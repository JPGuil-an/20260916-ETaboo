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

export default function UsersVerified() {
  const [users1, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { setNotification } = useStateContext();
  const { user } = useStateContext();

  if (user) {
    // Output the value of the user
    const name = user.name;
    const phone_number = user.phone_number;
    const id = user.id;
  }

  const id = "NULL";
  // const { setUser, notification } = useStateContext();

  useEffect(() => {
    axiosClient.get("/allUsers/allUsers").then(({ data }) => {
      setUser(data);
    });
  }, []);
  useEffect(() => {
    getUsers();
  }, [currentPage]);

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get(`/allUsers/allUsers?page=${currentPage}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        setTotalPages(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="row mt-1">
      <div className="card animated fadeInDown">
        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item active icon={HiUserCircle} title="Verified Users">
            <Table className="table-auto">
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Birthday</Table.HeadCell>
                <Table.HeadCell>Phone Number</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Address</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
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
                  {users1.map((u) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={u.id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.id}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.name}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.birthday}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.mobile_number}
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
                        {u.address}
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href={"/admin/users/view/" + u.id}
                        >
                          <svg
                            viewBox="0 0 1024 1024"
                            fill="currentColor"
                            height="2em"
                            width="2em"
                          >
                            <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" />
                          </svg>
                        </a>

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
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
