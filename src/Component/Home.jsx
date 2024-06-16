import React, { useState, useEffect } from "react";
import axiosInstance from "../Services/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [initialGlow, setInitialGlow] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productCategory, setProductCategory] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const pageNavigate = useNavigate();

  useEffect(() => {
    setInitialGlow(true);

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/get_clients");

        if (response.data.error_code === 200) {
          setProducts(response.data.data);
          setInitialGlow(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const redirectCategoryPage = (id) => {
    localStorage.setItem("client_id", id);
    setSelectedProductId(id);

    axiosInstance.post("/get_product_categories", {
      client_id:localStorage.getItem("client_id")
    }).then((response)=>{
      if(response.data.error_code === 200){
        setProductCategory(response.data.data)
      }else {
        toast.error(response.data.message)
      }
    })

    // switch (id) {
    //   case 2:
    //     setProductCategory([
    //       {
    //         desc: "Product category description will be displayed here",
    //         feasibility: [
    //           {
    //             bountary_type: "in",
    //             bountary_value: ["624617", "624618", "624619"],
    //             id: 6,
    //             question: "what is your zip code?",
    //             question_type: "numeric",
    //             question_value: [],
    //           },
    //           {
    //             bountary_type: ">",
    //             bountary_value: ["3000"],
    //             id: 7,
    //             question: "What is your approximate budget?",
    //             question_type: "numeric",
    //             question_value: [],
    //           },
    //           {
    //             bountary_type: "value",
    //             bountary_value: ["Natural"],
    //             id: 8,
    //             question: "Are you looking for natural or artificial diamonds?",
    //             question_type: "options",
    //             question_value: ["Natural", "Artificial"],
    //           },
    //         ],
    //         id: 3,
    //         name: "Jewellery",
    //       },
    //     ]);
    //     break;
    //   case 1:
    //     setProductCategory([
    //       {
    //         desc: "Category description will be displayed here",
    //         feasibility: [],
    //         id: 2,
    //         name: "Window Replace",
    //       },
    //       {
    //         desc: "Category description will be displayed here",
    //         feasibility: [
    //           {
    //             bountary_type: "in",
    //             bountary_value: ["20854", "20878", "20910", "20911"],
    //             id: 1,
    //             question: "Please enter your zip code",
    //             question_type: "numeric",
    //             question_value: [],
    //           },
    //           {
    //             bountary_type: ">",
    //             bountary_value: ["3"],
    //             id: 2,
    //             question: "How many windows would you like repaired?",
    //             question_type: "numeric",
    //             question_value: [],
    //           },
    //         ],
    //         id: 1,
    //         name: "Window Repair",
    //       },
    //     ]);

    //   default:
    //     break;
    // }
  };

  const handleOnChange = (productId) => {
    localStorage.setItem("product_id", productId);
  };

  const handleNextButtonClick = () => {

    const productId = localStorage.getItem("product_id");

    const selectedCategory = productCategory.find(category => category.id === parseInt(productId));

    if (selectedCategory) {

      if (selectedCategory.feasibility && selectedCategory.feasibility.length > 0) {
        pageNavigate("/consumer_preference")
        // handleShow()
        // console.log("Feasibility options found:", selectedCategory.feasibility);
      } else {
        pageNavigate("/consumer_preference")
      }
    } else {
      toast.error("Selected category not found.");
    }
  };



  return (
    <div className="content-breadcrumps-below-content-height w-100 overflow-scroll placeholder-glow">
      <div className="row g-3 pt-4 align-content-stretch">
        {initialGlow
          ? Array.from({ length: products.length }).map((_, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={i}>
              <div className="card rounded-4 border-0 h-100">
                <div className="card-body">
                  <div className="py-3">
                    <p className="card-text imagePlaceholder w-100 placeholder rounded-4"></p>
                  </div>
                  <h5 className="card-title py-3 w-50 placeholder rounded-2"></h5>
                  <p className="card-text py-5 w-100 placeholder rounded-2"></p>
                </div>
                <div className="card-footer py-3 bg-white rounded-4">
                  <button
                    type="button"
                    className="rounded-2 text-center w-100 placeholder py-3"
                  ></button>
                </div>
              </div>
            </div>
          ))
          : products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-3">
              <div className="card rounded-4 border-0 h-100">
                <div className="card-body">
                  <div className="py-3">
                    <img
                      src={require("../Component/assets/default.jpeg")}
                      height={200}
                      className="rounded-4 w-100"
                      alt="..."
                    />
                  </div>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.desc}</p>
                </div>
                <div className="card-footer py-3 bg-white rounded-4">
                  <button
                    type="button"
                    className="btn btn-primary text-center w-100"
                    onClick={() => redirectCategoryPage(product.id)}
                    data-bs-toggle="modal"
                    data-bs-target={`#exampleModalToggle-${product.id}`}
                  >
                    View products
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modals */}
      {products.map((product) => (
        <div
          key={product.id}
          className="modal fade"
          id={`exampleModalToggle-${product.id}`}
          aria-hidden="true"
          aria-labelledby={`exampleModalToggleLabel-${product.id}`}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id={`exampleModalToggleLabel-${product.id}`}
                >
                  {product.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="service" className="form-label">
                  What services are you looking for in {product.name} ?
                </label>

                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => handleOnChange(e.target.value)}
                >
                  <option value="">select service</option>
                  {productCategory.length > 0
                    ? productCategory.map((category, index) => {
                      return (
                        <option value={category.id} key={index}>
                          {category.name}
                        </option>
                      );
                    })
                    : null}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleNextButtonClick}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Do not even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;