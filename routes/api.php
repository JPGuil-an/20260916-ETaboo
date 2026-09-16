<?php

use Illuminate\Http\Request;
use App\Models\SupportedBarangay;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FarmController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SellerBuyerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SuperAdminController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    //ALL ABOUT USERS
    // Route::apiResource('/users', UserController::class);
    Route::get('/usercount', [DashboardController::class, 'usercount']);
    Route::get('/admin/dashboard/insights', [DashboardController::class, 'insights']);
    Route::get('/allUsers/pending', [UserController::class, 'allUsersPending']);
    Route::get('/allUsers/allUsers', [UserController::class, 'allUsers']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    //PRODUCTS
     Route::get('/products', [ProductController::class, 'allProducts']);
     Route::post('/getFarmInfo', [ProductController::class, 'getFarmInfobyUser']);
     Route::get('/getProductTypes', [ProductController::class, 'getProductTypes']);
     Route::post('/addProductForm', [ProductController::class, 'addProduct']);

    //FARMERS
    Route::get('/admin/farmers/profile', [SuperAdminController::class, 'getFarmers']);

    //ADMIN FOR PRODUCTS
    Route::get('/admin/products/pending', [SuperAdminController::class, 'pendingProducts']);
    Route::get('/admin/product/{product}', [SuperAdminController::class, 'pendingProduct']);
    Route::put('/admin/product/{product}', [SuperAdminController::class, 'pendingProductUpdate']);
    Route::get('/admin/products/approved', [SuperAdminController::class, 'approvedProducts']);

    //SUPERADMIN PAGES
    Route::get('/supportedBarangay', [SuperAdminController::class, 'supportedBarangay']);
    Route::post('/getCropPredictiveAnalysis', [SuperAdminController::class, 'getCropRecords']);
    Route::get('/barangays/{barangay}', [SuperAdminController::class, 'showBarangay']);
    Route::put('/barangays/{barangay}', [SuperAdminController::class, 'updateBarangay']);
    Route::post('/addBarangay', [DashboardController::class, 'addBarangay']);
    Route::get('/ids/{filename}', [SuperAdminController::class, 'getIDimage']);
    Route::post('/generateReport', [SuperAdminController::class, 'generateReport']); //dashboard
    Route::get('/getPriceRange', [SuperAdminController::class, 'getPriceRange']); //dashboard
    Route::get('/getPriceRangeSpecific', [SuperAdminController::class, 'getPriceRangeSpecific']); //dashboard

   //Farms
    Route::post('/farms', [FarmController::class, 'getFarms']);
    Route::get('/farm/{farm}', [FarmController::class, 'getFarm']);
    Route::put('/farm/{farm}', [FarmController::class, 'farmUpdate']);
    Route::get('/farmWithProducts/{farm}', [FarmController::class, 'farmWProducts']);


    //SELLER BUYER
    Route::post('/farmWithProducts', [SellerBuyerController::class, 'farmWProducts']);
    Route::get('/getProductToOrder/{product}', [SellerBuyerController::class, 'getProductToOrder']);
    Route::post('/orderNow',[SellerBuyerController::class, 'orderNow']);
    Route::post('/checkout',[SellerBuyerController::class, 'checkout']);
    Route::post('getOrders', [SellerBuyerController::class, 'getOrders']);   //ORDERS
    Route::get('getOrder/{order}', [SellerBuyerController::class, 'getFulfilledOrder']);
    Route::put('conFirmOrderBuyer/{order}', [SellerBuyerController::class, 'conFirmOrderBuyer']);
    Route::post('getFarmOrders', [SellerBuyerController::class, 'getFarmOrders']);

    Route::post('/confirmOrder/{order}', [SellerBuyerController::class, 'confirmOrder']);

    Route::post('/addFarmForm', [SellerBuyerController::class, 'addFarmForm']);
    Route::post('/getOrdersSeller', [SellerBuyerController::class, 'getOrdersSeller']);   //ORDERS
    Route::post('/confirmDelivery', [SellerBuyerController::class, 'confirmDelivery']);   //ORDERS

    Route::post('/sellerDashboard', [SellerBuyerController::class, 'sellerDashboard']); //dashboard

    Route::post('/priceRange', [SellerBuyerController::class, 'priceRange']); //dashboard

    Route::post('/cancelOrder/{order}', [SellerBuyerController::class, 'cancelOrder']);


    // Route::post('getPendingOrders', [ProductController::class, 'getPendingOrders']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
