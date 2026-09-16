import { Textarea } from "../../components/ui/TailwindUI.jsx";

import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";

export default function productFormManage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  let { id } = useParams();

  const [product, setProduct] = useState({
    product_name: null,
    product_type: "",
    variety: "",
    planted_date: "",
    prospect_harvest_in_kg: "",
    prospect_harvest_date: "",
    price: "",
    farm_belonged: "",
  });

  useEffect(() => {
    getproducts();
  }, []);

  const getproducts = () => {
    setLoading(true);
    axiosClient
      .get(`/admin/product/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setProduct(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
      axiosClient
        .put(`/admin/product/${product.id}`, product)
        .then(() => {
          setProduct(null);
          alert("User was successfully updated");
          navigate("/admin/products/pending");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });

  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <div className="flex">
          <div className="w-1/2 h-screen bg-gray-100">
            <div className="m-auto">
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
                        Product Info
                      </h1>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <label htmlFor="product_name">Product Name</label>
                    <input
                      value={product.product_name}
                      onChange={(ev) =>
                        setproduct({ ...product, product_name: ev.target.value })
                      }
                      readOnly
                      name="product_name"
                      required
                      id="product_name"
                      className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400 mb-1"
                    />
                    <label htmlFor="product_location">Address</label>
                    <input
                      value={product.product_location}
                      onChange={(ev) =>
                        setproduct({ ...product, product_location: ev.target.value })
                      }
                      name="product_location"
                      readOnly
                      required
                      id="product_location"
                      className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400 mb-2"
                    />
                    <div className="flex">
                      <div className="flex-grow w-1/4 pr-2">
                        <label htmlFor="variety">Variety</label>

                        <input
                          value={product.variety}
                          onChange={(ev) =>
                            setproduct({ ...product, variety: ev.target.value })
                          }
                          readOnly
                          required
                          id="variety"
                          name="variety"
                          className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400 mb-2"
                        />
                      </div>
                      <div className="flex-grow">
                        <label htmlFor="latitude">Prospect Harvest Date</label>
                        <input
                          value={product.prospect_harvest_date}
                          onChange={(ev) =>
                            setProduct({ ...product, prospect_harvest_date: ev.target.value })
                          }
                          required
                          readOnly
                          name="prospect_harvest_date"
                          id="prospect_harvest_date"
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
                        DA Regulated Section
                      </h1>
                    </div>
                    <div className="flex-none pt-2.5 pr-2.5 pl-1" />
                  </div>
                  <div className="px-5 pb-5">

                    <label htmlFor="farm_owner">Farm Owner</label>
                    <input
                      value={product.farm_belonged ? product.farm.farm_name : ""}
                      onChange={(ev) =>
                        setproduct({ ...product, farm_belonged: ev.target.value })
                      }
                      disabled
                      required
                      id="farm_owner"
                      name="farm_owner"
                      type="text"
                      className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                      mb-2
                    />
                    <div className="flex">
                      <div className="flex-grow w-1/4 pr-2">
                        <label htmlFor="price">Price :</label>
                        <input
                          value={product.price}
                          onChange={(ev) =>
                            setProduct({ ...product, price: ev.target.value })
                          }
                          required
                          id="price"
                          name="price"
                          type="number"
                          className=" ml-3 text-black placeholder-gray-600 w-1/4 px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-4" />
                  <div className="flex flex-row-reverse p-3">
                    <div className="flex-initial pl-3">
                      <a
                        onClick={() => setShow(!show)}
                        className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-yellow-500 rounded-md hover:bg-yellow-800  focus:outline-none focus:bg-blue-900  transition duration-300 transform active:scale-95 ease-in-out cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#FFFFFF"
                        >
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path
                            d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z"
                            opacity=".3"
                          />
                          <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z" />
                        </svg>
                        <span className="pl-2 mx-1">Approve</span>
                      </a>
                    </div>
                    <div className="flex-initial">
                      <a
                       onClick={() => setShowDelete(!show)}

                        className="flex items-center px-5 py-2.5 font-medium tracking-wide text-black capitalize rounded-md  hover:bg-red-200 hover:fill-current hover:text-red-600  focus:outline-none  transition duration-300 transform active:scale-95 ease-in-out cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                        >
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path d="M8 9h8v10H8z" opacity=".3" />
                          <path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" />
                        </svg>
                        <span className="pl-2 mx-1">Delete</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-screen bg-gray-100">
            <a target="_blank" href={`http://127.0.0.1:8000/storage/Product/${product.product_picture}`}>
              <img
                style={{
                  width: "500px",
                  height: "300px",
                  display: "block",
                  margin: "0 auto",
                  marginTop: "21px",
                  zIndex: 0, // Default z-index for the second image
                }}
                src={`http://127.0.0.1:8000/storage/Product/${product.product_picture}`}
                alt=""
              />
            </a>
          </div>
        </div>
      </div>


{showDelete && (
              <div
                className="relative z-50 bg-black"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg
                              viewBox="0 0 1024 1024"
                              fill="currentColor"
                              height="3em"
                              width="3em"
                            >
                              <path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z" />
                              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                            </svg>
                          </div>
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3
                              className="text-base font-semibold leading-6 text-gray-900"
                              id="modal-title"
                            >
                              Confirm Delete?
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-red-500">
                                Are you sure you that this product and owner is Doenst Exist?
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <a

                          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        >
                          Delete
                        </a>
                        <button
                          onClick={() => setShowDelete(false)}
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

{show && (
              <div
                className="relative z-50 bg-black"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg
                              viewBox="0 0 1024 1024"
                              fill="currentColor"
                              height="3em"
                              width="3em"
                            >
                              <path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z" />
                              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                            </svg>
                          </div>
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3
                              className="text-base font-semibold leading-6 text-gray-900"
                              id="modal-title"
                            >
                              Confirm product?
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Are you sure you that this product and it's price is Following the Guideline?
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                        >
                         Yes Approve
                        </button>
                        <button
                          onClick={() => setShow(false)}
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
    </form>
  );
}
