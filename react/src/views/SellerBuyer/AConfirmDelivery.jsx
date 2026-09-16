import React, { useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

export default function AProductOrder() {
  const { currentUserID } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transactionID: id,
    imageProof: null,
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

  const confirmOrder = (event) => {
    event.preventDefault();

    const dataToSend = new FormData();
    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }

    axiosClient
      .post("/confirmDelivery", dataToSend)
      .then((response) => {
        // Handle successful response if needed

        // Reset the form after successful submission
        setFormData({
          transactionID: id,
          imageProof: null,
          user_ID: currentUserID,
        });

        // Redirect or perform other actions as needed
        navigate("/seller/center"); // Example: Redirect to the homepage
      })
      .catch((error) => {
        // Handle errors if they occur
        console.error(error);
      });
  };

  return (
    <div>
      <Tabs.Group
        aria-label="Tabs with underline"
        style="underline"
        className="items-center"
      >
        <Tabs.Item active icon={HiUserCircle} title="Confirm Delivery">
          <div className="w-full h-screen bg-slate-100 mt-0 p-16">
            <form onSubmit={confirmOrder}>
              <div className="relative">
                <div className="absolute top-0 left-0 py-2 px-4 bg-white bg-opacity-50"></div>
                <p className="text-center font-normal text-xl leading-5 text-gray-800 md:mt-5 mt-3">
                  UPLOAD PROOF OF DELIVERY
                </p>
                <div className="flex flex-row justify-between mt-4">
                  <p className="font-medium text-base leading-4 text-gray-600"></p>
                  <div className="flex">
                    <br />
                    <input type="text" name="transaction_id" hidden />
                    <input
                      type="file"
                      name="imageProof"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="focus:outline-none focus:ring-2 hover:bg-green focus:ring-offset-2 focus:ring-green-800 font-medium text-base leading-4 text-white bg-green-800 w-full py-4 lg:mt-4 mt-2"
                >
                  Confirm Delivered
                </button>
              </div>
            </form>
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
