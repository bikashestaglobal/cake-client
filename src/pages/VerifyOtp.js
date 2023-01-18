import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  // Create State

  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [resendOtpLoading, setresendOtpLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpErrors, setOtpErrors] = useState("");

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();
    setOtpVerificationLoading(true);

    // Verify otp first
    if (!otp) {
      setOtpErrors("OTP is required");
      setOtpVerificationLoading(false);
      return;
    } else if (otp.length <= 3) {
      setOtpErrors("OTP must be 4 digits");

      setOtpVerificationLoading(false);
      return;
    }

    // Get server otp
    const verificationStr = localStorage.getItem("verification");
    const verification = JSON.parse(verificationStr);
    if (!verification?.otp) {
      toast.warning("Please Login/Register first");
      history.goBack();
      return;
    }
    const serverOtp = verification.otp;

    if (parseInt(serverOtp) / 2 != otp) {
      setOtpErrors("You Entered Wrong OTP");
      setOtpVerificationLoading(false);
      return;
    } else {
      toast.success("OTP Verified");
      history.push("/create-new-password");
    }
  };

  // resend Otp handler
  const resendOtpHandler = async (evt) => {
    evt.preventDefault();
    setresendOtpLoading(true);

    // get the verification str
    const verificationStr = localStorage.getItem("verification");
    const verification = JSON.parse(verificationStr);
    if (!verification?.email) {
      toast.warning("Please Login/Register first");
      history.goBack();
      return;
    }

    // resend otp
    try {
      const response = await fetch(
        `${Config.SERVER_URL}/customer/findAccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: verification.email }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        localStorage.setItem(
          "verification",
          JSON.stringify({
            email: data.body.email,
            jwtToken: data.body.token,
            otp: parseInt(data.body.otp) * 2,
          })
        );
        toast.success("OTP Send Successfully");
      } else {
        toast.error(data.message);
      }
      setresendOtpLoading(false);
    } catch (err) {
      toast.error(err.message);
      setresendOtpLoading(false);
    }
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
        <div
          className="page-content loginSec"
          style={{ background: `url('/assets/imgs/img18.jpg') 0 0 no-repeat` }}
        >
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div className="row">
                  <div className="col-lg-6 pr-30 d-none d-lg-block"></div>

                  {/* ENTER OTP */}

                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all">
                        <div className="heading_s1">
                          <h3 className="mb-5">Enter OTP</h3>
                        </div>
                        <form method="post" onSubmit={submitHandler}>
                          <div className="form-group">
                            <input
                              type="number"
                              name="otp"
                              onFocus={() => {
                                setOtpErrors("");
                              }}
                              value={otp}
                              onChange={(evt) => {
                                setOtpErrors("");
                                setOtp(evt.target.value);
                              }}
                              placeholder="Enter OTP"
                              className={otpErrors ? "red-border" : ""}
                            />
                            <p className="bg-danger rounded-3 mt-1 px-3">
                              {otpErrors}
                            </p>
                          </div>

                          <div className="login_footer form-group mb-50">
                            <div className="chek-form"></div>
                            <Link
                              to={"/account/login"}
                              className="text-muted"
                              onClick={resendOtpHandler}
                            >
                              Didn't get OTP?{" "}
                              {resendOtpLoading ? (
                                <>
                                  <Spinner /> Loading
                                </>
                              ) : (
                                " Resend Now."
                              )}
                            </Link>
                          </div>
                          <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-heading btn-block hover-up"
                              name="login"
                              disabled={otpVerificationLoading && "disabled"}
                            >
                              {otpVerificationLoading && <Spinner />}
                              Verify OTP
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

export default VerifyOtp;
