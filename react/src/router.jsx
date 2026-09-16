import {createBrowserRouter} from "react-router-dom";

import GuestLayout from "./components/GuestLayout";
import RootRedirect from "./components/RootRedirect.jsx";
import Login from "./views/Signin";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";

import AdminLayout from "./views/Admin/AdminLayout.jsx";
import Dashboard from "./views/Admin/Dashboard.jsx";

import AllUsers from "./views/Admin/AllUsers.jsx";
import UserViewVerified from "./views/Admin/UserViewVerified.jsx";
import UserForm from "./views/Admin/UserForm";
import UserFormManage from "./views/Admin/UserFormManage.jsx";

import FarmsApproved from "./views/Admin/FarmsApproved.jsx";
import FarmFormManage from "./views/Admin/FarmFormManage.jsx";
import FarmViewProducts from "./views/Admin/FarmViewProducts.jsx";
import FarmersProfile from "./views/Admin/FarmersProfile.jsx";
import FarmersProfileInfo from "./views/Admin/FarmersProfileInfo.jsx";

import Srp from "./views/Admin/Srp.jsx";
import ProductFormManage from "./views/Admin/ProductFormManage.jsx";
import ProductsApproved from "./views/Admin/ProductsApproved.jsx";

import CropPredictiveAnalysis from "./views/Admin/CropPredictiveAnalysis.jsx";
import BarangaySupported from "./views/Admin/BarangaySupported.jsx";
import ProductsSupported from "./views/Admin/ProductsSupported.jsx";
import BarangayUpdate from "./views/Admin/BarangayUpdate.jsx";

import SellerBuyerDashboard from "./views/SellerBuyer/ABuyerSellerDashboard"
import ProductAdd from "./views/SellerBuyer/ProductAdd.jsx";
import FarmListBySeller from "./views/SellerBuyer/FarmsBySeller.jsx"

import FulfilledOrderConfirm from "./views/SellerBuyer/FulfilledOrderConfirm.jsx";
import FarmProductOrderLists from "./views/SellerBuyer/OrderListsByFarm.jsx";

import GenerateReport from "./views/Admin/GenerateReport";

import Products from "./views/SellerBuyer/AProducts.jsx";
import ConfirmOrder from "./views/SellerBuyer/AConfirmOrder.jsx";
import FarmersProduct from "./views/SellerBuyer/AFarmersProduct.jsx";
import FarmViewProductsSB from "./views/SellerBuyer/AFarmViewProductsSB.jsx"
import SellerCenter from "./views/SellerBuyer/ASellerCenter.jsx"
import AddFarm from "./views/SellerBuyer/AAddFarm.jsx"
import ConfirmDelivery from "./views/SellerBuyer/AConfirmDelivery.jsx"

import Orders from "./views/SellerBuyer/AOrders";
import Home from "./views/Buyers/Home";

import BuyerLayout from "./views/Buyers/BuyerLayout";
import ListsProduct from "./views/Buyers/AProducts";
import OrdersLists from "./views/Buyers/Orders.jsx";
import LayoutSeller from "./views/SellerBuyer/Layout/LayoutSeller";
import LayoutBuyer from "./views/SellerBuyer/Layout/LayoutBuyer";
import CancelOrder from "./views/SellerBuyer/ABuyerSellerCancel";
import CancelOrderBuyer from "./views/Buyers/Cancel";
import Sample from "./views/sample.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: 'admin/dashboard',
        element: <Dashboard />
      },
      {
        path: 'admin/users/pending',
        element: <AllUsers />
      },
      {
        path: 'admin/users/verified',
        element: <AllUsers />
      },
      {
        path: 'admin/users/all',
        element: <AllUsers />
      },
      {
        path: 'users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: 'admin/users/view/:id',
        element: <UserViewVerified />
      },
      {
        path: 'admin/users/manage/:id',
        element: <UserFormManage />
      },
      {
        path: 'admin/pending/user/:id',
        element: <UserForm key="userUpdate" />
      },
      {
        path: 'admin/farms/approved',
        element: <FarmsApproved />
      },
      {
        path: 'admin/farms/pending/:id',
        element: <FarmFormManage />
      },
      {
        path: 'admin/farms/approved/:id',
        element: <FarmViewProducts />
      },
      {
        path: 'admin/products/srp',
        element: <Srp />
      },
      {
        path: 'admin/products/approved',
        element: <ProductsApproved />
      },
      {
        path: 'admin/product/pending/:id',
        element: <ProductFormManage />
      },
      {
        path: 'admin/farmers/profile',
        element: <FarmersProfile />
      },
      {
        path: 'admin/farm/:id',
        element: <FarmersProfileInfo />
      },
      {
        path: 'admin/croprecords',
        element: <CropPredictiveAnalysis />
      },
      {
        path: 'admin/supported/barangay',
        element: <BarangaySupported />
      },
      {
        path: 'barangays/:id',
        element: <BarangayUpdate />
      },
      {
        path: 'admin/supported/products',
        element: <ProductsSupported />
      },
      {
        path: 'admin/products/setPrice',
        element: <ProductsSupported />
      },
      {
        path: 'admin/report/generate',
        element: <GenerateReport />
      },
    ]
  },
  {
    element: <BuyerLayout />,
    children: [
      {
        path: 'buyer/home',
        element: <Home />
      },
      {
        path: 'buyer/order/products',
        element: <ListsProduct />
      },
      {
        path: 'buyer/orders',
        element: <OrdersLists />
      },
      {
        path: 'buyer/order/cancel/:id',
        element: <CancelOrderBuyer />
      },
    ]
  },
  {
    element: <LayoutBuyer />,
    children: [
      {
        path: 'buyer-seller/role/buyer',
        element: <Products />
      },
      {
        path: 'buyer-seller/orders',
        element: <Orders />
      },
      {
        path: 'buyer-seller/order/confirm/:id',
        element: <ConfirmOrder />
      },
      {
        path: 'buyer-seller/order/cancel/:id',
        element: <CancelOrder />
      },
    ]
  },
  {
    element: <LayoutSeller />,
    children: [
      {
        path: 'buyer-seller/dashboard',
        element: <SellerBuyerDashboard />
      },
      {
        path: 'buyer-seller/farmers/product',
        element: <FarmersProduct />
      },
      {
        path: 'buyer-seller/farm/:id',
        element: <FarmViewProductsSB />
      },
      {
        path: 'seller/center',
        element: <SellerCenter />
      },
      {
        path: 'buyer-seller/product/add',
        element: <ProductAdd />
      },
      {
        path: 'buyer-seller/farms/owned',
        element: <FarmListBySeller />
      },
      {
        path: 'buyer-seller/order/delivered/:id',
        element: <ConfirmDelivery />
      },
      {
        path: 'buyer-seller/farm/product/orders',
        element: <FarmProductOrderLists />
      },
      {
        path: 'buyer-seller/order/confirm/:id',
        element: <FulfilledOrderConfirm />
      },
      {
        path: 'seller/center/addFarm',
        element: <AddFarm />
      },
      {
        path: 'sample',
        element: <Sample />
      },
    ]
  },
  {
    element: <GuestLayout/>,
    children: [
      {
        path: 'login',
        element: <Login/>
      },
      {
        path: 'signup',
        element: <Signup/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
