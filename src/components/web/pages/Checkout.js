import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../Routes";
import Config from "../Config";
import { toast } from "react-toastify";
import parse from "html-react-parser";

const Checkout = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const { cart, shipping, coupon, adonCart = [] } = state;

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const [shippingAddress, setShippingAddress] = useState({});
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    mobile: "",
    companyName: "",
  });
  const [loaded, setLoaded] = useState(true);
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    mobile: "",
    companyName: "",
    additionalInfo: "",
  });
  const [availableShipAddress, setAvailableShipAddress] = useState([]);
  const [selectedShipAddress, setSedeletedShipAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const [subtotal, setSubtotal] = useState("");
  const [adonTotal, setAdonTotal] = useState("");
  const [discountWithCoupon, setDiscountWithCoupon] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [totalAmountAfterAdon, setTotalAmountAfterAdon] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [enteredCoupon, setEnteredCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState({
    message: "",
    error: false,
  });
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "",
    discount: "",
    discountType: "",
  });
  const [myWallet, setMyWallt] = useState({});
  const [setting, setSetting] = useState({});
  const [earnedCashback, setEarnedCashback] = useState(0);
  const [isUsingWallet, setIsUsingWallet] = useState(false);
  const [usedWalletAmount, setUsedWalletAmount] = useState(0);

  if (!customerInfo) {
    history.push("/account/login");
  }

  if (customerInfo && !customerInfo.jwtToken) {
    history.push("/account/login");
  }

  // Update billing Address
  const updateAddressHandler = () => {
    setLoaded(false);

    const updateData = { billingAddress, sameAddress: sameBillingAddress };
    if (!sameBillingAddress) {
      updateData.shippingAddress = shippingAddress;
    }

    if (selectedShipAddress) {
      updateData.sameAddress = false;
    }

    fetch(`${Config.SERVER_URL}/customer/profile`, {
      method: "PUT",
      body: JSON.stringify(updateData),
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
            // toast.success(result.message);
            setBillingAddress(result.body.billingAddress);
            createOrderHandler();
            return true;
          } else {
            setErrors({ ...result.error });
            toast.error(result.message);
            return false;
          }
        },
        (error) => {
          setLoaded(true);
          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // Create Order
  const createOrderHandler = () => {
    const orderData = {
      billingAddress,
      paymentMethod: selectedPaymentMethod,
      subtotal: subtotal,
      adonTotalAmount: adonTotal,
      totalAmount: totalAmount,
      discountWithCoupon: discountWithCoupon,
      coupon: appliedCoupon,
      usedWalletAmount: usedWalletAmount,
      shippingMethod: { ...shipping, pincode: undefined },
    };

    if (sameBillingAddress) {
      orderData.shippingAddress = { ...billingAddress, _id: undefined };
    } else {
      orderData.shippingAddress = shippingAddress;
    }

    if (selectedShipAddress) {
      orderData.shippingAddress = { ...selectedShipAddress, _id: undefined };
    }

    orderData.products = cart;

    orderData.adonProducts = adonCart;

    fetch(`${Config.SERVER_URL}/order`, {
      method: "POST",
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
            dispatch({ type: "CLEAR_CART" });
            dispatch({ type: "CLEAR_ADON_CART" });
            dispatch({ type: "CLEAR_SHIPPING" });

            // Update Wallet while use wallet amount at making the order
            if (isUsingWallet) {
              createTransactionHandler(
                result.body.id,
                myWallet.totalAmount,
                usedWalletAmount,
                "Used at Making Order !",
                "DEBITED"
              );
            }

            // Create Cashback
            if (setting.cashbackStatus) {
              createTransactionHandler(
                result.body.id,
                myWallet.totalAmount
                  ? Number.parseInt(myWallet.totalAmount) + earnedCashback
                  : earnedCashback,
                earnedCashback,
                "Cashback Added !",
                "CREDITED"
              );
            }

            // setBillingAddress(result.body.billingAddress);
            history.push("/thank-you");
            return true;
          } else {
            setErrors({ ...result.error });
            toast.error(result.message);
            return false;
          }
        },
        (error) => {
          setLoaded(true);
          //   M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // createTransactionHandler
  const createTransactionHandler = (
    orderId,
    totalAmount,
    amount = 0,
    message = "Cashback Added !",
    transactionType = "CREDITED"
  ) => {
    const newTransaction = {
      totalAmount,
      amount,
      message,
      orderId,
      transactionType,
    };

    fetch(`${Config.SERVER_URL}/customer/walletTransaction`, {
      method: "POST",
      body: JSON.stringify(newTransaction),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo.jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          // setLoaded(true);
          // console.log("Transaction", result);

          if (result.status == 200) {
            toast.success(result.message);
            // dispatch({ type: "CLEAR_CART" });
            // dispatch({ type: "CLEAR_ADON_CART" });
            // dispatch({ type: "CLEAR_SHIPPING" });
            // setBillingAddress(result.body.billingAddress);
            // history.push("/thank-you");
            return true;
          } else {
            setErrors({ ...result.error });
            toast.error(result.message);
            return false;
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
        Authorization: `Bearer ${
          (customerInfo && customerInfo.jwtToken) || ""
        }`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          //   console.log(result);
          if (result.status == 200) {
            setAvailableShipAddress(result.body.shippingAddresses);
            setBillingAddress(
              result.body.billingAddress || {
                name: "",
                email: "",
                address: "",
                city: "",
                mobile: "",
                companyName: "",
                additionalInfo: "",
              }
            );
            setMyWallt(result.body.wallet);
          } else {
            console.log(result);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  // Get Setting
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/setting`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (customerInfo && customerInfo.jwtToken) || ""
        }`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          //   console.log(result);
          if (result.status == 200) {
            setSetting(result.body);
          } else {
            console.log(result);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  // Calculate amount
  useEffect(() => {
    // Calculate subtotal
    let sub_total = cart
      .map((product) => product.price * product.quantity)
      .reduce((prev, curr) => prev + curr, 0);

    // Calculate the cashback
    let cash_back = 0;
    if (setting.cashbackStatus) {
      cash_back = (sub_total * Number.parseInt(setting.cashback)) / 100;

      if (cash_back > setting.maximumCashbackAmount) {
        cash_back = setting.maximumCashbackAmount;
      }
      setEarnedCashback(cash_back);
    }

    // calculate coupon discount amount
    let dis_with_coupon = 0;
    if (appliedCoupon.code) {
      if (appliedCoupon.discountType === "PERCENTAGE") {
        dis_with_coupon = (sub_total * appliedCoupon.discount) / 100;
      } else {
        dis_with_coupon = appliedCoupon.discount;
      }
    }

    let adon_total = adonCart
      .map((product) => product.price * product.quantity)
      .reduce((prev, curr) => prev + curr, 0);

    // Update Sub total;

    // Calculate Total
    let total = sub_total + parseInt(shipping.amount) - dis_with_coupon;

    // Total after adon
    let total_amount_after_adon =
      sub_total - dis_with_coupon + parseInt(shipping.amount) + adon_total;

    // Use Wallet Amount
    if (isUsingWallet) {
      if (total_amount_after_adon >= myWallet.totalAmount) {
        setUsedWalletAmount(myWallet.totalAmount);
        total_amount_after_adon -= myWallet.totalAmount;
        setMyWallt({ ...myWallet, totalAmount: 0 });
      } else {
        setUsedWalletAmount(total_amount_after_adon);

        setMyWallt({
          ...myWallet,
          totalAmount: myWallet.totalAmount - total_amount_after_adon,
        });
        total_amount_after_adon = 0;
      }
    } else {
      setMyWallt({
        ...myWallet,
        totalAmount: myWallet.totalAmount + usedWalletAmount,
      });
      setUsedWalletAmount(0);
    }

    setTotalAmount(total_amount_after_adon);
    setDiscountWithCoupon(dis_with_coupon);
    setSubtotal(sub_total + adon_total + parseInt(shipping.amount));
    setAdonTotal(adon_total);
    setTotalAmountAfterAdon(total_amount_after_adon);
  }, [cart, adonCart, appliedCoupon, setting, isUsingWallet]);

  // Get all coupon
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/coupon?status=Active`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (customerInfo && customerInfo.jwtToken) || ""
        }`,
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setCoupons(data.body);
        } else {
          console.log(
            "Error Occured While loading shippingMethods : ProductDetails"
          );
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  const couponHandler = (evt, coupon = enteredCoupon) => {
    evt.preventDefault();

    // Check coupon code is valid or not
    if (!coupons.some((c) => c.code === coupon)) {
      setCouponMessage({
        ...couponMessage,
        message: "Invalid Coupon Code",
        error: true,
      });
      return;
    }

    // Check coupon amount
    const filteredCoupon = coupons.filter((c) => c.code === coupon);

    if (filteredCoupon.length && subtotal < filteredCoupon[0].minimumAmount) {
      setCouponMessage({
        ...couponMessage,
        message: "Amount is Must at least Rs 500",
        error: true,
      });
      return;
    }

    fetch(`${Config.SERVER_URL}/coupon/verify/${coupon}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (customerInfo && customerInfo.jwtToken) || ""
        }`,
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          let walletStatus = isUsingWallet;
          if (walletStatus) {
            setIsUsingWallet(false);
          }

          setAppliedCoupon({
            code: data.body.code,
            discount: data.body.discount,
            discountType: data.body.discountType,
          });
          if (walletStatus) {
            setIsUsingWallet(true);
          }
          toast.success(data.message);
          setCouponMessage({
            ...couponMessage,
            message: data.message,
            error: false,
          });
        } else {
          toast.error(data.message);
          setCouponMessage({
            ...couponMessage,
            message: data.message,
            error: true,
          });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });

    // dispatch({
    //   type: "ADD_COUPON",
    //   payload: {
    //     code: filteredCoupon.code,
    //     discount: filteredCoupon.discount,
    //     discountType: filteredCoupon.discountType,
    //   },
    // });
  };

  // orderPlaceHandler
  const orderPlaceHandler = (evt) => {
    evt.preventDefault();

    if (availableShipAddress.length) {
      if (selectedShipAddress || sameBillingAddress == false) {
        updateAddressHandler();
      } else {
        toast.error("Must Select Shipping Address");
        return;
      }
    } else {
      updateAddressHandler();
    }

    // if (
    //   (availableShipAddress.length && !selectedShipAddress) ||
    //   sameBillingAddress == true
    // ) {
    //   toast.error("Must Select Shipping Address");
    //   return;
    // }
  };

  return (
    <main className="main">
      <div className="page-header breadcrumb-wrap">
        <div className="container">
          <div className="breadcrumb">
            <a href="index.html" rel="nofollow">
              <i className="fi-rs-home mr-5"></i>Home
            </a>
            <span></span> Shop
            <span></span> Checkout
          </div>
        </div>
      </div>
      <div className="container mb-80 mt-50">
        <div className="row">
          <div className="col-lg-8 mb-40">
            <h3 className="heading-2 mb-10">Checkout</h3>
            <div className="d-flex justify-content-between">
              <h6 className="text-body">
                There are <span className="text-brand"> {cart.length} </span>{" "}
                products in your cart
              </h6>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-7">
            <div className="row mb-50">
              <div className="col-lg-6 mb-sm-15 mb-lg-0 mb-md-3">
                <div
                  className="panel-collapse collapse login_form"
                  id="loginform"
                >
                  <div className="panel-body">
                    <p className="mb-30 font-sm">
                      If you have shopped with us before, please enter your
                      details below. If you are a new customer, please proceed
                      to the Billing &amp; Shipping section.
                    </p>
                    <form method="post">
                      <div className="form-group">
                        <input
                          type="text"
                          name="email"
                          placeholder="Username Or Email"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                        />
                      </div>
                      <div className="login_footer form-group">
                        <div className="chek-form">
                          <div className="custome-checkbox">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="checkbox"
                              id="remember"
                              value=""
                            />
                            <label
                              className="form-check-label"
                              htmlFor="remember"
                            >
                              <span>Remember me</span>
                            </label>
                          </div>
                        </div>
                        <a href="#">Forgot password?</a>
                      </div>
                      <div className="form-group">
                        <button className="btn btn-md" name="login">
                          Log in
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-6"></div>
            </div>

            {/* Billing Details */}
            <div className="row">
              <h4 className="mb-30">Billing Details</h4>
              <form method="post">
                {/* Name */}
                <div className="row">
                  <div className="form-group col-lg-12">
                    <input
                      className={
                        errors["billingAddress.name"] ? "red-border" : ""
                      }
                      type="text"
                      onFocus={() => {
                        setErrors({ ...errors, "billingAddress.name": "" });
                      }}
                      value={billingAddress.name}
                      onChange={(evt) => {
                        setBillingAddress({
                          ...billingAddress,
                          name: evt.target.value,
                        });
                      }}
                      placeholder="Your Name *"
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Address */}
                  <div className="form-group col-lg-6">
                    <input
                      type="text"
                      className={
                        errors["billingAddress.address"] ? "red-border" : ""
                      }
                      onFocus={() => {
                        setErrors({ ...errors, "billingAddress.address": "" });
                      }}
                      value={billingAddress.address}
                      onChange={(evt) => {
                        setBillingAddress({
                          ...billingAddress,
                          address: evt.target.value,
                        });
                      }}
                      placeholder="Address *"
                    />
                  </div>

                  {/* City */}
                  <div className="form-group col-lg-6">
                    <input
                      type="text"
                      className={
                        errors["billingAddress.city"] ? "red-border" : ""
                      }
                      onFocus={() => {
                        setErrors({ ...errors, "billingAddress.city": "" });
                      }}
                      value={billingAddress.city}
                      onChange={(evt) => {
                        setBillingAddress({
                          ...billingAddress,
                          city: evt.target.value,
                        });
                      }}
                      placeholder="City *"
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Pincode */}
                  <div className="form-group col-lg-6">
                    <input
                      required=""
                      type="text"
                      className={
                        errors["billingAddress.pincode"] ? "red-border" : ""
                      }
                      onFocus={() => {
                        setErrors({ ...errors, "billingAddress.pincode": "" });
                      }}
                      value={billingAddress.pincode}
                      onChange={(evt) => {
                        setBillingAddress({
                          ...billingAddress,
                          pincode: evt.target.value,
                        });
                      }}
                      placeholder="Postcode / ZIP *"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="form-group col-lg-6">
                    <input
                      required=""
                      type="text"
                      className={
                        errors["billingAddress.mobile"] ? "red-border" : ""
                      }
                      onFocus={() => {
                        setErrors({ ...errors, "billingAddress.mobile": "" });
                      }}
                      value={billingAddress.mobile}
                      onChange={(evt) => {
                        setBillingAddress({
                          ...billingAddress,
                          mobile: evt.target.value,
                        });
                      }}
                      placeholder="Phone *"
                    />
                  </div>
                </div>
                <div className="row">
                  {/* Company name */}
                  <div className="form-group col-lg-6">
                    <input
                      required=""
                      type="text"
                      value={billingAddress.companyName}
                      onChange={(evt) => {
                        setBillingAddress({
                          ...billingAddress,
                          companyName: evt.target.value,
                        });
                      }}
                      placeholder="Company Name"
                    />
                  </div>
                  {/* Email Address */}
                  <div className="form-group col-lg-6">
                    <input
                      required=""
                      type="text"
                      onFocus={() => {
                        setErrors({ ...errors, "billingAddress.email": "" });
                      }}
                      className={
                        errors["billingAddress.email"] ? "red-border" : ""
                      }
                      value={billingAddress.email}
                      onChange={(evt) => {
                        setBillingAddress({
                          ...billingAddress,
                          email: evt.target.value,
                        });
                      }}
                      placeholder="Email address *"
                    />
                  </div>
                </div>

                <div className="form-group mb-30">
                  <textarea
                    rows="5"
                    value={billingAddress.additionalInfo}
                    onChange={(evt) => {
                      setBillingAddress({
                        ...billingAddress,
                        additionalInfo: evt.target.value,
                      });
                    }}
                    placeholder="Additional information"
                  ></textarea>
                </div>

                <div className="">
                  {/* <div className="form-group">
                  <div className="checkbox">
                    <div className="custome-checkbox">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="checkbox"
                        id="createaccount"
                      />
                      <label
                        className="form-check-label label_info"
                        data-bs-toggle="collapse"
                        href="#collapsePassword"
                        data-target="#collapsePassword"
                        aria-controls="collapsePassword"
                        htmlFor="createaccount"
                      >
                        <span>Create an account?</span>
                      </label>
                    </div>
                  </div>
                </div> */}
                  {/* <div
                  id="collapsePassword"
                  className="form-group create-account collapse in"
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <input
                        required=""
                        type="password"
                        placeholder="Password"
                        name="password"
                      />
                    </div>
                  </div>
                </div> */}
                </div>

                {/* Shipping Address */}
                <div className="row">
                  <div className="col-md-12">
                    <h4 className="mb-30">Shipping Details</h4>
                  </div>

                  {sameBillingAddress && (
                    <div className="row">
                      {availableShipAddress.map((address, index) => {
                        return (
                          <div className="col-md-6" key={index}>
                            <table className="border-0 rounded">
                              <tr className="">
                                <td
                                  className="border-0"
                                  style={{ width: "50px" }}
                                >
                                  <input
                                    className=""
                                    style={{ width: "25px", height: "25px" }}
                                    type="radio"
                                    onChange={(evt) => {
                                      setSedeletedShipAddress({ ...address });
                                    }}
                                    name="billingAddress"
                                  />
                                </td>
                                <td className="border-0">
                                  <h6>{address.name}</h6>
                                  <h6>{address.mobile}</h6>
                                  <h6>{address.email}</h6>
                                  <h6>{address.address}</h6>
                                  <h6>
                                    {address.city} {address.pincode}{" "}
                                  </h6>
                                </td>
                              </tr>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="ship_detail">
                  <div className="form-group">
                    {!selectedShipAddress && (
                      <div className="chek-form">
                        <div className="custome-checkbox">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="checkbox"
                            onChange={() => {
                              setSameBillingAddress(!sameBillingAddress);
                            }}
                            id="differentaddress"
                          />
                          <label
                            className="form-check-label label_info"
                            data-bs-toggle="collapse"
                            data-target="#collapseAddress"
                            href="#collapseAddress"
                            aria-controls="collapseAddress"
                            htmlFor="differentaddress"
                          >
                            <span>Ship to a different address?</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    id="collapseAddress"
                    className="different_address collapse in"
                  >
                    {/* name */}
                    <div className="row">
                      <div className="form-group col-lg-12">
                        <input
                          type="text"
                          className={
                            errors["shippingAddress.name"] ? "red-border" : ""
                          }
                          onFocus={() => {
                            setErrors({
                              ...errors,
                              "shippingAddress.name": "",
                            });
                          }}
                          value={shippingAddress.name}
                          onChange={(evt) => {
                            setShippingAddress({
                              ...shippingAddress,
                              name: evt.target.value,
                            });
                          }}
                          placeholder="Your name *"
                        />
                      </div>
                    </div>
                    <div className="row shipping_calculator">
                      {/* Address */}
                      <div className="form-group col-lg-6">
                        <input
                          className={
                            errors["shippingAddress.address"]
                              ? "red-border"
                              : ""
                          }
                          onFocus={() => {
                            setErrors({
                              ...errors,
                              "shippingAddress.address": "",
                            });
                          }}
                          type="text"
                          value={shippingAddress.address}
                          onChange={(evt) => {
                            setShippingAddress({
                              ...shippingAddress,
                              address: evt.target.value,
                            });
                          }}
                          placeholder="Address *"
                        />
                      </div>

                      {/* City */}
                      <div className="form-group col-lg-6">
                        <input
                          className={
                            errors["shippingAddress.city"] ? "red-border" : ""
                          }
                          onFocus={() => {
                            setErrors({
                              ...errors,
                              "shippingAddress.city": "",
                            });
                          }}
                          type="text"
                          value={shippingAddress.city}
                          onChange={(evt) => {
                            setShippingAddress({
                              ...shippingAddress,
                              city: evt.target.value,
                            });
                          }}
                          placeholder="City *"
                        />
                      </div>
                    </div>
                    {/* pin and mobile */}
                    <div className="row">
                      <div className="form-group col-lg-6">
                        <input
                          className={
                            errors["shippingAddress.pincode"]
                              ? "red-border"
                              : ""
                          }
                          type="text"
                          onFocus={() => {
                            setErrors({
                              ...errors,
                              "shippingAddress.pincode": "",
                            });
                          }}
                          value={shippingAddress.pincode}
                          onChange={(evt) => {
                            setShippingAddress({
                              ...shippingAddress,
                              pincode: evt.target.value,
                            });
                          }}
                          placeholder="Pincode *"
                        />
                      </div>
                      <div className="form-group col-lg-6">
                        <input
                          className={
                            errors["shippingAddress.mobile"] ? "red-border" : ""
                          }
                          type="text"
                          onFocus={() => {
                            setErrors({
                              ...errors,
                              "shippingAddress.mobile": "",
                            });
                          }}
                          value={shippingAddress.mobile}
                          onChange={(evt) => {
                            setShippingAddress({
                              ...shippingAddress,
                              mobile: evt.target.value,
                            });
                          }}
                          placeholder="Mobile *"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-lg-6">
                        <input
                          required=""
                          type="text"
                          value={shippingAddress.companyName}
                          onChange={(evt) => {
                            setShippingAddress({
                              ...shippingAddress,
                              companyName: evt.target.value,
                            });
                          }}
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="form-group col-lg-6">
                        <input
                          className={
                            errors["shippingAddress.email"] ? "red-border" : ""
                          }
                          type="text"
                          onFocus={() => {
                            setErrors({
                              ...errors,
                              "shippingAddress.email": "",
                            });
                          }}
                          value={shippingAddress.email}
                          onChange={(evt) => {
                            setShippingAddress({
                              ...shippingAddress,
                              email: evt.target.value,
                            });
                          }}
                          placeholder="Email *"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
            {/* Coupon section */}
            <div className="border cart-totals p-md-4 ml-30 mb-2">
              <h4 className="mb-3">Available Coupon</h4>
              {couponMessage.message && (
                <div
                  className={`alert ${
                    couponMessage.error ? "alert-danger" : "alert-success"
                  }`}
                >
                  {couponMessage.message}
                </div>
              )}
              {coupons.map((item, index) => {
                return (
                  <div className="card card-body" key={index}>
                    <div className="d-flex justify-content-between">
                      <h6 className="h6">{item.code}</h6>
                      <button
                        onClick={(evt) => {
                          setEnteredCoupon(item.code);
                          couponHandler(evt, item.code);
                        }}
                        className="btn btn-info p-0 px-2"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="">
                      <span style={{ fontSize: "5px" }}>
                        {parse(item.description)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Section */}
            <div className="border p-40 cart-totals ml-30 mb-50">
              <div className="d-flex align-items-end justify-content-between mb-30">
                <h4>Your Order</h4>
                <h6 className="text-muted">Subtotal</h6>
              </div>
              <div className="divider-2 mb-30"></div>
              <div className="table-responsive order_table checkout">
                <table className="table no-border">
                  <tbody>
                    {cart.map((product, index) => {
                      return (
                        <tr key={`cart-c-${index}`}>
                          <td className="image product-thumbnail">
                            <img
                              src={product.image}
                              alt="#"
                              style={{ height: "80px" }}
                            />
                          </td>
                          <td>
                            <h6 className="w-160 mb-5">
                              <Link
                                to={`/p/${product.slug}`}
                                target={`_blank`}
                                className="text-heading"
                              >
                                {product.name}
                              </Link>
                            </h6>
                            <div className="product-rate-cover">
                              <span className="font-small ml-4 text-muted">
                                {product.flavour} {product.weight}
                              </span>
                            </div>
                          </td>
                          <td>
                            <h6 className="text-muted pl-20 pr-20">
                              x {product.quantity}
                            </h6>
                          </td>
                          <td>
                            <h4 className="text-brand">
                              <i className="fa fa-inr"></i>
                              {`${
                                parseInt(product.quantity) *
                                parseInt(product.price)
                              }`}
                            </h4>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Adon Products */}
              <div className="table-responsive order_table checkout">
                <h5 className="py-4">Adon Products</h5>

                <table className="table no-border">
                  <tbody>
                    {adonCart.map((product, index) => {
                      return (
                        <tr key={`cart-c-${index}`}>
                          <td className="image product-thumbnail">
                            <img
                              src={product.image}
                              alt="#"
                              style={{ height: "80px" }}
                            />
                          </td>
                          <td>
                            <h6 className="w-160 mb-5">
                              <Link
                                to={`/p/${product.slug}`}
                                target={`_blank`}
                                className="text-heading"
                              >
                                {product.name}
                              </Link>
                            </h6>
                            <div className="product-rate-cover"></div>
                          </td>
                          <td>
                            <h6 className="text-muted pl-20 pr-20">
                              x {product.quantity}
                            </h6>
                          </td>
                          <td>
                            <h4 className="text-brand">
                              <i className="fa fa-inr"></i>
                              {`${
                                parseInt(product.quantity) *
                                parseInt(product.price)
                              }`}
                            </h4>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between">
                  <h5 className="py-4">Delivery Charge</h5>
                  <h6 className="py-4">
                    <i className="fa fa-inr"></i>
                    {shipping.amount}{" "}
                  </h6>
                </div>

                {/* Subtotal */}
                <div className="d-flex justify-content-between py-3">
                  <div className="">
                    <h5 className="">Subtotal</h5>
                  </div>
                  <div className="">
                    <h6>
                      <i className="fa fa-inr"></i> {subtotal}{" "}
                    </h6>
                  </div>
                </div>

                <div className="d-flex justify-content-between py-1">
                  <div className="">
                    <h6 className="">Applied Coupon</h6>
                    <h6 className="badge badge-info">
                      {appliedCoupon.code || ""}{" "}
                    </h6>
                  </div>
                  <div className="">
                    <h6>
                      <i className="fa fa-inr"></i> {discountWithCoupon}{" "}
                    </h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between pb-1">
                  <div className="">
                    <h6 className="">Used Wallet Amount</h6>
                  </div>
                  <div className="">
                    <h6>
                      <i className="fa fa-inr"></i> {usedWalletAmount}
                    </h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <h5 className="py-4">Total Amount</h5>
                  <h6 className="py-4">
                    <i className="fa fa-inr"></i> {totalAmountAfterAdon}{" "}
                  </h6>
                </div>
              </div>
            </div>

            {/* Cashback section */}
            {setting.cashbackStatus && (
              <div className="border cart-totals p-md-4 ml-30 mb-2">
                <h4 className="mb-3">Cashback</h4>
                <ul>
                  <li>
                    Earn Cashback {setting.cashback || 0}% of Product Amount
                  </li>
                  <li>
                    Earn Cashback upto <i className="fa fa-inr"></i>{" "}
                    {setting.maximumCashbackAmount || 0}
                  </li>
                </ul>
              </div>
            )}

            {/* Wallet Section */}
            <div className="border cart-totals p-md-4 ml-30 mb-2">
              <div className="d-flex justify-content-between">
                <h4 className="mb-10">My Wallet</h4>

                <span className="badge bg-info">
                  <i className="fa fa-inr"></i> {myWallet.totalAmount || 0}
                </span>
              </div>
              {myWallet.totalAmount ? (
                <div className="form-check">
                  <input
                    className="form-check-input ml-2"
                    type="checkbox"
                    onChange={(evt) => {
                      setIsUsingWallet(evt.target.checked);
                    }}
                    id="useWallet"
                  />
                  <label className="form-check-label" for="useWallet">
                    Use Wallet Amount
                  </label>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="p-40">
              <h4 className="mb-10">Apply Coupon</h4>
              <p className="mb-30">
                <span className="font-lg text-muted">Using A Promo Code?</span>
              </p>
              <form action="#" onSubmit={couponHandler}>
                <div className="d-flex justify-content-between">
                  <input
                    className="font-medium mr-0 coupon"
                    name="Coupon"
                    value={enteredCoupon}
                    onFocus={() =>
                      setCouponMessage({ ...couponMessage, message: "" })
                    }
                    onChange={(evt) => setEnteredCoupon(evt.target.value)}
                    placeholder="Enter Your Coupon"
                  />
                  <button className="btn">Apply</button>
                </div>

                {couponMessage.message && (
                  <div
                    className={`alert ${
                      couponMessage.error ? "alert-danger" : "alert-success"
                    }`}
                  >
                    {couponMessage.message}
                  </div>
                )}
              </form>
            </div>

            <div className="payment ml-30">
              <h4 className="mb-30">Payment</h4>
              <div className="payment_option">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value={"COD"}
                    name="payment"
                    onChange={(evt) => {
                      setSelectedPaymentMethod(evt.target.value);
                      setErrors({ ...errors, paymentMethod: "" });
                    }}
                    id="flexRadioDefault1"
                  />
                  <label className="form-check-label" for="flexRadioDefault1">
                    Cash on Delivery
                  </label>
                </div>
                <div className="">
                  {errors["paymentMethod"] ? (
                    <p className="error"> {errors["paymentMethod"]} </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="payment-logo d-flex">
                <img
                  className="mr-15"
                  src="assets/imgs/theme/icons/payment-paypal.svg"
                  alt=""
                />
                <img
                  className="mr-15"
                  src="assets/imgs/theme/icons/payment-visa.svg"
                  alt=""
                />
                <img
                  className="mr-15"
                  src="assets/imgs/theme/icons/payment-master.svg"
                  alt=""
                />
                <img src="assets/imgs/theme/icons/payment-zapper.svg" alt="" />
              </div>
              <button
                onClick={orderPlaceHandler}
                className="btn btn-fill-out btn-block mt-30"
              >
                Place an Order<i className="fi-rs-sign-out ml-15"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
