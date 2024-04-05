import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { registrationSchema } from "../yupSchemas";
import Footer from "../layouts/Footer";
import { validateNumber } from "../helpers/Validation";

const Login = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();

  // Create State
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    if (state.jwtToken) {
      history.goBack();
    }
  }, []);

  // Scroll to view
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  const initialValues = { mobile: "", privacyPolicy: true };

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
              // set value to global state variable
              // dispatch({ type: "CUSTOMER", payload: result.body.token });
              // localStorage.setItem(
              //   "customerInfo",
              //   JSON.stringify({
              //     ...state,
              //     jwtToken: result.body.token,
              //   })
              // );
              history.push({
                pathname: "/account/verifyLoginOTP",
                state: { mobile: values.mobile },
              });
              toast.success(result.message);
              // history.goBack();
            } else if (result.status == 401) {
              // Need Varification
              // localStorage.setItem(
              //   "verification",
              //   JSON.stringify({
              //     mobile: mobile,
              //     otp: parseInt(result.body.otp) * 2,
              //   })
              // );
              // setOtpVerification(true);
              toast.error(result.message);
              if (result.error) helpers.setErrors(result.error);
            } else {
              toast.error(result.message);
              if (result.error) helpers.setErrors(result.error);
            }
          },
          (error) => {
            setLoaded(true);
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

                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all">
                        <div className="heading_s1">
                          <h3 className="mb-3">Login or Signup Your Account</h3>
                          {/* <p className="mb-30">
                            Don't have an account?
                            <Link to="/account/register" className="Linktext">
                              Create Account
                            </Link>
                          </p> */}
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

                          {/* <div className="login_footer form-group mb-50">
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
                              className="text-white font-weight-bold"
                              to={"/forgot-password"}
                              href="#"
                            >
                              Forgot password?
                            </Link>
                          </div> */}
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
