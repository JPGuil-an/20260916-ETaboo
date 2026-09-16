<?php

namespace Database\Seeders;

use App\Models\Farm;
use App\Models\PriceControl;
use App\Models\Product;
use App\Models\SupportedBarangay;
use App\Models\SupportedProduct;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DemoMarketplaceSeeder extends Seeder
{
    private string $demoPassword = 'password';

    public function run(): void
    {
        $this->seedCatalogSettings();
        $users = $this->seedUsers();
        $farms = $this->seedFarms($users);
        $products = $this->seedProducts($farms);
        $this->seedOrders($users, $farms, $products);
    }

    private function seedCatalogSettings(): void
    {
        foreach (['Bugcaon', 'Kulasihan', 'Bantuanon', 'Babahagon', 'Poblacion', 'Balila', 'Cawayan', 'Alanib', 'Basac', 'Capitan Juan', 'Victory', 'Songco'] as $barangay) {
            SupportedBarangay::updateOrCreate(['supported_barangay' => $barangay]);
        }

        $prices = [
            'Brocollis' => [85, 120],
            'Carrots' => [60, 90],
            'Cabbages' => [45, 70],
            'Tomatoes' => [65, 125],
        ];

        foreach ($prices as $product => [$min, $max]) {
            SupportedProduct::updateOrCreate(['supported_product' => $product]);
            PriceControl::updateOrCreate(['product_name' => $product], ['min' => $min, 'max' => $max]);
        }
    }

    private function seedUsers(): array
    {
        $records = [
            'admin' => ['DA Lantapan Admin', 'admin@etabo.test', '09991234567', 3, 'Poblacion, Lantapan, Bukidnon'],
            'maria' => ['Maria Santos', 'maria@etabo.test', '09171234567', 1, 'Songco, Lantapan, Bukidnon'],
            'pedro' => ['Pedro Dela Cruz', 'pedro@etabo.test', '09181234567', 1, 'Cawayan, Lantapan, Bukidnon'],
            'ana' => ['Ana Villanueva', 'ana@etabo.test', '09191234567', 2, 'Kibanggay, Lantapan, Bukidnon'],
            'jose' => ['Jose Ramirez', 'jose@etabo.test', '09201234567', 1, 'Victory, Lantapan, Bukidnon'],
            'liza' => ['Liza Flores', 'liza@etabo.test', '09211234567', 0, 'Poblacion, Lantapan, Bukidnon'],
            'carlo' => ['Carlo Mendoza', 'carlo@etabo.test', '09221234567', 0, 'Alanib, Lantapan, Bukidnon'],
        ];

        $users = [];
        foreach ($records as $key => [$name, $email, $mobile, $type, $address]) {
            $users[$key] = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'birthday' => '1990-01-15',
                    'address' => $address,
                    'mobile_number' => $mobile,
                    'user_type' => $type,
                    'password' => Hash::make($this->demoPassword),
                    'is_verified' => 1,
                    'is_active' => 0,
                    'email_verified_at' => now(),
                ]
            );
        }

        return $users;
    }

    private function seedFarms(array $users): array
    {
        $records = [
            'sunrise' => ['Sunrise Highland Farm', 'Songco, Lantapan', 3.8, 'A cool-climate family farm growing crisp broccoli and carrots using responsible soil practices.', 8.0539, 124.9949, 'farm-1.jpg', $users['maria']],
            'mountain' => ['Mountain View Produce', 'Cawayan, Lantapan', 5.2, 'Fresh highland vegetables harvested in small batches for nearby families and markets.', 8.0207, 125.0334, 'farm-2.jpg', $users['pedro']],
            'green' => ['Green Valley Organics', 'Kibanggay, Lantapan', 2.6, 'A buyer-and-seller operated farm specializing in cabbage and naturally grown seasonal produce.', 8.0871, 124.9656, 'farm-3.jpg', $users['ana']],
            'victory' => ['Victory Fresh Farms', 'Victory, Lantapan', 4.4, 'A community farm known for colorful tomatoes, leafy vegetables, and careful post-harvest handling.', 7.9978, 125.0212, 'farm-1.jpg', $users['jose']],
        ];

        $farms = [];
        foreach ($records as $key => [$name, $location, $hectares, $info, $lat, $lng, $image, $owner]) {
            $farms[$key] = Farm::updateOrCreate(
                ['farm_name' => $name, 'farm_owner' => $owner->id],
                [
                    'farm_location' => $location,
                    'farm_hectares' => $hectares,
                    'farm_info' => $info,
                    'latitude' => (string) $lat,
                    'longitude' => (string) $lng,
                    'farm_pictures' => $image,
                    'is_verified' => 1,
                ]
            );
            $this->copyAsset($image, 'Farms/' . $image);
        }

        return $farms;
    }

    private function seedProducts(array $farms): array
    {
        $records = [
            ['Green Magic Broccoli', 'Brocollis', 'Green Magic', 110, 180, 18, 'broccoli-1.jpg', 'sunrise'],
            ['Premium Broccoli Crowns', 'Brocollis', 'Legacy', 105, 145, 12, 'broccoli-2.jpg', 'mountain'],
            ['Baguio Broccoli', 'Brocollis', 'Marathon', 95, 120, 9, 'broccoli-1.jpg', 'green'],
            ['Fresh Broccoli Florets', 'Brocollis', 'Emerald Crown', 100, 155, 24, 'broccoli-2.jpg', 'victory'],
            ['Highland Carrots', 'Carrots', 'Nantes', 70, 240, 32, 'carrot-1.jpg', 'sunrise'],
            ['Sweet Orange Carrots', 'Carrots', 'Kuroda', 75, 195, 20, 'carrot-2.jpg', 'mountain'],
            ['Baby Carrots', 'Carrots', 'Amsterdam', 85, 110, 8, 'carrot-1.jpg', 'green'],
            ['Farm Fresh Carrots', 'Carrots', 'Chantenay', 68, 210, 27, 'carrot-2.jpg', 'victory'],
            ['Crisp Green Cabbage', 'Cabbages', 'Green Coronet', 55, 260, 38, 'cabbage-1.jpg', 'sunrise'],
            ['Highland Cabbage', 'Cabbages', 'Scorpio', 60, 220, 15, 'cabbage-2.jpg', 'mountain'],
            ['Organic Cabbage', 'Cabbages', 'Stonehead', 65, 170, 13, 'cabbage-1.jpg', 'green'],
            ['Fresh Savoy Cabbage', 'Cabbages', 'Savoy Ace', 58, 135, 10, 'cabbage-2.jpg', 'victory'],
            ['Roma Tomatoes', 'Tomatoes', 'Roma VF', 80, 190, 29, 'tomato-1.jpg', 'sunrise'],
            ['Sweet Cherry Tomatoes', 'Tomatoes', 'Sweet 100', 110, 125, 11, 'tomato-1.jpg', 'mountain'],
            ['Heirloom Tomatoes', 'Tomatoes', 'Brandywine', 120, 95, 7, 'tomato-2.jpg', 'green'],
            ['Fresh Red Tomatoes', 'Tomatoes', 'Diamante Max', 75, 230, 35, 'tomato-2.jpg', 'victory'],
        ];

        $products = [];
        foreach ($records as $index => [$name, $type, $variety, $price, $quantity, $sold, $image, $farmKey]) {
            $farm = $farms[$farmKey];
            $product = Product::updateOrCreate(
                ['product_name' => $name, 'farm_belonged' => $farm->id],
                [
                    'product_type' => $type,
                    'variety' => $variety,
                    'planted_date' => Carbon::today()->subDays(85 + ($index % 12))->toDateString(),
                    'prospect_harvest_in_kg' => $quantity,
                    'prospect_harvest_date' => Carbon::today()->addDays(4 + ($index % 8))->toDateString(),
                    'actual_harvested_in_kg' => $quantity,
                    'actual_sold_kg' => $sold,
                    'harvested_date' => Carbon::today()->subDays($index % 4)->toDateString(),
                    'product_location' => $farm->farm_location,
                    'price' => $price,
                    'product_picture' => $image,
                    'is_approved' => 1,
                ]
            );
            $this->copyAsset($image, 'Farms/' . $farm->id . '/' . $image);
            $products[$index] = $product;
        }

        return $products;
    }

    private function seedOrders(array $users, array $farms, array $products): void
    {
        $orders = [
            ['demo-pending', $users['liza'], $users['maria'], $products[0], 3, null, null, Carbon::today()->subDays(2)],
            ['demo-delivered', $users['carlo'], $users['pedro'], $products[5], 5, Carbon::today()->subDay(), null, Carbon::today()->subDays(4)],
            ['demo-complete', $users['liza'], $users['ana'], $products[10], 4, Carbon::today()->subDays(3), Carbon::today()->subDays(2), Carbon::today()->subDays(6)],
            ['demo-sales-1', $users['carlo'], $users['maria'], $products[12], 7, Carbon::today()->subMonth()->startOfMonth()->addDays(7), Carbon::today()->subMonth()->startOfMonth()->addDays(8), Carbon::today()->subMonth()->startOfMonth()->addDays(2)],
            ['demo-sales-2', $users['liza'], $users['pedro'], $products[8], 11, Carbon::today()->subMonths(2)->startOfMonth()->addDays(8), Carbon::today()->subMonths(2)->startOfMonth()->addDays(9), Carbon::today()->subMonths(2)->startOfMonth()->addDays(3)],
            ['demo-sales-3', $users['carlo'], $users['ana'], $products[2], 6, Carbon::today()->subMonths(3)->startOfMonth()->addDays(6), Carbon::today()->subMonths(3)->startOfMonth()->addDays(7), Carbon::today()->subMonths(3)->startOfMonth()->addDay()],
            ['demo-sales-4', $users['liza'], $users['jose'], $products[15], 9, Carbon::today()->subMonths(4)->startOfMonth()->addDays(10), Carbon::today()->subMonths(4)->startOfMonth()->addDays(11), Carbon::today()->subMonths(4)->startOfMonth()->addDays(5)],
            ['demo-sales-5', $users['carlo'], $users['maria'], $products[4], 12, Carbon::today()->subMonths(5)->startOfMonth()->addDays(7), Carbon::today()->subMonths(5)->startOfMonth()->addDays(8), Carbon::today()->subMonths(5)->startOfMonth()->addDays(2)],
        ];

        foreach ($orders as [$key, $buyer, $seller, $product, $kilos, $delivered, $paid, $ordered]) {
            $total = $product->price * $kilos;
            $transaction = Transaction::updateOrCreate(
                ['proof_of_delivery' => $key],
                [
                    'ordered_on' => $ordered->toDateString(),
                    'seller_prospect_date_todeliver' => Carbon::today()->addDays(1)->toDateString(),
                    'date_delivered' => $delivered?->toDateString(),
                    'price_of_goods' => $total,
                    'price_payed' => $paid ? $total : null,
                    'payed_on' => $paid?->toDateString(),
                    'buyers_name' => $buyer->id,
                    'seller' => $seller->id,
                ]
            );

            TransactionDetail::updateOrCreate(
                ['transaction_id' => $transaction->id, 'product_id' => $product->id],
                [
                    'product_name' => $product->product_name,
                    'variety' => $product->variety,
                    'planted_date' => $product->planted_date,
                    'harvested_date' => $product->harvested_date,
                    'kg_purchased' => $kilos,
                    'price_per_kilo' => $product->price,
                ]
            );
        }
    }

    private function copyAsset(string $filename, string $destination): void
    {
        $source = database_path('seeders/assets/' . $filename);
        if (! File::exists($source)) {
            throw new \RuntimeException('Missing marketplace seed image: ' . $source);
        }
        Storage::disk('public')->put($destination, File::get($source));
    }
}
