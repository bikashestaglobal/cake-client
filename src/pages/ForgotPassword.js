import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const ForgotPassword = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  // Create State
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [otpSendLoading, setOtpSendLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();
    setLoading(true);

    fetch(`${Config.SERVER_URL}/customer/findAccount`, {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setLoading(false);

          console.log(result);
          if (result.status == 200) {
            localStorage.setItem(
              "verification",
              JSON.stringify({
                email: result.body.email,
                jwtToken: result.body.token,
                otp: parseInt(result.body.otp) * 2,
              })
            );
            toast.success("OTP Send Successfully");
            history.push("/verify-otp");
          } else {
            const errors = Object.keys(result.error);
            errors.forEach((key) => {
              toast.error(result.error[key]);
            });
            toast.error(result.message);
          }
        },
        (error) => {
          setLoading(false);
          toast.error(error.message);
        }
      );
  };

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
                  <div className="col-lg-6 pr-30 d-none d-lg-block"></div>

                  {/* FORGOT PASSWORD */}

                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all">
                        <div className="heading_s1">
                          <h3 className="mb-5">FORGOT PASSWORD</h3>
                          <p className="mb-30">Enter Email to find Account</p>
                        </div>
                        <form method="post" onSubmit={submitHandler}>
                          <div className="form-group">
                            <input
                              type="email"
                              required=""
                              name="otp"
                              value={email}
                              onChange={(evt) => setEmail(evt.target.value)}
                              placeholder="yourname@example.com"
                            />
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
                              disabled={loading && "disabled"}
                            >
                              {loading ? (
                                <>
                                  <Spinner /> Loading
                                </>
                              ) : (
                                "Find Account"
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
      {/* <Footer /> */}
    </>
  );
};

export default ForgotPassword;
