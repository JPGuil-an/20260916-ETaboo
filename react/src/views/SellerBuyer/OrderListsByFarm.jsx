import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

import { Table, Spinner, Tabs } from "../../components/ui/TailwindUI.jsx";
import { HiUserCircle } from "react-icons/hi";

export default function OrderByFarm() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { currentUserID } = useStateContext();

  const payload = {
    user_ID: currentUserID,
  };

  useEffect(() => {
    axiosClient
      .post("/getFarmOrders", payload)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="row mt-1">
      <div className="card animated fadeInDown">
        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item active icon={HiUserCircle} title="Orders in your Farm">
            <Table className="table-auto">
              <Table.Head>
                <Table.HeadCell>Order No.</Table.HeadCell>
                <Table.HeadCell>Customer Name</Table.HeadCell>
                <Table.HeadCell>Ordered Product</Table.HeadCell>
                <Table.HeadCell>Ordered & to Deliver Date</Table.HeadCell>
                <Table.HeadCell>Accept Order</Table.HeadCell>
                <Table.HeadCell>Delivered</Table.HeadCell>
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
                  {products.map((u) => (
                    <Table.Row

                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.transaction.id}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.transaction.user.name}
                        <br />
                        {u.transaction.user.mobile_number}
                        <br />
                        {u.transaction.user.address}

                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {u.product_name}
                        <br />
                        {u.transaction.price_of_goods}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {u.transaction.ordered_on}
                      <br />
                      {u.transaction.seller_prospect_date_todeliver}
                      </Table.Cell>

                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">

                        { u.transaction.price_payed === null ? (
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
                        ) : (
                          null
                        )}

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
