import React, { useEffect, useState, useContext } from "react";

import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useFormik } from "formik";
import { registrationSchema } from "../yupSchemas";
import { validateNumber, validateText } from "../helpers/Validation";

const Register = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  // Create State
  const [mobile, setMobile] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState(true);
  const [isMobileExists, setIsMobileExists] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [otpSendLoading, setOtpSendLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState();
  const [regErrors, setRegErrors] = useState({
    name: "",
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
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));

  // handleIsMobileExists
  const handleIsMobileExists = async () => {
    try {
      const response = await fetch(
        `${Config.SERVER_URL}/customer/isMobileExists`,
        {
          method: "POST",
          body: JSON.stringify({ mobile: mobile }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        if (data?.body == true) {
          setRegErrors({
            ...regErrors,
            mobile: "Mobile Number is Already Registered",
          });
          setIsMobileExists(true);
        } else {
          setRegErrors({
            ...regErrors,
            mobile: "",
          });
          setIsMobileExists(false);
        }
      } else {
        console.log(data.body);
        setIsMobileExists(false);
      }
    } catch (error) {
      console.log(error.message);
      setIsMobileExists(false);
    }
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
      body: JSON.stringify({ email: verification.email }),
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
                email: result.body.email,
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

  const initialValues = {
    name: "",
    mobile: "",
    password: "",
    privacyPolicy: true,
  };

  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    setFieldError,
  } = useFormik({
    initialValues: initialValues,
    onSubmit: (values, helpers) => {
      setLoaded(false);
      fetch(Config.SERVER_URL + "/customer/register", {
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
              toast.success(result.message);
              localStorage.setItem(
                "verification",
                JSON.stringify({
                  email: result.body.email,
                  mobile: result.body.mobile,
                  otp: parseInt(result.otp) * 2,
                })
              );

              dispatch({ type: "CUSTOMER", payload: result.body.token });
              localStorage.setItem(
                "customerInfo",
                JSON.stringify({
                  ...state,
                  jwtToken: result.body.token,
                })
              );
              toast.success(result.message);
              // history.push("/");
              history.goBack();

              // console.log(result.body);
              // history.push("/account/login");
              // setOtpVerification(true);
            } else if (result.status == 401) {
              const error = result.error;
              helpers.setErrors(error);
              // need verification
              // toast.warning(result.message);
              // localStorage.setItem(
              //   "verification",
              //   JSON.stringify({
              //     email: result.body.email,
              //     mobile: result.body.mobile,
              //     otp: parseInt(result.otp) * 2,
              //   })
              // );
              // setOtpVerification(true);
            } else if (result.status == 302) {
              // need login
              toast.success(result.message);
              history.push("/account/login");
            } else {
              const error = result.error;
              helpers.setErrors(error);
              // const keys = Object.keys(error);
              // keys.forEach((key) => {
              //   toast.error(error[key]);
              // });
              // toast.error(result.message);
              // setRegErrors({ ...result.error, message: result.message });
            }
          },
          (error) => {
            setLoaded(true);
            //   M.toast({ html: error, classes: "bg-danger" });
          }
        );
    },
    validationSchema: registrationSchema,
  });

  const handleMobileValidation = (event) => {
    // const value = event.target.value.replace(/\D/g, "");
    // if (value.length > 10) event.target.value = value.slice(0, 10);
    // else event.target.value = value;
    handleChange(validateNumber(event));
  };

  const handleNameValidation = (event) => {
    // let value = event.target.value.replace(/[^a-zA-Z ]+|(?<= ) +/g, "");
    // event.target.value = value;
    handleChange(validateText(event));
  };
  // scroll to top when user click back button
  // useEffect(() => {
  //   const handleScroll = () => {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   };

  //   window.addEventListener("popstate", handleScroll);

  //   return () => {
  //     window.removeEventListener("popstate", handleScroll);
  //   };
  // }, []);
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
              <div class="col-lg-6 pr-30 d-none d-lg-block"></div>
              <div class="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div class="row">
                  <div class="col-lg-6 pr-30 d-none d-lg-block"></div>
                  {!otpVerification && (
                    <div class="col-lg-6 col-md-8">
                      <div class="login_wrap widget-taber-content ">
                        <div class="padding_eight_all">
                          <div class="heading_s1">
                            <h3 class="mb-5">Create an Account</h3>
                            <p class="mb-30">
                              Already have an account?
                              <Link className={"Linktext"} to="/account/login">
                                Login
                              </Link>
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
                          <form method="post" onSubmit={handleSubmit}>
                            <div class="form-group">
                              <input
                                type="text"
                                required=""
                                name="name"
                                placeholder="Name"
                                onBlur={handleBlur}
                                value={values.name}
                                onChange={handleNameValidation}
                                className={
                                  errors.name && touched.name
                                    ? "red-border"
                                    : ""
                                }
                              />
                              {errors.name && touched.name ? (
                                <p className={"form-error mt-1"}>
                                  {errors.name}
                                </p>
                              ) : null}
                            </div>

                            <div class="form-group">
                              <input
                                type="tel"
                                required=""
                                name="mobile"
                                placeholder="Mobile"
                                value={values.mobile}
                                onBlur={handleBlur}
                                onChange={handleMobileValidation}
                                className={
                                  errors.mobile && touched.mobile
                                    ? "red-border"
                                    : ""
                                }
                              />
                              {errors.mobile && touched.mobile ? (
                                <p className={"form-error mt-1"}>
                                  {errors.mobile}
                                </p>
                              ) : null}
                            </div>

                            {/* <div class="form-group">
                              <input
                                type="text"
                                required=""
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(evt) => setEmail(evt.target.value)}
                                className={regErrors.email ? "red-border" : ""}
                              />
                              {regErrors.email ? (
                                <p className={"form-error mt-1"}>
                                  {regErrors.email}
                                </p>
                              ) : null}
                            </div> */}

                            <div class="form-group">
                              <input
                                required=""
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={
                                  errors.password && touched.password
                                    ? "red-border"
                                    : ""
                                }
                              />
                              {errors.password && touched.password ? (
                                <p className={"form-error mt-1"}>
                                  {errors.password}
                                </p>
                              ) : null}
                            </div>

                            <div class="login_footer form-group mb-30">
                              <div class="chek-form">
                                <div class="custome-checkbox">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="privacyPolicy"
                                    checked={values.privacyPolicy}
                                    id="terms-policy"
                                    value={values.privacyPolicy}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <label
                                    class="form-check-label"
                                    htmlFor="terms-policy"
                                  >
                                    <span>
                                      I agree to{" "}
                                      <Link to={"/privacy-policy"}>
                                        Privacy Policy.
                                      </Link>
                                    </span>
                                  </label>
                                  {errors.privacyPolicy &&
                                  touched.privacyPolicy ? (
                                    <p className={"form-error mt-1"}>
                                      {errors.privacyPolicy}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div class="form-group mb-30">
                              <button
                                type="submit"
                                className="btn btn-fill-out btn-block hover-up font-weight-bold"
                                name="login"
                                disabled={
                                  (!loaded || isMobileExists) && "disabled"
                                }
                              >
                                {!loaded && (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}{" "}
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
                              <a
                                className="text-muted"
                                onClick={resendOTPHandler}
                              >
                                {otpSendLoading ? (
                                  <>
                                    <Spinner /> Loading
                                  </>
                                ) : (
                                  "Resend OTP?"
                                )}
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

                  {/* <div class="col-lg-6 pr-30 d-none d-lg-block">
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
                  </div> */}
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
