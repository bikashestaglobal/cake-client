import React, { useEffect, useState, useContext } from "react";
import Footer from "../Footer";
import Header from "../Header";
import { Link, useHistory } from "react-router-dom";
import Config from "../Config";
import { CustomerContext } from "../Routes";

const Login = () => {
  const { state, dispatch } = useContext(CustomerContext);
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

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));

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
            dispatch({ type: "CUSTOMER", payload: result.body.token });
            localStorage.setItem(
              "customerInfo",
              JSON.stringify({
                ...state,
                jwtToken: result.body.token,
              })
            );
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
            dispatch({ type: "CUSTOMER", payload: result.body.token });
            localStorage.setItem(
              "customerInfo",
              JSON.stringify({
                ...state,
                jwtToken: result.body.token,
              })
            );
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

  useEffect(() => {
    if (customerInfo && customerInfo.jwtToken) {
      history.goBack();
    }
  }, []);

  return (
    <>
      {/* <Header /> */}

      <main className="main pages">
        <div
          className="page-content loginSec"
          style={{ background: `url('/assets/imgs/img18.jpg') 0 0 no-repeat` }}
        >
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div className="row">
                  <div class="col-lg-6 pr-30 d-none d-lg-block"></div>

                  {!otpVerification && (
                    <div className="col-lg-6 col-md-8">
                      <div className="login_wrap widget-taber-content background-white">
                        <div className="padding_eight_all">
                          <div className="heading_s1">
                            <h3 className="mb-5">Login</h3>
                            <p className="mb-30">
                              Don't have an account?
                              <Link to="/account/register">Create here</Link>
                            </p>

                            {loginErrors.message && (
                              <div className="alert alert-danger">
                                {loginErrors.message}
                              </div>
                            )}

                            {successMessage && (
                              <div className="alert alert-success">
                                {successMessage}
                              </div>
                            )}
                          </div>
                          <form method="post" onSubmit={submitHandler}>
                            <div className="form-group">
                              <input
                                type="text"
                                required=""
                                name="email"
                                onChange={(evt) => setEmail(evt.target.value)}
                                placeholder="Username or Email *"
                                className={
                                  loginErrors.email ? "red-border" : ""
                                }
                                onFocus={(evt) =>
                                  setLoginErrors({
                                    ...loginErrors,
                                    email: "",
                                    message: "",
                                  })
                                }
                              />
                              <span className="error">{loginErrors.email}</span>
                            </div>
                            <div className="form-group">
                              <input
                                required=""
                                type="password"
                                name="password"
                                className={
                                  loginErrors.password ? "red-border" : ""
                                }
                                onChange={(evt) =>
                                  setPassword(evt.target.value)
                                }
                                placeholder="Your password *"
                                onFocus={(evt) =>
                                  setLoginErrors({
                                    ...loginErrors,
                                    password: "",
                                    message: "",
                                  })
                                }
                              />
                              <span className="error">
                                {loginErrors.password}
                              </span>
                            </div>

                            <div className="login_footer form-group mb-50">
                              <div className="chek-form">
                                <div className="custome-checkbox">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="checkbox"
                                    id="exampleCheckbox1"
                                    value=""
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="exampleCheckbox1"
                                  >
                                    <span>Remember me</span>
                                  </label>
                                </div>
                              </div>
                              <Link
                                className="text-muted"
                                to={"/forgot-password"}
                                href="#"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn btn-fill-out btn-block hover-up font-weight-bold"
                                name="login"
                                disabled={!loaded && "disabled"}
                              >
                                {!loaded && (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                                {"  "}
                                Log in
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OTP VERIFICATION */}

                  {otpVerification && (
                    <div className="col-lg-6 col-md-8">
                      <div className="login_wrap widget-taber-content background-white">
                        <div className="padding_eight_all bg-white">
                          <div className="heading_s1">
                            <h3 className="mb-5">OTP VERIFICATION</h3>
                            <p className="mb-30">Need to verify your Account</p>
                            {otpErrors.message && (
                              <div className="alert alert-danger">
                                {otpErrors.message}
                              </div>
                            )}

                            {successMessage && (
                              <div className="alert alert-success">
                                {successMessage}
                              </div>
                            )}
                          </div>
                          <form method="post" onSubmit={otpSubmitHandler}>
                            <div className="form-group">
                              <input
                                type="text"
                                required=""
                                name="otp"
                                value={otp}
                                onChange={(evt) => setOtp(evt.target.value)}
                                placeholder="OTP *"
                                className={otpErrors.email ? "red-border" : ""}
                                onFocus={() =>
                                  setOtpErrors({
                                    ...otpErrors,
                                    otp: "",
                                    message: "",
                                  })
                                }
                              />
                              <span className="error">{otpErrors.otp}</span>
                            </div>

                            <div className="login_footer form-group mb-50">
                              <div className="chek-form"></div>
                              <a className="text-muted" href="#">
                                Resend OTP?
                              </a>
                            </div>
                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn btn-heading btn-block hover-up"
                                name="login"
                                disabled={!loaded && "disabled"}
                              >
                                {!loaded && (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                                Verify
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Login;
