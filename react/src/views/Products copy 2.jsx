import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Pagination } from "../components/ui/TailwindUI.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const { user } = useStateContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // const { setPro duct, notification } = useStateContext();

  useEffect(() => {
    axiosClient.get("/products").then(({ data }) => {
      setProduct(data);
    });
  }, []);
  useEffect(() => {
    getProducts();
  }, [currentPage]);

  // const onDeleteClick = (user) => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) {
  //     return;
  //   }
  //   axiosClient.delete(`/users/${user.id}`).then(() => {
  //     setNotification("User was successfully deleted");
  //     getUsers();
  //   });
  // };

  const getProducts = () => {
    setLoading(true);
    axiosClient
      .get(`/products?page=${currentPage}`)
      .then(({ data }) => {
        setLoading(false);
        setProducts(data.data);
        setTotalPages(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <body class="antialiased bg-gray-200 text-gray-900 font-sans p-6">
        <div class="container mx-auto">
          <div class="flex flex-wrap -mx-4">

            <form>
            {loading && <p>Loading</p>}
            {!loading && (
              <div class="flex flex-wrap -mx-4">
                {products.map((u) => (
                  <div class="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
                    <a
                      href=""
                      class="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden"
                    >
                      <div class="relative pb-48 overflow-hidden">
                        <img
                          class="absolute inset-0 h-full w-full object-cover"
                          src="https://images.unsplash.com/photo-1475855581690-80accde3ae2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
                          alt=""
                        />
                      </div>
                      <div class="p-4">
                        <FontAwesomeIcon icon={faLocationDot} />
                        &nbsp;
                        <span class="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                          {/* {u.product_location} */} same
                        </span>
                        <h2 class="mt-2 mb-2">{u.product_name}</h2>
                        <p class="text-sm text-justify">
                          Available: {u.prospect_harvest_in_kg} &nbsp; Kilo/s{" "}
                          <br></br>
                        </p>
                        <div class="mt-3 flex items-center">
                          <span class="text-sm font-semibold">Php.</span>&nbsp;
                          <span class="font-bold text-xl">{u.price}</span>&nbsp;
                          <span class="text-sm font-semibold">/ Kl</span>
                        </div>
                      </div>
                      <div class="p-2 border-t border-b text-xs text-gray-700">
                        <span class="flex items-center mb-1">
                          <p>Planted:</p>
                          <i class="far fa-clock fa-fw mr-2 text-gray-900"></i>
                          {u.planted_date}
                        </span>
                        <span class="flex items-center">
                          <p>Harvesting:</p>
                          <i class="far fa-address-card fa-fw text-gray-900 mr-2"></i>{" "}
                          {u.prospect_harvest_date}
                        </span>
                      </div>
                      </a>
                      <div class="p-2 flex items-center text-sm text-gray-600">
                        <label htmlFor="quantity">
                        <FontAwesomeIcon icon={faCartShopping} size="2x" />
                        </label>
                        <input
                          type="number"
                          name="product_id[]"
                          id="quantity"
                          class=" ml-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          min="1" max={u.prospect_harvest_in_kg} ></input>
                      </div>

                  </div>
                ))}
              </div>
            )}
             </form>
          </div>

        </div>

        <div className="flex items-center justify-center text-center mt-3">
          <Pagination
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
            showIcons
            totalPages={totalPages}
          />
        </div>

      </body>
    </div>
  );
}
