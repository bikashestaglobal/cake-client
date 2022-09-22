import React, { useState } from "react";
import Config from "../config/Config";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
const Subscribe = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [loaded, setLoaded] = useState(true);

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();
    setLoaded(false);

    fetch(`${Config.SERVER_URL}/newsletters`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo.jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            setFormData({ email: "" });
            toast.success(result.message);
          } else {
            const keys = Object.keys(result.error);
            keys.forEach((element) => {
              toast.error(result.error[element]);
            });
            toast.error(result.message);
          }
          setLoaded(true);
        },
        (error) => {
          toast.error(error.message);
          setLoaded(true);
        }
      );
  };

  return (
    <form className="form-subcriber d-flex" onSubmit={submitHandler}>
      <input
        onChange={(evt) => {
          setFormData({ ...formData, email: evt.target.value });
        }}
        type="email"
        value={formData.email}
        placeholder="Your emaill address"
      />
      <button className="btn" type="submit">
        {loaded ? "Subscribe" : <Spinner />}
      </button>
    </form>
  );
};

export default Subscribe;
