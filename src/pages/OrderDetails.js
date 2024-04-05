import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useHistory, Redirect } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";
import date from "date-and-time";

const OrderDetails = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  const { id } = useParams();

  const [orderDetails, setOrderDetails] = useState({
    products: [],
    adonProducts: [],
  });
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const [isReturnable, setIsReturnable] = useState(false);

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

  // get order details
  useEffect(() => {
    setLoading(true);
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

            // Calculate is order is returnable or not
            if (result.body.orderStatus == "DELIVERED") {
              const deliveryTime = new Date(result.body.updatedAt);
              const currentTime = new Date();
              const timeGapInMinute = Number.parseInt(
                (currentTime - deliveryTime) / 1000 / 60
              );

              console.log("Time", timeGapInMinute);
              if (timeGapInMinute > 60) {
                setIsReturnable(false);
              } else {
                setIsReturnable(true);
              }
            }
          } else {
            toast.error(result.message);
          }
          setLoading(false);
        },
        (error) => {
          toast.error(error.message);
          setLoading(false);
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
      <div className="page-content pt-5 pb-150">
        <div className="container pt-5">
          <div className="row">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="py-5">
                  <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-lg-10 m-auto">
                <div className="row">
                  <div className="col-md-9">
                    <div className="card bg-white mb-20">
                      <div className="card-header d-flex justify-content-between bg-white">
                        <h5>
                          Order Details
                          <p>
                            OrderId :{" "}
                            <span className="badge bg-brown">
                              {orderDetails.orderId || orderDetails._id}
                            </span>
                          </p>
                        </h5>
                        <h5>
                          Order Amount{" "}
                          <span className="fa fa-inr">
                            {orderDetails.totalAmount}
                          </span>
                        </h5>
                      </div>
                      <div className="card-body">
                        <div class="">
                          {orderDetails.orderStatus != "CANCELLED" ? (
                            <div id="stepProgressBar">
                              <div class="step">
                                <p class="step-text">PENDING</p>
                                <div
                                  class={`bullet line ${
                                    orderDetails.orderStatus == "PENDING" ||
                                    orderDetails.orderStatus == "CONFIRMED" ||
                                    orderDetails.orderStatus == "READYTOSHIP" ||
                                    orderDetails.orderStatus == "DISPATCHED" ||
                                    orderDetails.orderStatus == "DELIVERED"
                                      ? "completed"
                                      : ""
                                  }`}
                                >
                                  1
                                </div>
                              </div>
                              <div class="step">
                                <p class="step-text">CONFIRMED</p>
                                <div
                                  class={`bullet line ${
                                    orderDetails.orderStatus == "CONFIRMED" ||
                                    orderDetails.orderStatus == "READYTOSHIP" ||
                                    orderDetails.orderStatus == "DISPATCHED" ||
                                    orderDetails.orderStatus == "DELIVERED"
                                      ? "completed"
                                      : ""
                                  }`}
                                >
                                  2
                                </div>
                              </div>
                              <div class="step">
                                <p class="step-text">DISPATCHED</p>
                                <div
                                  class={`bullet line ${
                                    orderDetails.orderStatus == "DISPATCHED" ||
                                    orderDetails.orderStatus == "DELIVERED"
                                      ? "completed"
                                      : ""
                                  }`}
                                >
                                  3
                                </div>
                              </div>
                              <div class="step">
                                <p class="step-text">DELIVERED</p>
                                <div
                                  class={`bullet ${
                                    orderDetails.orderStatus == "DELIVERED"
                                      ? "completed"
                                      : ""
                                  }`}
                                >
                                  4
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="alert alert-danger">
                              This order has been cancelled by{" "}
                              <span className="bg-info text-light p-1 rounded-pill">
                                {orderDetails.cancelledBy}{" "}
                              </span>
                              <div>Reason : {orderDetails.cancelMessage}</div>
                            </div>
                          )}
                          <div className="row">
                            {/* Product Details */}
                            <div className="col-md-12">
                              <div className="pb-4">
                                <h5>Product Details</h5>
                              </div>
                              {orderDetails.products.map((item, index) => {
                                return (
                                  <div
                                    className="d-flex justify-content-between"
                                    key={`p-${index}`}
                                  >
                                    <Link to={`/product/${item.slug}`}>
                                      <div className="d-flex justify-content-between">
                                        <div className="">
                                          <img
                                            style={{
                                              height: "80px",
                                              width: "80px",
                                              borderRadius: "20px",
                                            }}
                                            src={item.image}
                                            alt="Product Image"
                                          />
                                        </div>
                                        <div className="px-2 py-3">
                                          <h6>{item.name}</h6>
                                          <p className="text-small">
                                            {item.shape} | {item.flavour} |{" "}
                                            {item.cakeType} | {item.weight}
                                          </p>
                                        </div>
                                      </div>
                                    </Link>
                                    <div className="">
                                      <div className="">
                                        <h6>
                                          {" "}
                                          <i className="fa fa-inr"></i>{" "}
                                          {item.price}{" "}
                                        </h6>
                                        <p className="quntext">
                                          Qty : {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Adon Product Details */}
                            {orderDetails.adonProducts.length ? (
                              <div className="col-md-12 py-3">
                                <div className="pb-4">
                                  <h5>Adon Product Details</h5>
                                </div>
                                {orderDetails.adonProducts.map(
                                  (item, index) => {
                                    return (
                                      <div className="d-flex justify-content-between">
                                        <div className="d-flex justify-content-between">
                                          <div className="">
                                            <img
                                              style={{
                                                height: "80px",
                                                width: "80px",
                                                borderRadius: "20px",
                                              }}
                                              src={item.image}
                                              alt="Product Image"
                                            />
                                          </div>
                                          <div className="px-2 py-3">
                                            <h6>{item.name}</h6>
                                          </div>
                                        </div>
                                        <div className="">
                                          <div className="">
                                            <h6>
                                              {" "}
                                              <i className="fa fa-inr"></i>{" "}
                                              {item.price}{" "}
                                            </h6>
                                            <p className="text-small">
                                              Qty : {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            ) : (
                              ""
                            )}

                            {/* Cancel & Return Order */}
                            <div className="py-4 d-flex ">
                              {/* <div className="">
                                {orderDetails.orderStatus == "PENDING" ||
                                orderDetails.orderStatus == "CONFIRMED" ? (
                                  <Link
                                    to={`/account/cancelOrder/${orderDetails._id}`}
                                    className="btn btn-danger"
                                  >
                                    Cancel Order
                                  </Link>
                                ) : (
                                  ""
                                )}
                              </div> */}
                              {/* <div className="px-2">
                                {isReturnable ? (
                                  <Link className="btn btn-danger">
                                    Return Order
                                  </Link>
                                ) : (
                                  ""
                                )}
                              </div> */}
                            </div>

                            {/* Table Design */}
                            <table className="table table-striped table-bordered order-table mt-3 h6 mb-5">
                              <tr>
                                <th>Delivery Charges</th>
                                <td className="text-right">
                                  <i className="fa fa-inr"></i>
                                  {orderDetails.shippingMethod
                                    ? orderDetails.shippingMethod.amount
                                    : ""}
                                </td>
                              </tr>
                              <tr>
                                <th>Subtotal</th>
                                <td className="text-right">
                                  <i className="fa fa-inr"></i>
                                  {orderDetails.subtotal}
                                </td>
                              </tr>
                              <tr>
                                <th>Discount with Coupon</th>
                                <td className="text-right">
                                  <i className="fa fa-inr"></i>
                                  {orderDetails.discountWithCoupon}
                                </td>
                              </tr>
                              <tr>
                                <th>Used Wallet Amount</th>
                                <td className="text-right">
                                  <i className="fa fa-inr"></i>
                                  {orderDetails.usedWalletAmount}
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <h6 className="p-0 m-0">Total Amount</h6>
                                </th>
                                <td>
                                  <h6 className="text-right p-0 m-0">
                                    <i className="fa fa-inr"></i>
                                    {orderDetails.totalAmount}
                                  </h6>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 ">
                    <div className="card bg-brown mb-3">
                      <div className="card-body">
                        <h5>Payment Method : {orderDetails.paymentMethod}</h5>
                      </div>
                    </div>

                    <div className="card bg-white mb-3">
                      <div className="card-body">
                        <h5 className="pb-3">Delivery Details</h5>
                        {orderDetails.shippingMethod ? (
                          <div className="">
                            <h6 className="pb-2">
                              Delivery: {orderDetails.shippingMethod.method}
                            </h6>
                            {orderDetails.orderStatus !== "DELIVERED" ? (
                              <div className="">
                                <h6 className="pb-2">
                                  Delivery Date:{" "}
                                  <span className="badge bg-brown">
                                    {date.format(
                                      new Date(
                                        orderDetails.shippingMethod.date
                                      ),
                                      "DD-MM-YYYY"
                                    )}
                                  </span>
                                </h6>
                                <h6 className="pb-2">
                                  Delivery Time:{" "}
                                  <span className="badge bg-brown">
                                    {date.transform(
                                      orderDetails.shippingMethod.startTime,
                                      "HH:mm",
                                      "hh"
                                    )}
                                    -
                                    {date.transform(
                                      orderDetails.shippingMethod.endTime,
                                      "HH:mm",
                                      "hh:mm A"
                                    )}
                                  </span>
                                </h6>
                              </div>
                            ) : (
                              <div className="">
                                <h6 className="pb-2">
                                  Delivered Date:{" "}
                                  <span className="badge bg-brown">
                                    {date.format(
                                      new Date(orderDetails.updatedAt),
                                      "DD-MM-YYYY"
                                    )}
                                  </span>
                                </h6>
                                <h6 className="pb-2">
                                  Delivery Time:{" "}
                                  <span className="badge bg-brown">
                                    {date.format(
                                      new Date(orderDetails.updatedAt),
                                      "hh:mm A"
                                    )}
                                  </span>
                                </h6>
                              </div>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="card bg-white mb-3">
                      <div className="card-body">
                        <h5 className="pb-3">Shipping Address</h5>
                        {orderDetails.shippingAddress ? (
                          <div className="">
                            <h6 className="pb-2">
                              Name: {orderDetails.shippingAddress.name}{" "}
                            </h6>

                            <h6 className="pb-2">
                              Mobile: {orderDetails.shippingAddress.mobile}{" "}
                            </h6>
                            <h6 className="pb-2">
                              Address: {orderDetails.shippingAddress.address}{" "}
                            </h6>
                            <h6 className="pb-2">
                              Landmark: {orderDetails.shippingAddress.landmark}{" "}
                            </h6>
                            <h6 className="pb-2">
                              City: {orderDetails.shippingAddress.city}{" "}
                            </h6>
                            <h6 className="pb-2">
                              Pincode: {orderDetails.shippingAddress.pincode}{" "}
                            </h6>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
