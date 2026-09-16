import { Link, Navigate, Outlet ,Routes, Route } from "react-router-dom";
// import NavBar from "./NavBar";
// import SidebarNav from "./SidebarNav";

// import { Link, Navigate, Outlet, Routes, Route } from "react-router-dom";

import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider";

import { Button, Navbar, Sidebar } from "./ui/TailwindUI.jsx";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";


export default function DefaultLayout() {
  const {user , currentUserID, token, setUser, setToken, setCurrentUserID } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  // if(user.id){
  //   return <Navigate to="/login/NO USEr" />;
  // }
  // const history = History();
  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      setCurrentUserID(null);
    });
  };



  // localStorage.setItem('USER_ID', currentUserID);
  return (
    <div>
      {/* <NavBar /> */}

      <div>
        {/* <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   <span class="sr-only">Open sidebar</span>
   <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
   </svg>
</button> */}

        <aside
          id="separator-sidebar"
          class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          {/* <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800"> */}
          <div class="h-full py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <Sidebar
              className="bg-blue-500"
              aria-label="Sidebar with multi-level dropdown example"
            >
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item
                    className="mb-6 mt-3"
                    href="/dashboard"
                    icon={HiChartPie}
                  >

                    <p>Dashboard</p>

                    {/* <p>user - {user.id}-</p> */}
                  </Sidebar.Item>

                  <p> Products Section</p>
                  <hr class=" h-1 bg-gray-900 border-0  dark:bg-gray-700"></hr>
                  <Link to="/products/add"><Sidebar.Item >
                    Add Product
                  </Sidebar.Item></Link>
                  <Sidebar.Collapse
                    className="mt-3"
                    icon={HiShoppingBag}
                    label="Products Lists"
                  >
                    <Link to="products/brocolli"><Sidebar.Item>
                      Brocolli
                    </Sidebar.Item></Link>
                    <Sidebar.Item href="products/carrot">Carrots</Sidebar.Item>
                    <Link to="products/cabbage">
                      Cabbages
                   </Link>
                    <Sidebar.Item href="products/tomato">Tomatoes</Sidebar.Item>
                  </Sidebar.Collapse>
                  <Sidebar.Item href="/farms" icon={HiInbox}>
                    <p>Farms</p>
                  </Sidebar.Item>
                  <Sidebar.Item className="mb-6 mt-3" href="#" icon={HiUser}>
                    <p>Farms Harvests</p>
                  </Sidebar.Item>

                  <p>Transactions Section</p>
                  <hr class=" h-1 bg-gray-900 border-0 rounded md:my-10 dark:bg-gray-700"></hr>

                  <Link to="/orders/list"><Sidebar.Item
                    className="mb-6 mt-3"
                    icon={HiShoppingBag}
                  >
                    <p>Orders Page</p>
                  </Sidebar.Item></Link>

                  <p> App Settings</p>
                  <hr class=" h-1 bg-gray-900 border-0  dark:bg-gray-700"></hr>
                  <Sidebar.Item href="/admin/supported/barangay" icon={HiArrowSmRight}>
                    <p>Barangay Supported</p>
                  </Sidebar.Item>
                  <Sidebar.Item href="/admin/supported/products" icon={HiArrowSmRight}>
                    <p>Products Supported</p>
                  </Sidebar.Item>

                  <p>Account Section</p>
                  <hr class=" h-1 bg-gray-900 border-0 rounded md:my-10 dark:bg-gray-700"></hr>
                  <Sidebar.Item icon={HiUser}>
                    <p>Profile</p>
                  </Sidebar.Item>
                  <Link onClick={onLogout}><Sidebar.Item icon={HiArrowSmRight}>
                    <p>Logout</p>
                  </Sidebar.Item></Link>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>
        </aside>

        <div class="p-0 sm:ml-64">
          <div className="bg-slate-100 min-w-screen">
            <Navbar fluid rounded className="bg-slate-200">
              <Navbar.Brand href="/">
                <img
                  alt="e-Tabo logo"
                  className="mr-3 h-6 sm:h-9"
                  src="/logo.jpg"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                  E-tabo
                </span>
              </Navbar.Brand>
              <div className="flex md:order-2">
                <Link onClick={onLogout}>
                  <Button>Logout</Button>
                </Link>
                <Navbar.Toggle />
              </div>
              <Navbar.Collapse>
                <Link to="/dashboard">
                  <Navbar.Link>Farms</Navbar.Link>
                </Link>
                <Link to="/users">
                  {" "}
                  <Navbar.Link>Sellers</Navbar.Link>
                </Link>
                <Link to="/products">
                  <Navbar.Link>Products</Navbar.Link>
                </Link>
                <Navbar.Link>About</Navbar.Link>
              </Navbar.Collapse>
            </Navbar>
          </div>
          <div class="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">

          {/* ID: {currentUserID} */}
                    {/* <br>
                    </br> */}
                    {/* TOKEN : {token} */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
