import { useState } from "react";

import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";

import { Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    variety: "",
    planted_date: "",
    prospect_harvest_in_kg: "",
    prospect_harvest_date: "",
    actual_harvested_in_kg: "",
    harvested_date: "",
    product_location: "",
    price: "",
    product_picture: "",
    farm_belonged: "",
  });
  const {currentUserID, setCurrentUserID } = useStateContext();

  const [productType, setProductType] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .post("/api/submit-form", formData)
      .then((response) => {
        // Handle successful form submission
        console.log(response.data);

        // Reset the form after submission
        setFormData({
          product_name: "",
          product_type: "",
          variety: "",
          planted_date: "",
          prospect_harvest_in_kg: "",
          prospect_harvest_date: "",
          actual_harvested_in_kg: "",
          harvested_date: "",
          product_location: "",
          price: "",
          product_picture: "",
          farm_belonged: "",
        });
      })
      .catch((error) => {
        // Handle form submission error
        console.error(error);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>

      <p class="text-center text-lg mt-6">Addss Product Form</p>

      <div class="m-12 outline outline-2  outline-offset-2 ">
        <form>
          <div class="p-4 mb-5">
          <div class="grid grid-cols-2 gap-4 mt-4 mb-6">
              <div>
            {/* START OF COLUMN 1 */}
            <div class="grid grid-cols-3 gap-4 mt-4 mb-6">
              <div>
                <div class="relative z-0 w-full mb-6 group">
                  <input
                    type="text"
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    required
                  />
                  <label
                    for="product_name"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Product Name
                  </label>
                </div>
              </div>
              <div>
                <div class="relative z-0 w-full mb-6 group">
                  <select
                    id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option selected disabled>
                      Choose a Product Type
                    </option>
                    <option value="Brocollis">Brocollis</option>
                    <option value="Carrots">Carrots</option>
                    <option value="Cabbages">Cabbages</option>
                    <option value="Tomatoes">Tomatoes</option>
                  </select>
                </div>
              </div>
              <div>
                <div class="relative z-0 w-full mb-6 group">
                  <input
                    type="text"
                    id="variety"
                    name="variety"
                    value={formData.variety}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    required
                  />
                  <label
                    for="variety"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Variety
                  </label>
                </div>
              </div>
            </div>
            {/* START COLUMN 2 */}
            </div>


            <div>


            {/* START COLUMN 2 */}
            <div class="grid grid-cols-3 gap-4 mt-4 mb-6">
              <div>
                <div class="relative z-0 w-full mb-6 group">
                  <input
                    type="date"
                    id="planted_date"
                    name="planted_date"
                    value={formData.planted_date}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    required
                  />
                  <label
                    for="planted_date"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Planted Date
                  </label>
                </div>
              </div>
              <div>
                <div class="relative z-0 w-full mb-6 group">
                <input
                    type="number"
                    id="prospect_harvest_in_kg"
                    name="prospect_harvest_in_kg"
                    value={formData.prospect_harvest_in_kg}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    required
                  />
                  <label
                    for="prospect_harvest_in_kg"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Prospect harvest in Kg
                  </label>
                </div>
              </div>
              <div>
                <div class="relative z-0 w-full mb-6 group">
                  <input
                    type="date"
                    id="harvested_date"
                    name="harvested_date"
                    value={formData.harvested_date}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    required
                  />
                  <label
                    for="harvested_date"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Harvested Date
                  </label>
                </div>
              </div>
            </div>
            {/* START COLUMN 2 */}
            </div>
            </div>


            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// const product_name = createRef();
// const product_type = createRef();
// const variety = createRef();
// const planted_date = createRef();
// const prospect_harvest_in_kg = createRef();
// const prospect_harvest_date = createRef();
// const actual_harvested_in_kg = createRef();
// const harvested_date = createRef();
// const product_location = createRef();
// const price = createRef();
// const product_picture = createRef();
// const farm_belonged = createRef();
