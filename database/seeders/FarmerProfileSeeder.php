<?php

namespace Database\Seeders;

use App\Models\Farm;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class FarmerProfileSeeder extends Seeder
{
    public function run(): void
    {
        $profiles = [
            ['Ramon Abella', 'ramon@etabo.test', '09301110001', 'Alanib', 'Alanib Vegetable Terrace', 2.4, 'Seasonal broccoli and carrot grower using terraced highland plots.', 'farm-1.jpg'],
            ['Elena Caballero', 'elena@etabo.test', '09301110002', 'Baclayon', 'Baclayon Harvest Farm', 3.1, 'Family-run cabbage and tomato farm serving nearby public markets.', 'farm-2.jpg'],
            ['Nestor Dumlao', 'nestor@etabo.test', '09301110003', 'Balila', 'Balila Green Fields', 4.0, 'Diversified vegetable farm focused on consistent weekly harvests.', 'farm-3.jpg'],
            ['Carmen Estrella', 'carmen@etabo.test', '09301110004', 'Bantuanon', 'Bantuanon Fresh Picks', 2.8, 'Small-batch highland produce grown with careful soil management.', 'farm-1.jpg'],
            ['Joel Fernandez', 'joel@etabo.test', '09301110005', 'Bugcaon', 'Bugcaon Ridge Farm', 5.3, 'Cool-climate farm producing carrots, cabbage, and broccoli.', 'farm-2.jpg'],
            ['Teresa Garcia', 'teresa@etabo.test', '09301110006', 'Capitan Juan', 'Capitan Juan Organics', 3.6, 'Community-supported farm with naturally grown vegetables.', 'farm-3.jpg'],
            ['Luis Hernandez', 'luis@etabo.test', '09301110007', 'Kaatuan', 'Kaatuan Valley Produce', 4.7, 'Reliable wholesale and retail harvests for Lantapan buyers.', 'farm-1.jpg'],
            ['Norma Ignacio', 'norma@etabo.test', '09301110008', 'Kulasihan', 'Kulasihan Family Farm', 2.2, 'A family vegetable farm known for sweet carrots and tomatoes.', 'farm-2.jpg'],
        ];

        foreach ($profiles as $index => [$name, $email, $mobile, $location, $farmName, $hectares, $info, $image]) {
            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'birthday' => '1988-06-15',
                    'address' => $location . ', Lantapan, Bukidnon',
                    'mobile_number' => $mobile,
                    'user_type' => $index % 3 === 0 ? 2 : 1,
                    'password' => Hash::make('password'),
                    'is_verified' => 1,
                    'is_active' => $index % 2,
                    'email_verified_at' => now(),
                ]
            );

            Farm::updateOrCreate(
                ['farm_name' => $farmName, 'farm_owner' => $user->id],
                [
                    'farm_location' => $location . ', Lantapan',
                    'farm_hectares' => $hectares,
                    'farm_info' => $info,
                    'latitude' => (string) (8.01 + ($index * 0.008)),
                    'longitude' => (string) (124.96 + ($index * 0.009)),
                    'farm_pictures' => $image,
                    'is_verified' => 1,
                ]
            );

            $source = database_path('seeders/assets/' . $image);
            if (File::exists($source)) {
                Storage::disk('public')->put('Farms/' . $image, File::get($source));
            }
        }

        foreach ([
            ['Mila Pending Buyer', 'mila.pending@etabo.test', '09302220001', 0, 'Basac'],
            ['Danilo Pending Seller', 'danilo.pending@etabo.test', '09302220002', 1, 'Poblacion'],
        ] as [$name, $email, $mobile, $type, $location]) {
            User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'birthday' => '1992-04-10',
                    'address' => $location . ', Lantapan, Bukidnon',
                    'mobile_number' => $mobile,
                    'user_type' => $type,
                    'password' => Hash::make('password'),
                    'is_verified' => 0,
                    'is_active' => 0,
                ]
            );
        }
    }
}
