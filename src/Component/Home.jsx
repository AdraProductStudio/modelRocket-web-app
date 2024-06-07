import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Services/axiosInstance";

const Home = () => {
  const [products, setProducts] = useState([]);
  const pageRender = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      axiosInstance.get("/get_clients").then((response) => {
        if (response.data.error_code === 200) {
          setProducts(response.data.data);
        } else {
          alert(response.data.message);
        }
      });
    };

    fetchData();
  }, []);

  const redirectCategoryPage = async (id) => {   
        localStorage.setItem("client_id",id)    
        pageRender("/category")  
  };

  return (
    <div className="content-breadcrumps-below-content-height w-100">
      <div className="row g-3 pt-4 align-content-stretch overflow-scroll">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-lg-3">
            <div className="card rounded-4 border-0 h-100">
              <div className="card-body">
                <div className="py-3">
                  <img
                    src={`https://cdn.matsuritech.com/client/${product.name}.png`}
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
                >
                  View products
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
