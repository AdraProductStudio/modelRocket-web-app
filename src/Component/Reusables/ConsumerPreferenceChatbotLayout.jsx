import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../Services/axiosInstance";
import { DataAnalysisGrapgh } from "./DataAnalysisGrapgh";
import { Tooltip } from "react-tooltip";
import { FaInfoCircle } from "react-icons/fa";
import "../../../src/ConsumerPreferenceChatbotLayout.css";
import { IoPerson } from "react-icons/io5";
import botImage from "../assets/model-rocket-bot.svg";

const ConsumerPreferenceChatbotLayout = () => {
  const [viewCharts, setViewCharts] = useState(false);
  const [viewGraph, setViewGraph] = useState(false);

  const [productComparison, setProductComparison] = useState([]);
  const [showGraphSection, setShowGraphSection] = useState(false);
  const inputRef = useRef();
  const [userTextInput, setUserTextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatbotMessage, setchatbotMessage] = useState({
    timestamp: new Date(),
    message: "",
  });
  const [conversationId, setConversationId] = useState(null);
  const [init, setInit] = useState(false);

  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000
  );

  useEffect(() => {
    setRandomNumber(randomNumber);
    const getChatbot = async () => {
      var requiredParams = {
        client_id: localStorage.getItem("client_id"),
        service_id: localStorage.getItem("service_id"),
        msg: userTextInput,
        flag: "init",
        usr_phoneno: randomNumber,
      };

      try {
        await axiosInstance
          .post("/chatbot_new", requiredParams)
          .then((response) => {
            setchatbotMessage({
              timestamp: new Date(),
              message: response.data.data.message,
            });
            setConversationId(response.data.data.conversation_id);            
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    };

    getChatbot();
  }, [init]);

  const [graphData, setGraphData] = useState({});

  const chatbotResponse = async (userInput, stage) => {
    var requiredParams = {
      client_id: localStorage.getItem("client_id"),
      service_id: localStorage.getItem("service_id"),
      msg: userInput,
      flag: stage,
      usr_phoneno: randomNumber,
    };

    try {
      const result = await axiosInstance.post("/chatbot_new", requiredParams);
      if (result.data.error_code === 200) {
        setTimeout(() => {
          getOfferProduct();
        }, 2000);
        return result.data.data.message;
      } else if (
        result.data.error_code === 500 &&
        result.data.data.message == {}
      ) {
        return "Hey! Something went wrong. Can you please ask again";
      } else {
        return "Hey! Something went wrong. Can you please ask again";
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.msg === "Token has expired"
      ) {
        return "Session Expired! Please try again...!";        
      }
    }
  };

  const getOfferProduct = async () => {
    const requiredParams = {
      conversation_id: conversationId,
    };
    
    try {
      const response = await axiosInstance.post("/get_offer", requiredParams);

      if (response.data.error_code === 200) {
        setProductComparison(response.data.data.product_comparisons);
        setGraphData(response.data.data.criteria_weights);
      } else if (
        response.data.error_code === 404 &&
        response.data.message === "Product offer not found."
      ) {
        const newData = {};
        for (let key in graphData) {
          if (graphData.hasOwnProperty(key)) {
            newData[key] = 0.25;
          }
        }
        setGraphData(newData);
        setInit(!init);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    let input;
    if (!userTextInput.trim()) return;
    input = userTextInput;

    const userMessage = { text: input, user: true, timestamp: new Date() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const essenceMessage = { text: "...", user: false, timestamp: new Date() };

    setMessages((prevMessages) => [...prevMessages, essenceMessage]);
    setTimeout(() => {
      document.querySelector("#scrollView").scrollIntoView({
        behavior: "smooth",
      });
    }, 1);

    const response = await chatbotResponse(input, "step");

    const newEssenceMessage = {
      text: response,
      user: false,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [
      ...prevMessages.slice(0, -1),
      newEssenceMessage,
    ]);

    if (messages.length > 6) {
      setShowGraphSection(true);
    }

    setUserTextInput("");
    setTimeout(() => {
      document.querySelector("#scrollView").scrollIntoView({
        behavior: "smooth",
      });
    }, 1);
  };

  const ClearChat = () => {
    setViewCharts(false);
    setMessages([]);
    setShowGraphSection(false);
    setProductComparison([]);
    setViewGraph(false);
    chatbotResponse("", "reset");
  };

  const handleEnterKey = (e) => {
    if (e.keyCode === 13) {
      if (userTextInput && userTextInput !== "") {
        handleSubmit();
      }
    }
  };

 
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM/PM format
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  };

  return (
    <>
      <section className="content-breadcrumps-below-content-height content-preference-section pt-1 overflowY overflowX placeholder-glow">
        <div className="container h-100">
          <div className="row h-100">
            {/* Left-side container */}

            <div className="col-lg-6 h-100 ps-0 pe-2 py-3">
              <div className=" card border-0 shadow-sm h-100 rounded-4">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title mb-1 pt-4 pb-3 px-4">
                      Consumer preference
                      <Tooltip id="tooltip_one" className="tooltipWidth" />
                      <label className="form-label ps-2">
                        <FaInfoCircle
                          data-tooltip-id="tooltip_one"
                          data-tooltip-content="This is a representation of the consumer engagement"
                        />
                      </label>
                    </h4>
                    <label className="form-label mx-4">
                      Please use the chatbot to indicate which of the following
                      two attributes is more important to you
                    </label>
                  </div>
                </div>

                <div className="range-bar-container slidecontainer px-3 mt-3">
                  <div className="essence-chatbot ">
                    <ul className="essence-chatbox">
                      <li className="essence-chat essence-incoming ">
                        <img
                          src={botImage}
                          alt="model-rocket-bot-image"
                          className="model-rocket-bot-image"
                        />
                        <p className="ms-2">
                          {chatbotMessage.message}
                          <br />
                          <span style={{ fontSize: "11px" }}>
                            {formatTimestamp(chatbotMessage.timestamp)}
                          </span>
                        </p>
                      </li>

                      {messages.map((message, index) => (
                        <React.Fragment key={index}>
                          <li
                            key={index}
                            className={`essence-chat ${
                              message.user
                                ? "essence-outgoing"
                                : "essence-incoming"
                            }`}
                          >
                            {message.user ? (
                              <>
                                <p className="me-2">
                                  {message.text}
                                  <br />
                                  <span style={{ fontSize: "11px" }}>
                                    {formatTimestamp(message.timestamp)}
                                  </span>
                                </p>
                                <IoPerson className="fs-5" />
                              </>
                            ) : (
                              <>
                                <img
                                  src={botImage}
                                  alt="model-rocket-bot-image"
                                  className="model-rocket-bot-image"
                                />
                                <p className="ms-2">
                                  {message.text}
                                  <br />
                                  <span style={{ fontSize: "11px" }}>
                                    {formatTimestamp(message.timestamp)}
                                  </span>
                                </p>
                              </>
                            )}
                            {/* <span className="timestamp">
                              {formatTimestamp(message.timestamp)}
                            </span> */}
                          </li>
                        </React.Fragment>
                      ))}
                      <div id="scrollView" style={{ marginTop: "0px" }}></div>
                    </ul>
                  </div>
                </div>

                <div className="">
                  <div className="essence-chat-input d-flex mx-4 my-4 rounded-3">
                    <div className="d-flex justify-content-between align-items-center h-100 w-90 border px-3 rounded-3 me-0">
                      <textarea
                        className="essence-textArea "
                        ref={inputRef}
                        autoFocus
                        placeholder="Enter a message..."
                        required
                        value={userTextInput}
                        onChange={(e) => setUserTextInput(e.target.value)}
                        onKeyDown={(e) => handleEnterKey(e)}
                      ></textarea>
                      <span
                        id="essence-send-btn"
                        className="material-symbols-outlined"
                        onClick={handleSubmit}
                      >
                        <svg
                          width="34"
                          height="28"
                          viewBox="0 0 34 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.25 28V17.5L14.25 14L0.25 10.5V0L33.5 14L0.25 28Z"
                            fill="#65A3FF"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="d-flex ">
                      <button
                        className="btn btn-sm btn-secondary ms-4"
                        onClick={ClearChat}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right-side container */}

            <div className="col-lg-6 h-100 pe-0 ps-2 py-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 d-flex flex-wrap p-2">
                {/* secion one */}
                <div className="h-50">
                  <div className="card h-100 overflowY">
                    <h6 className="card-title m-2">
                      Consumer weights
                      <Tooltip id="tooltip_two" className="tooltipWidth" />
                      <label className="form-label ps-2">
                        {" "}
                        <FaInfoCircle
                          data-tooltip-id="tooltip_two"
                          data-tooltip-content="This is a view into the consumer's weights"
                        />{" "}
                      </label>
                    </h6>

                    <div className="card-body">
                      {viewCharts ? (
                        Object.keys(graphData).length > 0 ? (
                          <DataAnalysisGrapgh graphData={graphData} />
                        ) : null
                      ) : (
                        <div className="h-100 row align-items-center justify-content-center">
                          <div className="col text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => setViewCharts(true)}
                            >
                              View consumer weights
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* secion two */}
                <div className="h-50">
                  <div className="card h-100 overflowY overflowX">
                    {viewGraph ? (
                      <>
                        <div>
                          <h4 className="card-title mb-1 pt-4 mb-3 px-2">
                            Top Recommendations
                            <Tooltip
                              id="tooltip_three"
                              className="tooltipWidth"
                            />
                            <label className="form-label ps-2">
                              {" "}
                              <FaInfoCircle
                                data-tooltip-id="tooltip_three"
                                data-tooltip-content="This is a view into the recommendations made to the consumer and the rationale behind it"
                              />{" "}
                            </label>
                          </h4>
                        </div>
                        <h6 className="m-2 recommendations-content">
                          Options from the catalog that best match the consumer
                          preference weights will be displayed here. The
                          following are the consumer weights sorted by priority
                          in descending order.
                        </h6>
                        <div className="row mx-0 my-3 flex-column">
                          {Object.keys(graphData)
                            // Sort keys based on values in descending order
                            .sort((a, b) => graphData[b] - graphData[a])
                            .map((key, index) => (
                              <div
                                className="col mb-3 price-container"
                                key={index}
                              >
                                <div className="form-floating">
                                  <input
                                    type="text"
                                    className="w-100 pt-3 px-3 price-input-field pe-none"
                                    value={(graphData[key] * 100).toFixed(2)}
                                    readOnly
                                  />
                                  <p className="special-label">{key} (%)</p>
                                </div>
                              </div>
                            ))}
                        </div>

                        {productComparison.length > 0 ? (
                          <div>
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
                                      {item["non-quantified-values"].map(
                                        (feature, index) => {
                                          // Get the label and value from each feature object
                                          const label = Object.keys(feature)[0]; // Extracting the label
                                          const value = feature[label]; // Extracting the value

                                          // Calculate the width of the column dynamically based on the length of the label and value
                                          const labelWidth = `${
                                            (label.length + 2) * 10
                                          }px`; // Adjust the multiplier according to your font size and padding
                                          const valueWidth = `${
                                            (value.length + 2) * 10
                                          }px`; // Adjust the multiplier according to your font size and padding
                                          const columnWidth =
                                            label.length > value.length
                                              ? labelWidth
                                              : valueWidth;

                                          // Rendering JSX for each feature
                                          return (
                                            <div
                                              className="col mb-3 price-container"
                                              key={index}
                                              style={{ minWidth: columnWidth }}
                                            >
                                              <div className="form-floating">
                                                <input
                                                  type="text"
                                                  className="w-100 pt-3 px-3 price-input-field pe-none"
                                                  value={value}
                                                  readOnly
                                                />
                                                <p className="special-label">
                                                  {label}
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : showGraphSection ? (
                      <div className="h-100 row align-items-center justify-content-center">
                        <div className="col text-center">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setViewGraph(true)}
                          >
                            View recommendations
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConsumerPreferenceChatbotLayout;
