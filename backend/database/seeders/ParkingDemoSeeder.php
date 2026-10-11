<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParkingDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('parking_areas')->where('area_code', 'MAIN')->exists()) {
            $this->command->info('Demo parking data already exists. Nothing changed.');
            return;
        }

        $adminId = DB::table('users')->where('user_code', 'ADM-001')->value('user_id');
        $sedanId = DB::table('vehicle_types')->where('type_code', 'sedan')->value('vehicle_type_id');

        if (! $adminId || ! $sedanId) {
            $this->command->error('Run "php artisan db:seed" and "php artisan pass:create-admin" first.');
            return;
        }

        DB::transaction(function () use ($adminId, $sedanId) {
            $areaId = DB::table('parking_areas')->insertGetId([
                'area_code' => 'MAIN',
                'area_name' => 'Main Campus Parking',
                'is_active' => true,
            ]);

            // code => [name, total slots, reserved, maintenance, occupied]
            $zones = [
                'A' => ['Zone A', 20, 2, 0, 3],
                'B' => ['Zone B', 16, 0, 1, 14],
                'C' => ['Zone C', 24, 3, 0, 5],
                'D' => ['Zone D', 12, 4, 0, 3],
            ];

            $n = 0;
            foreach ($zones as $code => [$name, $total, $reserved, $maint, $occupied]) {
                $zoneId = DB::table('parking_zones')->insertGetId([
                    'parking_area_id'   => $areaId,
                    'zone_code'         => $code,
                    'zone_name'         => $name,
                    'vehicle_type_id'   => $sedanId,
                    'declared_capacity' => $total,
                    'is_active'         => true,
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ]);

                for ($i = 1; $i <= $total; $i++) {
                    $status = $i <= $reserved
                        ? 'reserved'
                        : ($i <= $reserved + $maint ? 'maintenance' : 'available');

                    $slotId = DB::table('parking_slots')->insertGetId([
                        'zone_id'         => $zoneId,
                        'slot_code'       => $code . '-' . str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                        'vehicle_type_id' => $sedanId,
                        'slot_status'     => $status,
                        'created_at'      => now(),
                        'updated_at'      => now(),
                    ]);

                    // Occupy the last N available slots with demo vehicles
                    if ($status === 'available' && $i > $total - $occupied) {
                        $n++;
                        $vehicleId = DB::table('vehicles')->insertGetId([
                            'owner_user_id'       => $adminId,
                            'vehicle_type_id'     => $sedanId,
                            'plate_number'        => sprintf('DEMO-%03d', $n),
                            'registration_status' => 'registered',
                            'created_at'          => now(),
                            'updated_at'          => now(),
                        ]);

                        DB::table('parking_transactions')->insert([
                            'ticket_number'      => sprintf('DEMO-%04d', $n),
                            'vehicle_id'         => $vehicleId,
                            'user_id'            => $adminId,
                            'parking_area_id'    => $areaId,
                            'slot_id'            => $slotId,
                            'access_method'      => 'manual',
                            'entry_datetime'     => now()->subMinutes(rand(10, 300)),
                            'transaction_status' => 'active',
                            'remarks'            => 'Demo data',
                            'created_at'         => now(),
                            'updated_at'         => now(),
                        ]);
                    }
                }
            }
        });

        $this->command->info('Demo parking data created: 4 zones, 72 slots, 25 occupied.');
    }
}