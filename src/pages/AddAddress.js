import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useHistory, Redirect } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { addressSchema } from "../yupSchemas";
import Footer from "../layouts/Footer";
import {
  validateNumber,
  validateText,
  validatePincode,
} from "../helpers/Validation";
const AddAddress = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  const { tab = "address" } = useParams();
  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    addressType: "HOME",
    pincode: "",
  });
  const [loaded, setLoaded] = useState(true);

  const [addressErrors, setaddressErrors] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    alternateMobile: "",
  });
  const [pincodes, setPincodes] = useState([]);
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  if (!customerInfo) {
    history.push("/account/login");
  }

  if (customerInfo && !customerInfo.jwtToken) {
    history.push("/account/login");
  }

  // Get Pincodes
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/pincode?limit=20000&skip=0`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setPincodes(data.body);
        } else {
          toast.error(data.message);
          console.log("Error: addAddress ", data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        console.log("Error: addAddress ", error.message);
      });
  }, []);

  const checkPinCode = (pincode) => {
    return pincodes.some((pin) => pincode == pin.pincode);
  };

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();
    setLoaded(false);

    // Check Pincode
    if (address.pincode && !checkPinCode(address.pincode)) {
      setaddressErrors({
        ...addressErrors,
        pincode: "This pin code is not available for delivery",
      });
      setLoaded(true);
      return;
    }
    fetch(`${Config.SERVER_URL}/customer/address`, {
      method: "POST",
      body: JSON.stringify(address),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo.jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setLoaded(true);
          if (result.status == 200) {
            toast.success(result.message);
            history.goBack();
          } else {
            toast.error(result.message);
            setaddressErrors({ ...result.error, message: result.message });
          }
        },
        (error) => {
          toast.error(error.message);
          setLoaded(true);
          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // Check customer is logedin or not

  const initialValues = {
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    addressType: "HOME",
    pincode: "",
  };

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

      // Check Pincode
      if (values.pincode && !checkPinCode(values.pincode)) {
        helpers.setErrors({
          pincode: "This pin code is not available for delivery",
        });
        setLoaded(true);
        return;
      }

      fetch(Config.SERVER_URL + "/customer/address", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${customerInfo.jwtToken}`,
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setLoaded(true);
            if (result.status == 200) {
              // set value to global state variable
              toast.success(result.message);
              history.goBack();
            } else {
              helpers.setErrors(result.error);
            }
          },
          (error) => {
            toast.error(error.message);
            setLoaded(true);
          }
        );
    },
    validationSchema: addressSchema,
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

  const handlePincodeValidation = (evt) => {
    // Validate Pincode
    // let value = evt.target.value.replace(/\D/g, "");
    // evt.target.value = value.slice(0, 6);
    handleChange(validatePincode(evt));

    // const found = pincodes.some((pin) => pin.pincode == value);

    // if (found) {
    //   setEnteredPincode({
    //     ...enteredPincode,
    //     message: "This pincode is available for delivery",
    //     error: false,
    //     pincode: value,
    //   });
    //   dispatch({
    //     type: "SHIPPING_METHOD",
    //     payload: {
    //       ...shippingDateTime,
    //       pincode: value,
    //     },
    //   });
    // } else {
    //   setEnteredPincode({
    //     ...enteredPincode,
    //     message: "Delivery is not available in this pincode",
    //     error: true,
    //     pincode: value,
    //   });
    // }
  };

  return (
    <>
      <main className="main pages">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <a href="index.html" rel="nofollow">
                <i className="fa fa-home mr-5"></i>Home
              </a>
              <span></span> Pages <span></span> My Account
            </div>
          </div>
        </div>
        <div className="page-content pt-30 pb-30">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 m-auto">
                <div className="row">
                  <div className="col-md-3">
                    <div className="dashboard-menu">
                      <ul className="nav flex-column" role="tablist">
                        {/* Dashboard */}
                        <li className="nav-item">
                          <Link
                            className={
                              tab == "dashboard"
                                ? "nav-link active"
                                : "nav-link"
                            }
                            id="dashboard-tab"
                            data-bs-toggle="tab"
                            to="/account/my-account/dashboard"
                            onClick={(evt) =>
                              history.push("/account/my-account/dashboard")
                            }
                            role="tab"
                            aria-controls="dashboard"
                            aria-selected={tab == "dashboard" ? true : false}
                          >
                            <i className="fa fa-cog mr-10"></i>
                            Dashboard
                          </Link>
                        </li>

                        {/* Wallet */}
                        <li className="nav-item">
                          <Link
                            className={
                              tab == "wallet" ? "nav-link active" : "nav-link"
                            }
                            id="wallet-tab"
                            data-bs-toggle="tab"
                            to="/account/my-account/wallet"
                            onClick={(evt) =>
                              history.push("/account/my-account/wallet")
                            }
                            role="tab"
                            aria-controls="wallet"
                            aria-selected={tab == "wallet" ? true : false}
                          >
                            <i className="fa fa-inr mr-10"></i>
                            Wallet
                          </Link>
                        </li>
                        {/* Orders */}
                        <li className="nav-item">
                          <Link
                            className={
                              tab == "orders" ? "nav-link active" : "nav-link"
                            }
                            id="orders-tab"
                            data-bs-toggle="tab"
                            to="#orders"
                            onClick={(evt) =>
                              history.push("/account/my-account/orders")
                            }
                            role="tab"
                            aria-controls="orders"
                            aria-selected="false"
                          >
                            <i className="fa fa-tag mr-10"></i>Orders
                          </Link>
                        </li>

                        {/* Wishlists */}
                        <li className="nav-item">
                          <Link
                            className={
                              tab == "wishlists"
                                ? "nav-link active"
                                : "nav-link"
                            }
                            id="wishlists-tab"
                            data-bs-toggle="tab"
                            to="#wishlists"
                            onClick={(evt) =>
                              history.push("/account/my-account/wishlists")
                            }
                            role="tab"
                            aria-controls="wishlists"
                            aria-selected="false"
                          >
                            <i className="fa fa-heart mr-10"></i>Wishlists
                          </Link>
                        </li>
                        {/* <li className="nav-item">
                        <Link
                          className={
                            tab == "track-order"
                              ? "nav-link active"
                              : "nav-link"
                          }
                          id="track-orders-tab"
                          data-bs-toggle="tab"
                          onClick={(evt) =>
                            history.push("/account/my-account/track-order")
                          }
                          to="#track-orders"
                          role="tab"
                          aria-controls="track-orders"
                          aria-selected="true"
                        >
                          <i className="fa fa-map-marker mr-10"></i>
                          Track Your Order
                        </Link>
                      </li> */}

                        {/* Address */}
                        <li className="nav-item">
                          <Link
                            className={
                              tab == "address" ? "nav-link active" : "nav-link"
                            }
                            id="address-tab"
                            data-bs-toggle="tab"
                            to="#address"
                            onClick={(evt) =>
                              history.push("/account/my-account/address")
                            }
                            role="tab"
                            aria-controls="address"
                            aria-selected="false"
                          >
                            <i className="fa fa-home mr-10"></i>My Address
                          </Link>
                        </li>

                        {/* Account Details */}
                        <li className="nav-item">
                          <Link
                            className={
                              tab == "account-detail"
                                ? "nav-link active"
                                : "nav-link"
                            }
                            id="account-detail-tab"
                            data-bs-toggle="tab"
                            to="#account-detail"
                            onClick={(evt) =>
                              history.push("/account/my-account/account-detail")
                            }
                            role="tab"
                            aria-controls="account-detail"
                            aria-selected="false"
                          >
                            <i className="fa fa-user mr-10"></i>Account details
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="tab-content account dashboard-content pl-20">
                      {/* Account Details */}
                      <div
                        className={"tab-pane fade active show"}
                        id="account-detail"
                        role="tabpanel"
                        aria-labelledby="account-detail-tab"
                      >
                        <div className="card">
                          <div className="card-header">
                            <h5>Add Address</h5>
                          </div>
                          <div className="card-body">
                            <form
                              method="post"
                              name="enq"
                              onSubmit={handleSubmit}
                            >
                              <div className="row">
                                {/* Name */}
                                <div className="form-group col-md-6">
                                  <label>
                                    Name <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    name="name"
                                    className={
                                      addressErrors.name
                                        ? "red-border form-control"
                                        : "form-control"
                                    }
                                    onChange={handleNameValidation}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    placeholder="Name"
                                  />
                                  {errors.name && touched.name ? (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {errors.name}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* Mobile */}
                                <div className="form-group col-md-6">
                                  <label>
                                    Mobile Number
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    className={
                                      addressErrors.mobile
                                        ? "red-border form-control"
                                        : "form-control"
                                    }
                                    name="mobile"
                                    onChange={handleMobileValidation}
                                    onBlur={handleBlur}
                                    value={values.mobile}
                                    placeholder="Mobile"
                                  />
                                  {errors.mobile && touched.mobile ? (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {errors.mobile}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* Alternative Mobile */}
                                <div className="form-group col-md-6">
                                  <label>
                                    Alternative Mobile Number
                                    <span className="required"></span>
                                  </label>
                                  <input
                                    type="tel"
                                    className={
                                      addressErrors.alternateMobile
                                        ? "red-border form-control"
                                        : "form-control"
                                    }
                                    onChange={handleMobileValidation}
                                    onBlur={handleBlur}
                                    name={"alternateMobile"}
                                    value={values.alternateMobile}
                                    placeholder="Alternate Mobile"
                                  />
                                  {errors.alternateMobile &&
                                  touched.alternateMobile ? (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {errors.alternateMobile}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* Address */}
                                <div className="form-group col-md-6">
                                  <label>
                                    Address
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    className={
                                      addressErrors.address
                                        ? "red-border form-control"
                                        : "form-control"
                                    }
                                    name="address"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.address}
                                    placeholder="address"
                                  />
                                  {errors.address && touched.address ? (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {errors.address}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* Landmark */}
                                <div className="form-group col-md-6">
                                  <label>
                                    Landmark
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    className={
                                      addressErrors.landmark
                                        ? "red-border form-control"
                                        : "form-control"
                                    }
                                    name="landmark"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.landmark}
                                    placeholder="Landmark"
                                  />
                                  {errors.landmark && touched.landmark ? (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {errors.landmark}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* City */}
                                <div className="form-group col-md-6">
                                  <label>
                                    City
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    required=""
                                    type="text"
                                    className={
                                      addressErrors.city
                                        ? "red-border form-control"
                                        : "form-control"
                                    }
                                    name="city"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.city}
                                    placeholder="city"
                                  />
                                  {errors.city && touched.city ? (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {errors.city}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* Address Type */}
                                <div className="col-md-6">
                                  <label className="col-md-12">
                                    Address Type
                                    <span className="required">*</span>
                                  </label>
                                  <div className="form-check form-check-inline px-4">
                                    <input
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className="form-check-input"
                                      type="radio"
                                      checked={
                                        values.addressType == "HOME"
                                          ? "checked"
                                          : ""
                                      }
                                      name="addressType"
                                      id="home"
                                      value="HOME"
                                    />
                                    <label
                                      className="form-check-label"
                                      for="home"
                                    >
                                      HOME
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      checked={
                                        values.addressType == "OFFICE"
                                          ? "checked"
                                          : ""
                                      }
                                      className="form-check-input"
                                      type="radio"
                                      name="addressType"
                                      id="office"
                                      value="OFFICE"
                                    />
                                    <label
                                      className="form-check-label"
                                      for="office"
                                    >
                                      OFFICE
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      checked={
                                        values.addressType == "OTHER"
                                          ? "checked"
                                          : ""
                                      }
                                      className="form-check-input"
                                      type="radio"
                                      name="addressType"
                                      id="other"
                                      value="OTHER"
                                    />
                                    <label
                                      className="form-check-label"
                                      for="other"
                                    >
                                      OTHER
                                    </label>
                                  </div>

                                  <div className="col-md-12">
                                    {errors.addressType &&
                                    touched.addressType ? (
                                      <p
                                        className="text-danger"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {errors.addressType}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>

                                {/* Pincode */}
                                <div className="form-group col-md-6">
                                  <label>
                                    Pincode
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    name="pincode"
                                    className={
                                      addressErrors.pincode
                                        ? "red-border form-control"
                                        : "form-control"
                                    }
                                    onChange={handlePincodeValidation}
                                    onBlur={handleBlur}
                                    value={values.pincode}
                                    placeholder="Pincode"
                                    onFocus={(evt) =>
                                      setaddressErrors({
                                        ...addressErrors,
                                        pincode: "",
                                      })
                                    }
                                  />
                                  {errors.pincode && touched.pincode ? (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {errors.pincode}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                <div className="col-md-12">
                                  <button
                                    type="submit"
                                    className="btn btn-fill-out btn-block hover-up font-weight-bold"
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
                                    Add Address
                                  </button>
                                </div>
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
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AddAddress;
