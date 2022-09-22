import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";

const CreatePassword = () => {
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

  const [otpVerification, setOtpVerification] = useState(true);

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

  useEffect(() => {
    // if (customerInfo && customerInfo.jwtToken) {
    //   history.goBack();
    // }
  }, []);

  return (
    <>
      {/* <Header /> */}

      <main className="main pages">
        <div className="page-content pt-150 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div className="row">
                  <div className="col-lg-6 pr-30 d-none d-lg-block">
                    <img
                      className="border-radius-15"
                      src="/assets/imgs/page/login-1.png"
                      alt=""
                    />
                  </div>

                  {/* FORGOT PASSWORD */}

                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all bg-white">
                        <div className="heading_s1">
                          <h3 className="mb-5">FORGOT PASSWORD</h3>
                          <p className="mb-30">Enter Email to find Account</p>
                        </div>
                        <form method="post" onSubmit={submitHandler}>
                          <div className="form-group">
                            <input
                              type="text"
                              required=""
                              name="otp"
                              value={otp}
                              onChange={(evt) => setOtp(evt.target.value)}
                              placeholder="yourname@example.com"
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
                            <Link
                              to={"/account/login"}
                              className="text-muted"
                              href="#"
                            >
                              Need Login?
                            </Link>
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
                              Find Account
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
      {/* <Footer /> */}
    </>
  );
};

export default CreatePassword;
