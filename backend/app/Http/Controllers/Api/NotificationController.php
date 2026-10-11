<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /** The signed-in user's notifications, newest first. */
    public function index(Request $request): JsonResponse
    {
        $rows = DB::table('notifications')
            ->where('user_id', $request->user()->getKey())
            ->orderByDesc('created_at')
            ->orderByDesc('notification_id')
            ->limit(50)
            ->get();

        $items = $rows->map(fn ($n) => [
            'id'      => $n->notification_id,
            'type'    => $n->notification_type,
            'title'   => $n->title,
            'body'    => $n->body,
            'read'    => (bool) $n->is_read,
            'sent_at' => Carbon::parse($n->sent_at ?? $n->created_at)->toIso8601String(),
        ])->values();

        return response()->json([
            'notifications' => $items,
            'unread'        => $items->where('read', false)->count(),
        ]);
    }

    /** Mark one notification as read (only if it belongs to the user). */
    public function markRead(Request $request, int $id): JsonResponse
    {
        $mine = DB::table('notifications')
            ->where('notification_id', $id)
            ->where('user_id', $request->user()->getKey());

        if (! (clone $mine)->exists()) {
            return response()->json(['message' => 'Notification not found.'], 404);
        }

        (clone $mine)->where('is_read', false)->update([
            'is_read'    => true,
            'read_at'    => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Marked as read.']);
    }

    /** Mark all of the user's notifications as read. */
    public function markAllRead(Request $request): JsonResponse
    {
        $count = DB::table('notifications')
            ->where('user_id', $request->user()->getKey())
            ->where('is_read', false)
            ->update([
                'is_read'    => true,
                'read_at'    => now(),
                'updated_at' => now(),
            ]);

        return response()->json(['message' => 'All marked as read.', 'updated' => $count]);
    }
}