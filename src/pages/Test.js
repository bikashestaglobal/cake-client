import React from "react";
import axios from "axios";
import Config from "../config/Config";
const Test = () => {
  const generateToken = async () => {
    // const response = await fetch(
    //   `${Config.SERVER_URL}/order/generateInstamojoToken`
    // );
    // const data = await response.json();
    // console.log(data);

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer HoIuMkUEjfAmLYpDrpxymSKewPWERr267nGbW7VBFpE.qVhSbCetLPGnVIoLHzv23b_7VkincEIBYA2G6gr8jSY",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        allow_repeated_payments: false,
        send_email: false,
        amount: 1,
        purpose: "1",
        redirect_url: "http://localhost:3000/test",
      }),
    };

    fetch("https://api.instamojo.com/v2/payment_requests/", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-4">
          <button onClick={generateToken}>Payment</button>
        </div>
      </div>
    </div>
  );
};

export default Test;
