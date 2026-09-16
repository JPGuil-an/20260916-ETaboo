import { useEffect, useState, createRef } from "react";
import axiosClient from "../../axios-client.js";
import { useNavigate, useParams } from "react-router-dom";
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

export default function BarangaySupported() {

  const { token,} = useStateContext();

  const [loading, setLoading] = useState(false);
  let { id } = useParams();
  const [barangay, setBarangay] = useState({
    id: null,
    supported_barangay: "",
    created_at: "",
  });

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/barangays/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setBarangay(data.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onBarangayUpdate = (ev) => {
    ev.preventDefault();

    // axiosClient.put(`/users/${user.id}`, user)
    //     .then(() => {
    //       setNotification('User was successfully updated')
    //       navigate('/users')
    //     })
    //     .catch(err => {
    //       const response = err.response;
    //       if (response && response.status === 422) {
    //         setErrors(response.data.errors)
    //       }
    //     })
    if (barangay.id) {
      axiosClient
      .put(`/barangays/${barangay.id}`, barangay)
        .then(() => {
          navigate('/users')
          setNotification("Barangay was successfully updated");
          // navigate("/admin/supported/barangay");

        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  //MODAL
  const [openModal, setOpenModal] = useState("form-elements");
  const props = { openModal, setOpenModal };

  const handleCloseModal = () => {
    // setOpenModal(undefined);
    // navigate(-1); // Navigate back to the previous page
  };
  return (
    <div class="pl-12 pr-12 pt-6">

        {/* {notification && <div className="notification">{notification}</div>} */}


      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose= {handleCloseModal}
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={onBarangayUpdate}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Edit Barangay Name
              </h3>
              <div className="text-center">
                {loading && (
                  <Spinner aria-label="Large spinner example" size="lg" />
                )}
                <div className="mb-2 block">
                  {!loading && (
                    <TextInput
                      value={barangay.supported_barangay}
                      onChange={(ev) =>
                        setBarangay({
                          ...barangay,
                          supported_barangay: ev.target.value,
                        })
                      }
                      placeholder="Barangay"
                    />
                  )}
                </div>
              </div>

              <div className="w-full">
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
          <Button
            href="/admin/supported/barangay"
            className="w-full mt-3 bg-slate-500 hover:bg-slate-600"
          >
            Back
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
