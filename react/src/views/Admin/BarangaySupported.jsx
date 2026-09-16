import { useEffect, useState, createRef } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

import {
  Table,
  Button,
  Pagination,
  Spinner,
  Modal,
  Label,
  TextInput,
} from "../../components/ui/TailwindUI.jsx";
import { HiPlusSm } from "react-icons/hi";

export default function BarangaySupported() {
  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { setNotification } = useStateContext();
  const [message, setMessage] = useState(null);


  const barangayRef = createRef();

  useEffect(() => {
    axiosClient.get("/supportedBarangay").then(({ data }) => {
      setBarangay(data);
    });
  }, []);
  useEffect(() => {
    getBarangays();
  }, [currentPage]);

  // const onDeleteClick = (user) => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) {
  //     return;
  //   }
  //   axiosClient.delete(`/supportedBarangay/${user.id}`).then(() => {
  //     setNotification("User was successfully deleted");
  //     getUsers();
  //   });
  // };

  const getBarangays = () => {
    setLoading(true);
    axiosClient
      .get(`/supportedBarangay?page=${currentPage}`)
      .then(({ data }) => {
        setLoading(false);
        setBarangays(data.data);
        setTotalPages(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  //MODAL
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };
  const count = 0;

  const onBarangaySubmit = (event) => {
    event.preventDefault();

    const payload = {
      supported_barangay: barangayRef.current.value,
    };
    axiosClient
      .post("/addBarangay", payload)
      .then(() => {
        setNotification("Barangay added successfully");
        getBarangays();
        setOpenModal(false);
        barangayRef.current.value = "";
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          // setOpenModal(true);
          setMessage(response.data.errors);
        }
      });
  };

  return (
    <div class="pl-12 pr-12 pt-6">
      <div class="grid grid-cols-2 gap-4 mt-4 mb-6">
        <div>
          <h1>These Barangays will be used in the form upon Registration</h1>
          {/* <Link className="btn-add" to="/users/new">
          Add new
        </Link> */}
        </div>

        <div class="flex justify-end">
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() => props.setOpenModal("form-elements")}
          >
            <HiPlusSm className="ml-2 h-5 w-5" />
            <p>Add Barangay</p>
          </Button>
        </div>
      </div>
      <div>
        <div className="card animated fadeInDown">
          <Table className="table-auto">
            <Table.Head>
              <Table.HeadCell>Barangay Order #</Table.HeadCell>
              <Table.HeadCell>Barangay Name</Table.HeadCell>
              <Table.HeadCell>Added At</Table.HeadCell>
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
                {barangays.map((u, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={u.id}
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {count + index + 1}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {u.supported_barangay}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {u.created_at}
                    </Table.Cell>
                    <Table.Cell>
                    <Button color="warning"><Link

                        to={"/barangays/" + u.id}
                      >
                        Edit
                      </Link></Button>

                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            )}
          </Table>

          {/* {notification && <div className="notification">{notification}</div>} */}

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
      </div>

      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={onBarangaySubmit}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add Barangay
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="barangay" value="Barangay Name to Add" />
                </div>

                <TextInput
                  ref={barangayRef}
                  id="barangay"
                  placeholder="Complete Barangay Name"
                  required
                />
              </div>

              <div className="w-full">
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
