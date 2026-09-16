import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
// import { useHistory  } from "react-router-dom";

import Swal from "sweetalert2";
import { Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

export default function Srp() {
  const { currentUserID } = useStateContext();

  const payload = {
    user_ID: currentUserID,
  };

  var counter = 1;

  //ADDING PRODUCTS
  const [formData, setFormData] = useState({
    product_type: "",
    min: "",
    max: "",
  });

  const [brocolli, setBrocolli] = useState([]);
  const [cabbage, setCabbage] = useState([]);
  const [carrot, setCarrot] = useState([]);
  const [tomato, setTomato] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const addFarmForm = (e) => {
    e.preventDefault();

    const farmData = new FormData();
    for (const key in formData) {
      farmData.append(key, formData[key]);
    }
    axiosClient
      .post("/priceRange", farmData)
      .then((response) => {
        showSuccessAlert();
        setFormData({
          product_type: "",
          min: "",
          max: "",
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
      text: "Price Range Set Successfully",
    });
  };

  const showInfoAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Error!",
      text: "Please check all required fields are not empty",
    });
  };

  const [prices, setPrices] = useState([]);

  useEffect(() => {
    axiosClient.get("/getPriceRange").then(({ data }) => {
      setPrices(data);
    });
  }, []);


  useEffect(() => {
    axiosClient.get("/getPriceRangeSpecific")
    .then(({ data }) => {
      setBrocolli(data.broccoli);
      setCabbage(data.cabbage);
      setCarrot(data.carrot);
      setTomato(data.tomato);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);

  return (
    <div className="mt-3 mx-6">
      <Tabs.Group
        aria-label="Tabs with underline"
        style="underline"
        className="items-center"
      >
        <Tabs.Item active icon={HiUserCircle} title="Suggested Retail Price">
        <div className="items-center">
          <h2 className="text-center">Price Posted</h2>
          <div className="2xl:container 2xl:mx-auto">
          <div className=" bg-gray-50 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-12 gap-14 lg:px-20 lg:py-12 py-10 md:px-12 px-4">
            {/* customer Grid Card */}

            <div>
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                height="3em"
                width="3em"
              >
                <path d="M0 192c0-35.3 28.7-64 64-64h1.6C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64h1.6c35.3 0 64 28.7 64 64 0 11.7-3.1 22.6-8.6 32H8.6C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256h457.2c15.1 0 27.4 12.3 27.4 27.4 0 70.5-44.4 130.7-106.7 154.1l-1.8 14.5c-2 16-15.6 28-31.8 28H140.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z" />
              </svg>
              <h3 className=" text-xl leading-5 font-semibold text-gray-800 lg:mt-10 mt-8 ">
                Brocolli
              </h3>
              <p className=" text-base leading-6 font-normal text-gray-600 mt-4 lg:w-full md:w-9/12 w-full">
                Max. Price : Php <span className="font-bold">{brocolli}.00</span>
              </p>
            </div>
            {/* Delivery grid Card */}
            <div>
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                height="3em"
                width="3em"
              >
                <path d="M346.7 6C337.6 17 320 42.3 320 72c0 40 15.3 55.3 40 80s40 40 80 40c29.7 0 55-17.6 66-26.7 4-3.3 6-8.2 6-13.3s-2-10-6-13.2c-11.4-9.1-38.3-26.8-74-26.8-32 0-40 8-40 8s8-8 8-40c0-35.7-17.7-62.6-26.8-74-3.2-4-8.1-6-13.2-6s-10 2-13.3 6zM244.6 136c-40 0-77.1 18.1-101.7 48.2l60.5 60.5c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L125.5 212v.1L2.2 477.9C-2 487-.1 497.8 7 505s17.9 9 27.1 4.8l134.7-62.4-52.1-52.1c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l60.4 60.3 100.2-46.4c46.4-21.5 76.2-68 76.2-119.2C376 194.8 317.2 136 244.6 136z" />
              </svg>
              <h3 className=" text-xl leading-5 font-semibold text-gray-800 lg:mt-10 mt-8 ">
                Carrots
              </h3>
              <p className=" text-base leading-6 font-normal text-gray-600 mt-4 lg:w-full md:w-9/12 w-full">
                Max. Price : Php <span className="font-bold">{carrot}.00</span>
              </p>
            </div>

            {/* Recycle Grid Card */}

            <div>
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                height="3em"
                width="3em"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M2 9a10 10 0 1020 0M12 19A10 10 0 0122 9M2 9a10 10 0 0110 10M12 4a9.7 9.7 0 012.99 7.5M9.01 11.5A9.7 9.7 0 0112 4" />
              </svg>
              <h3 className=" text-xl leading-5 font-semibold text-gray-800 lg:mt-10 mt-8 ">
                Cabbages
              </h3>
              <p className=" text-base leading-6 font-normal text-gray-600 mt-4 lg:w-full md:w-9/12 w-full">
                Max. Price : Php <span className="font-bold">{cabbage}.00</span>
              </p>
            </div>

            {/* Secure Payment Card */}

            <div>
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                height="3em"
                width="3em"
              >
                <path d="M288 120c0-30.9 25.1-56 56-56s56 25.1 56 56v13c-29.3 10-48 34.5-48 70.1 0 27.9 25.3 74.8 66 111.6 3.8 3.5 8.9 5.3 14 5.3s10.2-1.8 14-5.3c40.7-36.8 66-83.7 66-111.6 0-35.6-18.7-60.2-48-70.1v-13C464 53.7 410.3 0 344 0S224 53.7 224 120v21.8c-16.7-8.8-35.8-13.8-56-13.8-66.3 0-120 53.7-120 120v13c-29.3 10-48 34.5-48 70.1 0 27.9 25.3 74.8 66 111.6 3.8 3.5 8.9 5.3 14 5.3s10.2-1.8 14-5.3c40.7-36.8 66-83.7 66-111.6 0-35.6-18.7-60.2-48-70.1v-13c0-30.9 25.1-56 56-56s56 25.1 56 56v232c0 17.7 14.3 32 32 32s32-14.3 32-32V120z" />
              </svg>
              <h3 className=" text-xl leading-5 font-semibold text-gray-800 lg:mt-10 mt-8 ">
                Tomato
              </h3>
              <p className=" text-base leading-6 font-normal text-gray-600 mt-4 lg:w-full md:w-9/12 w-full">
                Max. Price : Php <span className="font-bold">{tomato}.00</span>
              </p>
            </div>
          </div>
        </div>
          </div>
          <div className="mx-12 outline outline-2  outline-offset-2">
            <div className="p-4 mb-5 bg-gray-200 dark:bg-gray-900 ">
              <p className="text-center text-lg mt-2 p-2">
                Price Ceiling and Price Floor
              </p>
              <form onSubmit={addFarmForm}>
                {/* START */}
                <div
                  className="bg-gray-200 dark:bg-gray-900 flex items-center justify-center"
                  style={{ fontFamily: '"Lato", sans-serif' }}
                >
                  <div className="flex md:flex-row flex-col items-center px-4">
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="farm_name"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Product Type
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
                        <select
                          id="product_type"
                          name="product_type"
                          value={formData.product_type}
                          onChange={handleChange}
                          required
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        >
                          <option value="SelectOne">Select One</option>

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
                        htmlFor="product_type"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Minimum Price
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
                        <input
                          type="number"
                          min={0}
                          id="min"
                          name="min"
                          value={formData.min}
                          onChange={handleChange}
                          required
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}

                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <label
                        htmlFor="variety"
                        className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                      >
                        Maximum Price
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
                          min={1}
                          id="max"
                          name="max"
                          required
                          value={formData.max}
                          onChange={handleChange}
                          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                        />
                      </div>
                    </div>
                    {/* Code block ends */}
                  </div>
                </div>

                <div
                  className="bg-gray-200 dark:bg-gray-900 flex items-center justify-center"
                  style={{ fontFamily: '"Lato", sans-serif' }}
                >
                  <div className="flex md:flex-row flex-col items-center pt-1 pb-8 px-4">
                    {/* Code block starts */}
                    <div className="flex flex-col md:mr-16">
                      <div className="relative">
                        <a
                          href="/seller/center"
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
                  </div>
                </div>
              </form>
            </div>
          </div>


        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
