import React, { useEffect, useState } from "react";
import axiosInstance from "../../Services/axiosInstance";
import toast from "react-hot-toast";

const ConsumerPreferenceLayout = () => {
  const [loading, setLoading] = useState(false);
  const [mainCriteriaPairs, setMainCriteriaPairs] = useState([]);
  const [sliderValues, setSliderValues] = useState([]);
  const [recommendedData, setRecommendedData] = useState([]);
  const [data, setData] = useState([]);

  const [apiRequest, setApiRequest] = useState({});
  const [productComparison, setProductComparison] = useState([]);

  useEffect(() => {
    const get_attributes = async () => {
      const getProduct = {
        client_id: localStorage.getItem("client_id"),
        product_category_id: localStorage.getItem("product_category_id"),
      };

      try {
        await axiosInstance.post("/get_attributes", getProduct).then((res) => {
          setRecommendedData(res.data.data[0]);
          setApiRequest(res.data.data[0]);
          setMainCriteriaPairs(res.data.data[0].main_criteria_pairs);
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (
      localStorage.getItem("client_id") !== null &&
      localStorage.getItem("product_category_id")
    ) {
      get_attributes();
    }
  }, []);

  useEffect(() => {
    if (mainCriteriaPairs.length > 0) {
      const defaultValues = Array(mainCriteriaPairs.length).fill(5); // Assuming default value is 1
      setSliderValues(defaultValues);
    }
  }, [mainCriteriaPairs]);

  const convertSliderValue = (value) => {
    switch (value) {
      case 1:
        return 1 / 5;
      case 2:
        return 1 / 4;
      case 3:
        return 1 / 3;
      case 4:
        return 1 / 2;
      case 5:
        return 1;
      case 6:
        return 2;
      case 7:
        return 3;
      case 8:
        return 4;
      case 9:
        return 5;
      default:
        return 1; // Default to 1 if value is out of range
    }
  };

  const updateApiRequest = () => {
    const updatedApiRequest = {
      ...apiRequest,
      user_importance: sliderValues.map(convertSliderValue),
    };
    console.log("Updated API Request:", updatedApiRequest); // Add this line
    setApiRequest(updatedApiRequest);
  };

  const handleDone = async () => {
    // updateApiRequest(); // Update apiRequest with current slider values

    const updatedApiRequest = {
      ...apiRequest,
      user_importance: sliderValues.map(convertSliderValue),
    };

    console.log(updatedApiRequest);

    try {
      setLoading(true);

      // Make API call with updated apiRequest
      const response = await axiosInstance.post(
        "/consumer_service",
        updatedApiRequest
      );
      console.log(response.data);
      if (response.data.error_code === 200) {
        setData(response.data); // Set your data state here
        setProductComparison(response.data.data.product_comparisons);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleDone = async (e) => {
  //   // Update apiRequest with current slider values
  //   updateApiRequest();
  //   const convertedValues = sliderValues.map((value) =>
  //     convertSliderValue(value)
  //   );
  //   alert(convertedValues);

  //   console.log(apiRequest)

  //   try {
  //     // Make API call with axios
  //     const response = await axiosInstance.post("/consumer_service", apiRequest);

  //     // Handle the response, for example, set the received data to the 'data' state

  //     if(response.data.error_code === 200){
  //       console.log(response.data);
  //     }

  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setLoading(false);
  //   }
  // };

  const handleSliderChange = (index, event) => {
    const newSliderValues = [...sliderValues];
    newSliderValues[index] = parseInt(event.target.value);
    setSliderValues(newSliderValues);
    console.log("Slider Values Updated:", newSliderValues); // Add this line
  };

  return (
    <>
      <section className="content-breadcrumps-below-content-height content-preference-section pt-1 overflow-scroll">
        <div className="container h-100">
          <div className="row h-100">
            {/* Left-side container */}

            <div className="col-lg-6 h-100 ps-0 pe-2 py-3">
              <div className=" card border-0 shadow-sm h-100 rounded-4">
                <h4 className="title mb-1 pt-4 pb-3 px-4">
                  Consumer Preference
                </h4>
                <div className="range-bar-container slidecontainer  px-4 ">
                  <>
                    {mainCriteriaPairs &&
                      mainCriteriaPairs.map((pair, index) => {
                        const key = `slider-${index}`; // Unique key for each slider
                        return (
                          <div
                            className="d-flex my-4 align-items-center"
                            key={key}
                          >
                            <p className="p-2 mb-0 w-25 sliderText">
                              {pair[0]}
                            </p>
                            <div className="p-2 mb-0 flex-grow-1">
                              <input
                                type="range"
                                className="form-control slider w-90"
                                min="1"
                                max="9"
                                step="1"
                                id={key}
                                value={sliderValues[index] || 5} // Use default value if sliderValues[index] is falsy
                                onChange={(event) =>
                                  handleSliderChange(index, event)
                                } // Event handler
                              />
                            </div>
                            <p className="p-2 mb-0 w-25 sliderText">
                              {pair[1]}
                            </p>
                          </div>
                        );
                      })}
                  </>
                </div>

                <div className="text-center px-4 my-2 mt-4">
                  <div
                    className="btn brand-color w-100 fw-bold"
                    onClick={handleDone}
                  >
                    {loading ? "Loading, Please wait..." : "Done"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right-side container */}

            <div className="col-lg-6 h-100 pe-0 ps-2 py-3">
              <div className=" card h-100 border-0 shadow-sm rounded-4 overflow-scroll">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../assets/loadings.gif")}
                      className="w-15"
                      alt="loading-gif"
                    />
                  </div>
                ) : productComparison.length ? (
                  <div>
                    <h4 className="title mb-1 pt-4 mb-3 px-4">
                      Top Recommendations
                    </h4>
                    <div className="top-recommendation-card-container px-4">
                      {productComparison.map((item, index) => (
                        <div className="card mb-3 p-0" key={index}>
                          <div className="row g-0">
                            <div className="col-md-12">
                              <div className="card-body mb-0">
                                <h5 className="card-title fw-bold">
                                  {item.name}
                                </h5>
                                <p className="card-text">{item.desc}</p>
                              </div>
                            </div>
                          </div>
                          <div className="container-fluid my-3 mb-4">
                          <div className="row mx-0">
  {/* Mapping non-quantified values into item.features */}
  {item["non-quantified-values"].map((feature, index) => {
    // Get the label and value from each feature object
    const label = Object.keys(feature)[0]; // Extracting the label
    const value = feature[label]; // Extracting the value

    // Calculate the width of the column dynamically based on the length of the label and value
    const labelWidth = `${(label.length + 2) * 10}px`; // Adjust the multiplier according to your font size and padding
    const valueWidth = `${(value.length + 2) * 10}px`; // Adjust the multiplier according to your font size and padding
    const columnWidth = label.length > value.length ? labelWidth : valueWidth;

    // Rendering JSX for each feature
    return (
      <div className="col mb-3 price-container" key={index} style={{ minWidth: columnWidth }}>
        <div className="form-floating">
          <input
            type="text"
            className="w-100 pt-3 px-3 price-input-field pe-none"
            value={value}
            readOnly
          />
          <p className="special-label">{label}</p>
        </div>
      </div>
    );
  })}
</div>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../assets/NoDataFound.jpg")}
                      className="w-75"
                      alt="loading-gif"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConsumerPreferenceLayout;
