<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParkingDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !in_array($user->user_type, ['security', 'admin'], true)) {
            return response()->json([
                'message' => 'Unauthorized access.'
            ], 403);
        }

        $today = now()->toDateString();

        $todayEntries = DB::table('parking_transactions')
            ->whereDate('entry_datetime', $today)
            ->count();

        $todayExits = DB::table('parking_transactions')
            ->whereDate('exit_datetime', $today)
            ->count();

        // Adjust these values after checking auth_result.
        $deniedAccess = DB::table('access_events')
            ->whereDate('event_datetime', $today)
            ->whereIn('auth_result', ['denied', 'rejected'])
            ->count();

        $activeVisitors = DB::table('parking_transactions')
            ->whereNotNull('visitor_id')
            ->whereNotNull('entry_datetime')
            ->whereNull('exit_datetime')
            ->distinct()
            ->count('visitor_id');

        $recentTransactions = DB::table('parking_transactions as pt')
            ->leftJoin('vehicles as v', 'pt.vehicle_id', '=', 'v.vehicle_id')
            ->select(
                'pt.transaction_id',
                'pt.ticket_number',
                'v.plate_number',
                'pt.entry_datetime',
                'pt.exit_datetime'
            )
            ->orderByDesc('pt.created_at')
            ->limit(10)
            ->get();

        return response()->json([
            'today_entries' => $todayEntries,
            'today_exits' => $todayExits,
            'denied_access' => $deniedAccess,
            'active_visitors' => $activeVisitors,
            'recent_events' => $recentTransactions,
        ]);
    }
}
