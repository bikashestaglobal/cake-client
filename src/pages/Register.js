import React, { useEffect, useState, useContext } from "react";

import { Link, useHistory } from "react-router-dom";
import Config from "../config/Config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useFormik } from "formik";
import { registrationSchema } from "../yupSchemas";
import Footer from "../layouts/Footer";
import { validateNumber, validateText } from "../helpers/Validation";

const Register = () => {
  const history = useHistory();
  // Create State
  const [isMobileExists, setIsMobileExists] = useState(false);
  const [loaded, setLoaded] = useState(true);

  const initialValues = {
    name: "",
    mobile: "",
    privacyPolicy: "",
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
              // toast.success(result.message);
              history.push({
                pathname: "/account/verifyAccount",
                state: { mobile: values.mobile },
              });
            } else {
              const error = result.error;
              if (error) helpers.setErrors(error);
              toast.error(result.message);
            }
          },
          (error) => {
            setLoaded(true);
            toast.error(error.message);
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
                                errors.name && touched.name ? "red-border" : ""
                              }
                            />
                            {errors.name && touched.name ? (
                              <p className={"form-error mt-1"}>{errors.name}</p>
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

export default Register;
