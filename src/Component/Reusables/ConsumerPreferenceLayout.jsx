import React, { useEffect, useState } from "react";
import axiosInstance from "../../Services/axiosInstance";

const ConsumerPreferenceLayout = () => {
  const [loading, setLoading] = useState(false);

  const handleDone = (e) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const [recommendedData, setRecommendedData] = useState([]);
  const [mainCriteriaPairs, setMainCriteriaPairs] = useState([]);
  const [data, setData] = useState([""])

  useEffect(() => {
    const get_attributes = async () => {
      const getProduct = {
        client_id: localStorage.getItem("client_id"),
        product_category_id: localStorage.getItem("product_category_id"),
      };
      

      try {
        await axiosInstance.post("/get_attributes", getProduct).then((res) => {
          console.log(res.data.data);
          setRecommendedData(res.data.data[0]);
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
                  {mainCriteriaPairs &&
                    mainCriteriaPairs.map((pair, index) => {
                      return (
                        <div
                        className="d-flex my-4 align-items-center"
                        key={index}
                      >
                        {/* <p className="p-2 mb-0 ">{index}</p> */}
                        <p className="p-2 mb-0 w-25 sliderText">{pair[0]}</p>
                        <div className="p-2 mb-0 flex-grow-1 ">
                          <input
                            type="range"
                            className="form-control slider w-90"
                            min="1"
                            max="9"
                            step="1"
                            id={`slider-${index}`}
                            defaultValue={5}
                          />
                        </div>
                        <p className="p-2 mb-0 w-25 sliderText">{pair[1]}</p>
                      </div>
                      )
                     
                    })}
                </div>
                
                <div className="text-center px-4 my-2 mt-4">
                  <div className="btn brand-color w-100" onClick={handleDone}>
                    Done
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
                ) : data.length ? (
                  <div>
                    <h4 className="title mb-1 pt-4 mb-3 px-4">
                      Top Recommendations
                    </h4>
                    <div className="top-recommendation-card-container  px-4">
                    <div className="card mb-3 p-0 ">
                        <div className="row g-0 ">
                          <div className="col-md-12">
                            <div className="card-body mb-0">
                              <h5 className="card-title fw-bold">
                                Radiant Rose Pendant
                              </h5>
                              <p className="card-text ">
                                The pendant features a central rose motif,
                                symbolizing love, beauty, and grace. The rose is
                                intricately designed to showcase delicate
                                petals, often with a lifelike texture and form.
                              </p>
                              <p className="card-text">
                                <small className="card-text">
                                  A pendant featuring a floral design with
                                  diamond petals and a central diamond,
                                  resembling the radiant rose style.
                                </small>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="container-fluid  my-3 mb-4">
                          <div className="row mx-0">
                            <div className="col mb-0   price-container">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                  value="$5200"
                                  readOnly
                                />
                                <p className="special-label">Cost</p>
                              </div>
                            </div>

                            <div className="col mb-0   price-container">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                  value="1.50"
                                  readOnly
                                />
                                <p className="special-label">Carat</p>
                              </div>
                            </div>

                            <div className="col mb-0   price-container">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                  value="VS1"
                                  readOnly
                                />
                                <p className="special-label">Clarity</p>
                              </div>
                            </div>

                            <div className="col mb-0   price-container">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                  value="Round"
                                  readOnly
                                />
                                <p className="special-label">Cut Brilliant</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card mb-3 p-0 ">
                        <div className="row g-0 ">
                          <div className="col-md-12">
                            <div className="card-body mb-0">
                              <h5 className="card-title fw-bold">
                                Radiant Rose Pendant
                              </h5>
                              <p className="card-text ">
                                The pendant features a central rose motif,
                                symbolizing love, beauty, and grace. The rose is
                                intricately designed to showcase delicate
                                petals, often with a lifelike texture and form.
                              </p>
                              <p className="card-text">
                                <small className="card-text">
                                  A pendant featuring a floral design with
                                  diamond petals and a central diamond,
                                  resembling the radiant rose style.
                                </small>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="container-fluid  my-3 mb-4">
                          <div className="row mx-0">
                            <div className="col mb-0   price-container">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                  value="$5200"
                                  readOnly
                                />
                                <p className="special-label">Cost</p>
                              </div>
                            </div>

                            <div className="col mb-0   price-container">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                  value="1.50"
                                  readOnly
                                />
                                <p className="special-label">Carat</p>
                              </div>
                            </div>

                            <div className="col mb-0   price-container">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                  value="VS1"
                                  readOnly
                                />
                                <p className="special-label">Clarity</p>
                              </div>
                            </div>

                            <div className="col mb-0   price-container">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                  value="Round"
                                  readOnly
                                />
                                <p className="special-label">Cut Brilliant</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../assets/loadings.gif")}
                      className="w-15"
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
