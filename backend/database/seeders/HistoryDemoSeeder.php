<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HistoryDemoSeeder extends Seeder
{
    public function run(): void
    {
        $userId = DB::table('users')->where('email', 'juan@student.edu')->value('user_id');
        $vehicle = $userId
            ? DB::table('vehicles')->where('owner_user_id', $userId)->first()
            : null;
        $areaId = DB::table('parking_areas')->where('area_code', 'MAIN')->value('parking_area_id');

        if (! $userId || ! $vehicle) {
            $this->command->error('Register juan@student.edu in the app first.');
            return;
        }

        if (! $areaId) {
            $this->command->error('Run "php artisan db:seed --class=ParkingDemoSeeder" first.');
            return;
        }

        $already = DB::table('parking_transactions')
            ->where('vehicle_id', $vehicle->vehicle_id)
            ->where('remarks', 'Demo history')
            ->exists();

        if ($already) {
            $this->command->info('Demo history already exists. Nothing changed.');
            return;
        }

        // days ago, slot, entry hour, entry minute, minutes parked
        $stays = [
            [1, 'A-05', 7, 32, 613],
            [3, 'B-05', 8, 10, 590],
            [5, 'A-06', 7, 55, 515],
            [7, 'C-05', 9, 0, 360],
            [10, 'A-07', 8, 20, 480],
            [14, 'C-06', 7, 45, 545],
        ];

        foreach ($stays as $i => [$daysAgo, $slotCode, $hour, $minute, $minutes]) {
            $slotId = DB::table('parking_slots')->where('slot_code', $slotCode)->value('slot_id');

            // Times are set in Manila time, then stored in the app's timezone
            $entry = now('Asia/Manila')
                ->subDays($daysAgo)
                ->setTime($hour, $minute)
                ->setTimezone(config('app.timezone'));

            DB::table('parking_transactions')->insert([
                'ticket_number'      => sprintf('DEMO-H-%03d', $i + 1),
                'vehicle_id'         => $vehicle->vehicle_id,
                'user_id'            => $userId,
                'parking_area_id'    => $areaId,
                'slot_id'            => $slotId,
                'access_method'      => 'rfid',
                'entry_datetime'     => $entry,
                'exit_datetime'      => $entry->copy()->addMinutes($minutes),
                'transaction_status' => 'completed',
                'remarks'            => 'Demo history',
                'created_at'         => $entry,
                'updated_at'         => $entry,
            ]);
        }

        $this->command->info('Demo history created: 6 completed stays for juan@student.edu.');
    }
}