import React, { useEffect, useState, useContext, useRef } from "react";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { loginSchema } from "../yupSchemas";
import { validateNumber } from "../helpers/Validation";

const Login = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();

  // Create State
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [generatedOtp, setGeneratedOtp] = useState();
  const [otpSendLoading, setOtpSendLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpErrors, setOtpErrors] = useState({
    otp: "",
    message: "",
  });

  const [otpVerification, setOtpVerification] = useState(false);

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));

  // Submit Handler
  const otpSubmitHandler = (evt) => {
    evt.preventDefault();
    setLoaded(false);

    // get OTP
    const verification = JSON.parse(localStorage.getItem("verification"));
    if (!verification) {
      toast.error("Please Fill the Form");
      setOtpVerification(false);
    }

    if (otp == parseInt(verification.otp) / 2) {
      toast.success("OTP Verified");
      localStorage.removeItem("verification");
    } else {
      toast.error("Invalid Otp");
      setLoaded(true);
      return;
    }

    fetch(`${Config.SERVER_URL}/customer/verify`, {
      method: "POST",
      body: JSON.stringify({ mobile: verification.mobile }),
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
            toast.success(result.message);
            history.push("/");
          } else {
            const errors = Object.keys(result.error);
            errors.forEach((key) => {
              toast.error(result.error[key]);
            });
            toast.error(result.message);
          }
        },
        (error) => {
          setLoaded(true);
          toast.error(error.message);
        }
      );
  };

  // Resend OTP
  const resendOTPHandler = (evt) => {
    evt.preventDefault();
    setOtpSendLoading(true);

    // get Data
    const verification = JSON.parse(localStorage.getItem("verification"));
    if (!verification) {
      toast.error("Please Fill the Form");
      setOtpVerification(false);
    }

    fetch(`${Config.SERVER_URL}/customer/findAccount`, {
      method: "POST",
      body: JSON.stringify({ mobile: verification.mobile }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setOtpSendLoading(false);
          if (result.status == 200) {
            localStorage.setItem(
              "verification",
              JSON.stringify({
                mobile: result.body.mobile,
                otp: parseInt(result.body.otp) * 2,
              })
            );
            setGeneratedOtp(result.body.otp);
            toast.success("OTP Send Successfully");
          } else {
            const errors = Object.keys(result.error);
            errors.forEach((key) => {
              toast.error(result.error[key]);
            });
            toast.error(result.message);
          }
        },
        (error) => {
          setOtpSendLoading(false);
          toast.error(error.message);
        }
      );
  };

  useEffect(() => {
    if (state.jwtToken) {
      history.goBack();
    }
  }, []);

  // Scroll to view
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  const initialValues = { mobile: "", password: "" };

  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    setErrors,
  } = useFormik({
    initialValues,

    onSubmit: (values, helpers) => {
      setLoaded(false);

      fetch(Config.SERVER_URL + "/customer/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setLoaded(true);
            if (result.status == 200) {
              // set value to global state variable
              dispatch({ type: "CUSTOMER", payload: result.body.token });
              localStorage.setItem(
                "customerInfo",
                JSON.stringify({
                  ...state,
                  jwtToken: result.body.token,
                })
              );
              toast.success(result.message);
              history.goBack();
            } else if (result.status == 401) {
              // Need Varification
              localStorage.setItem(
                "verification",
                JSON.stringify({
                  mobile: mobile,
                  otp: parseInt(result.body.otp) * 2,
                })
              );
              setOtpVerification(true);
            } else {
              helpers.setErrors(result.error);
            }
          },
          (error) => {
            setLoaded(true);
          }
        );
    },
    validationSchema: loginSchema,
  });

  const handleMobileValidation = (event) => {
    // const value = event.target.value.replace(/\D/g, "");
    // if (value.length > 10) event.target.value = value.slice(0, 10);
    // else event.target.value = value;
    handleChange(validateNumber(event));
  };

  // useEffect(() => {
  //   return history.listen((location) => {
  //     if (history.action === "POP") {
  //       history.go(-1);
  //     }
  //   });
  // }, [history]);

  // scroll to top when user click back button
  // useEffect(() => {
  //   const unlisten = history.listen(() => {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   });

  //   return () => {
  //     unlisten();
  //   };
  // }, [history]);

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
                              <Link to="/account/register" className="Linktext">
                                Create Account
                              </Link>
                            </p>
                          </div>
                          <form method="post" onSubmit={handleSubmit}>
                            <div className="form-group">
                              <input
                                type="tel"
                                name="mobile"
                                onChange={handleMobileValidation}
                                value={values.mobile}
                                onBlur={handleBlur}
                                placeholder="Your Mobile*"
                                className={
                                  touched.mobile && errors.mobile
                                    ? "red-border"
                                    : ""
                                }
                              />

                              {touched.mobile && errors.mobile ? (
                                <p className={"form-error mt-1"}>
                                  {errors.mobile}
                                </p>
                              ) : null}
                            </div>
                            <div className="form-group">
                              <input
                                required=""
                                type="password"
                                name="password"
                                className={
                                  errors.password && touched.password
                                    ? "red-border"
                                    : ""
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Your password *"
                              />
                              {errors.password && touched.password ? (
                                <p className={"form-error mt-1"}>
                                  {errors.password}
                                </p>
                              ) : null}
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
                              {/* <Link
                                className="text-white font-weight-bold"
                                to={"/forgot-password"}
                                href="#"
                              >
                                Forgot password?
                              </Link> */}
                            </div>
                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn btn-fill-out btn-block hover-up font-weight-bold"
                                name="login"
                                disabled={!loaded && "disabled"}
                              >
                                {loaded ? (
                                  "Log in"
                                ) : (
                                  <>
                                    <Spinner /> Loading
                                  </>
                                )}
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
                                className={otpErrors.mobile ? "red-border" : ""}
                                onFocus={() =>
                                  setOtpErrors({
                                    ...otpErrors,
                                    otp: "",
                                    message: "",
                                  })
                                }
                              />
                            </div>

                            <div className="login_footer form-group mb-50">
                              <div className="chek-form"></div>
                              <a
                                className="text-muted"
                                onClick={resendOTPHandler}
                              >
                                {otpSendLoading ? <Spinner /> : "Resend OTP?"}
                              </a>
                            </div>
                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn btn-heading btn-block hover-up"
                                name="login"
                                disabled={!loaded && "disabled"}
                              >
                                {!loaded && <Spinner />}
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
      <Footer />
    </>
  );
};

export default Login;
