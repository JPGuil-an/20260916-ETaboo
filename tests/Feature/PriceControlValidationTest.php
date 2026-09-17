<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\SellerBuyerController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class PriceControlValidationTest extends TestCase
{
    use DatabaseTransactions;

    /** @dataProvider invalidPriceRanges */
    public function test_maximum_price_must_be_strictly_greater_than_minimum($minimum, $maximum): void
    {
        $request = Request::create('/api/priceRange', 'POST', [
            'product_type' => 'Carrots',
            'min' => $minimum,
            'max' => $maximum,
        ]);

        try {
            app(SellerBuyerController::class)->priceRange($request);
            $this->fail('An invalid price range was accepted.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('max', $exception->errors());
        }
    }

    public function invalidPriceRanges(): array
    {
        return [
            'equal prices' => [80, 80],
            'maximum below minimum' => [80, 79],
        ];
    }
}
