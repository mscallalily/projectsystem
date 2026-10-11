<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationDemoSeeder extends Seeder
{
    public function run(): void
    {
        // type, title, body, already read?, minutes ago
        $samples = [
            ['pass_approved', 'Parking Access Approved', 'Your vehicle has been approved for campus parking.', false, 120],
            ['rfid_assigned', 'RFID Card Assigned', 'An RFID card has been assigned to your account.', false, 1440],
            ['slot_full', 'Parking Area Nearing Capacity', 'Zone B is almost full. Consider parking in Zone C.', true, 180],
            ['maintenance', 'System Maintenance', 'PASS will undergo maintenance on Sept 5 from 11 PM to 1 AM.', true, 2880],
            ['violation_issued', 'Parking Violation Alert', 'A violation has been recorded for your vehicle at Zone B.', false, 240],
        ];

        $created = 0;

        foreach (DB::table('users')->pluck('user_id') as $userId) {
            // Skip users who already have notifications, so this is safe to run twice
            if (DB::table('notifications')->where('user_id', $userId)->exists()) {
                continue;
            }

            foreach ($samples as [$type, $title, $body, $read, $minutesAgo]) {
                $at = now()->subMinutes($minutesAgo);

                DB::table('notifications')->insert([
                    'user_id'           => $userId,
                    'notification_type' => $type,
                    'title'             => $title,
                    'body'              => $body,
                    'channel'           => 'in_app',
                    'is_read'           => $read,
                    'read_at'           => $read ? $at : null,
                    'sent_at'           => $at,
                    'created_at'        => $at,
                    'updated_at'        => $at,
                ]);
            }

            $created++;
        }

        $this->command->info("Demo notifications created for {$created} user(s).");
    }
}