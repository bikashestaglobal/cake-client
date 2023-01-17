import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useHistory, Redirect } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";

const CancelOrder = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  const { tab = "orders" } = useParams();
  const { id, status } = useParams();
  const [cancelMessage, setCancelMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState({});
  const [loaded, setLoaded] = useState(true);
  const [customer, setCustomer] = useState({});
  const [cancelReason, setCancelReasonErrors] = useState("");
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  if (!customerInfo) {
    history.push("/account/login");
  }

  if (customerInfo && !customerInfo.jwtToken) {
    history.push("/account/login");
  }

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
            setCustomer(result.body);
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

    const orderData = {
      orderStatus: "CANCELLED",
      cancelledBy: "CUSTOMER",
      customerId: customer._id,
    };

    if (cancelMessage) {
      orderData.cancelMessage = cancelMessage;
    }

    fetch(`${Config.SERVER_URL}/order/cancleOrder/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
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
            setCancelReasonErrors(result.message);
          }
        },
        (error) => {
          toast.error(error.message);
          setLoaded(true);
          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get order details
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/order/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo.jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            setOrderDetails(result.body);
          } else {
            toast.error(result.message);
          }
        },
        (error) => {
          toast.error(error.message);

          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // Check customer is logedin or not

  return (
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
      <div className="page-content pt-150 pb-150">
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
                            tab == "dashboard" ? "nav-link active" : "nav-link"
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
                            tab == "wishlists" ? "nav-link active" : "nav-link"
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

                      {/* Logout */}
                      {/* <li className="nav-item">
                        <Link className="nav-link" to="#" onClick={signOut}>
                          <i className="fa fa-sign-out mr-10"></i>Logout
                        </Link>
                      </li> */}
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
                        <div className="card-header d-flex justify-content-between">
                          <h5>{status ? status : "Cancle"} Order</h5>
                          <h6>
                            Order Amount{" "}
                            <span className="fa fa-inr">
                              {orderDetails.totalAmount || 0}
                            </span>
                          </h6>
                        </div>
                        <div className="card-body">
                          <form
                            method="post"
                            name="enq"
                            onSubmit={submitHandler}
                          >
                            <div className="row">
                              {/* Address */}
                              <div className="form-group col-md-12">
                                <label>
                                  Why do you want to{" "}
                                  {status ? status : "cancel"} the Order?
                                </label>
                                <input
                                  className={"form-control"}
                                  onChange={(evt) =>
                                    setCancelMessage(evt.target.value)
                                  }
                                  value={cancelMessage}
                                  placeholder="Reason for cancellation"
                                  onFocus={(evt) => setCancelReasonErrors("")}
                                />
                                <span className="error">{cancelReason}</span>
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
                                  {status ? status : "Cancel"} Order
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

export default CancelOrder;
