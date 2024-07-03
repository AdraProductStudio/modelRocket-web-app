import React, { useState, useEffect } from "react";
import axiosInstance from "../Services/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { IoIosInformationCircleOutline } from "react-icons/io";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [initialGlow, setInitialGlow] = useState(false);
  const [productCategory, setProductCategory] = useState([]);

  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setMainCreteriaContent(false);
  };
  const handleShow = () => setShow(true);

  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [correctAnswers, setCorrectAnswers] = useState(
    new Array(currentQuestions.length).fill(false)
  );

  const [btnLoading, setBtnLoading] = useState(false);


  const [mainCreteriaContent, setMainCreteriaContent] = useState(false);

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
    setProductCategory([]);
    localStorage.setItem("client_id", id);

    axiosInstance
      .post("/get_product_categories", {
        client_id: localStorage.getItem("client_id"),
      })
      .then((response) => {
        if (response.data.error_code === 200) {
          setProductCategory(response.data.data);

          setFormData({});
          setValidationErrors({});
          setCurrentQuestions([]);
          setCurrentQuestionIndex(0);
        } else {
          toast.error(response.data.message);
        }
      });
  };




  const handleOnChange = (productId) => {

    localStorage.setItem("product_id", productId);
    const selectedCategory = productCategory.find(
      (category) => category.id === parseInt(productId)
    );

    if (selectedCategory) {
      setCurrentQuestions(selectedCategory.feasibility);
    } else {
      setCurrentQuestions([]);
      toast.error("Selected category not found.");
    }
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
        handleShow();

      } else {
        pageNavigate("/consumer_preference");
      }
    } else {
      toast.error("Selected category not found.");
    }
  };

  const handleInputChange = (e, questionId) => {
    const userInput = e.target.value;
    setFormData({ ...formData, [questionId]: userInput });

    const question = currentQuestions.find((q) => q.id === questionId);
    if (question && validateAnswer(question, userInput)) {
      const index = currentQuestions.findIndex((q) => q.id === questionId);
      if (index !== -1) {
        const newCorrectAnswers = [...correctAnswers];
        newCorrectAnswers[index] = true;
        setCorrectAnswers(newCorrectAnswers);
      }
    }
  };

  const validateAnswer = (question, userInput) => {
    return question.correct_answer === userInput;
  };

  const handleNextQuestion = () => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const error = validateQuestion(currentQuestion);
    if (error) {
      if(error.type==="empty"){
        toast.error("Input should not be empty")
      }else{
        toast(error, {
          icon: (
            <IoIosInformationCircleOutline className="infoToast me-1" />
          ),
        })
      }
     
    } else {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {

        setBtnLoading(true);

        const getAttributesParamters = {
          client_id: localStorage.getItem("client_id"),
          product_category_id: localStorage.getItem("product_id"),
        };
        axiosInstance
          .post("/get_attributes", getAttributesParamters)
          .then((response) => {
            if (response.data.error_code === 200) {

              setBtnLoading(false);
              if (response.data.data.main_criteria_pairs.length > 0) {
                handleClose();
                pageNavigate("/consumer_preference");
              } else {
                handleShow();
                setMainCreteriaContent(true);
              }
            } else {
              toast.error(response.data.message);
            }
          })
          .catch((err) => {
            toast.error(err);
          })

      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const validateQuestion = (question) => {
    const userInput = formData[question.id];

    if (userInput === "" || userInput === undefined) {
      return {err:"Inputs should not be empty",type:"empty"}
    } else {
      switch (question.bountary_type) {
        case "in":
          if (!question.bountary_value.includes(userInput)) {
            return "Sorry, we don't provide products or services that meet your requirements.";
          }
          break;
        case "notin":
          if (question.bountary_value.includes(userInput)) {
            return "Sorry, we don't provide products or services that meet your requirements.";
          }
          break;
        case ">":
          if (parseFloat(userInput) <= parseFloat(question.bountary_value[0])) {
            return `Sorry, we don't provide products or services that meet your requirements.`;
          }
          break;
        case "<":
          if (parseFloat(userInput) >= parseFloat(question.bountary_value[0])) {
            return `Sorry, we don't provide products or services that meet your requirements.`;
          }
          break;
        case ">=":
          if (parseFloat(userInput) < parseFloat(question.bountary_value[0])) {
            return `Sorry, we don't provide products or services that meet your requirements.`;
          }
          break;
        case "<=":
          if (parseFloat(userInput) > parseFloat(question.bountary_value[0])) {
            return `Sorry, we don't provide products or services that meet your requirements.`;
          }
          break;
        case "value":
          if (!question.bountary_value.includes(userInput)) {
            return `Sorry, we don't provide products or services that meet your requirements.`;
          }
          break;
        default:
          break;
      }
      return null;
    }
  };

  const renderQuestionInputs = () => {
    const question = currentQuestions[currentQuestionIndex];

    if (!question) {
      return null;
    }

    const error = validationErrors[question.id];

    let inputField;

    switch (question.question_type) {
      case "numeric":
        inputField = (
          <input
            type="number"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Please enter response"
            aria-label={question.question}
            aria-describedby="basic-addon2"
            value={formData[question.id] || ""}
            onChange={(e) => handleInputChange(e, question.id)}
          />
        );
        break;
      case "options":
        inputField = (
          <select
            className={`form-select ${error ? "is-invalid" : ""}`}
            value={formData[question.id] || ""}
            onChange={(e) => handleInputChange(e, question.id)}
          >
            <option value="">Select an option</option>
            {question.question_value.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
        break;
      default:
        inputField = (
          <input
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Please enter response"
            aria-label={question.question}
            aria-describedby="basic-addon2"
            value={formData[question.id] || ""}
            onChange={(e) => handleInputChange(e, question.id)}
          />
        );
        break;
    }

    return (
      <div key={question.id} className="mb-3">
        <Tooltip id="dynamic-tooltip" />
        <label className="form-label">
          {question.question}{" "}
          {question.tool_tip ? (
            <FaInfoCircle
              data-tooltip-id="dynamic-tooltip"
              data-tooltip-content={question.tool_tip}
            />
          ) : null}
        </label>
        {inputField}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  };

  return (
    <div className="content-breadcrumps-below-content-height w-100 overflowY overflowX placeholder-glow">
      <div className="row g-3 pt-4 align-content-stretch">
        {initialGlow ?
          <div className="col-12 col-sm-6 col-lg-3" >
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
          :
          products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-3">
              <div className="card rounded-4 border-0 h-100">
                <div className="card-body">
                  <div className="py-3">
                    <img
                      src="https://cdn.matsuritech.com/client/default_client.jpeg"
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
                    onClick={() => {
                      localStorage.removeItem("product_id");
                      redirectCategoryPage(product.id)
                    }}
                    data-bs-toggle="modal"
                    data-bs-target={`#exampleModalToggle-${product.id}`}
                  >
                    View consumer experience
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
                  name="Default_select_example"
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
        centered
      >
        <Modal.Header closeButton>
          {/* <Modal.Title>Modal title</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {mainCreteriaContent ? (
            <label className="form-label">
              <img src={require("../Component/assets/businessDeal.png")} width={270} height={220} className="rounded mx-auto d-block mb-4" alt="..." />
              Thank you for answering our questions. Someone from our team will
              be in touch with you shortly!
            </label>
          ) : (
            renderQuestionInputs()
          )}
        </Modal.Body>

        {mainCreteriaContent ? (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={handleNextQuestion}
              disabled={btnLoading}
            >
              {btnLoading ? "Please Wait" : "Next"}
            </Button>
          </Modal.Footer>
        )}
      </Modal>

    </div>
  );
};

export default Home;
