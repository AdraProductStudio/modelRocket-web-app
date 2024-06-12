import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Services/axiosInstance";

const ProductCategory = () => {
  const pageRender = useNavigate();
  const ref = useRef(null);

  const category = [
    {
      cardName: "chain-card",
      cardAbs: "chain-abs",
    },
    {
      cardName: "ring-card",
      cardAbs: "ring-abs",
    },
    {
      cardName: "bracelets-card",
      cardAbs: "bracelets-abs",
    },
    {
      cardName: "earring-card",
      cardAbs: "earring-abs",
    },
  ];

  const [initialGlow, setInitialGlow] = useState(false);
  const [productCategory, setProductCategory] = useState([]);
  const [feasibilityData, setFeasibilityData] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fieldValues, setFieldValues] = useState(
    Array(feasibilityData.length).fill("")
  );

  const handleFieldChange = (index, value) => {
    setFieldValues((prevFieldValues) => {
      const newFieldValues = [...prevFieldValues];
      newFieldValues[index] = value;
      return newFieldValues;
    });
  };

  const dummyCard = [1, 2, 3, 4];

  const randomColor = () => {
    var rand = Math.floor(Math.random() * 4);
    return category[rand];
  };

  const fetchClientProduct = async () => {
    setInitialGlow(true);
    const getProduct = {
      client_id: localStorage.getItem("client_id"),
    };

    try {
      const res = await axiosInstance.post(
        "/get_product_categories",
        getProduct
      );      
      setInitialGlow(false);
      setProductCategory(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("client_id") !== null) {
      fetchClientProduct();
    }

    setFieldValues(Array(feasibilityData.length).fill(""));
  }, [feasibilityData]);

  const redirectConsumerPreferencePage = async (id, feasibilityArray) => {
    if (feasibilityArray.length > 0) {
      setFeasibilityData(feasibilityArray);
      localStorage.setItem("product_category_id", id);
    } else {
      localStorage.setItem("product_category_id", id);
      pageRender("consumer_preference");
    }
  };


  const handleRedirect = () => {
    let isEmpty = false;
    let isNotSatisfied = false;
    let noneSatisfied = true; // Flag to track if none of the conditions are satisfied

    

    // Check if any required field is empty
    fieldValues.forEach((value, i) => {

      const inputElement = document.getElementById(`input-${i}`);
      if (value === "") {
        inputElement.style.borderColor = "red";
        isEmpty = true;
        
      } else {
        {
          setErrorMessage("") 

          let isError = false;

          feasibilityData.forEach((v, i) => {
            const inputValue = fieldValues[i];
            const boundaryType = v.bountary_type;
            const boundaryValue = v.bountary_value;
            const inputElement = document.getElementById(`input-${i}`);

            // Reset isNotSatisfied for each iteration
            isNotSatisfied = false;

            switch (boundaryType) {
              case "in":
                if (!boundaryValue.includes(inputValue)) {
                  inputElement.style.borderColor = "red";
                  isError = true;
                  isNotSatisfied = true;
                } else {
                  inputElement.style.borderColor = "green";
                }
                break;
              case ">":
                if (
                  isNaN(parseFloat(inputValue)) ||
                  parseFloat(inputValue) <= parseFloat(boundaryValue)
                ) {
                  inputElement.style.borderColor = "red";
                  isError = true;
                  isNotSatisfied = true;
                } else {
                 
                  inputElement.style.borderColor = "green";
                }
                break;
              case "<":
                if (
                  isNaN(parseFloat(inputValue)) ||
                  parseFloat(inputValue) >= parseFloat(boundaryValue)
                ) {
                  inputElement.style.borderColor = "red";
                  isError = true;
                  isNotSatisfied = true;
                } else {
                 
                  inputElement.style.borderColor = "green";
                }
                break;
              case "value":                
                if (inputValue !== boundaryValue[0]) {
                  inputElement.style.borderColor = "red";
                  isError = true;
                  isNotSatisfied = true;
                } else {                  
                  inputElement.style.borderColor = "green";
                }
                break;
              default:
                break;
            }
                                                          
          });

          

            if (isNotSatisfied) {
              noneSatisfied = false;
            }

          


          if (!isError) {
            document.getElementById("dismissModal").click();
            pageRender("consumer_preference");
          }
        }
      }
    });

    // If any required field is empty, show error message and return
    if (isEmpty) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (noneSatisfied) {
      setNoDataFound(true);
      // Alternatively, you can trigger another action or set another flag here
    }
  };

  

  const handleResetAll = () => {
    if (ref.current) {
      ref.current.value = "";
    }
  };

  const dynamicInputFields = (v, i) => {
    switch (v.bountary_type) {
      case "in":
      case ">":
      case "<":
        return (
          <input
            id={`input-${i}`}
            type="number"
            className="w-100 form-control"
            onChange={(e) => handleFieldChange(i, e.target.value)}
          />
        );

      case "value":
        return (
          <select
            id={`input-${i}`}
            className="w-100 form-select"
            onChange={(e) => handleFieldChange(i, e.target.value)}
          >
            <option value="">select</option>
            {v.question_value.map((value, i) => {
              return (
                <option value={value} key={i}>
                  {value}
                </option>
              );
            })}
          </select>
        );

      default:
        return (
          <input id={`input-${i}`} type="text" className="w-100 form-control" />
        );
    }
  };

  return (
    <>
      <div className="content-breadcrumps-below-content-height w-100 placeholder-glow">
        <div className="w-100 py-4 h-100">
          <div className="card  rounded-4 border-0 category-card-height h-100 overflow-scroll">
            <div className="card-body p-4">
              <h5 className="category-card-title">Product Category</h5>

              <div className="w-100 row g-3 pt-4">
                {initialGlow
                  ? dummyCard.map((v, i) => {
                      return (
                        <div className="col-12 col-sm-6 col-lg-3" key={i}>
                          <div className={`card rounded-4 cup`}>
                            <div className="card-body p-4">
                              <div className="position-relative pb-3">
                                <div className={`icon-absolute placeholder`}>
                                  <img
                                    src={"..."}
                                    width={30}
                                    height={30}
                                    alt="..."
                                    className="opacity-0 pe-none"
                                  />
                                </div>
                              </div>
                              <h5 className="mt-5 rounded-2 ps-1 fw-bold text-dark bg placeholder w-75 py-2"></h5>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : productCategory.map((v, i) => {
                      return (
                        <div
                          className="col-12 col-sm-6 col-lg-3"
                          key={i}
                          onClick={() => {
                            redirectConsumerPreferencePage(v.id, v.feasibility);
                            handleResetAll();
                          }}
                          data-bs-toggle={
                            v.feasibility.length > 0 ? "modal" : ""
                          }
                          data-bs-target={
                            v.feasibility.length > 0 ? "#feasibilityModal" : ""
                          }
                        >
                          <div
                            className={`card rounded-4 ${
                              randomColor().cardName
                            } cup`}
                          >
                            <div className="card-body p-4">
                              <div className="position-relative pb-3">
                                <div
                                  className={`icon-absolute ${
                                    randomColor().cardAbs
                                  }`}
                                >
                                  <img
                                    src={`https://cdn.matsuritech.com/product/${v.name}.png`}
                                    width={30}
                                    height={30}
                                    alt="..."
                                  />
                                </div>
                              </div>
                              <h5 className="pt-5 ps-1 fw-bold text-dark bg">
                                {v.name}
                              </h5>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="feasibilityModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                {feasibilityData.map((v, i) => {
                  return (
                    <div
                      className="col-12 d-flex flex-wrap align-items-center mb-3"
                      key={i}
                    >
                      <div className="col-7">
                        <p className="fesibility-fontSize text-break mb-0">
                          {i + 1} {v.question}
                        </p>
                      </div>
                      <div className="col-5">{dynamicInputFields(v, i)}</div>
                    </div>
                  );
                })}
              </div>
              {noDataFound && !errorMessage && (
                <div
                  className="alert alert-primary fesibility-fontSize fw-bold"
                  role="alert"
                >
                  Sorry! We don’t have any products/services that match your
                  requirements
                </div>
              )}

              {errorMessage && (
                <div
                  className="alert alert-danger fesibility-fontSize fw-bold"
                  role="alert"
                >
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div className="col-6 m-0 px-1">
                <button
                  type="button"
                  className="btn btn-transparent border w-100"
                  data-bs-dismiss="modal"
                  id="dismissModal"                 
                >
                  Close
                </button>
              </div>
              <div className="col-6 m-0 px-1">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={handleRedirect}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCategory;
