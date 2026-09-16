import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
// import { useHistory  } from "react-router-dom";

import Swal from "sweetalert2";
import { Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

export default function ProductAdd() {
  const { currentUserID } = useStateContext();

  const payload = {
    user_ID: currentUserID,
  };

  const [productType, setProductType] = useState([]);
  const [farmsOwned, setfarmsOwned] = useState([]);
  var counter = 1;

  useEffect(() => {
    axiosClient
      .get("/getProductTypes")
      .then((response) => {
        setProductType(response.data.productType);
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

  return (
    <div className="mt-3 mx-6">
      <Tabs.Group
        aria-label="Tabs with underline"
        style="underline"
        className="items-center"
      >
        <Tabs.Item active icon={HiUserCircle} title="Broccoli">
          <h1>assssjkahs</h1>
        </Tabs.Item>
        <Tabs.Item active icon={HiUserCircle} title="Cabbage">
          <h1>asjkahs</h1>
        </Tabs.Item>
        <Tabs.Item active icon={HiUserCircle} title="Carrot">
          <h1>asjkahs</h1>
        </Tabs.Item>
        <Tabs.Item active icon={HiUserCircle} title="Tomato">
          <h1>asjkahs</h1>
        </Tabs.Item>
      </Tabs.Group>
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
                      <option value="0" selected disabled>
                        Select Product Type
                      </option>
                      {productType.map((product) => (
                        <option value={product.supported_product}>
                          {product.supported_product}
                        </option>
                      ))}
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
                      className="mx-2 my-2 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-md w-full block"
                    >
                      Save
                    </button>
                  </div>
                </div>
                {/* Code block ends */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
