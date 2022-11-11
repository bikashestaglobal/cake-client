import React, { useEffect, useState, useContext } from "react";

import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";

const Register = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  // Create State
  const [email, setEmail] = useState("bikashsinghak47@gmail.com");
  const [mobile, setMobile] = useState("9117162463");
  const [name, setName] = useState("Akash");
  const [password, setPassword] = useState("123456");
  const [loaded, setLoaded] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState(
    Math.floor(Math.random() * (9999 - 1000 + 1)) + 9999
  );
  const [regErrors, setRegErrors] = useState({
    name: "",
    email: "",
    mobile: "",
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
      mobile,
      name,
    };
    fetch(Config.SERVER_URL + "/customer/register", {
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
            toast.success(result.message);
            localStorage.setItem(
              "verification",
              JSON.stringify({
                email: result.body.email,
                mobile: result.body.mobile,
                otp: parseInt(result.otp) * 2,
              })
            );
            setOtpVerification(true);
          } else if (result.status == 401) {
            // need verification
            toast.warning(result.message);
            localStorage.setItem(
              "verification",
              JSON.stringify({
                email: result.body.email,
                mobile: result.body.mobile,
                otp: parseInt(result.otp) * 2,
              })
            );
            setOtpVerification(true);
          } else if (result.status == 302) {
            // need login
            toast.success(result.message);
            history.push("/account/login");
          } else {
            const error = result.error;
            const keys = Object.keys(error);
            keys.forEach((key) => {
              toast.error(error[key]);
            });
            // setRegErrors({ ...result.error, message: result.message });
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

    // get OTP
    const verification = JSON.parse(localStorage.getItem("verification"));
    if (!verification) {
      toast.error("Please Register First");
      setOtpVerification(false);
    }

    if (otp == parseInt(verification.otp) / 2) {
      toast.success("Account Verified");
      localStorage.removeItem("verification");
    } else {
      toast.error("Invalid Otp");
      setLoaded(true);
      return;
    }

    fetch(`${Config.SERVER_URL}/customer/verify`, {
      method: "POST",
      body: JSON.stringify({ email: verification.email }),
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
            const error = result.error;
            const keys = Object.keys(error);
            keys.forEach((key) => {
              toast.error(error[key]);
            });
          }
        },
        (error) => {
          setLoaded(true);
          toast.error(error.message);
        }
      );
  };

  return (
    <>
      {/* <Header /> */}
      <main class="main pages">
        <div
          className="page-content loginSec"
          style={{ background: `url('/assets/imgs/img18.jpg') 0 0 no-repeat` }}
        >
          <div class="container">
            <div class="row">
              <div class="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div class="row">
                  {!otpVerification && (
                    <div class="col-lg-6 col-md-8">
                      <div class="login_wrap widget-taber-content ">
                        <div class="padding_eight_all">
                          <div class="heading_s1">
                            <h3 class="mb-5">Create an Account</h3>
                            <p class="mb-30">
                              Already have an account?
                              <Link to="/account/login">Login</Link>
                            </p>
                            {/* {regErrors.message && (
                              <div className="alert alert-danger">
                                {regErrors.message}
                              </div>
                            )}

                            {successMessage && (
                              <div className="alert alert-success">
                                {successMessage}
                              </div>
                            )} */}
                          </div>
                          <form method="post" onSubmit={submitHandler}>
                            <div class="form-group">
                              <input
                                type="text"
                                required=""
                                name="username"
                                placeholder="Name"
                                value={name}
                                onChange={(evt) => setName(evt.target.value)}
                                className={regErrors.name ? "red-border" : ""}
                              />
                            </div>

                            <div class="form-group">
                              <input
                                type="text"
                                required=""
                                name="mobile"
                                placeholder="Mobile"
                                value={mobile}
                                onChange={(evt) => setMobile(evt.target.value)}
                                className={regErrors.mobile ? "red-border" : ""}
                              />
                            </div>

                            <div class="form-group">
                              <input
                                type="text"
                                required=""
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(evt) => setEmail(evt.target.value)}
                                className={regErrors.email ? "red-border" : ""}
                              />
                            </div>

                            <div class="form-group">
                              <input
                                required=""
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(evt) =>
                                  setPassword(evt.target.value)
                                }
                                className={
                                  regErrors.password ? "red-border" : ""
                                }
                              />
                            </div>

                            <div class="login_footer form-group mb-30">
                              <div class="chek-form">
                                <div class="custome-checkbox">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="checkbox"
                                    id="exampleCheckbox12"
                                    value=""
                                  />
                                  <label
                                    class="form-check-label"
                                    htmlFor="exampleCheckbox12"
                                  >
                                    <span>I agree to terms &amp; Policy.</span>
                                  </label>
                                </div>
                              </div>
                              {/* <!--   <a href="page-privacy-policy.html"><i class="fi-rs-book-alt mr-5 text-muted"></i>Lean more</a> --> */}
                            </div>
                            <div class="form-group mb-30">
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
                                Submit &amp; Register
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
                        <div className="padding_eight_all">
                          <div className="heading_s1">
                            <h3 className="mb-5">OTP VERIFICATION</h3>
                            <p className="mb-30">Need to verify your Account</p>
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
                              />
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

                  <div class="col-lg-6 pr-30 d-none d-lg-block">
                    <div class="card-login mt-115">
                      <a href="#" class="social-login facebook-login">
                        <img
                          src="assets/imgs/theme/icons/logo-facebook.svg"
                          alt=""
                        />
                        <span>Continue with Facebook</span>
                      </a>
                      <a href="#" class="social-login google-login">
                        <img
                          src="assets/imgs/theme/icons/logo-google.svg"
                          alt=""
                        />
                        <span>Continue with Google</span>
                      </a>
                      <a href="#" class="social-login apple-login">
                        <img
                          src="assets/imgs/theme/icons/logo-apple.svg"
                          alt=""
                        />
                        <span>Continue with Apple</span>
                      </a>
                    </div>
                  </div>
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

export default Register;
