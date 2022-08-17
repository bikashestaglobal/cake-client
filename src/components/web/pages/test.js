import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import { Link, useHistory } from "react-router-dom";
import Config from "../Config";

const Login = () => {
  const history = useHistory();
  // Create State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState(
    Math.floor(Math.random() * (9999 - 1000 + 1)) + 9999
  );
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const [otp, setOtp] = useState("");
  const [otpErrors, setOtpErrors] = useState({
    otp: "",
    message: "",
  });

  const [otpVerification, setOtpVerification] = useState(false);

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();
    setLoaded(false);
    const customerData = {
      email,
      password,
      otp: generatedOtp,
    };
    fetch(Config.SERVER_URL + "/customer/login", {
      method: "POST",
      body: JSON.stringify(customerData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setLoaded(true);
          if (result.status == 200) {
            // set value to redux
            // dispatch({ type: "STUDENT", payload: result.data });
            localStorage.setItem("customer", JSON.stringify(result.body));
            localStorage.setItem("jwt_customer_token", result.body.token);
            setSuccessMessage(result.message);
            history.push("/");
          } else if (result.status == 401) {
            setOtpErrors({
              ...otpErrors,
              message: result.message + ", OTP send yo your Email !",
            });
            setOtpVerification(true);
          } else {
            setLoginErrors({ ...result.error, message: result.message });
          }
        },
        (error) => {
          setLoaded(true);
          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };
  // Submit Handler
  const otpSubmitHandler = (evt) => {
    evt.preventDefault();
    setLoaded(false);

    // Check OTP
    console.log(otp, generatedOtp);
    if (otp == generatedOtp) {
      setSuccessMessage("Account Verified");
    } else {
      setOtpErrors({ ...otpErrors, otp: "Invalid OTP" });
      setLoaded(true);
      return;
    }

    fetch(`${Config.SERVER_URL}/customer/verify`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setLoaded(true);
          if (result.status == 200) {
            // set value to redux
            // dispatch({ type: "STUDENT", payload: result.data });
            localStorage.setItem("customer", JSON.stringify(result.body));
            localStorage.setItem("jwt_customer_token", result.body.token);
            setSuccessMessage(result.message);
            history.push("/");
          } else {
            setLoginErrors({ ...result.error, message: result.message });
          }
        },
        (error) => {
          setLoaded(true);
          setLoginErrors({ ...loginErrors, message: error.message });
        }
      );
  };

  return <div className=""></div>;
};

export default Login;
