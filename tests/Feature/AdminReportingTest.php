<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Farm;
use App\Models\Product;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminReportingTest extends TestCase
{
    use DatabaseTransactions;

    public function test_transaction_report_rejects_a_reversed_date_range(): void
    {
        $this->actingAsAdmin();

        $this->postJson('/api/generateReport', [
            'product_type' => 'Carrots',
            'starting_date' => '2026-09-10',
            'end_date' => '2026-09-09',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('end_date');
    }

    public function test_crop_report_rejects_a_reversed_date_range(): void
    {
        $this->actingAsAdmin();

        $this->postJson('/api/getCropPredictiveAnalysis', [
            'commodity' => 'Carrots',
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-09',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('end_date');
    }

    public function test_crop_report_filters_and_groups_records_by_normalized_location(): void
    {
        $this->actingAsAdmin();
        $farm = $this->createFarm();

        $this->createProduct($farm, 'Carrots', '2026-09-02', 'Alanib, Lantapan', 25, 40);
        $this->createProduct($farm, 'Carrots', '2026-09-06', 'ALANIB', 15, 30);
        $this->createProduct($farm, 'Carrots', '2026-08-20', 'Alanib', 100, 150);
        $this->createProduct($farm, 'Tomatoes', '2026-09-04', 'Alanib', 80, 90);

        $this->postJson('/api/getCropPredictiveAnalysis', [
            'commodity' => 'Carrots',
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-10',
        ])->assertOk()
            ->assertJsonPath('commodity', 'Carrots')
            ->assertJsonCount(1, 'locations')
            ->assertJsonPath('locations.0.location', 'Alanib')
            ->assertJsonPath('locations.0.sold_kg', 40)
            ->assertJsonPath('locations.0.yield_kg', 70)
            ->assertJsonPath('totals.sold_kg', 40)
            ->assertJsonPath('totals.yield_kg', 70);
    }

    private function actingAsAdmin(): void
    {
        Sanctum::actingAs(User::factory()->create([
            'user_type' => 3,
            'is_verified' => 1,
            'is_active' => 1,
        ]));
    }

    private function createFarm(): Farm
    {
        return Farm::create([
            'farm_name' => 'Reporting Test Farm',
            'farm_location' => 'Alanib, Lantapan',
            'farm_hectares' => 2,
            'farm_info' => 'Created inside a transaction for reporting tests.',
            'longitude' => '124.988',
            'latitude' => '8.012',
            'farm_pictures' => 'farm.jpg',
            'is_verified' => 1,
            'farm_owner' => auth()->id(),
        ]);
    }

    private function createProduct(
        Farm $farm,
        string $type,
        string $harvestedDate,
        string $location,
        float $soldKg,
        float $yieldKg
    ): Product {
        return Product::create([
            'product_name' => $type . ' harvest',
            'product_type' => $type,
            'variety' => 'Test variety',
            'planted_date' => '2026-06-01',
            'prospect_harvest_in_kg' => $yieldKg,
            'prospect_harvest_date' => $harvestedDate,
            'actual_harvested_in_kg' => $yieldKg,
            'actual_sold_kg' => $soldKg,
            'harvested_date' => $harvestedDate,
            'product_location' => $location,
            'price' => 80,
            'product_picture' => 'product.jpg',
            'is_approved' => 1,
            'farm_belonged' => $farm->id,
        ]);
    }
}
