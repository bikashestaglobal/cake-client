import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { otpSchema } from "../yupSchemas";
import Footer from "../layouts/Footer";
import { validateOTP } from "../helpers/Validation";

const VerifyLoginOTP = (props) => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  const [timer, setTimer] = useState(30);
  const mobileNumber = history?.location?.state?.mobile;
  if (!mobileNumber) {
    // history.goBack();
  }

  // Create State
  const [loaded, setLoaded] = useState(true);
  const [otpSendLoading, setOtpSendLoading] = useState(false);

  // Resend OTP
  const resendOTPHandler = (evt) => {
    evt.preventDefault();
    setOtpSendLoading(true);

    fetch(`${Config.SERVER_URL}/customer/findAccountWithMobile`, {
      method: "POST",
      body: JSON.stringify({ mobile: mobileNumber }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setOtpSendLoading(false);
          if (result.status == 200) {
            toast.success(result.message);
            setTimer(30);
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

  const initialValues = { otp: "" };

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

      fetch(Config.SERVER_URL + "/customer/verifyLoginOTP", {
        method: "POST",
        body: JSON.stringify({
          mobile: mobileNumber,
          otp: values.otp,
        }),
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

              if (!result.body.name) {
                history.replace({
                  pathname: "/account/updateName",
                  state: { token: result.body.token },
                });
                return;
              }

              dispatch({ type: "CUSTOMER", payload: result.body.token });
              localStorage.setItem(
                "customerInfo",
                JSON.stringify({
                  ...state,
                  jwtToken: result.body.token,
                })
              );
              toast.success(result.message);
              // setOtpVerification(true);
              history.go(-2);
            } else {
              //   const errors = Object.keys(result.error);
              //   errors.forEach((key) => {
              //     toast.error(result.error[key]);
              //   });
              toast.error(result.message);
              helpers.setErrors(result.error);
            }
          },
          (error) => {
            setLoaded(true);
          }
        );
    },
    validationSchema: otpSchema,
  });

  const handleOtpValidation = (event) => {
    // const value = event.target.value.replace(/\D/g, "");
    // if (value.length > 4) event.target.value = value.slice(0, 4);
    // else event.target.value = value;
    handleChange(validateOTP(event));
  };

  // for timer
  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer]);

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

                  {/* OTP VERIFICATION */}
                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all">
                        <div className="heading_s1">
                          <h3 className="mb-5">OTP Verification</h3>
                          <p className="mb-30">
                            An 'OTP' has been sent to your 'Mobile Number'.
                          </p>
                        </div>
                        <form method="post" onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input
                              type="tel"
                              required=""
                              name="otp"
                              value={values.otp}
                              onChange={handleOtpValidation}
                              onBlur={handleBlur}
                              placeholder="OTP *"
                              className={
                                touched.otp && errors.otp ? "red-border" : ""
                              }
                            />
                            {touched.otp && errors.otp ? (
                              <p className={"form-error mt-1"}>{errors.otp}</p>
                            ) : null}
                          </div>

                          <div className="login_footer form-group mb-50">
                            <div className="chek-form"></div>
                            {timer <= 0 ? (
                              <a
                                className="text-muted"
                                onClick={resendOTPHandler}
                              >
                                {otpSendLoading ? (
                                  <>
                                    Loading <Spinner />
                                  </>
                                ) : (
                                  "Resend OTP?"
                                )}
                              </a>
                            ) : (
                              <a className="text-muted">
                                Resend OTP in {timer}s
                              </a>
                            )}
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

export default VerifyLoginOTP;
