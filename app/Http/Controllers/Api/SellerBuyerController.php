<?php

namespace App\Http\Controllers\api;

use App\Models\Farm;
use App\Models\User;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\PriceControl;
use Illuminate\Http\Request;
use App\Models\TransactionDetail;
use App\Http\Controllers\Controller;
use  Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;


class SellerBuyerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function farmWProducts(Request $request)
    {

        $user_ID = Crypt::decryptString($request->user_ID);
        $farm = Farm::where('farm_owner', $user_ID)
            ->with(['products' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }, 'user'])
            ->get();
        return response()->json($farm);
    }

    public function getProductToOrder($product)
    {
        $product =  Product::where('id', $product)
            ->with('farm', 'farm.user')
            ->get();

        $max = $product[0]->prospect_harvest_in_kg - $product[0]->actual_sold_kg;

        return response()->json([
            'product' => $product,
            'maximum' => $max,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function orderNow(Request $request)
    {
        $user_ID = Crypt::decryptString($request->user_ID);
        $product = Product::where('id', $request->productID_)->first();

        $seller = Farm::where('id', $product->farm_belonged)->first();

        $newTransaction  = Transaction::create([
            'seller' => $seller->farm_owner,
            'ordered_on' => now(),
            'price_of_goods' => $product->price * $request->kg_,
            'buyers_name' => $user_ID,
            'from_farm' => $product->farm_belonged,

        ]);

        $cost = $product->price * $request->kg_;
        TransactionDetail::create([
            'product_id' => $product->id,
            'product_name' => $product->product_name,
            'product_type' => $product->product_type,
            'variety' => $product->variety,
            'planted_date' => $product->planted_date,
            'harvested_date' => $product->harvested_date,
            'kg_purchased' => $request->kg_,
            'price_per_kilo' => $product->price,
            'total_price' => $cost,
            'transaction_id' => $newTransaction->id,

        ]);
        $kgTotal =  $product->actual_sold_kg + $request->kg_;
        $kgTotal2 = $product->actual_harvested_in_kg - $request->kg_;

        $product->update([
            'actual_sold_kg' => $kgTotal,
            'actual_harvested_in_kg' => $kgTotal2,
        ]);
        return response()->json("sucesss");
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.kg' => ['required', 'numeric', 'min:1'],
        ]);

        $buyer = $request->user();

        $orderIds = DB::transaction(function () use ($validated, $buyer) {
            $created = [];

            foreach ($validated['items'] as $item) {
                $product = Product::query()
                    ->with('farm')
                    ->lockForUpdate()
                    ->findOrFail($item['product_id']);

                $requested = (float) $item['kg'];
                $available = max(0, (float) $product->prospect_harvest_in_kg - (float) $product->actual_sold_kg);

                if ((int) $product->is_approved !== 1 || $available < $requested) {
                    throw ValidationException::withMessages([
                        'items' => $available <= 0
                            ? "{$product->product_name} is already sold out."
                            : "Only {$available} kg of {$product->product_name} is still available.",
                    ]);
                }

                $total = (float) $product->price * $requested;
                $transaction = Transaction::create([
                    'seller' => $product->farm->farm_owner,
                    'ordered_on' => now()->toDateString(),
                    'price_of_goods' => $total,
                    'buyers_name' => $buyer->id,
                ]);

                TransactionDetail::create([
                    'product_id' => $product->id,
                    'product_name' => $product->product_name,
                    'variety' => $product->variety,
                    'planted_date' => $product->planted_date,
                    'harvested_date' => $product->harvested_date,
                    'kg_purchased' => $requested,
                    'price_per_kilo' => $product->price,
                    'transaction_id' => $transaction->id,
                ]);

                $product->increment('actual_sold_kg', $requested);
                $created[] = $transaction->id;
            }

            return $created;
        });

        return response()->json([
            'message' => 'Checkout completed successfully.',
            'order_ids' => $orderIds,
        ], 201);
    }

    public function getOrders(Request $request)
    {
        $user_ID = Crypt::decryptString($request->user_ID);
        // $farmsOwnedByUser = Farm::where("farm_owner",  $user_ID)->get();
        // $farmData = [];
        // foreach ($farmsOwnedByUser as $farm) {
        //     $farmTransactions = Transaction::where("from_farm", $farm->id)->where("price_payed", ">=",  0)->get();
        //     $transactionsData = [];

        //     foreach ($farmTransactions as $transaction) {
        //         // Access the user_id from the buyers_name in the transaction
        //         $buyerUser = User::find($transaction->buyers_name);

        //         $transactionDetails = TransactionDetail::where("transaction_id", $transaction->id)->get();
        //         $transactionsData[] = [
        //             'transaction' => $transaction,
        //             'buyer_user' => $buyerUser,
        //             'transaction_details' => $transactionDetails,
        //         ];
        //     }

        //     $farmData[] = [
        //         'farm' => $farm,
        //         'transactions' => $transactionsData,
        //     ];

        //     return response()->json($farmData);
        // }

        // ----
        // $userPendingOrders = User::where('id', $user_ID)
        // ->whereHas('transactions', function ($query) {
        //     $query->where('payed_on', null);
        // })
        // ->with('transactions.TransactionDetail')
        // ->get();

        $userPendingOrders = User::where('id', $user_ID)
            ->whereHas('transactions')
            ->with(['transactions' => function ($query) {
                $query->orderBy('seller_prospect_date_todeliver', 'desc');
            }, 'transactions.TransactionDetail', 'transactions.TransactionDetail.productOrdered.farm.user' ])
            ->get();


        return response()->json([
            'userPendingOrders' => $userPendingOrders,
        ]);
    }

    public function getOrdersSeller(Request $request)
    {
        $user_ID = Crypt::decryptString($request->user_ID);
        //     $userPendingOrders = User::whereHas('transactions')
        // ->with(['transactions' => function ($query) {
        //     $query->orderBy('seller_prospect_date_todeliver', 'desc');
        // }, 'transactions.TransactionDetail'])
        // ->get();
        //     return response()->json([
        //         'userPendingOrders' => $userPendingOrders,
        //     ]);

        $transactions = Transaction::where('seller', $user_ID)
            ->with('TransactionDetail', 'user', 'TransactionDetail.productOrdered')
            ->get();

        // return response()->json($farm);

        return response()->json([
            'userPendingOrders' => $transactions,
        ]);
    }

    public function confirmOrder($transaction)
    {

        $transaction = Transaction::where('id', $transaction)->first();

        if ($transaction) {
            $transaction->update([
                'payed_on' => date('Y-m-d'), // Use the now() function to get the current date and time
            ]);
        }
    }



    public function getFulfilledOrder($order)
    {
        $transaction = Transaction::where('id', $order)
            ->with('TransactionDetail', 'user')
            ->get();

        return response()->json($transaction);
    }

    public function getFarmOrders(Request $request)
    {
        $user_ID = Crypt::decryptString($request->user_ID);
        $owned = Farm::where('farm_owner', $user_ID)->first();


        $farmOrders = TransactionDetail::where('from_farm', $owned->id)
            ->with('transaction', 'transaction.user')
            ->get();

        return response()->json($farmOrders);
    }

    public function addFarmForm(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'farm_name' => 'required|string',
            'farm_location' => 'required|string',
            'farm_hectares' => 'required|numeric',
            'farm_info' => 'required|string',
            'farm_pic' => 'image|mimes:jpeg,png,jpg,gif', // Adjust file validation rules as needed
        ]);

        // Create an empty data array
        $data = [];

        // Fill the data array with validated input
        $data['farm_name'] = $validatedData['farm_name'];
        $data['farm_location'] = $validatedData['farm_location'];
        $data['farm_hectares'] = $validatedData['farm_hectares'];
        $data['farm_info'] = $validatedData['farm_info'];
        $data['longitude'] = 0;
        $data['latitude'] = 0;
        $data['farm_owner'] =  Crypt::decryptString($request->user_ID);

        if ($request->hasFile('farm_pic')) {
            $photo = $request->file('farm_pic');
            $fileName = $photo->getClientOriginalName();
            // Store the file in the public storage inside the 'product_images' folder
            $photo->storeAs('public/Farms/', $fileName);
            $data['farm_pictures'] = $fileName;
        }
        $farm = Farm::create($data);

        return response()->json(['success' => 'Product Added Successfully']);
    }


    public function confirmDelivery(Request $request)
    {
        $id = $request->transactionID;
        $validatedData = $request->validate([
            'imageProof' => 'image|mimes:jpeg,png,jpg,gif',
        ]);

        $data = [];

        if ($request->hasFile('imageProof')) {
            $photo = $request->file('imageProof');
            $fileName = $photo->getClientOriginalName();
            // Store the file in the public storage inside the 'product_images' folder
            $photo->storeAs('public/ProofOfDelivery/', $fileName);
            $data['proof_of_delivery'] = $fileName;
        }
        $farm = Transaction::where('id', $id)->first();
        $data['price_payed'] = $farm->price_of_goods;

        if ($farm) {
            $farm->update($data);
        }
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
    public function conFirmOrderBuyer($id)
    {
        $transaction = Transaction::where('id', $id)->first();

        if ($transaction) {
            $e = $transaction['price_of_goods'];
            $transaction->update([
                'price_payed' => $e,
            ]);
        }
    }

    public function sellerDashboard(Request $request){

        $user_ID = Crypt::decryptString($request->user_ID);
        $productCount =Farm::where('farm_owner', $user_ID)->count();
        $pendingOrderCount = Transaction::where('seller', $user_ID)
        ->where('seller_prospect_date_todeliver', null)->count();

        $totalSolds = Transaction::where('seller', $user_ID)
        ->where('price_payed','>', 0)->get();

        $cost = 0;
        foreach( $totalSolds as $totalSold)
        {
            $cost = $cost + $totalSold->price_payed;
        }

        $priceRange = PriceControl::all();


        return response()->json([
            'farmcount' => $productCount,
            'pendingOrderCount' => $pendingOrderCount,
            'totalSold' => $cost,
            'priceRange' => $priceRange,
        ]);
    }

    public function priceRange(Request $request){

        $validatedData = $request->validate([
            'product_type' => 'required|string',
            'min' => 'required|numeric|min:0',
            'max' => 'required|numeric|gt:min',
        ], [
            'max.gt' => 'Maximum price must be greater than minimum price.',
        ]);

        // Find an existing record by 'product_name' or create a new one
       PriceControl::updateOrCreate(
            ['product_name' => $validatedData['product_type']],
            [
                'max' => $validatedData['max'],
                'min' => $validatedData['min'],
            ]
        );


        return response()->json(['success' => 'Product Added Successfully']);

    }

    public function cancelOrder($id){
        $trxn = Transaction::where('id', $id)->first();
        $data['price_of_goods'] = -1;

        if ($trxn) {
            $trxn->update($data);

            $transactionDetails = TransactionDetail::where('transaction_id', $id)->first();

            // Delete all retrieved transaction details
                $product = Product::where('id',  $transactionDetails->product_id)->first();
                $data1['actual_sold_kg'] = $product->actual_sold_kg - $transactionDetails->kg_purchased;
                $product->update($data1);
                $transactionDetails->delete();
        }

        return response()->json(200);
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
