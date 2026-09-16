import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
// import { useHistory  } from "react-router-dom";

import Swal from "sweetalert2";
import { Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

export default function ASellerCenter() {
  const { currentUserID } = useStateContext();

  const payload = {
    user_ID: currentUserID,
  };

  const [productTypeZ, setProductTypeZ] = useState([]);
  const [farmsOwned, setfarmsOwned] = useState([]);
  const [minCabbage, setminCabbage] = useState();
  const [maxCabbage, setmaxCabbage] = useState();
  const [minBrocolli, setminBrocolli] = useState();
  const [maxBrocolli, setmaxBrocolli] = useState();
  const [minCarrot, setminCarrot] = useState();
  const [maxCarrot, setmaxCarrot] = useState();
  const [minTomato, setminTomato] = useState();
  const [maxTomato, setmaxTomato] = useState();


  var counter = 1;

  useEffect(() => {
    axiosClient
      .get("/getProductTypes")
      .then((response) => {
        setProductTypeZ(response.data.productType);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axiosClient
      .post("/getFarmInfo", payload)
      .then((response) => {
        setfarmsOwned(response.data.farmsOwned);
        setminBrocolli(response.data.minBrocolli);
        setmaxBrocolli(response.data.maxBrocolli);
        setminCabbage(response.data.minCabbage);
        setmaxCabbage(response.data.maxCabbage);
        setminCarrot(response.data.minCarrot);
        setmaxCarrot(response.data.maxCarrot);
        setminTomato(response.data.minTomato);
        setmaxTomato(response.data.maxTomato);

      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //ADDING PRODUCTS
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    farm_belonged: "",
    is_approved: 1,
    variety: "",
    planted_date: "",
    prospect_harvest_in_kg: "",
    prospect_harvest_date: "",
    actual_harvested_in_kg: "",
    harvested_date: "",
    product_location: "",
    price: "",
    user_ID: currentUserID,
    product_picture: null, // Moved product_picture here
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const addProductForm = (e) => {
    e.preventDefault();

    const productData = new FormData();
    for (const key in formData) {
      productData.append(key, formData[key]);
    }
    axiosClient
      .post("/addProductForm", productData)
      .then((response) => {
        showSuccessAlert();
        setFormData({
          product_name: "",
          product_type: "",
          farm_belonged: "",
          variety: "",
          planted_date: "",
          prospect_harvest_in_kg: "",
          prospect_harvest_date: "",
          actual_harvested_in_kg: "",
          harvested_date: "",
          product_location: "",
          price: "",
          product_picture: null, // Reset product_picture too
        });
      })
      .catch((error) => {
        showInfoAlert();
        console.error(error);
      });
  };

  const showSuccessAlert = () => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Product Added Successfully",
    });
  };

  const showInfoAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Error!",
      text: "Please check all required fields are not empty",
    });
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    axiosClient
      .post("getOrdersSeller", payload)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (data === null) {
    return (
      <div className="text-center">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (data.userPendingOrders === undefined) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="mt-3 mx-6">
      <Tabs.Group
        aria-label="Tabs with underline"
        style="underline"
        className="items-center"
      >
        <Tabs.Item active icon={HiUserCircle} title="Add Product">
          <div className="m-12 outline outline-2  outline-offset-2">
            <div className="p-4 mb-5 bg-gray-200 dark:bg-gray-900 ">
              <p className="text-center text-lg mt-2 p-2">Add Product Form</p>
              <form onSubmit={addProductForm}>
                {/* START */}
                <div
                  className="bg-gray-200 dark:bg-gray-900 flex items-center justify-center"
                  style={{ fontFamily: '"Lato", sans-serif' }}
                >
                  <div className="flex md:flex-row flex-col items-center py-8 px-4">
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="product_name"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Product Name
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center pl-4 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="product_name"
                          value={formData.product_name}
                          onChange={handleChange}
                          id="product_name"
                          required
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16 md:py-0 py-4">
                      <label
                        htmlFor="product_type"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Product Type
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center px-4 border-r dark:border-gray-700 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                            />
                          </svg>
                        </div>
                        <select
                          id="product_type"
                          name="product_type"
                          value={formData.product_type}
                          onChange={handleChange}
                          required
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        >
                          <option value="-">Please Select --</option>
                          <option value="Brocollis">Brocollis</option>
                          <option value="Carrots">Carrots</option>
                          <option value="Cabbages">Cabbages</option>
                          <option value="Tomatoes">Tomatoes</option>
                        </select>
                      </div>
                    </div>
                    {/* Code block ends */}
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16 md:py-0 py-4">
                      <label
                        htmlFor="farm_belonged"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Farm Name
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center px-4 border-r dark:border-gray-700 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                            />
                          </svg>
                        </div>
                        <select
                          id="farm_belonged"
                          name="farm_belonged"
                          value={formData.farm_belonged}
                          onChange={handleChange}
                          required
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        >
                          <option value="0">Select Farm</option>
                          {farmsOwned.map((farm, index) => (
                            // <option value={farm.supported_product}>{farm.supported_product}</option>,
                            <option key={farm.id} value={farm.id}>
                              {counter++} . {farm.farm_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Code block ends */}
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="variety"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Variety
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center pl-4 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="variety"
                          name="variety"
                          required
                          value={formData.variety}
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                  </div>
                </div>

                {/* SECOND PART */}

                <div
                  className="bg-gray-200 dark:bg-gray-900 flex items-center justify-center"
                  style={{ fontFamily: '"Lato", sans-serif' }}
                >
                  <div className="flex md:flex-row flex-col items-center pt-1 pb-8 px-4">
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="planted_date"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Planted Date
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center pl-4 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                            />
                          </svg>
                        </div>
                        <input
                          type="date"
                          id="planted_date"
                          name="planted_date"
                          value={formData.planted_date}
                          required
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="prospect_harvest_in_kg"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Prospect Harvest in Kg
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center pl-4 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                            />
                          </svg>
                        </div>
                        <input
                          min={1}
                          required
                          id="prospect_harvest_in_kg"
                          type="number"
                          name="prospect_harvest_in_kg"
                          value={formData.prospect_harvest_in_kg}
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16 md:py-0 py-4">
                      <label
                        htmlFor="prospect_harvest_date"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Prospect Harvest Date
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center px-4 border-r dark:border-gray-700 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                            />
                          </svg>
                        </div>
                        <input
                          type="date"
                          id="prospect_harvest_date"
                          name="prospect_harvest_date"
                          required
                          value={formData.prospect_harvest_date}
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-16 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}

                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="harvested_date"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Harvested Date
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center pl-4 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                            />
                          </svg>
                        </div>
                        <input
                          type="date"
                          id="harvested_date"
                          name="harvested_date"
                          value={formData.harvested_date}
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                  </div>
                </div>

                {/* THIRD */}

                <div
                  className="bg-gray-200 dark:bg-gray-900 flex items-center justify-center"
                  style={{ fontFamily: '"Lato", sans-serif' }}
                >
                  <div className="flex md:flex-row flex-col items-center pt-1 pb-8 px-4">
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="actual_harvested_in_kg"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Actual Harvested in Kg
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center pl-4 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                            />
                          </svg>
                        </div>
                        <input
                          type="number"
                          id="actual_harvested_in_kg"
                          name="actual_harvested_in_kg"
                          value={formData.actual_harvested_in_kg}
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="product_location"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Product Location
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center pl-4 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                            />
                          </svg>
                        </div>
                        <input
                          id="product_location"
                          type="text"
                          name="product_location"
                          value={formData.product_location}
                          onChange={handleChange}
                          required
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16 md:py-0 py-4">
                      <label
                        htmlFor="price"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Price
                      </label>
                      <div className="relative">
                        <div className="absolute text-gray-600 dark:text-gray-400 flex items-center px-4 border-r dark:border-gray-700 h-full cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                            />
                          </svg>
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          min={
                            formData.product_type === 'Brocollis' ? minBrocolli :
                            formData.product_type === 'Carrots' ? minCarrot :
                            formData.product_type === 'Cabbages' ? minCabbage :
                            formData.product_type === 'Tomatoes' ? minTomato : ''
                          } // Set min based on product type
                          max={
                            formData.product_type === 'Brocollis' ? maxBrocolli :
                            formData.product_type === 'Carrots' ? maxCarrot:
                            formData.product_type === 'Cabbages' ? maxCabbage :
                            formData.product_type === 'Tomatoes' ? maxTomato : ''
                          } // Set max based on product type
                          required
                          value={formData.price}
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-16 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}

                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="product_picture"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Product Picture
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="product_picture"
                          name="product_picture"
                          required
                          // value={formData.handleFileChange}
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                  </div>
                </div>

                {/* ENDING */}

                <div
                  className="bg-gray-200 dark:bg-gray-900 flex items-center justify-center"
                  style={{ fontFamily: '"Lato", sans-serif' }}
                >
                  <div className="flex md:flex-row flex-col items-center pt-1 pb-8 px-4">
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <div className="relative">
                        <a
                          type=""
                          className="mx-2 my-2 bg-slate-700 transition duration-150 ease-in-out hover:bg-slate-600 rounded text-white px-6 py-2 text-md w-full block"
                        >
                          Back
                        </a>
                      </div>
                    </div>
                    {/* Code block ends */}
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16 md:py-0 py-4">
                      <div className="relative">
                        <button
                          type="submit"
                          // onClick={addP roductForm}
                          className="mx-2 my-2 bg-green-700 transition duration-150 ease-in-out hover:bg-green-600 rounded text-white px-6 py-2 text-md w-full block"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    {/* Code block ends */}
                    <div className="flex flex-col md:mr-16">
                      <div className="relative">
                        <a
                          href="/seller/center/addFarm"
                          className="mx-2 my-2 bg-slate-700 transition duration-150 ease-in-out hover:bg-slate-600 rounded text-white px-6 py-2 text-md w-full block text-center"
                        >
                          Add Farm
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item active icon={HiUserCircle} title="Farms Pending Order">
          <div className="bg-gray-100 w-full">
            <p className="text-center mt-3">Pending Orders</p>
            <p className="text-xs mt-0 mb-6 text-center italic">
              These are the orders to your farm.
            </p>
            {data.userPendingOrders.map((order) => (
              <div className="bg-slate-200" key={order.id}>
                {order.transaction_detail.map(
                  (transaction_detail) =>
                    order.price_payed === null ? (
                      <div
                        key={transaction_detail.id}
                        className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto"
                        style={{ borderTop: "1px solid #000" }}
                      >
                        <div className="mt-0 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0 bg-slate-300">
                          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                            <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                              <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
                                Transaction No: {order.id}
                              </p>

                              <div className="mt-0 md:mt-2 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                <div className="pb-4 md:pb-8 w-full md:w-40">
                                  <img
                                    className="w-full hidden md:block"
                                    src={`http://127.0.0.1:8000/storage/Farms/${transaction_detail.product_ordered.farm_belonged}/${transaction_detail.product_ordered.product_picture}`}
                                  />
                                </div>
                                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                  <div className="w-full flex flex-col justify-start items-start space-y-8">
                                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                                      <span>
                                        {transaction_detail.product_name}
                                      </span>
                                    </h3>
                                    <div className="flex justify-start items-start flex-col space-y-2">
                                      <p className="text-sm leading-none text-gray-800">
                                        <span className="text-gray-300">
                                          Variety:{" "}
                                        </span>
                                        {transaction_detail.variety}
                                      </p>
                                      <p className="text-sm leading-none text-gray-800">
                                        <span className="text-gray-300">
                                          Planted :{" "}
                                        </span>
                                        {transaction_detail.planted_date}
                                      </p>
                                      <p className="text-sm leading-none text-gray-800">
                                        <span className="text-gray-300">
                                          Harvested:{" "}
                                        </span>
                                        {transaction_detail.harvested_date}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex justify-between space-x-8 items-start w-full">
                                    <p className="text-base xl:text-lg leading-6">
                                      ₱ {transaction_detail.price_per_kilo} /Kl
                                    </p>
                                    <p className="text-base xl:text-lg leading-6 text-gray-800">
                                      {transaction_detail.kg_purchased} Kl
                                    </p>
                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                                      ₱{" "}
                                      {transaction_detail.price_per_kilo *
                                        transaction_detail.kg_purchased}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">
                                  Summary
                                </h3>
                                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                  <div className="flex justify-between w-full">
                                    <p className="text-base leading-4 text-gray-800">
                                      Subtotal
                                    </p>
                                    <p className="text-base leading-4 text-gray-600">
                                      ₱{" "}
                                      {transaction_detail.price_per_kilo *
                                        transaction_detail.kg_purchased}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                  <p className="text-base font-semibold leading-4 text-gray-800">
                                    Total
                                  </p>
                                  <p className="text-base font-semibold leading-4 text-gray-600">
                                    ₱{" "}
                                    {transaction_detail.price_per_kilo *
                                      transaction_detail.kg_purchased}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">
                                  Order Status :{" "}
                                  <span className="text-sm border-y-emerald-400">
                                    {" "}
                                    PENDING{" "}
                                  </span>
                                </h3>
                                <div className="flex justify-between items-start w-full">
                                  <div className="flex justify-center items-center space-x-4">
                                    <div class="w-8 h-8">
                                      <img
                                        class="w-full h-full"
                                        alt="logo"
                                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                                      />
                                    </div>
                                    <div className="flex flex-col justify-start items-center">
                                      <p className="text-lg leading-6 font-semibold text-green-800">
                                        Scheduled Delivery Dates
                                        <br />
                                        <span className="font-normal">
                                          {order.seller_prospect_date_todeliver}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">
                                  Customer : <br />
                                  <span className="text-sm border-y-emerald-400">
                                    {" "}
                                    {order.user.name} <br />
                                    {order.user.mobile_number}
                                  </span>
                                </h3>
                                <div className="flex justify-between items-start w-full">
                                  <div className="flex justify-center items-center space-x-4">
                                    <div class="w-8 h-8">
                                      <img
                                        class="w-full h-full"
                                        alt="logo"
                                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                                      />
                                    </div>
                                    <div className="flex flex-col justify-start items-center">
                                      <p className="text-lg leading-6 font-semibold text-green-800">
                                        Delivery to
                                        <br />
                                        <span className="font-normal">
                                          {order.user.address}
                                        </span>
                                      </p>
                                      <a
                                        href={`/buyer-seller/order/delivered/${order.id}`}
                                      >
                                        <button className="rounded-lg focus:outline-none focus:ring-2 hover:bg-green focus:ring-offset-2 focus:ring-green-800 font-medium text-base leading-4 text-white bg-green-800 w-full py-4 lg:mt-4 mt-2 p-2">
                                          Order Delivered
                                        </button>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null //
                )}
              </div>
            ))}
          </div>
        </Tabs.Item>
        <Tabs.Item active icon={HiUserCircle} title="Farms Fulfilled Order">
          <div className="bg-gray-100 w-full">
            <p className="text-center mt-3">Fulfilled Orders</p>
            <p className="text-xs mt-0 mb-6 text-center italic">
              Successfully Ordered Commodities
            </p>
            {data.userPendingOrders.map((order) => (
              <div className="bg-slate-200" key={order.id}>
                {order.transaction_detail.map(
                  (transaction_detail) =>
                    order.price_payed != null ? (
                      <div
                        key={transaction_detail.id}
                        className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto"
                        style={{ borderTop: "1px solid #000" }}
                      >
                        <div className="mt-0 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0 bg-slate-300">
                          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                            <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                              <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
                                Transaction No: {order.id}
                              </p>

                              <div className="mt-0 md:mt-2 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                <div className="pb-4 md:pb-8 w-full md:w-40">
                                  <img
                                    className="w-full hidden md:block"
                                    src={`http://127.0.0.1:8000/storage/Farms/${transaction_detail.product_ordered.farm_belonged}/${transaction_detail.product_ordered.product_picture}`}
                                  />
                                </div>
                                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                  <div className="w-full flex flex-col justify-start items-start space-y-8">
                                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                                      <span>
                                        {transaction_detail.product_name}
                                      </span>
                                    </h3>
                                    <div className="flex justify-start items-start flex-col space-y-2">
                                      <p className="text-sm leading-none text-gray-800">
                                        <span className="text-gray-300">
                                          Variety:{" "}
                                        </span>
                                        {transaction_detail.variety}
                                      </p>
                                      <p className="text-sm leading-none text-gray-800">
                                        <span className="text-gray-300">
                                          Planted :{" "}
                                        </span>
                                        {transaction_detail.planted_date}
                                      </p>
                                      <p className="text-sm leading-none text-gray-800">
                                        <span className="text-gray-300">
                                          Harvested:{" "}
                                        </span>
                                        {transaction_detail.harvested_date}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex justify-between space-x-8 items-start w-full">
                                    <p className="text-base xl:text-lg leading-6">
                                      ₱ {transaction_detail.price_per_kilo} /Kl
                                    </p>
                                    <p className="text-base xl:text-lg leading-6 text-gray-800">
                                      {transaction_detail.kg_purchased} Kl
                                    </p>
                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                                      ₱{" "}
                                      {transaction_detail.price_per_kilo *
                                        transaction_detail.kg_purchased}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">
                                  Summary
                                </h3>
                                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                  <div className="flex justify-between w-full">
                                    <p className="text-base leading-4 text-gray-800">
                                      Subtotal
                                    </p>
                                    <p className="text-base leading-4 text-gray-600">
                                      ₱{" "}
                                      {transaction_detail.price_per_kilo *
                                        transaction_detail.kg_purchased}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                  <p className="text-base font-semibold leading-4 text-gray-800">
                                    Total
                                  </p>
                                  <p className="text-base font-semibold leading-4 text-gray-600">
                                    ₱{" "}
                                    {transaction_detail.price_per_kilo *
                                      transaction_detail.kg_purchased}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">
                                  Order Status : <br />
                                  <span className="text-sm border-y-emerald-400">
                                    {" "}
                                    DELIVERED {order.payed_on}
                                  </span>
                                </h3>
                                <div className="flex justify-between items-start w-full">
                                  <div className="flex justify-center items-center space-x-4">
                                    <div class="w-8 h-8">
                                      <img
                                        class="w-full h-full"
                                        alt="logo"
                                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                                      />
                                    </div>
                                    <div className="flex flex-col justify-start items-center">
                                      <p className="text-lg leading-6 font-semibold text-green-800">
                                        Buyers Confirmation
                                        <br />
                                        <span className="font-normal">
                                          {order.payed_on === null ? (
                                            <p className="text-red-600">
                                              NOT YET CONFIRMED BY THE BUYER
                                            </p>
                                          ) : (
                                            <p className="text-bold rounded-md bg-green-500 text-white text-center">
                                              Confirmed
                                            </p>
                                          )}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">
                                  Delivered to : <br />
                                  <span className="text-sm border-y-emerald-400">
                                    {" "}
                                    {order.user.name} <br />
                                    {order.user.mobile_number}
                                  </span>
                                </h3>
                                <div className="flex justify-between items-start w-full">
                                  <div className="flex justify-center items-center space-x-4">
                                    <div class="w-8 h-8">
                                      <img
                                        class="w-full h-full"
                                        alt="logo"
                                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                                      />
                                    </div>
                                    <div className="flex flex-col justify-start items-center">
                                      <p className="text-lg leading-6 font-semibold text-green-800">
                                        Delivery to
                                        <br />
                                        <span className="font-normal">
                                          {order.user.address}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null //
                )}
              </div>
            ))}
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
