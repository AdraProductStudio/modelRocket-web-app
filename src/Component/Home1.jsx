import React, { useState, useEffect } from "react";
import axiosInstance from "../Services/axiosInstance";
import toast from "react-hot-toast";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [initialGlow, setInitialGlow] = useState(false);
  const [category, setCategory] = useState(null);
  const [isError, setIsError] = useState(true);
  const [disable, setDisable] = useState(true);
  const [feasibilityData, setFeasibilityData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const pageRender = useNavigate();

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

  const redirectCategoryPage = async (id) => {
    localStorage.setItem("client_id", id);
  };

  const handleOnChange = (selectedCategory) => {
    if (selectedCategory === "") {
      setDisable(true);
      setIsError(true);
    } else {
      setDisable(false);
      setIsError(false);

      // Find the selected product based on category name
      const selectedProduct = products.find((product) =>
        product.product_category.some((pc) => pc.name === selectedCategory)
      );

      if (selectedProduct) {
        // Extract the selected product category data
        const selectedCategoryData = selectedProduct.product_category.find(
          (pc) => pc.name === selectedCategory
        );

        // Update feasibility data and selected category state
        setFeasibilityData(selectedCategoryData.feasibility);
        setCategory(selectedCategory);
      }
    }
  };

  const handleInputChange = (questionId, event) => {
    const { value } = event.target;
    setAnswers({ ...answers, [questionId]: value });
  };

  const validateBoundary = (question, answer) => {
    if (question.bountary_type === "in" && !question.bountary_value.includes(answer)) {
      return false;
    }
    if (question.bountary_type === ">" && parseInt(answer) <= parseInt(question.bountary_value[0])) {
      return false;
    }
    // Add more validation logic for other boundary types as needed
    return true;
  };

  const handleNextQuestion = () => {
    const currentQuestion = feasibilityData[currentQuestionIndex];
    const answer = answers[currentQuestion.id];

    // Validate the answer against the boundary conditions
    if (validateBoundary(currentQuestion, answer)) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      toast.error("Validation failed");
    }
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSubmit = async () => {
    const currentQuestion = feasibilityData[currentQuestionIndex];
    const answer = answers[currentQuestion.id];

    if (answer === undefined || answer === "") return;

    // Validate the answer against the boundary conditions
    if (validateBoundary(currentQuestion, answer)) {
      try {
        const getAttributeParameters = {
          product_category_id: localStorage.getItem("selectedCategoryId"),
          client_id: localStorage.getItem("client_id"),
        };

        // Make API call to submit the answers
        const response = await axiosInstance.post(
          "/get_attributes",
          getAttributeParameters
        );

        // Check response for error handling if needed
        if (response.data.error_code === 200) {
          if (response.data.data[0].main_criteria_pairs.length > 0) {
            pageRender("/consumer_preference");
            document.getElementById("dismisModal1").click();
            document.getElementById("dismisModal2").click();
          } else {
            toast.error("Criteria Pairs Not Available");
          }
        } else {
          toast.error(response.data.message || "Failed to submit");
        }
      } catch (error) {
        console.error("Error while submitting:", error);
        toast.error("Failed to submit");
      }
    } else {
      toast.error("Validation failed");
    }
  };

  return (
    <div className="content-breadcrumps-below-content-height w-100 overflow-scroll placeholder-glow">
      <div className="row g-3 pt-4 align-content-stretch">
        {initialGlow
          ? Array.from({ length: 4 }).map((_, i) => (
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
                      data-bs-toggle="modal"
                      data-bs-target={`#exampleModalToggle-${product.id}`} // Unique modal ID for each product
                      onClick={() => redirectCategoryPage(product.id)}
                    >
                      View products
                    </button>
                  </div>
                </div>
                <div
                  className="modal fade"
                  id={`exampleModalToggle-${product.id}`} // Unique modal ID for each product
                  aria-hidden="true"
                  aria-labelledby={`exampleModalToggleLabel-${product.id}`} // Unique label ID for each product
                  tabIndex="-1"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          id={`dismisModal1-${product.id}`} // Unique close button ID for each product
                        ></button>
                      </div>
                      <div className="modal-body">
                        <label htmlFor="label" className="form-label">
                          What service are you looking for?
                        </label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) => handleOnChange(e.target.value)}
                        >
                          <option value="">Select service</option>
                          {product.product_category.map((productCategory) => (
                            <option
                              key={productCategory.id}
                              value={productCategory.name}
                            >
                              {productCategory.name}
                            </option>
                          ))}
                        </select>

                        {isError && (
                          <div id="inputErrorBlock" className="form-text">
                            * Required field
                          </div>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button
                          className="btn btn-primary"
                          data-bs-target={`#exampleModalToggle2-${product.id}`} // Unique target ID for each product
                          data-bs-toggle="modal"
                          data-bs-dismiss="modal"
                          disabled={disable}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="dismisModal2"></button>
            </div>
            <div className="modal-body">
              {feasibilityData.length > 0 && (
                <>
                  <h5>{feasibilityData[currentQuestionIndex].question}</h5>
                  {feasibilityData[currentQuestionIndex].question_type === "numeric" && (
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter your answer"
                      onChange={(e) =>
                        handleInputChange(feasibilityData[currentQuestionIndex].id, e)
                      }
                    />
                  )}
                  {feasibilityData[currentQuestionIndex].question_type === "options" && (
                    <select
                      className="form-select"
                      onChange={(e) =>
                        handleInputChange(feasibilityData[currentQuestionIndex].id, e)
                      }
                    >
                      <option value="">Select an option</option>
                      {feasibilityData[currentQuestionIndex].question_value.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  <ReactTooltip className="tooltipStyle" effect="solid" place="right" />
                  <button
                    className="btn btn-outline-secondary me-4 w-20"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    data-tip="Click here to go back."
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={
                      currentQuestionIndex === feasibilityData.length - 1
                        ? handleSubmit
                        : handleNextQuestion
                    }
                    disabled={!answers[feasibilityData[currentQuestionIndex].id]}
                  >
                    {currentQuestionIndex === feasibilityData.length - 1 ? "Submit" : "Next"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

