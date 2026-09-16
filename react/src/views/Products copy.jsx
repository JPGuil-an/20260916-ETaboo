import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Table, Pagination } from "../components/ui/TailwindUI.jsx";

export default function Products() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  // const { setNotification } = useStateContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // const { setPro duct, notification } = useStateContext();

  useEffect(() => {
    axiosClient.get("/products").then(({ data }) => {
      setProduct(data);
    });
  }, []);
  useEffect(() => {
    getProducts();
  }, [currentPage]);

  // const onDeleteClick = (user) => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) {
  //     return;
  //   }
  //   axiosClient.delete(`/users/${user.id}`).then(() => {
  //     setNotification("User was successfully deleted");
  //     getUsers();
  //   });
  // };

  const getProducts = () => {
    setLoading(true);
    axiosClient
      .get(`/products?page=${currentPage}`)
      .then(({ data }) => {
        setLoading(false);
        setProducts(data.data);
        setTotalPages(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };



  return (
    <div>
      <div>
        <h1>Products</h1>
        <Link className="btn-add" to="/users/new">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <Table>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Product Name</Table.HeadCell>
            <Table.HeadCell>Variety</Table.HeadCell>
            <Table.HeadCell>Kilograms</Table.HeadCell>
            <Table.HeadCell>product_location</Table.HeadCell>
            <Table.HeadCell>product_seller</Table.HeadCell>
          </Table.Head>
          {loading && (
            <Table.Body>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </Table.Body>
          )}
          {!loading && (
            <Table.Body className="divide-y">
              {products.map((u) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={u.id}
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {u.id}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {u.product_name}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {u.variety}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {u.kilograms}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {u.product_location}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {u.product_seller}
                  </Table.Cell>

                </Table.Row>
              ))}
            </Table.Body>
          )}
        </Table>

         {/* {notification && <div className="notification">{notification}</div>} */}

        <div className="flex items-center justify-center text-center mt-3">

  </div>
      </div>
    </div>
  );
}
