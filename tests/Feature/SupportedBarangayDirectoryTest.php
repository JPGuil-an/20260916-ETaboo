<?php

namespace Tests\Feature;

use App\Models\SupportedBarangay;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SupportedBarangayDirectoryTest extends TestCase
{
    use DatabaseTransactions;

    public function test_directory_search_filters_all_paginated_barangays(): void
    {
        Sanctum::actingAs(User::factory()->create([
            'user_type' => 3,
            'is_verified' => 1,
            'is_active' => 1,
        ]));

        SupportedBarangay::create(['supported_barangay' => 'Codexridge North']);
        SupportedBarangay::create(['supported_barangay' => 'Codexridge South']);
        SupportedBarangay::create(['supported_barangay' => 'Alanib']);

        $response = $this->getJson('/api/supportedBarangay?search=codexridge');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 2);

        $this->assertTrue(collect($response->json('data'))->every(
            fn (array $barangay) => str_contains(strtolower($barangay['supported_barangay']), 'codexridge')
        ));
    }
}
