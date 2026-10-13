<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParkingController extends Controller
{
    /** Live availability per zone. */
    public function zones(): JsonResponse
    {
        $rows = DB::table('parking_zones as z')
            ->leftJoin('parking_slots as s', 's.zone_id', '=', 'z.zone_id')
            ->leftJoin('parking_transactions as t', function ($join) {
                $join->on('t.slot_id', '=', 's.slot_id')
                     ->where('t.transaction_status', '=', 'active');
            })
            ->where('z.is_active', true)
            ->groupBy('z.zone_id', 'z.zone_code', 'z.zone_name')
            ->orderBy('z.zone_code')
            ->selectRaw("
                z.zone_id, z.zone_code, z.zone_name,
                COUNT(DISTINCT s.slot_id) AS capacity,
                COUNT(DISTINCT CASE WHEN s.slot_status = 'reserved' THEN s.slot_id END) AS reserved,
                COUNT(DISTINCT CASE WHEN s.slot_status IN ('maintenance','disabled') THEN s.slot_id END) AS unavailable,
                COUNT(DISTINCT t.transaction_id) AS occupied
            ")
            ->get();

        $zones = $rows->map(function ($r) {
            $capacity = (int) $r->capacity;
            $reserved = (int) $r->reserved;
            $unavailable = (int) $r->unavailable;
            $occupied = (int) $r->occupied;

            return [
                'id'          => $r->zone_id,
                'code'        => $r->zone_code,
                'name'        => $r->zone_name,
                'capacity'    => $capacity,
                'occupied'    => $occupied,
                'reserved'    => $reserved,
                'unavailable' => $unavailable,
                'free'        => max(0, $capacity - $occupied - $reserved - $unavailable),
            ];
        })->values();

        return response()->json([
            'zones'      => $zones,
            'updated_at' => now()->toIso8601String(),
        ]);
    }

    /** The signed-in user's own parking stays, newest first. */
    public function history(Request $request): JsonResponse
    {
        $rows = DB::table('parking_transactions as t')
            ->join('vehicles as v', 'v.vehicle_id', '=', 't.vehicle_id')
            ->leftJoin('parking_slots as s', 's.slot_id', '=', 't.slot_id')
            ->leftJoin('parking_zones as z', 'z.zone_id', '=', 's.zone_id')
            ->where('t.user_id', $request->user()->getKey())
            ->where('t.transaction_status', '!=', 'cancelled')
            ->orderByDesc('t.entry_datetime')
            ->limit(50)
            ->get([
                't.transaction_id',
                't.entry_datetime',
                't.exit_datetime',
                't.access_method',
                't.transaction_status',
                't.duration_minutes',
                'v.plate_number',
                'z.zone_name',
                's.slot_code',
            ]);

        $items = $rows->map(function ($r) {
            $entry = Carbon::parse($r->entry_datetime);
            $exit = $r->exit_datetime ? Carbon::parse($r->exit_datetime) : null;
            $minutes = $r->duration_minutes !== null
                ? (int) $r->duration_minutes
                : max(0, (int) $entry->diffInMinutes(now()));

            return [
                'id'      => $r->transaction_id,
                'plate'   => $r->plate_number,
                'zone'    => $r->zone_name ?? 'Open area',
                'slot'    => $r->slot_code,
                'method'  => strtoupper($r->access_method),
                'status'  => $r->transaction_status,
                'entry'   => $entry->toIso8601String(),
                'exit'    => $exit?->toIso8601String(),
                'minutes' => $minutes,
            ];
        })->values();

        return response()->json(['history' => $items]);
    }
}