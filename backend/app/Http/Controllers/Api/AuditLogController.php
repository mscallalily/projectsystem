<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    private function canViewAuditLogs(User $user): bool
    {
        return $user->account_status === 'active'
            && $user->roles()
                ->whereIn('role_code', ['admin', 'parking_admin'])
                ->where('is_active', true)
                ->exists();
    }

    public function index(Request $request): JsonResponse
    {
        $actor = $request->user();

        if (! $actor || ! $this->canViewAuditLogs($actor)) {
            return response()->json([
                'message' => 'You are not authorized to view audit logs.',
            ], 403);
        }

        $query = AuditLog::query()->with('user');

        $search = trim((string) $request->query('search', ''));

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder->where('actor_label', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('auditable_type', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->query('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->query('to'));
        }

        $logs = $query
            ->orderByDesc('created_at')
            ->orderByDesc('log_id')
            ->paginate(15)
            ->withQueryString();

        return response()->json($logs);
    }
}
