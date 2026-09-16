import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

import {
  Table,
  Button,
  Pagination,
  Spinner,
  Tabs,
  Badge,
} from "../../components/ui/TailwindUI.jsx";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import CanvasJSReact from "@canvasjs/react-charts";

export default function CropRecords() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { setNotification } = useStateContext();

  const id = "NULL";

  var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  useEffect(() => {
    axiosClient.get("getCropRecords").then(({ data }) => {
      setCrops(data);
    });
  }, []);
  useEffect(() => {
    getCrops();
  }, [currentPage]);

  const getCrops = () => {
    setLoading(true);
    axiosClient
      .get(`getCropRecords?page=${currentPage}`)
      .then(({ data }) => {
        setLoading(false);
        setCrops(data.data);
        setTotalPages(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

//FOR FORM;

const [selectedOption1, setSelectedOption1] = useState("");
const [selectedOption2, setSelectedOption2] = useState("");
const [selectedOption3, setSelectedOption3] = useState("");

const months = ["Jan-", "Feb-", "Mar-", "Apr-", "May-", "Jun-", "Jul-", "Aug-", "Sep-", "Oct-", "Nov-", "Dec-"];
const year = ["2019", "2020", "2021"];
const commodity = ["Carrots", "Chinese Cabbage", "Lettuce","Tomato"];

const handleSubmit = (e) => {
  e.preventDefault();

  const formData ={
    commodity : selectedOption1,
    months : selectedOption2,
    year : selectedOption3,
  }
  axiosClient.post


};



//CHART JS
  const options = {
    title: {
      text: "Shared Crops",
    },
    data: [
      {
        type: "column",
        dataPoints: [
          { label: "Chinese Cabbage", y: 10 },
          { label: "Orange", y: 15 },
          { label: "Banana", y: 25 },
          { label: "Mango", y: 30 },
          { label: "Grape", y: 28 },
        ],
      },
    ],
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedOption1}
            onChange={(e) => setSelectedOption1(e.target.value)}
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
            Select an option 2:
          </label>
          <select
            id="selectOption2"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedOption2}
            onChange={(e) => setSelectedOption2(e.target.value)}
          >
            <option value="" disabled>
              -- Select an option 2 --
            </option>
            {months.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="selectOption3"
          >
            Select an option 3:
          </label>
          <select
            id="selectOption3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedOption3}
            onChange={(e) => setSelectedOption3(e.target.value)}
          >
            <option value="" disabled>
              -- Select an option 3 --
            </option>
            {year.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
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

              <div className="w-1/2">
                <button className="float-right bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring mr-1 mb-3"></button>
                <Table className="table-auto">
                  <Table.Head>
                    <Table.HeadCell>No.</Table.HeadCell>
                    <Table.HeadCell>Barangay</Table.HeadCell>
                    <Table.HeadCell>Commodity</Table.HeadCell>
                    <Table.HeadCell>Record Date</Table.HeadCell>
                    <Table.HeadCell>Area</Table.HeadCell>
                    <Table.HeadCell>Yield</Table.HeadCell>
                  </Table.Head>

                  {loading && (
                    <tbody>
                      <tr>
                        <td colSpan="6" class="text-center">
                          <Spinner
                            aria-label="Large spinner example"
                            size="lg"
                          />
                        </td>
                      </tr>
                    </tbody>
                  )}

                  {!loading && Array.isArray(crops) && crops.length > 0 && (
                    <Table.Body className="divide-y">
                      {crops.map((u) => (
                        <Table.Row
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          key={u.id}
                        >
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {u.id}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {u.barangay}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {u.commodity}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {u.record_date}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {u.area === null ? "not-specified" : u.area}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <Badge color="warning" size="sm">
                              <p className="text-center">
                                {u.yield === null ? "not-specified" : u.yeild}
                              </p>
                            </Badge>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  )}
                </Table>
                <div className="flex items-center justify-center text-center mt-3">
                  <Pagination
                    currentPage={currentPage}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                    }}
                    showIcons
                    totalPages={totalPages}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <CanvasJSChart
                  options={options}
                  /* onRef = {ref => this.chart = ref} */
                />

              </div>
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
