import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const CreateNewPassword = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  // Create State
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [updating, setUpdating] = useState(false);

  // Submit Handler
  const submitHandler = async (evt) => {
    evt.preventDefault();
    setUpdating(true);

    // Check password
    if (formData.password != formData.confirmPassword) {
      toast.error("Passwords do not match");
      setUpdating(false);
      return;
    }
    // Check password length
    if (formData?.password?.length < 6) {
      toast.error("Passwords must be at least 6 characters long");
      setUpdating(false);
      return;
    }

    // Get Data from local storage
    const verificationStr = localStorage.getItem("verification");
    const verification = JSON.parse(verificationStr);
    if (!verification?.jwtToken) {
      toast.warning("Please Login/Register first");
      history.goBack();
      return;
    }
    const jwtToken = verification.jwtToken;
    // resend otp
    try {
      const response = await fetch(
        `${Config.SERVER_URL}/customer/updatePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ password: formData.password }),
        }
      );
      const data = await response.json();
      if (data.status == 200) {
        localStorage.removeItem("verification");
        toast.success(data.message);
        history.push("/account/login");
      } else {
        toast.error(data.message);
      }
      setUpdating(false);
    } catch (err) {
      toast.error(err.message);
      setUpdating(false);
    }
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

                  {/* Create new password */}

                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all">
                        <div className="heading_s1">
                          <h3 className="mb-5">Create New Password</h3>
                        </div>
                        <form method="post" onSubmit={submitHandler}>
                          <div className="form-group">
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(evt) => {
                                setFormData({
                                  ...formData,
                                  password: evt.target.value,
                                });
                              }}
                              placeholder="New Password"
                            />
                          </div>

                          <div className="form-group">
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(evt) => {
                                setFormData({
                                  ...formData,
                                  confirmPassword: evt.target.value,
                                });
                              }}
                              placeholder="Confirm Password"
                            />
                          </div>

                          <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-heading btn-block hover-up"
                              name="login"
                              disabled={updating && "disabled"}
                            >
                              {updating && <Spinner />}
                              Create Password
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

export default CreateNewPassword;
