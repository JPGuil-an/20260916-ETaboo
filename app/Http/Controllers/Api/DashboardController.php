<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Farm;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\SupportedBarangay;
use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Http\Resources\SupportedBarangayResource;
use App\Http\Requests\SuperAdmin\StoreBarangayRequest;

class DashboardController extends Controller
{
    public function insights()
    {
        $products = Product::where('is_approved', 1)->get();
        $transactions = Transaction::with('transactionDetail')->get();

        $months = collect(range(5, 0))->map(function ($offset) {
            $date = Carbon::now()->subMonths($offset);
            return [
                'key' => $date->format('Y-m'),
                'label' => $date->format('M'),
                'sales' => 0,
                'orders' => 0,
            ];
        })->keyBy('key');

        foreach ($transactions as $transaction) {
            if (! $transaction->payed_on) {
                continue;
            }
            $key = Carbon::parse($transaction->payed_on)->format('Y-m');
            if ($months->has($key)) {
                $month = $months->get($key);
                $month['sales'] += (float) ($transaction->price_payed ?: 0);
                $month['orders']++;
                $months->put($key, $month);
            }
        }

        $categories = $products->groupBy('product_type')->map(function ($items, $name) {
            return [
                'name' => $name,
                'listings' => $items->count(),
                'available_kg' => max(0, (float) $items->sum('prospect_harvest_in_kg') - (float) $items->sum('actual_sold_kg')),
                'sold_kg' => (float) $items->sum('actual_sold_kg'),
            ];
        })->values();

        $locations = Farm::all()->groupBy(function ($farm) {
            return trim(explode(',', $farm->farm_location)[0]);
        })->map(function ($items, $name) {
            return ['name' => $name, 'farms' => $items->count()];
        })->sortByDesc('farms')->values();

        return response()->json([
            'summary' => [
                'active_listings' => $products->count(),
                'available_kg' => max(0, (float) $products->sum('prospect_harvest_in_kg') - (float) $products->sum('actual_sold_kg')),
                'sold_kg' => (float) $products->sum('actual_sold_kg'),
                'sales' => (float) $transactions->sum(function ($transaction) {
                    return $transaction->price_payed ?: 0;
                }),
                'orders' => $transactions->count(),
                'farms' => Farm::count(),
            ],
            'sales_trend' => $months->values(),
            'categories' => $categories,
            'locations' => $locations,
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     *  @ return \Illuminate\Http\Response
     */
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */

    public function usercount()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $startDate = Carbon::create($currentYear, $currentMonth, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $userAll =User::all()->count();
        $pendingUser =User::where('is_verified', '0')->count();
        $activeUser =User::where('is_active', '1')->count();

        $transactionCount = Transaction::whereBetween('payed_on', [$startDate, $endDate])->count();

        return response()->json([
            'userAll' => $userAll,
            'pendingUser' => $pendingUser,
            'activeUser' => $activeUser,
            'transactionCount' => $transactionCount,
        ]);




    }


    // public function supportedBarangay()
    // {
    //     $supportedBarangay = SupportedBarangay::all();
    //     return SupportedBarangayResource::collection($supportedBarangay);
    // }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    public function addBarangay(StoreBarangayRequest $request)
    {
        $data = $request->validated();
        $supportedBarangay= SupportedBarangay::create($data);

        return response(new SupportedBarangayResource($supportedBarangay) , 201);
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
