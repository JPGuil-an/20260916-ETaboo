import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

function FarmersProduct() {
  const { currentUserID } = useStateContext();
  const [farms, setFarms] = useState([]);

  const [loading, setLoading] = useState(false);
  const { user } = useStateContext();

  useEffect(() => {
    getFarms();
  }, []);

  const getFarms = () => {
    setLoading(true);
    axiosClient
      .get("/admin/farmers/profile")
      .then(({ data }) => {
        setLoading(false);
        setFarms(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <div className="bg-gray-100 ">
        <div className="mx-auto container py-8">
          <Tabs.Group aria-label="Tabs with underline" style="underline">
            <Tabs.Item active icon={HiUserCircle} title="Alanib">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Alanib" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Baclayon">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Baclayon" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Balila">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Balila" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Bantuanon">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Bantuanon" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Basac">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Basac" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Bugcaon">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Bugcaon" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Capitan Juan">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Capitan Juan" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Cawayan">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Cawayan" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Kaatuan">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Kaatuan" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Kibangay">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Kibangay" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Kulasihan">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Kulasihan" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Poblacion">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Poblacion" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Songco">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Songco" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
            <Tabs.Item active icon={HiUserCircle} title="Victory">
              {loading ? (
                <p className="text-indigo-900 text-center">Loading...</p>
              ) : (
                <div className="flex flex-wrap items-center lg:justify-between justify-center">
                  {farms.map((farm) =>
                    farm.farm_location === "Victory" ? (
                      <Link to={`/buyer-seller/farm/${farm.id}`} key={farm.id}>
                        <div className="mx-2 w-72 lg:mb-0 mb-8">
                          <div>
                            <img
                              src={`http://127.0.0.1:8000/storage/Farms/${farm.farm_pictures}`}
                              className="w-full h-44"
                            />
                          </div>
                          <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-bookmark"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold">
                                  {farm.farm_name}
                                </h2>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                Farm Info: <br /> {farm.farm_info}
                              </p>
                              <hr class="border-t-2 border-gray-400" />

                              <p className="text-xs text-gray-600 mt-2">
                                Farm Hectares: <br />
                                {farm.farm_hectares}
                              </p>
                              <div className="flex mt-4">
                                <div>
                                  <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                                    Owned by:
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <h2 className="text-indigo-700 text-xs font-semibold">
                                  {farm.user.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              )}
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </>
  );
}

export default FarmersProduct;
