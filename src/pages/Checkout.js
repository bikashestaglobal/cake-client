import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import Spinner from "../components/Spinner";
import date from "date-and-time";
import { BiRupee } from "react-icons/bi";

const Checkout = () => {
  const history = useHistory();

  const { state, dispatch } = useContext(CustomerContext);
  const { cart, shipping, coupon, adonCart = [] } = state;
  const scrollViewRef = useRef(null);
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

  const [availableShipAddress, setAvailableShipAddress] = useState([]);
  const [selectedShipAddress, setSedeletedShipAddress] = useState(null);
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [totalMrp, setTotalMrp] = useState("");
  const [discountOnMrp, setDiscountOnMrp] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [adonTotal, setAdonTotal] = useState("");
  const [discountWithCoupon, setDiscountWithCoupon] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [totalAmountAfterAdon, setTotalAmountAfterAdon] = useState("");
  const [coupons, setCoupons] = useState([]);

  const [enteredCoupon, setEnteredCoupon] = useState("");
  const [couponVerified, setCouponVerified] = useState(true);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingDateTime, setShippingDataTime] = useState({
    date: shipping.date || "",
    method: shipping.method || "",
    startTime: shipping.startTime || "",
    endTime: shipping.endTime || "",
    amount: shipping.amount || "",
  });
  const [shippingMethodModel, setShippingMethodModel] = useState(false);

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

  // changeDeliveryDateHandler
  const changeDeliveryDateHandler = (evt) => {
    evt.preventDefault();
    setShippingDataTime({
      date: evt.target.value,
      method: "",
      startTime: "",
      endTime: "",
      amount: "",
    });
    if (evt.target.value) {
      setShippingMethodModel(true);
    }

    dispatch({
      type: "SHIPPING_METHOD",
      payload: {
        date: evt.target.value,
        method: "",
        startTime: "",
        endTime: "",
        amount: "",
      },
    });
  };

  //
  const changeShippingMethodHandler = (evt) => {
    evt.preventDefault();

    if (!shippingDateTime.startTime || !shippingDateTime.endTime) {
      toast.error("Select Shipping Time");
      return;
    }
    dispatch({
      type: "SHIPPING_METHOD",
      payload: {
        ...shippingDateTime,
      },
    });
    setShippingMethodModel(false);
  };

  // orderPlaceHandler
  const orderPlaceHandler = (evt) => {
    evt.preventDefault();

    if (!selectedPaymentMethod) {
      toast.error("Payment Method is Required !!");
      return;
    }
    if (selectedShipAddress) {
      createOrderHandler();
    } else {
      if (useDifferentAddress) {
        updateAddressHandler();
      } else {
        toast.error("Delivery Address is Required !!");
      }
    }
  };

  // Update shipping Address
  const updateAddressHandler = () => {
    setLoaded(false);

    const updateData = {
      shippingAddress: {
        ...shippingAddress,
        pincode: shipping.pincode,
      },
    };

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
            createOrderHandler();
            return true;
          } else {
            setErrors({ ...result.error });
            toast.error(result.message);

            let keys = Object.keys(result.error);
            keys.forEach((item) => {
              toast.error(result.error[item]);
            });

            // Scroll to scrollViewRef
            if (scrollViewRef) scrollViewRef.current.scrollIntoView();
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
      paymentMethod: selectedPaymentMethod,
      subtotal: subtotal,
      adonTotalAmount: adonTotal,
      totalAmount: totalAmount,
      discountWithCoupon: discountWithCoupon,
      coupon: appliedCoupon,
      usedWalletAmount: usedWalletAmount,
      shippingMethod: { ...shipping, pincode: undefined },
    };

    if (selectedShipAddress) {
      orderData.shippingAddress = { ...selectedShipAddress, _id: undefined };
    } else {
      if (
        useDifferentAddress &&
        shippingAddress.name &&
        shippingAddress.landmark
      )
        orderData.shippingAddress = {
          ...shippingAddress,
          pincode: shipping.pincode,
        };
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
            console.log(result.error);
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

  // Scroll into view
  useEffect(() => {
    if (scrollViewRef) {
      // scrollViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Set shipping methods
  useEffect(() => {
    setShippingDataTime({
      date: shipping.date || "",
      method: shipping.method || "",
      startTime: shipping.startTime || "",
      endTime: shipping.endTime || "",
      amount: shipping.amount || "",
      pincode: shipping.pincode || "",
    });

    if (shipping.date && (!shipping.startTime || !shipping.endTime)) {
      setShippingMethodModel(true);
    }
  }, [shipping]);

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
            if (result.body.shippingAddresses.length) {
              setAvailableShipAddress(result.body.shippingAddresses);
            } else {
              setUseDifferentAddress(true);
            }
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

    let total_mrp = cart
      .map((product) => product.mrp * product.quantity)
      .reduce((prev, curr) => prev + curr, 0);
    setTotalMrp(total_mrp);

    let total_discount_on_mrp = total_mrp - sub_total;
    setDiscountOnMrp(total_discount_on_mrp);

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
  }, [cart, adonCart, appliedCoupon, setting, isUsingWallet, shipping]);

  // Get Shipping methods
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/shipping-method`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setShippingMethods(data.body);
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
    setCouponVerified(false);

    // Check coupon code is valid or not
    if (!coupons.some((c) => c.code === coupon)) {
      toast.error("Invalid Coupon Code");
      setCouponVerified(true);
      return;
    }

    // Check coupon amount
    const filteredCoupon = coupons.filter((c) => c.code === coupon);

    if (filteredCoupon.length && subtotal < filteredCoupon[0].minimumAmount) {
      toast.error(
        `Amount is Must at least Rs ${filteredCoupon[0].minimumAmount}`
      );
      setCouponVerified(true);
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
        setCouponVerified(true);
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
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setCouponVerified(true);
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

  const removeAppliedCouponHandler = () => {
    setAppliedCoupon({
      code: "",
      discount: "",
      discountType: "",
    });
    toast.success("Coupon removed Successfully !");
  };

  return (
    <main className="main">
      <div className="page-header breadcrumb-wrap">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/" rel="nofollow">
              <i className="fa fa-home"></i>Home
            </Link>
          </div>
        </div>
      </div>
      <div className="container mb-80 mt-50">
        <div className="row">
          <div className="col-lg-8 mb-40">
            <h3 className="heading-2 mb-10" ref={scrollViewRef}>
              Checkout
            </h3>
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
            {/* Delivery Details */}
            <div className="row">
              <h4 className="mb-30">Delivery Details</h4>
              <form method="post">
                {/* Shipping Address */}
                <div className="row">
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
                                <h6>{address.address}</h6>
                                <h6>{address.landmark}</h6>
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
                </div>

                <div className="ship_detail">
                  <div
                    // id="collapseAddress"
                    className="different_address"
                  >
                    <div className="row">
                      {/* name */}
                      <div className="form-group col-lg-6">
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

                      {/* Mobile */}
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

                      {/* Address */}
                      <div className="form-group col-lg-6">
                        <input
                          className={
                            errors["shippingAddress.landmark"]
                              ? "red-border"
                              : ""
                          }
                          onFocus={() => {
                            setErrors({
                              ...errors,
                              "shippingAddress.landmark": "",
                            });
                          }}
                          type="text"
                          value={shippingAddress.landmark}
                          onChange={(evt) => {
                            setShippingAddress({
                              ...shippingAddress,
                              landmark: evt.target.value,
                            });
                          }}
                          placeholder="Landmark *"
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

                      {/* Pincode */}
                      <div className="form-group col-lg-6">
                        <input
                          type="text"
                          disabled
                          readOnly
                          value={shipping.pincode}
                          placeholder="Pincode *"
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

              {coupons.map((item, index) => {
                return (
                  <div className="card card-body" key={index}>
                    <div className="d-flex justify-content-between">
                      <h6 className="h6">{item.code}</h6>
                      {appliedCoupon.code == item.code ? (
                        <button
                          onClick={(evt) => {
                            setEnteredCoupon("");
                            removeAppliedCouponHandler();
                          }}
                          className="btn"
                        >
                          Applied <i className="fa fa-trash"></i>
                        </button>
                      ) : (
                        <button
                          onClick={(evt) => {
                            setEnteredCoupon(item.code);
                            couponHandler(evt, item.code);
                          }}
                          className="btn"
                        >
                          {couponVerified ? "Apply" : <Spinner />}
                        </button>
                      )}
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
                              <span className="font-small text-muted">
                                Weight {product.weight}
                              </span>{" "}
                              <span className="font-small text-muted">
                                Qty {product.quantity}
                              </span>
                            </div>
                            <div className="product-rate-cover">
                              <span className="font-small ml-4 text-muted">
                                <i className="fa fa-inr"></i> {product.price}
                              </span>{" "}
                              <span className="font-small ml-4 text-muted">
                                <strike>
                                  <i className="fa fa-inr"></i>
                                  {product.mrp}
                                </strike>
                              </span>{" "}
                              <span className="hot text-danger">
                                {100 -
                                  Math.ceil(
                                    (product.price / product.mrp) * 100
                                  )}
                                % off
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
                {adonCart.length ? (
                  <>
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
                  </>
                ) : (
                  ""
                )}

                {/* total mrp */}
                <div className="d-flex justify-content-between py-3">
                  <div className="">
                    <h5 className="">Total MRP</h5>
                  </div>
                  <div className="">
                    <h6>
                      <i className="fa fa-inr"></i> {totalMrp}{" "}
                    </h6>
                  </div>
                </div>

                <div className="d-flex justify-content-between py-3">
                  <div className="">
                    <h6 className="">Discount on MRP</h6>
                  </div>
                  <div className="">
                    <h6>
                      - <i className="fa fa-inr"></i> {discountOnMrp}{" "}
                    </h6>
                  </div>
                </div>

                <div className="d-flex justify-content-between py-1">
                  <div className="">
                    <h6 className="">Coupon Dispount</h6>
                    <h6 className="badge badge-info">
                      {appliedCoupon.code || ""}{" "}
                    </h6>
                  </div>
                  <div className="">
                    <h6>
                      - <i className="fa fa-inr"></i> {discountWithCoupon}{" "}
                    </h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between pb-1">
                  <div className="">
                    <h6 className="">Adon Total Amount</h6>
                  </div>
                  <div className="">
                    <h6>
                      <i className="fa fa-inr"></i> {adonTotal}
                    </h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between pb-1">
                  <div className="">
                    <h6 className="">Used Wallet Amount</h6>
                  </div>
                  <div className="">
                    <h6>
                      - <i className="fa fa-inr"></i> {usedWalletAmount}
                    </h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="py-4">
                    <div className="d-flex">
                      <h6>Delivery Charge</h6>
                      <button
                        onClick={(evt) => {
                          setShippingMethodModel(true);
                        }}
                        className="btn p-1 px-2 bg-white text-danger"
                      >
                        <i className="fa fa-pencil"></i>
                      </button>
                    </div>
                    <div className="">
                      <span className="badge text-muted p-0">
                        {shipping.method}
                      </span>
                    </div>
                    <div className="">
                      <span className="badge text-muted p-0">
                        {date.format(
                          date.parse(shipping.date, "YYYY-MM-DD"),
                          "DD-MMM-YYYY"
                        )}
                      </span>
                      <span className="badge text-muted">
                        (
                        {date.format(
                          date.parse(shipping.startTime, "hh:mm"),
                          "hh:mm A"
                        )}
                        {"-"}
                        {date.format(
                          date.parse(shipping.endTime, "hh:mm"),
                          "hh:mm A"
                        )}
                        )
                      </span>
                    </div>
                  </div>
                  <h6 className="py-4">
                    <i className="fa fa-inr"></i>
                    {shipping.amount}
                  </h6>
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

                <span className="btn">
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
                    onChange={(evt) => setEnteredCoupon(evt.target.value)}
                    placeholder="Enter Your Coupon"
                  />
                  {appliedCoupon.code ? (
                    <button
                      onClick={(evt) => {
                        setEnteredCoupon("");
                        removeAppliedCouponHandler();
                      }}
                      className="btn d-flex justify-content-between align-items-center"
                    >
                      <i className="fa fa-trash"></i> Applied
                    </button>
                  ) : (
                    <button className="btn">
                      {couponVerified ? "Apply" : <Spinner />}
                    </button>
                  )}
                </div>
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
                Place an Order<i className="fa fa-sign-out ml-15"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Custom modal */}
      <div
        id="myModal"
        className="custom-modal2"
        style={{
          display: shippingMethodModel ? "block" : "none",
        }}
      >
        <div className="custom-modal2-content">
          <span
            className="custom-modal2-close"
            onClick={() => {
              if (!shippingDateTime.startTime || !shippingDateTime.endTime) {
                toast.error("Select Shipping Time");
                return;
              }
              setShippingMethodModel(false);
            }}
          >
            &times;
          </span>

          <h5>Change Shipping Methods</h5>
          <div className="form-group">
            <h6 className="py-3">Select Delivery Date</h6>
            <input
              className="form-control"
              type="date"
              onChange={changeDeliveryDateHandler}
              value={date.format(new Date(shipping.date), "YYYY-MM-DD")}
              min={date.format(new Date(), "YYYY-MM-DD")}
            />
          </div>

          <div
            className="accordion accordion-flush mt-3"
            id="accordionFlushExample"
          >
            {shippingMethods.map((method, index) => {
              return (
                <div className="accordion-item">
                  <h2 className="accordion-header " id="flush-headingOne">
                    <button
                      className="accordion-button collapsed d-flex justify-content-between"
                      type="button"
                      onClick={(evt) => {
                        setShippingDataTime({
                          ...shippingDateTime,
                          method: method.name,
                          amount: method.amount,
                        });
                      }}
                      data-bs-toggle="collapse"
                      data-bs-target={`#flush-collapseOne${index}`}
                      aria-expanded="false"
                      aria-controls={`flush-collapseOne${index}`}
                    >
                      <p>{method.name}</p>

                      <p className="">
                        <BiRupee style={{ marginTop: "-4px" }} />
                        {method.amount}
                      </p>
                    </button>
                  </h2>
                  <div
                    id={`flush-collapseOne${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div key={`time-${index}`} className="accordion-body">
                      {method.shippingTimes.map((time, index) => {
                        const today = date.format(new Date(), "DD-MM-YYYY");
                        const currentTime = date.format(
                          date.addHours(new Date(), 4),
                          "HH:mm"
                        );
                        const selectedDate = date.format(
                          new Date(shippingDateTime.date),
                          "DD-MM-YYYY"
                        );

                        const endTime = date.transform(
                          time.endTime,
                          "HH:mm",
                          "HH:mm"
                        );

                        return (
                          <div className="py-1 px-2 border mb-2">
                            <div
                              className="form-check m-0"
                              key={`time-${index}`}
                            >
                              <input
                                onChange={(evt) => {
                                  setShippingDataTime({
                                    ...shippingDateTime,
                                    startTime: time.startTime,
                                    endTime: time.endTime,
                                  });
                                }}
                                className="form-check-input ml-3"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                                disabled={
                                  today == selectedDate && currentTime > endTime
                                    ? true
                                    : false
                                }
                              />
                              <label
                                className="form-check-label"
                                for="flexRadioDefault1"
                              >
                                {date.transform(
                                  time.startTime,
                                  "HH:mm",
                                  "hh:mm"
                                )}
                                -
                                {date.transform(
                                  time.endTime,
                                  "HH:mm",
                                  "hh:mm A"
                                )}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="">
              <button className="btn" onClick={changeShippingMethodHandler}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
