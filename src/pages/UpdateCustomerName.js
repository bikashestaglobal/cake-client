import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { updateName } from "../yupSchemas";
import Footer from "../layouts/Footer";
import { validateText } from "../helpers/Validation";

const UpdateCustomerName = (props) => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  const [timer, setTimer] = useState(30);
  const token = history?.location?.state?.token;
  if (!token) {
    // history.goBack();
  }

  // Create State
  const [loaded, setLoaded] = useState(true);

  const initialValues = { name: "" };

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

      fetch(Config.SERVER_URL + "/customer/updateName", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    validationSchema: updateName,
  });

  const handleNameValidation = (event) => {
    // const value = event.target.value.replace(/[^a-zA-Z ]+|(?<= ) +/g, "");

    // event.target.value = value;
    handleChange(validateText(event));
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

                  {/* ENTER NAME */}
                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all">
                        <div className="heading_s1">
                          <h5 className="text-light mb-3">
                            Welcome to TheCakeInc
                          </h5>
                          <h3 className="mb-3">Please Enter Your Name</h3>
                        </div>
                        <form method="post" onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input
                              type="text"
                              required=""
                              name="name"
                              value={values.name}
                              onChange={handleNameValidation}
                              onBlur={handleBlur}
                              placeholder="Enter name"
                              className={
                                touched.name && errors.name ? "red-border" : ""
                              }
                            />
                            {touched.name && errors.name ? (
                              <p className={"form-error mt-1"}>{errors.name}</p>
                            ) : null}
                          </div>

                          <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-heading btn-block hover-up"
                              name="login"
                              disabled={!loaded && "disabled"}
                            >
                              {!loaded && <Spinner />}
                              Continue
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

export default UpdateCustomerName;
