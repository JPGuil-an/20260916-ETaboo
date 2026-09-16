import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

import {
  Spinner,
  Tabs,
  Badge,
} from "../../components/ui/TailwindUI.jsx";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import CanvasJSReact from "@canvasjs/react-charts";

export default function CropPredictiveAnalysis() {

  const id = "NULL";

  var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const [showChart, setShowChart] = useState(false);

  //FOR FORM;
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");

  const commodity = ["Carrots", "Chinese Cabbage", "Lettuce", "Tomato"];
  const [dataPoints, setDataPoints] = useState([]);
  const [monthYear, setMonthYear] = useState("");
  const [commodities, setCommodities] = useState("");

 //CHART JS
 const options = {
  title: {
    text:`${commodities} Commodity Report for the ( ${monthYear}) M-Y`
  },
  data: [
    {
      type: "column",
      dataPoints: dataPoints,
    },
  ],
};

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      commodity: selectedOption1,
      start_date: selectedOption2,
      end_date: selectedOption3,
    };
    axiosClient
      .post("/getCropPredictiveAnalysis", formData)
      .then((response) => {
        const dataFromBackend = response.data;
        // setSelectedOption1("");
        // setSelectedOption2("");
        // setSelectedOption3("");
        const newDataPoints = [
          { label: "Bugcaon Sold", y: dataFromBackend.BugcaonSold },
          { label: "Bugcaon Yield", y: dataFromBackend.BugcaonYield },
          { label: "CapitanJuan Sold", y: dataFromBackend.CapitanJuanSold },
          { label: "CapitanJuan Yield", y: dataFromBackend.CapitanJuanYield },
          { label: "Kulasihan Sold", y: dataFromBackend.KulasihanSold },
          { label: "Kulasihan Yield", y: dataFromBackend.KulasihanYield },
          { label: "Bantuanon Sold", y: dataFromBackend.BantuanonSold },
          { label: "Bantuanon Yield", y: dataFromBackend.BantuanonYield },
          { label: "Poblacion Sold", y: dataFromBackend.PoblacionSold },
          { label: "Poblacion Yield", y: dataFromBackend.PoblacionYield },
          { label: "Balila Sold", y: dataFromBackend.BalilaSold },
          { label: "Balila Yield", y: dataFromBackend.BalilaYield },
          { label: "Baclayon Sold", y: dataFromBackend.BaclayonSold },
          { label: "Baclayon Yield", y: dataFromBackend.BaclayonYield },
          { label: "Kaatuan Sold", y: dataFromBackend.KaatuanSold },
          { label: "Kaatuan Yield", y: dataFromBackend.KaatuanYield },
          { label: "Alanib Sold", y: dataFromBackend.AlanibSold },
          { label: "Alanib Yield", y: dataFromBackend.AlanibYield },
          { label: "Songco Sold", y: dataFromBackend.SongcoSold },
          { label: "Songco Yield", y: dataFromBackend.SongcoYield },
          { label: "Cawayan Sold", y: dataFromBackend.CawayanSold },
          { label: "Cawayan Yield", y: dataFromBackend.CawayanYield },
          { label: "Victory Sold", y: dataFromBackend.VictorySold },
          { label: "Victory Yield", y: dataFromBackend.VictoryYield },
          { label: "Kibangay Sold", y: dataFromBackend.KibangaySold },
          { label: "Kibangay Yield", y: dataFromBackend.KibangayYield },
          { label: "Basac Sold", y: dataFromBackend.BasacSold },
          { label: "Basac Yield", y: dataFromBackend.BasacYield },
        ];

        // Update the state with the new dataPoints array
        setDataPoints(newDataPoints);
        setCommodities(dataFromBackend.Commodity)
        setMonthYear(dataFromBackend.MonthYear)
        setShowChart(true);

      })
      .catch((error) => {
        console.log("Response Error", error);
      });
  };

  return (
    <div className="row mt-8 pr-12 pl-12">
      <div className="card animated fadeInDown">
        <h1 class="text-xl font-bold text-center mb-5 bg-slate-400">
          Crop Records
        </h1>
        <div className="flex justify-center">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-1/3"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="selectOption1"
              >
                Select a Commodity:
              </label>
              <select
                id="selectOption1"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                value={selectedOption1}
                onChange={(e) => setSelectedOption1(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- Select an option 1 --
                </option>
                {commodity.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="selectOption2"
              >
               Select the Start Date to Plot:
              </label>
              <input
              name="start_date"
                id="selectOption2"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                value={selectedOption2}
                onChange={(e) => setSelectedOption2(e.target.value)}
                required
                type="date"
               />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="selectOption3"
              >
                Select Until What Date to Plot:
              </label>
              <input
              name="end_date"
                id="selectOption3"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                value={selectedOption3}
                onChange={(e) => setSelectedOption3(e.target.value)}
                required
                type="date"
               />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>


        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item active icon={HiUserCircle} title="Crops Records">
            <div className="flex">
              <div className="w-full">
                {/* <CanvasJSChart
                  options={options} */}
                  {/* //  onRef = {ref => this.chart = ref} */}
                {/* /> */}

                {showChart && (
        <CanvasJSReact.CanvasJSChart
          options={options}
          //  onRef = {ref => this.chart = ref}
        />
      )}
              </div>
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
