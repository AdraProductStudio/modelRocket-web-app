import React, { useState, useEffect } from "react";
import axiosInstance from "../Services/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [initialGlow, setInitialGlow] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productCategory, setProductCategory] = useState([]);
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [questionAnswers, setQuestionAnswers] = useState({}); // Store user answers
  const [selectedCategory, setSelectedCategory] = useState(null); // State to hold the selected category

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
  
  };

  const handleOnChange = (productId) => {
    localStorage.setItem("product_id", productId);
  };

  const handleNextButtonClick = () => {
    const productId = localStorage.getItem("product_id");

    const selectedCategory = productCategory.find(
      (category) => category.id === parseInt(productId)
    );

    if (selectedCategory) {
      if (
        selectedCategory.feasibility &&
        selectedCategory.feasibility.length > 0
      ) {
        setCurrentQuestionIndex(0); // Reset question index for new category
        handleShow();
        console.log("Feasibility options found:", selectedCategory.feasibility);
      } else {
        pageNavigate("/consumer_preference");
      }
    } else {
      toast.error("Selected category not found.");
    }
  };
  const handleClose = () => {
    setShow(false);
    setQuestionAnswers({}); // Reset answers on modal close
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    // Ensure selectedProductId is not null and productCategory exists
    if (selectedProductId !== null && productCategory.length > 0) {
      // Find the selected category
      const selectedCategory = productCategory.find(category => category.id === selectedProductId);
  
      if (selectedCategory) {
        // Check if feasibility exists and currentQuestionIndex is within bounds
        if (selectedCategory.feasibility && selectedCategory.feasibility.length > 0) {
          setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, selectedCategory.feasibility.length - 1));
          handleShow(); // Show modal for the next question
        } else {
          // Handle case where feasibility data is empty or not found
          console.error('Feasibility data not found for selected category:', selectedCategory);
          // Optionally show a toast or handle this scenario accordingly
        }
      } else {
        console.error('Selected category not found in productCategory:', selectedProductId);
        // Optionally show a toast or handle this scenario accordingly
      }
    } else {
      console.error('Selected product category or productCategory array is not initialized properly.');
      // Optionally show a toast or handle this scenario accordingly
    }
  };
  
  
  
  

  const handleAnswerChange = (e, questionId) => {
    setQuestionAnswers({
      ...questionAnswers,
      [questionId]: e.target.value,
    });
  };

  const handleModalConfirm = () => {
    // Here you can handle submitting answers or navigate based on the answers
    handleClose();
    pageNavigate("/consumer_preference"); // Example navigation after modal completion
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

{productCategory.map((category) => (
  <div key={category.id}>
    {/* Render product category information */}
    <h3>{category.name}</h3>
    <p>{category.desc}</p>
    {/* Button to open modal for this category */}
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => handleShow(category)}
    >
      View Feasibility Questions
    </button>
    {/* Modal for this category */}
    <Modal
      show={show && selectedCategory && selectedCategory.id === category.id}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{category.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {category.feasibility.map((question, index) => (
          <div key={question.id}>
            <p>{question.question}</p>
            {question.question_type === "numeric" && (
              <input
                type="number"
                value={questionAnswers[question.id] || ""}
                onChange={(e) => handleAnswerChange(e, question.id)}
              />
            )}
            {question.question_type === "options" && (
              <select
                value={questionAnswers[question.id] || ""}
                onChange={(e) => handleAnswerChange(e, question.id)}
              >
                <option value="">Select an option</option>
                {question.question_value.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleModalConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
))}

    </div>
  );
};

export default Home;
