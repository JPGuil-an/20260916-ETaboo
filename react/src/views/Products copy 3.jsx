import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Pagination, Button, Spinner, Alert } from "../components/ui/TailwindUI.jsx";
import { HiInformationCircle } from "react-icons/hi";

export default function Products() {

  const { currentUserID } = useStateContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [prodID, setProdID] = useState([]);

  useEffect(() => {
    axiosClient.get("/products").then(({ data }) => {
      setProduct(data);
    });
  }, []);
  useEffect(() => {
    getProducts();
  }, [currentPage]);

  const getProducts = () => {
    setLoading(true);
    axiosClient
      .get(`/products?page=${currentPage}`)
      .then(({ data }) => {
        setLoading(false);
        setProducts(data.data);
        setProdID(data.data);
        setTotalPages(data.meta.last_page);

      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [showAlert, setShowAlert] = useState(false);

  // Auto close the alert after 3 seconds (adjust the duration as needed)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 4000); //

    return () => {
      clearTimeout(timer);
    };
  }, []);




  const [formData, setFormData] = useState({
    productID_: "",
    kg_: "",
    ID_: "",
    variety: "",
    user_ID: currentUserID,
  });
  // console.log("sent");
  const submitToCart = (event) => {
    event.preventDefault();
    axiosClient
      .post('/addToCart', formData) // Replace '/api/submit' with your Laravel API endpoint
      .then((response) => {
        // Handle successful response if needed
        // console.log(response.data);
        console.log("sent");
        console.log(formData);


      })
      .catch((error) => {
        // Handle error if needed
        console.error('Error submitting form:', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className=" 2xl:container 2xl:mx-auto">
      <div className=" py-6 lg:px-20 md:px-6 px-4">
        <p className=" font-normal text-sm leading-3 text-gray-600 ">
          Available Vegetables
        </p>
        <hr className=" w-full bg-gray-200 my-6" />
        {loading && (
          <div className="flex items-center justify-center">
            <Button color="gray">
              <Spinner aria-label="Alternate spinner button example" />
              <span className="pl-3 items-center">Getting Products ...</span>
            </Button>
          </div>
        )}
        {showAlert && (
          <Alert color="success" icon={HiInformationCircle} rounded>
            <span>
              <p>
                <span className="font-medium">Info alert!</span>
                Change a few things up and try submitting again.
              </p>
            </span>
          </Alert>
        )}

        <h1>000-{prodID.id}</h1>
        {!loading && (
          <div className=" grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-y-12 lg:gap-x-8 sm:gap-y-10 sm:gap-x-6 gap-y-6 lg:mt-12 mt-10">
            {products.map((u) => (

            // {prodID.map((v) => (



              <div className="relative">
                <div className=" absolute top-0 left-0 py-2 px-4 bg-white bg-opacity-50 "></div>
                <div className=" relative group">
                  <div className=" flex justify-center items-center opacity-0 bg-gradient-to-t from-gray-800 via-gray-800 to-opacity-30 group-hover:opacity-50 absolute top-0 left-0 h-full w-full"></div>
                  <img
                    className=" w-96 h-96"
                    src="https://s-media-cache-ak0.pinimg.com/736x/ba/ef/c1/baefc1bbbc0aa057a4682e045ef9a10d--gymnastics-girls-handstand.jpg"
                    alt="A girl Posing Img"
                  />
                </div>
                <form  key={u.id} onSubmit={submitToCart}>
                <p className=" font-normal text-xl leading-5 text-gray-800 md:mt-5 mt-3">
                  {u.product_name.toUpperCase()}
                </p>
                <p className=" font-semibold text-xl leading-5 text-gray-800 mt-4">
                  ₱ {u.price} / Kl
                </p>
                <div className="flex flex-row justify-between mt-4">
                  <p className=" font-medium text-base leading-4 text-gray-600"></p>
                  <div className="flex">
                    <p>Select Kilo &nbsp;</p>

                    <input type="text"
                    // name={`product_${u.id}`}
                    //  value={formData[`inputField_${data.id}`] || ''}
                    // value={u.id}

                    name={`productID_${u.id}`}
                    value={formData[`productID_${u.id}`] || ''}
                    onChange={handleChange}

                    />
<br />
                    <input type="text"
                    name={`ID_${u.id}`}
                    value=""

                    hidden
                    />


                    <input
                      id="counter"


                      // name={`kg_${u.id}`}
                      type="number"

                      name={`kg_${u.id}`}
                      value={formData[`kg_${u.id}`] || u.id}
                      onChange={handleChange}

                      min={0}
                      aria-label="input"
                      className="border border-gray-300 h-full text-center w-14 pb-1"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="focus:outline-none focus:ring-2 hover:bg-green focus:ring-offset-2 focus:ring-green-800 font-medium text-base leading-4 text-white bg-green-800 w-full py-4 lg:mt-4 mt-2">
                  Add to Cart
                </button>
                </form>
              </div>
          // ))}
            ))}

            <div className="lg:ml-60 md:ml-60 flex items-center justify-center text-center mx-8">
              <Pagination
                currentPage={currentPage}
                layout="pagination"
                nextLabel="Next"
                onPageChange={(page) => {
                  setCurrentPage(page);
                }}
                previousLabel="Back"
                showIcons
                totalPages={totalPages}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
