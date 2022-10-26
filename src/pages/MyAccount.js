import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useHistory, Redirect } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { BiEdit, BiTrash, BiPlusCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import date from "date-and-time";

const MyAccount = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  const { tab = "dashboard" } = useParams();
  const [profile, setProfile] = useState({});
  const [myWishlists, setMyWishlist] = useState([]);
  const [removeFromWishlist, setRemoveFromWishlist] = useState([]);

  const [myWallet, setMyWallet] = useState({
    totalAmount: "",
    history: [],
  });
  const [loaded, setLoaded] = useState(true);
  const [customer, setCustomer] = useState({
    billingAddress: {},
    shippingAddresses: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [profileErrors, setProfileErrors] = useState({
    mobile: "",
    password: "",
    name: "",
  });
  const [orders, setOrders] = useState([]);

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));

  if (!customerInfo) {
    history.push("/account/login");
  }

  if (customerInfo && !customerInfo.jwtToken) {
    history.push("/account/login");
  }
  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();
    setLoaded(false);
    const customerData = {
      name: profile.name,
      password: profile.password,
      mobile: profile.mobile,
    };

    fetch(`${Config.SERVER_URL}/customer/profile`, {
      method: "PUT",
      body: JSON.stringify(customerData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo.jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setLoaded(true);
          if (result.status == 200) {
            // set value to redux
            dispatch({
              type: "CUSTOMER",
              payload: { ...state, ...result.body },
            });
            localStorage.setItem(
              "customer",
              JSON.stringify({ ...state, ...result.body })
            );
            localStorage.setItem("jwt_customer_token", result.body.token);
            toast.success(result.message);
          } else {
            setProfileErrors({ ...result.error, message: result.message });
          }
        },
        (error) => {
          setLoaded(true);
          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // Submit Handler
  const deleteHandler = (evt, deleteId) => {
    evt.preventDefault();
    setLoaded(false);

    fetch(`${Config.SERVER_URL}/customer/address/${deleteId}`, {
      method: "DELETE",
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
            // set value to redux
            setDeleted(!deleted);
            toast.success(result.message);
          } else {
            console.log(result);
          }
        },
        (error) => {
          setLoaded(true);
          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

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
            setCustomer({
              ...result.body,
              billingAddress: result.body.billingAddress || {},
            });
            setProfile({
              name: result.body.name,
              mobile: result.body.mobile,
              email: result.body.mobile,
            });
            // console.log("Wallet", result.body.wallet);
            setMyWallet(
              result.body.wallet || {
                totalAmount: "",
                history: [],
              }
            );
          } else {
            console.log(result);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }, [deleted]);

  // My Orders
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/order/myOrders`, {
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
            setOrders(result.body);
          } else {
            console.log(result);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }, [deleted]);

  // My Wishlists
  useEffect(() => {
    if (customerInfo && customerInfo.jwtToken) {
      fetch(`${Config.SERVER_URL}/wishlists/myWishlist`, {
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
              console.log("wishlist", result.body);
              setMyWishlist(result.body);
              // toast.success(result.message);
            } else {
              const keys = Object.keys(result.error);
              keys.forEach((element) => {
                toast.error(result.error[element]);
              });
              toast.error(result.message);
            }
          },
          (error) => {
            toast.error(error.message);
          }
        );
    }
  }, [removeFromWishlist]);

  // removeFromWishlistHandler
  const removeFromWishlistHandler = (evt, widhlistId) => {
    evt.preventDefault();

    if (!customerInfo && !customerInfo.jwtToken) {
      history.push("/login");
      return;
    }

    fetch(`${Config.SERVER_URL}/wishlists/${widhlistId}`, {
      method: "DELETE",
      // body: JSON.stringify({ product }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo.jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            toast.success(result.message);
          } else {
            const keys = Object.keys(result.error);
            keys.forEach((element) => {
              toast.error(result.error[element]);
            });
            toast.error(result.message);
          }
          setRemoveFromWishlist(!removeFromWishlist);
        },
        (error) => {
          toast.error(error.message);
        }
      );
  };

  return (
    <main className="main pages">
      <div className="page-header breadcrumb-wrap">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" rel="nofollow">
              <i className="fa fa-home mr-5"></i>Home
            </Link>
            {/* <span></span> Pages <span></span> My Account */}
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
                      <li className="nav-item">
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
                      </li>
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
                      <li className="nav-item">
                        <Link className="nav-link" to="#">
                          <i className="fa fa-sign-out mr-10"></i>Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="tab-content account dashboard-content pl-20">
                    {/* Dashboard */}
                    <div
                      className={
                        tab == "dashboard"
                          ? "tab-pane fade active show"
                          : "tab-pane fade"
                      }
                      id="dashboard"
                      role="tabpanel"
                      aria-labelledby="dashboard-tab"
                    >
                      <div className="card">
                        <div className="card-header">
                          <h4 className="mb-0">
                            Hello {profile.name || "Guest"}!
                          </h4>
                        </div>
                        <div className="card-body">
                          <p>
                            From your account dashboard. you can easily check
                            &amp; view your
                            <Link to="/account/my-account/orders">
                              recent orders
                            </Link>
                            ,
                            <br />
                            manage your
                            <Link to="/account/my-account/address">
                              shipping and billing addresses
                            </Link>
                            and
                            <Link to="/account/my-account/account-detail">
                              edit your password and account details.
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet */}
                    <div
                      className={
                        tab == "wallet"
                          ? "tab-pane fade active show"
                          : "tab-pane fade"
                      }
                      id="wallet"
                      role="tabpanel"
                      aria-labelledby="wallet-tab"
                    >
                      <div className="card">
                        <div className="card-header d-flex justify-content-between">
                          <h4 className="mb-0">Wallet Amount</h4>
                          <h4 className="badge bg-danger">
                            <i className="fa fa-inr"></i>
                            {myWallet.totalAmount || 0}
                          </h4>
                        </div>
                        <div className="card-body">
                          {myWallet.history.map((transaction, index) => {
                            return (
                              <div className="card card-body bg-white mb-1">
                                <div className="d-flex justify-content-between">
                                  <div className="">
                                    {/* <button className="btn btn-info transaction-btn mr-4">
                                  <i className="fa fa-send"></i>
                                </button> */}
                                    <p>{transaction.message}</p>
                                    <p className="ml-4">
                                      {date.format(
                                        new Date(transaction.createdAt),
                                        "DD-MM-YYYY"
                                      )}
                                    </p>
                                  </div>
                                  <div className="">
                                    <p className="text-right">
                                      <span className="fa fa-inr"></span>{" "}
                                      {transaction.amount}
                                    </p>
                                    <p>
                                      {transaction.transactionType ==
                                      "DEBITED" ? (
                                        <span className="badge bg-danger">
                                          Debited from Wallet
                                        </span>
                                      ) : (
                                        <span className="badge bg-info">
                                          Credit to Wallet
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Orders */}
                    <div
                      className={
                        tab == "orders"
                          ? "tab-pane fade active show"
                          : "tab-pane fade"
                      }
                      id="orders"
                      role="tabpanel"
                      aria-labelledby="orders-tab"
                    >
                      <div className="card">
                        <div className="card-header">
                          <h4 className="mb-0">Your Orders</h4>
                        </div>
                        {orders.length ? (
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table bg-white">
                                <thead>
                                  <tr>
                                    <th>Order</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.map((order, index) => {
                                    return (
                                      <tr key={`order-${index}`}>
                                        <td> {`#${index + 1}`} </td>
                                        <td>
                                          {date.format(
                                            new Date(order.createdAt),
                                            "DD-MM-YYYY"
                                          )}
                                        </td>
                                        <td>
                                          {order.orderStatus == "CANCELLED" ? (
                                            <span className="text-danger">
                                              {order.orderStatus}
                                            </span>
                                          ) : (
                                            <span className="text-info">
                                              {order.orderStatus}
                                            </span>
                                          )}
                                        </td>
                                        <td>
                                          <i className="fa fa-inr"></i>
                                          {order.totalAmount} for
                                          {order.products.length} item
                                        </td>
                                        <td>
                                          <Link
                                            to={`/account/my-account/order/${order._id}`}
                                            className="btn-small d-block"
                                          >
                                            View
                                          </Link>

                                          {order.orderStatus == "ORDERPLACED" ||
                                          order.orderStatus == "CONFIRMED" ? (
                                            <Link
                                              to={`/account/cancelOrder/${order._id}`}
                                              className="btn-small d-block"
                                            >
                                              Cancel
                                            </Link>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="alert alert-danger">No order yet</div>
                        )}
                      </div>
                    </div>

                    {/* Wishlists */}
                    <div
                      className={
                        tab == "wishlists"
                          ? "tab-pane fade active show"
                          : "tab-pane fade"
                      }
                      id="wishlists"
                      role="tabpanel"
                      aria-labelledby="wishlists-tab"
                    >
                      <div className="card">
                        <div className="card-header">
                          <h4 className="mb-0">My Wishlists</h4>
                        </div>
                        {myWishlists.length ? (
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table bg-white">
                                <thead>
                                  <tr>
                                    <th>#Sn</th>
                                    <th>Product</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {myWishlists.map((wishlistItem, index) => {
                                    return (
                                      <tr key={`wishlistItem-${index}`}>
                                        <td>
                                          <h6>{`#${index + 1}`}</h6>
                                        </td>

                                        <td className="d-flex align-items-center gap-3">
                                          <Link
                                            to={`/product/${wishlistItem.product.slug}`}
                                          >
                                            <img
                                              style={{
                                                height: "60px",
                                                width: "60px",
                                                borderRadius: "50%",
                                              }}
                                              src={
                                                wishlistItem.product
                                                  .defaultImage
                                              }
                                            />
                                          </Link>
                                          <h6>
                                            <Link
                                              to={`/product/${wishlistItem.product.slug}`}
                                            >
                                              {wishlistItem.product.name}
                                            </Link>
                                          </h6>

                                          <h6>
                                            <strike className={"text-danger"}>
                                              <i className="fa fa-inr"></i>
                                              {wishlistItem.product.skus[0].mrp}
                                            </strike>
                                          </h6>
                                          <h5>
                                            <i className="fa fa-inr"></i>
                                            {
                                              wishlistItem.product.skus[0]
                                                .sellingPrice
                                            }
                                          </h5>
                                        </td>
                                        <td>
                                          <button
                                            className="btn btn-danger"
                                            onClick={(evt) => {
                                              removeFromWishlistHandler(
                                                evt,
                                                wishlistItem._id
                                              );
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="alert alert-danger">
                            Wishlist is Empty
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Order Tracking */}
                    <div
                      className={
                        tab == "track-order"
                          ? "tab-pane fade active show"
                          : "tab-pane fade"
                      }
                      id="track-orders"
                      role="tabpanel"
                      aria-labelledby="track-orders-tab"
                    >
                      <div className="card">
                        <div className="card-header">
                          <h4 className="mb-0">Orders tracking</h4>
                        </div>
                        <div className="card-body contact-from-area">
                          <p>
                            To track your order please enter your OrderID in the
                            box below and press "Track" button. This was given
                            to you on your receipt and in the confirmation email
                            you should have received.
                          </p>
                          <div className="row">
                            <div className="col-lg-8">
                              <form
                                className="contact-form-style mt-30 mb-50"
                                action="#"
                                method="post"
                              >
                                <div className="input-style mb-20">
                                  <label>Order ID</label>
                                  <input
                                    name="order-id"
                                    placeholder="Found in your order confirmation email"
                                    type="text"
                                  />
                                </div>
                                <div className="input-style mb-20">
                                  <label>Billing email</label>
                                  <input
                                    name="billing-email"
                                    placeholder="Email you used during checkout"
                                    type="email"
                                  />
                                </div>
                                <button
                                  className="submit submit-auto-width"
                                  type="submit"
                                >
                                  Track
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Billing Address */}
                    <div
                      className={
                        tab == "address"
                          ? "tab-pane fade active show"
                          : "tab-pane fade"
                      }
                      id="address"
                      role="tabpanel"
                      aria-labelledby="address-tab"
                    >
                      <div className="row">
                        <div className="col-lg-12 mt-2">
                          <div className="card">
                            <div className="card-header d-flex justify-content-between">
                              <h4 className="mb-0">Shipping Address</h4>
                              <Link
                                to={"/account/addAddress"}
                                className="btn btn-info"
                              >
                                <BiPlusCircle /> Add
                              </Link>
                            </div>
                            <div className="card-body row">
                              {customer &&
                                customer.shippingAddresses.map((address) => {
                                  return (
                                    <div className="card col-md-6">
                                      <div className="card-body bg-white mb-2">
                                        <div className="d-flex justify-content-between">
                                          <h6>
                                            {address.name} (
                                            {address.addressType}){" "}
                                          </h6>
                                          <div className="">
                                            <Link
                                              to={`/account/editAddress/${address._id}`}
                                              className="btn btn-info px-1 py-0 pb-1 "
                                            >
                                              <BiEdit size={"1rem"} />
                                            </Link>
                                            <button
                                              type="button"
                                              className="btn btn-danger px-1 py-0 pb-1"
                                              onClick={(evt) => {
                                                deleteHandler(evt, address._id);
                                              }}
                                            >
                                              <BiTrash size={"1rem"} />
                                            </button>
                                          </div>
                                        </div>
                                        <p>{address.mobile}</p>
                                        <p>{address.alternateMobile}</p>
                                        <p>{address.email}</p>
                                        <p>{address.address}</p>
                                        <p>{address.landmark}</p>
                                        <p>
                                          {address.city}, {address.pincode}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}

                              {customer &&
                              !customer.shippingAddresses.length ? (
                                <div className="alert alert-danger">
                                  Address not Available
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Account Details */}
                    <div
                      className={
                        tab == "account-detail"
                          ? "tab-pane fade active show"
                          : "tab-pane fade"
                      }
                      id="account-detail"
                      role="tabpanel"
                      aria-labelledby="account-detail-tab"
                    >
                      <div className="card">
                        <div className="card-header">
                          <h5>Account Details</h5>

                          {profileErrors.message && (
                            <div className="alert alert-danger">
                              {profileErrors.message}
                            </div>
                          )}

                          {successMessage && (
                            <div className="alert alert-success">
                              {successMessage}
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <form
                            method="post"
                            name="enq"
                            onSubmit={submitHandler}
                          >
                            <div className="row">
                              <div className="form-group col-md-6">
                                <label>
                                  Full Name <span className="required">*</span>
                                </label>
                                <input
                                  required=""
                                  name="name"
                                  className={
                                    profileErrors.name
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setProfile({
                                      ...profile,
                                      name: evt.target.value,
                                    })
                                  }
                                  value={profile.name}
                                  placeholder="Name"
                                  onFocus={(evt) =>
                                    setProfileErrors({
                                      ...profileErrors,
                                      name: "",
                                      message: "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {profileErrors.name}
                                </span>
                              </div>
                              <div className="form-group col-md-6">
                                <label>
                                  Mobile Number
                                  <span className="required">*</span>
                                </label>
                                <input
                                  required=""
                                  name="phone"
                                  className={
                                    profileErrors.mobile
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setProfile({
                                      ...profile,
                                      mobile: evt.target.value,
                                    })
                                  }
                                  value={profile.mobile}
                                  placeholder="Mobile"
                                  onFocus={(evt) =>
                                    setProfileErrors({
                                      ...profileErrors,
                                      mobile: "",
                                      message: "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {profileErrors.mobile}
                                </span>
                              </div>

                              <div className="form-group col-md-12">
                                <label>
                                  Email Address
                                  <span className="required">*</span>
                                </label>
                                <input
                                  required=""
                                  className="form-control"
                                  name="email"
                                  type="email"
                                  disabled
                                  value={profile.email}
                                />
                              </div>

                              <div className="form-group col-md-12">
                                <label>
                                  New Password
                                  <span className="required">*</span>
                                </label>
                                <input
                                  required=""
                                  name="cpassword"
                                  type="password"
                                  className={
                                    profileErrors.password
                                      ? "red-border form-control"
                                      : "form-control"
                                  }
                                  onChange={(evt) =>
                                    setProfile({
                                      ...profile,
                                      password: evt.target.value,
                                    })
                                  }
                                  value={profile.password}
                                  placeholder="Password"
                                  onFocus={(evt) =>
                                    setProfileErrors({
                                      ...profileErrors,
                                      password: "",
                                      message: "",
                                    })
                                  }
                                />
                                <span className="error">
                                  {profileErrors.password}
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
                                  {"  "}
                                  Save Change
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

export default MyAccount;
