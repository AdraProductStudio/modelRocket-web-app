import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { GiGemPendant } from "react-icons/gi";
import { GiDiamondRing } from "react-icons/gi";
import { GiHeartEarrings } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Services/axiosInstance"; 

const Category = () => {
  const pageRender = useNavigate();
  const category = [
    {
      category: "Pendent",
      icon: <GiGemPendant className="fs-3 text-light" />,
      cardName: "chain-card",
      cardAbs: "chain-abs",
    },
    {
      category: "Ring",
      icon: <GiDiamondRing className="fs-3 text-light" />,
      cardName: "ring-card",
      cardAbs: "ring-abs",
    },
    {
      category: "Bracelet",
      icon: <BiLoaderCircle className="fs-3 text-light" />,
      cardName: "bracelets-card",
      cardAbs: "bracelets-abs",
    },
    {
      category: "Earrning",
      icon: <GiHeartEarrings className="fs-3 text-light" />,
      cardName: "earring-card",
      cardAbs: "earring-abs",
    },
  ];

  const [initialGlow, setInitialGlow] = useState(false);  
  const [isFesabilityAvailable, setIsFesabilityAvailable] = useState(false);
  const [zipCode, setZipCode] = useState("");

  const [squareFootage, setsquareFootage] = useState("");
  const [selectBox, setSelectBox] = useState("");
  const [productCategory, setProductCategory] = useState([]);

  const [zipCodeErr, setZipCodeErr] = useState(false);
  const [sqfoootageErr, setSqfoootageErr] = useState(false);
  const [selectBoxErr, setSelectBoxErr] = useState(false);
  const [feasibilityData,setFeasibilityData] = useState([]);

  const [codes, setCodes] = useState([]);
  const [sqFootageLimit, setSqFootageLimit] = useState("");
  const [selectBoxArray, setSelectBoxArray] = useState([]); 

  const dummyCard = [1, 2, 3, 4]

  const randomColor = () => { 
    var rand = Math.floor(Math.random() * 4);
    return category[rand];
  };

  useEffect(() => {
    setInitialGlow(true);
    const fetchClientProduct = async () => {
      const getProduct = {
        client_id: localStorage.getItem("client_id"),
      };

      try {
        await axiosInstance
          .post("/get_product_categories", getProduct)
          .then((res) => { 
            setInitialGlow(false);
            setProductCategory(res.data.data);
          });

      } catch (err) {
        console.log(err);
      }
    };

    if (localStorage.getItem("client_id") !== null) {
      fetchClientProduct(); 
    }

    fetchClientProduct();
  }, []);

  const redirectConsumerPreferencePage = async (id,feasibilityArray) => {
    if(feasibilityArray.length > 0){
      setFeasibilityData(feasibilityArray)
      setCodes(feasibilityArray[0].bountary_value);
      setSqFootageLimit(parseInt(feasibilityArray[1].bountary_value[0]));
      setSelectBoxArray(feasibilityArray[2].question_value);

      localStorage.setItem("product_category_id", id)
    }else{
      localStorage.setItem("product_category_id", id)
      pageRender("consumer_preference")
    }
  }

  const handleInput = (e) => {
    if (e.target.name === "zipcode") {
      if (e.target.value !== "") {
        if (isFinite(e.target.value)) {
          setZipCode(e.target.value);
        } else {
          setZipCode("");
        }
      } else {
        setZipCode("");
      }
    } else if (e.target.name === "sqFootage") {
      if (e.target.value !== "") {
        console.log(isFinite(e.target.value))
        if (isFinite(e.target.value)) {
          setsquareFootage(parseInt(e.target.value));
        } else {
          setsquareFootage("");
        }
      } else {
        setsquareFootage("");
      }
    } else {
      if (e.target.value !== "") {
        setSelectBox(e.target.value);
      } else {
        setSelectBox("");
      }
    }

  }

  const handleFocus = (e) => {
    var a = codes.includes(zipCode);

    if (e.target.name === "zipcode") {
      if (a) {
        setZipCodeErr(false);
      } else {
        setZipCodeErr(true);
      }
    } else if (e.target.name === "sqFootage") {
      console.log(squareFootage >= 0 && squareFootage < sqFootageLimit && squareFootage !== "")
      if (squareFootage >= 0 && squareFootage < sqFootageLimit && squareFootage !== "") {
        setSqfoootageErr(false)
      } else {
        setSqfoootageErr(true)
      }
    } else {
      if (selectBox !== "") {
        setSelectBoxErr(false);
      } else {
        setSelectBoxErr(true);
      }
    }
  }

  const handleRedirect = () => {
    console.log(squareFootage)
    if (codes.includes(zipCode) && squareFootage >= 0 && squareFootage < sqFootageLimit && squareFootage!=="" && selectBox !== "") {
      document.getElementById("dismissModal").click();
      pageRender("consumer_preference");
    } else {
      var a = codes.includes(zipCode);
      var b = squareFootage;

      if (a) {
        setZipCodeErr(false);
      } else {
        setZipCodeErr(true);
      }

      if (b >= 0 && b < sqFootageLimit && b !== "") {
        setSqfoootageErr(false)
      } else {
        setSqfoootageErr(true)
      }

      if (selectBox !== "") {
        setSelectBoxErr(false);
      } else {
        setSelectBoxErr(true);
      }
    }
  }

  return (
    <>
      <div className="content-breadcrumps-below-content-height w-100 placeholder-glow">
        <div className="w-100 py-4 h-100">
          <div className="card  rounded-4 border-0 category-card-height h-100 overflow-scroll">
            <div className="card-body p-4">
              <h5 className="category-card-title">Product Category</h5>

              <div className="w-100 row g-3 pt-4">
                {
                  initialGlow ?
                    dummyCard.map((v, i) => {
                      return <div className="col-12 col-sm-6 col-lg-3" key={i}>
                        <div className={`card rounded-4 cup`}
                        >
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
                    })

                    :

                    productCategory.map((v, i) => {
                      return (
                        <div
                          className="col-12 col-sm-6 col-lg-3" key={i}
                          onClick={() => {
                            redirectConsumerPreferencePage(v.id,v.feasibility);
                            setZipCodeErr(false);
                            setSqfoootageErr(false);
                            setSelectBoxErr(false);
                            setZipCode("");
                            setsquareFootage("");
                            setSelectBox("");
                          }}
                          data-bs-toggle={v.feasibility.length > 0 ? "modal" : ""}
                          data-bs-target={v.feasibility.length > 0 ? "#feasibilityModal" : ""}
                        >
                          <div
                            className={`card rounded-4 ${randomColor().cardName} cup`}
                          >
                            <div className="card-body p-4">
                              <div className="position-relative pb-3">
                                <div
                                  className={`icon-absolute ${randomColor().cardAbs}`}
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

      <div className="modal fade" id="feasibilityModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"

            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-12 d-flex flex-wrap align-items-center mb-3">
                <div className="col-7 ">
                  <p className="fesibility-fontSize text-break mb-0">1. {feasibilityData.length > 0 ? feasibilityData[0].question : ""}</p>
                </div>
                <div className="col-5">
                  <input type="text" value={zipCode} 
                      className={`${codes.includes(zipCode) ? 
                            zipCodeErr ? "" : "border-success border-2"
                            :
                            zipCodeErr ? "border-danger border-2" : ""
                        } w-100 form-control`} 
                        maxLength="6" onChange={handleInput} name="zipcode" onBlur={handleFocus} />

                  {codes.includes(zipCode) ? null : zipCodeErr ? <span className="fesibility-fontSize text-danger">Invalid Zip code</span> : null}
                </div>
              </div>


              <div className="col-12 d-flex flex-wrap align-items-center mb-3">
                <div className="col-7">
                  <p className="fesibility-fontSize text-break mb-0">2. {feasibilityData.length > 0 ? feasibilityData[1].question : ""}</p>
                </div>
                <div className="col-5">
                  <input type="text" value={squareFootage}
                    className={`${squareFootage >= 0 && squareFootage < sqFootageLimit && squareFootage !== "" ?
                      sqfoootageErr ? "" : "border-success border-2"
                      : sqfoootageErr ? "border-danger border-2" : ""
                      } w-100 form-control`
                    } maxLength="3" onChange={handleInput} name="sqFootage" onBlur={handleFocus} />


                  {squareFootage >= 0 && squareFootage < sqFootageLimit && squareFootage !== "" ?
                    null
                    :
                    sqfoootageErr ? <span className="fesibility-fontSize text-danger">Invalid square footage</span> : null 
                  }
                  
                </div>
              </div>
              <div className="col-12 d-flex flex-wrap align-items-center mb-3">
                <div className="col-7 ">
                  <p className="fesibility-fontSize text-break mb-0">3. {feasibilityData.length > 0 ? feasibilityData[2].question : ""}</p>
                </div>
                <div className="col-5">
                  <select
                    className={`${selectBox !== "" ?
                      selectBoxErr ? "" : "border-success border-2"
                      : selectBoxErr ? "border-danger border-2" : ""
                      } form-select`
                    }
                    value={selectBox}
                    aria-label="Default select example" name="selectbox" onChange={handleInput} onBlur={handleFocus}>
                    <option value="">select</option>
                    {
                      selectBoxArray.map((v, i) => {
                        return <option value={v} key={i}>{v}</option>
                      })
                    }
                  </select>
                  {selectBox!=="" ? null : selectBoxErr ? <span className="fesibility-fontSize text-danger">Field not selected</span> : null}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="col-6 m-0 px-1">
              <button type="button" className="btn btn-transparent border w-100" data-bs-dismiss="modal" id="dismissModal"
              >Close</button>
            </div>
            <div className="col-6 m-0 px-1">
              <button type="button" className="btn btn-primary w-100" onClick={handleRedirect}>Next</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Category;
