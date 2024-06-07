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

  const [productCategory, setProductCategory] = useState([]);
  const randomColor = () => {
    var rand = Math.floor(Math.random() * 4);
    return category[rand];
  };



 

  useEffect(() => {
    const fetchClientProduct = async () => {
      const getProduct = {
        client_id: localStorage.getItem("client_id"),
      };

      try {
        await axiosInstance
          .post("/get_product_categories", getProduct)
          .then((res) => {
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

  const redirectConsumerPreferencePage = (id) => {
    localStorage.setItem("product_category_id",id)
    pageRender("consumer_preference")
  }
  
  return (
    <div className="content-breadcrumps-below-content-height w-100">
      <div className="w-100 py-4 h-100">
        <div className="card rounded-4 border-0 category-card-height h-100 overflow-scroll">
          <div className="card-body p-4">
            <h5 className="category-card-title">Product Category</h5>

            <div className="w-100 row g-3 pt-4">
              {productCategory.map((v, i) => {
                return (
                  <div
                    className="col-12 col-sm-6 col-lg-3" key={i}
                    onClick={()=>redirectConsumerPreferencePage(v.id)}
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
  );
};

export default Category;
