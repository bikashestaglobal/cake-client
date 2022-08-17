import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { CustomerContext } from "../Routes";
import Config from "../Config";

const EditBillingAddress = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const { jwtToken } = state;
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  if (!customerInfo) {
    history.push("/account/login");
  }

  if (customerInfo && !customerInfo.jwtToken) {
    history.push("/account/login");
  }

  const { id } = useParams();
  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    address: "",
    email: "",
    city: "",
    pincode: "",
  });
  const [loaded, setLoaded] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [addressErrors, setaddressErrors] = useState({
    "billingAddress.name": "",
    "billingAddress.mobile": "",
    "billingAddress.email": "",
    "billingAddress.address": "",
    "billingAddress.city": "",
    "billingAddress.pincode": "",
  });

  // Get Profile
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/customer/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo ? customerInfo.jwtToken : ""}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            setAddress(result.body.billingAddress || {});
          } else {
            console.log(result);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();
    setLoaded(false);

    const updateData = {
      name: address.name,
      mobile: address.mobile,
      email: address.email,
      companyName: address.companyName,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
    };

    fetch(`${Config.SERVER_URL}/customer/profile`, {
      method: "PUT",
      body: JSON.stringify({ billingAddress: updateData }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setLoaded(true);
          if (result.status == 200) {
            // set value to redux
            toast.success(result.message);
            history.goBack();
          } else {
            toast.error(result.message);
            setaddressErrors({ ...result.error, message: result.message });
          }
        },
        (error) => {
          toast.success(error.message);
          setLoaded(true);
          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // Check customer is logedin or not
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/customer/address/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          if (result.status == 200) {
            setAddress(result.body);
          } else {
            console.log(result);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  return (
    <main className="main pages">
      <div className="page-header breadcrumb-wrap">
        <div className="container">
          <div className="breadcrumb">
            <a href="index.html" rel="nofollow">
              <i className="fi-rs-home mr-5"></i>Home
            </a>
            <span></span> Pages <span></span> My Account
          </div>
        </div>
      </div>
      <div className="page-content pt-150 pb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div className="row">
                <div className="col-md-3">
                  <div className="dashboard-menu">
                    <ul className="nav flex-column" role="tablist">
                      <li className="nav-item">
                        <Link
                          className={"nav-link"}
                          to="/account/my-account/dashboard"
                        >
                          <i className="fi-rs-settings-sliders mr-10"></i>
                          Dashboard
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={"nav-link"}
                          to="/account/my-account/orders"
                        >
                          <i className="fi-rs-shopping-bag mr-10"></i>Orders
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={"nav-link"}
                          to={"/account/my-account/track-order"}
                        >
                          <i className="fi-rs-shopping-cart-check mr-10"></i>
                          Track Your Order
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={"nav-link"}
                          to="/account/my-account/address"
                        >
                          <i className="fi-rs-marker mr-10"></i>My Address
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={"nav-link"}
                          id="account-detail-tab"
                          //   data-bs-toggle="tab"
                          to="/account/my-account/account-detail"
                        >
                          <i className="fi-rs-user mr-10"></i>Account details
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="#">
                          <i className="fi-rs-sign-out mr-10"></i>Logout
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
                          <h5>Edit Billing Address</h5>
                        </div>
                        <div className="card-body">
                          <form
                            method="post"
                            name="enq"
                            onSubmit={submitHandler}
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
                                    addressErrors["billingAddress.name"]
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setAddress({
                                      ...address,
                                      name: evt.target.value,
                                    })
                                  }
                                  value={address.name}
                                  placeholder="Name"
                                  onFocus={(evt) =>
                                    setaddressErrors({
                                      ...addressErrors,
                                      "billingAddress.name": "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {addressErrors["billingAddress.name"]}
                                </span>
                              </div>

                              {/* Mobile */}
                              <div className="form-group col-md-6">
                                <label>
                                  Mobile Number
                                  <span className="required">*</span>
                                </label>
                                <input
                                  className={
                                    addressErrors["billingAddress.mobile"]
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setAddress({
                                      ...address,
                                      mobile: evt.target.value,
                                    })
                                  }
                                  value={address.mobile}
                                  placeholder="Mobile"
                                  onFocus={(evt) =>
                                    setaddressErrors({
                                      ...addressErrors,
                                      "billingAddress.mobile": "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {addressErrors["billingAddress.mobile"]}
                                </span>
                              </div>

                              {/* Mobile */}
                              <div className="form-group col-md-6">
                                <label>
                                  Alternative Mobile Number
                                  <span className="required"></span>
                                </label>
                                <input
                                  className={
                                    addressErrors[
                                      "billingAddress.alternateMobile"
                                    ]
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setAddress({
                                      ...address,
                                      alternateMobile: evt.target.value,
                                    })
                                  }
                                  value={address.alternateMobile}
                                  placeholder="alternateMobile"
                                  onFocus={(evt) =>
                                    setaddressErrors({
                                      ...addressErrors,
                                      "billingAddress.alternateMobile": "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {
                                    addressErrors[
                                      "billingAddress.alternateMobile"
                                    ]
                                  }
                                </span>
                              </div>

                              {/* Email */}
                              <div className="form-group col-md-6">
                                <label>
                                  Email
                                  <span className="required"></span>
                                </label>
                                <input
                                  className={
                                    addressErrors["billingAddress.email"]
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setAddress({
                                      ...address,
                                      email: evt.target.value,
                                    })
                                  }
                                  value={address.email}
                                  placeholder="email"
                                  onFocus={(evt) =>
                                    setaddressErrors({
                                      ...addressErrors,
                                      "billingAddress.email": "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {addressErrors["billingAddress.email"]}
                                </span>
                              </div>

                              {/* Address */}
                              <div className="form-group col-md-6">
                                <label>
                                  Address
                                  <span className="required">*</span>
                                </label>
                                <input
                                  className={
                                    addressErrors["billingAddress.address"]
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setAddress({
                                      ...address,
                                      address: evt.target.value,
                                    })
                                  }
                                  value={address.address}
                                  placeholder="address"
                                  onFocus={(evt) =>
                                    setaddressErrors({
                                      ...addressErrors,
                                      "billingAddress.address": "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {addressErrors["billingAddress.address"]}
                                </span>
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
                                    addressErrors["billingAddress.city"]
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setAddress({
                                      ...address,
                                      city: evt.target.value,
                                    })
                                  }
                                  value={address.city}
                                  placeholder="city"
                                  onFocus={(evt) =>
                                    setaddressErrors({
                                      ...addressErrors,
                                      "billingAddress.city": "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {addressErrors["billingAddress.city"]}
                                </span>
                              </div>

                              {/* Company Name */}
                              <div className="form-group col-md-6">
                                <label>
                                  Company Name
                                  <span className="required"></span>
                                </label>
                                <input
                                  className={
                                    addressErrors["billingAddress.companyName"]
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setAddress({
                                      ...address,
                                      companyName: evt.target.value,
                                    })
                                  }
                                  value={address.companyName}
                                  placeholder="companyName"
                                  onFocus={(evt) =>
                                    setaddressErrors({
                                      ...addressErrors,
                                      "billingAddress.companyName": "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {addressErrors["billingAddress.companyName"]}
                                </span>
                              </div>
                              {/* Pincode */}
                              <div className="form-group col-md-6">
                                <label>
                                  Pincode
                                  <span className="required">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={
                                    addressErrors["billingAddress.pincode"]
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setAddress({
                                      ...address,
                                      pincode: evt.target.value,
                                    })
                                  }
                                  value={address.pincode}
                                  placeholder="pincode"
                                  onFocus={(evt) =>
                                    setaddressErrors({
                                      ...addressErrors,
                                      "billingAddress.pincode": "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {addressErrors["billingAddress.pincode"]}
                                </span>
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
                                  Update Address
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
  );
};

export default EditBillingAddress;
