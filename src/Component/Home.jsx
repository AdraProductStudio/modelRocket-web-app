import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Services/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  const ref = useRef();

  const [products, setProducts] = useState([]);
  const [initialGlow, setInitialGlow] = useState(false);
  const dummyCard = [1, 2, 3, 4];
  const [file, setFile] = useState([]);
  const [updateClientStatus, setUpdateClientStatus] = useState(false)


  
  const pageRender = useNavigate();

  useEffect(() => {
    setInitialGlow(true);

    const fetchData = async () => {
      axiosInstance.get("/get_clients").then((response) => {
        if (response.data.error_code === 200) {
          setProducts(response.data.data);
          setInitialGlow(false);
        } else {
          alert(response.data.message);
        }
      });
    };

  
    fetchData();
  }, [updateClientStatus]);

 

  const redirectCategoryPage = async (id) => {
    localStorage.setItem("client_id", id)
    pageRender("/category")
  };


  const handleUploadXlsheet = (e) => {
    setFile(e.target.files[0]);
    uploadXlFile(e.target.files[0])
  }

  const uploadXlFile = async (fileData) => {
    const fd=new FormData()
    fd.append("file",fileData)

    try {
      const res = await axiosInstance.post("/upload", fd, {
        headers: {
          "content-type": "multipart/form-data",
        }
      })      


      ref.current.value = "";
      if(res.data.error_code===200){
        setUpdateClientStatus(!updateClientStatus)
      }else{
        toast.error(res.data.message)
      }

    } catch (err) {
      console.log(err)
    }
  }

  return (

    <div className="content-breadcrumps-below-content-height w-100 overflow-scroll placeholder-glow">


      <div className="row g-3 pt-4 align-content-stretch">
        <div className="col-12 d-inline-flex justify-content-end">
          {/* <div className="col-12 col-sm-6 col-md-3">
            <div class="mb-3">
              <input class="form-control" ref={ref} type="file" accept=".xls,.xlsx" onChange={handleUploadXlsheet} />
            </div>
          </div> */}
        </div>
        {
          initialGlow ?
            dummyCard.map((v, i) => {
              return <div className="col-12 col-sm-6 col-lg-3" key={i}>
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
                    >
                    </button>
                  </div>
                </div>
              </div>
            })

            :
            products.map((product) => (
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
