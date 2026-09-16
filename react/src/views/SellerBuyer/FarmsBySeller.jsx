import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

import {
  Table,
  Button,
  Spinner,
  Tabs,
  Badge,
} from "../../components/ui/TailwindUI.jsx";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";

export default function FarmListBySeller() {
  const [farmsOwned, setfarmsOwned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { currentUserID } = useStateContext();

  const payload = {
    user_ID: currentUserID,
  };

  useEffect(() => {
    axiosClient
      .post("/getFarmInfo", payload)
      .then((response) => {
        setfarmsOwned(response.data.farmsOwned);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  let counter = 0;
  return (
    <div className="row mt-1">
      <div className="card animated fadeInDown">
        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item active icon={HiUserCircle} title="Farms You Owned">
            <Table className="table-auto">
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Farm Name</Table.HeadCell>
                <Table.HeadCell>Farm Location</Table.HeadCell>
                <Table.HeadCell>Farm Hectares</Table.HeadCell>
                <Table.HeadCell>Verified ?</Table.HeadCell>
                <Table.HeadCell>Longitude</Table.HeadCell>
                <Table.HeadCell>Latitude</Table.HeadCell>
              </Table.Head>
              {loading && (
                <tbody>
                  <tr>
                    <td colSpan="6" class="text-center">
                      <Spinner aria-label="Large spinner example" size="lg" />
                    </td>
                  </tr>
                </tbody>
              )}

              {!loading && (
                <Table.Body className="divide-y">
                  {farmsOwned.map((u) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={u.id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {++counter}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.farm_name}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.farm_location}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.farm_hectares}
                      </Table.Cell>

                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.is_verified === 1 ? (
                          <Badge color="success" size="sm">
                            <p className="text-center">
                              {" "}
                              &nbsp;&nbsp;&nbsp;VERIFIED
                            </p>
                          </Badge>
                        ) : (
                          <Badge color="warning" size="sm">
                            <p className="text-center">NOT VERIFIED</p>
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.longitude}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.latitude}
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                          to={"/buyer-seller/farm/" + u.id}
                        >
                          <svg
                            viewBox="0 0 1024 1024"
                            fill="currentColor"
                            height="2em"
                            width="2em"
                          >
                            <path d="M396 512a112 112 0 10224 0 112 112 0 10-224 0zm546.2-25.8C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM508 688c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z" />
                          </svg>
                        </Link>

                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
            </Table>

          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
