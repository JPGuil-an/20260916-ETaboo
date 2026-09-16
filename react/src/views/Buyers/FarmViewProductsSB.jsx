import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea, Table } from "../../components/ui/TailwindUI.jsx";

export default function FarmViewProductsSB() {
  const [loading, setLoading] = useState(false);
  const { user } = useStateContext();
  const [farmID, setFarmID] = useState([]);
  const navigate = useNavigate();
  let { id } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    getFarms();
  }, []);

  const getFarms = () => {
    setLoading(true);
    axiosClient
      .get(`/farmWithProducts/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setData(data);
        setUserType(data.user_type);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="flex">
        <div className="w-1/2 h-screen bg-gray-100">
          <div className="m-auto">
            {data.map((farm) => (
              <div>
                <div className="mt-5 bg-white rounded-lg shadow">
                  <div className="flex">
                    <div className="flex-1 py-5 pl-5 overflow-hidden">
                      <svg
                        className="inline align-text-top"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                      >
                        <g>
                          <path d="M9 6.5 A2.5 2.5 0 0 1 6.5 9 A2.5 2.5 0 0 1 4 6.5 A2.5 2.5 0 0 1 9 6.5 z" />
                          <path d="M14 7l-5.223 8.487L7 13l-5 7h20z" />
                          <circle
                            cx="7.04807"
                            cy="6.97256"
                            r="2.5"
                            id="svg_3"
                          />
                        </g>
                      </svg>
                      <h1 className="inline text-2xl font-semibold leading-none">
                        Farmers Profile
                      </h1>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <label htmlFor="farmName">Farm Name</label>
                    <input
                      value={farm.farm_name}
                      onChange={(ev) =>
                        setFarm({ ...farm, farm_name: ev.target.value })
                      }
                      readOnly
                      name="farm_name"
                      required
                      id="farm_name"
                      className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400 mb-1"
                    />
                    <label htmlFor="farm_location">Address</label>
                    <input
                      value={farm.farm_location}
                      onChange={(ev) =>
                        setFarm({ ...farm, farm_location: ev.target.value })
                      }
                      name="farm_location"
                      required
                      readOnly
                      id="farm_location"
                      className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400 mb-2"
                    />
                    <div className="flex">
                      <div className="flex-grow w-1/4 pr-2">
                        <label htmlFor="longitude">Longitude</label>

                        <input
                          value={farm.longitude}
                          onChange={(ev) =>
                            setFarm({ ...farm, longitude: ev.target.value })
                          }
                          readOnly
                          required
                          id="longitude"
                          name="longitude"
                          className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400 mb-2"
                        />
                      </div>
                      <div className="flex-grow">
                        <label htmlFor="latitude">Latitude</label>
                        <input
                          value={farm.latitude}
                          onChange={(ev) =>
                            setFarm({ ...farm, latitude: ev.target.value })
                          }
                          required
                          readOnly
                          name="latitude"
                          id="latitude"
                          className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-1 py-5 pl-5 overflow-hidden">
                      <svg
                        className="inline align-text-top"
                        width={21}
                        height="20.5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                      >
                        <g>
                          <path
                            d="m4.88889,2.07407l14.22222,0l0,20l-14.22222,0l0,-20z"
                            fill="none"
                            id="svg_1"
                            stroke="null"
                          />
                          <path
                            d="m7.07935,0.05664c-3.87,0 -7,3.13 -7,7c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zm-5,7c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88c-2.08,-2.67 -5,-7.03 -5,-9.88z"
                            id="svg_2"
                          />
                          <circle
                            cx="7.04807"
                            cy="6.97256"
                            r="2.5"
                            id="svg_3"
                          />
                        </g>
                      </svg>
                      <h1 className="inline text-2xl font-semibold leading-none">
                        Farm Description
                      </h1>
                    </div>
                    <div className="flex-none pt-2.5 pr-2.5 pl-1" />
                  </div>
                  <div className="px-5 pb-5">
                    <Textarea
                      value={farm.farm_info}
                      onChange={(ev) =>
                        setFarm({ ...farm, farm_info: ev.target.value })
                      }
                      required
                      readOnly
                      name="farm_info"
                      id="farm_info"
                      className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400 mb-2"
                    />

                    <label htmlFor="farm_owner">Farm Owner</label>
                    <input
                      value={farm.user.name}
                      onChange={(ev) =>
                        setFarm({ ...farm, farm_owner: ev.target.value })
                      }
                      required
                      readOnly
                      id="farm_owner"
                      name="farm_owner"
                      type="text"
                      className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                      mb-2
                    />
                    <div className="flex">
                      <div className="flex-grow w-1/4 pr-2">
                        <label htmlFor="farm_hectares">Hectares</label>
                        <input
                          value={farm.farm_hectares}
                          onChange={(ev) =>
                            setFarm({ ...farm, farm_hectares: ev.target.value })
                          }
                          required
                          readOnly
                          id="farm_hectares"
                          name="farm_hectares"
                          type="text"
                          className=" ml-3 text-black placeholder-gray-600 w-1/4 px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 h-screen bg-gray-100 mt-24">
          <Table>
            <Table.Head>
              <Table.HeadCell>Products By this farm</Table.HeadCell>
              <Table.HeadCell>Variety</Table.HeadCell>
              <Table.HeadCell>Available Kl.</Table.HeadCell>
              <Table.HeadCell>Harvested on</Table.HeadCell>
              <Table.HeadCell>Price / Kl</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {data.map((farm) => (
                <React.Fragment key={farm.id}>
                  {farm.products.map((product) => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {product.product_name}
                      </Table.Cell>
                      <Table.Cell>{product.variety}</Table.Cell>
                      <Table.Cell>
                        {product.prospect_harvest_in_kg -
                          product.actual_sold_kg}
                      </Table.Cell>
                      <Table.Cell>{product.prospect_harvest_date}</Table.Cell>
                      <Table.Cell>&#8369; {product.price}</Table.Cell>
                      {/* <a href=""><Table.Cell className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "> order</Table.Cell> </a> */}
                      <a href={`/buyer-seller/order/products/${product.id}`}>
                        <Table.Cell>
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
                            order
                          </button>
                        </Table.Cell>
                      </a>
                    </Table.Row>
                  ))}
                </React.Fragment>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
