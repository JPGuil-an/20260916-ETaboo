import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
// import { useHistory  } from "react-router-dom";

import Swal from "sweetalert2";
import { Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

export default function AAddFarm() {
  const { currentUserID } = useStateContext();

  const payload = {
    user_ID: currentUserID,
  };

  var counter = 1;

  //ADDING PRODUCTS
  const [formData, setFormData] = useState({
    farm_name: "",
    farm_location: "",
    farm_hectares: "",
    farm_info: "",
    farm_pic: null, // Moved product_picture here
    user_ID: currentUserID,
  });

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
      .post("/addFarmForm", farmData)
      .then((response) => {
        showSuccessAlert();
        setFormData({
          farm_name: "",
          farm_location: "",
          farm_hectares: "",
          farm_pic: null,
          farm_info: "",

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
      text: "FARM Added Successfully",
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

        <Tabs.Item active icon={HiUserCircle} title="Add Farm">
        <div className="m-12 outline outline-2  outline-offset-2">
        <div className="p-4 mb-5 bg-gray-200 dark:bg-gray-900 ">
          <p className="text-center text-lg mt-2 p-2">Register Farm Form</p>
          <form onSubmit={addFarmForm}>
            {/* START */}
            <div
              className="bg-gray-200 dark:bg-gray-900 flex items-center justify-center"
              style={{ fontFamily: '"Lato", sans-serif' }}
            >
              <div className="flex md:flex-row flex-col items-center py-8 px-4">
                {/* Code block starts */}
                <div className="flex flex-col md:mr-16">
                  <label
                    htmlFor="farm_name"
                    className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                  >
                    Farm Name
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
                      name="farm_name"
                      value={formData.farm_name}
                      onChange={handleChange}
                      id="farm_name"
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
                    Farm Location
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
                      id="farm_location"
                      name="farm_location"
                      value={formData.farm_location}
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
                    htmlFor="farm_belonged"
                    className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                  >
                    Farm Hectares
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
                      id="farm_hectares"
                      name="farm_hectares"
                      value={formData.farm_hectares}
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
                    Farm Pic
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
                      type="file"
                      id="farm_pic"
                      name="farm_pic"
                      required
                      // value={formData.farm_pic}
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
                     Farm Info
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
                    <textarea

                      type="text"
                      id="farm_info"
                      name="farm_info"
                      value={formData.farm_info}
                      required
                      onChange={handleChange}
                      className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-12 text-sm border-gray-300 rounded border shadow"
                    >

                    </textarea>
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
