import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

function FarmsPending() {
  const { currentUserID } = useStateContext();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useStateContext();
  const [farmID, setFarmID] = useState([]);

  const formData = {
    user_ID: currentUserID,
    requested_type: 1,
  };

  useEffect(() => {
    getFarms();
  }, []);

  const getFarms = () => {
    setLoading(true);
    axiosClient
      .post(`/farms`, formData)
      .then(({ data }) => {
        setLoading(false);
        setFarms(data);
        setFarmID(data.data);
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
          <Tabs.Item active icon={HiUserCircle} title="Farms Approved">
            {loading ? (
              <p className="text-indigo-900 text-center">Loading...</p>
            ) :
            (
              <div className="flex flex-wrap items-center lg:justify-between justify-center">
              {farms.map( farm => (
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
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                      </svg>
                    </div>
                    <div className="bg-yellow-200 py-1.5 px-6 rounded-full">
                      <p className="text-xs text-yellow-500">{farm.id}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold">{farm.farm_name}</h2>
                      <p className="text-xs text-gray-600 pl-5">{farm.user.name}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {farm.farm_info}
                    </p>
                    <div className="flex mt-4">
                      <div>
                        <p className="text-xs text-gray-600 px-2 bg-gray-200 py-1">
                      Location
                        </p>
                      </div>

                    </div>
                    <div className="flex items-center justify-between py-4">
                      <h2 className="text-indigo-700 text-xs font-semibold">
                      {farm.farm_location}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              ))}
              </div>
            )}
            </Tabs.Item>
            </Tabs.Group>
      </div>
      </div>
    </>
  );
}

export default FarmsPending;
