<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
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
}