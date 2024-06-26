import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Footer from "../layouts/Footer";

const PaymentRedirectBackInstamojo = () => {
  const history = useHistory();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const { payment_id, payment_request_id, payment_status } = Object.fromEntries(
    urlSearchParams.entries()
  );
  const [errors, setErrors] = useState(false);

  const { state, dispatch } = useContext(CustomerContext);

  const scrollViewRef = useRef(null);
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));

  if (!customerInfo) {
    history.push("/account/login");
  }

  if (customerInfo && !customerInfo.jwtToken) {
    history.push("/account/login");
  }

  // Scroll into view
  useEffect(() => {
    if (scrollViewRef.current) scrollViewRef.current.scrollIntoView();
  }, []);

  if (!payment_id && !payment_request_id && !payment_status) {
    history.replace({ pathname: "/" });
  }

  // Update Order
  useEffect(() => {
    if (!payment_id && !payment_request_id && !payment_status) {
      return;
    }

    const orderId = localStorage.getItem("orderId");
    const customOrderId = localStorage.getItem("customOrderId");
    fetch(`${Config.SERVER_URL}/order/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (customerInfo && customerInfo.jwtToken) || ""
        }`,
      },
      body: JSON.stringify({
        paymentStatus: payment_status,
        paymentRequestId: payment_request_id,
        paymentId: payment_id,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            if (payment_status == "Credit") {
              localStorage.removeItem("orderId");
              dispatch({ type: "CLEAR_CART" });
              dispatch({ type: "CLEAR_ADON_CART" });
              dispatch({ type: "CLEAR_SHIPPING" });
              history.replace({
                pathname: "/thank-you",
                orderId: orderId,
                customOrderId: customOrderId,
              });
            } else {
              localStorage.removeItem("orderId");
              dispatch({ type: "CLEAR_CART" });
              dispatch({ type: "CLEAR_ADON_CART" });
              dispatch({ type: "CLEAR_SHIPPING" });
              history.replace({
                pathname: "/payment-failed",
                orderId: orderId,
              });
            }
          } else {
            localStorage.removeItem("orderId");
            dispatch({ type: "CLEAR_CART" });
            dispatch({ type: "CLEAR_ADON_CART" });
            dispatch({ type: "CLEAR_SHIPPING" });
            setErrors(true);
          }
          localStorage.removeItem("customOrderId");
        },
        (error) => {
          localStorage.removeItem("orderId");
          localStorage.removeItem("customOrderId");
          dispatch({ type: "CLEAR_CART" });
          dispatch({ type: "CLEAR_ADON_CART" });
          dispatch({ type: "CLEAR_SHIPPING" });
          setErrors(true);
        }
      );
  }, [payment_id, payment_request_id, payment_status]);

  // Delete Checkout Order Data
  useEffect(() => {
    if (!payment_id && !payment_request_id && !payment_status) {
      return;
    }
    const orderCheckoutId = localStorage.getItem("order-checkout");

    if (!orderCheckoutId) return;

    if (orderCheckoutId) {
      fetch(`${Config.SERVER_URL}/order-checkouts/${orderCheckoutId}`, {
        method: "DELETE",
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
            if (result.status == 200) {
              localStorage.removeItem("order-checkout");
            } else {
              localStorage.removeItem("order-checkout");
            }
          },
          (error) => {
            localStorage.removeItem("order-checkout");
          }
        );
    }
  }, [payment_id, payment_request_id, payment_status]);

  // scroll to top when user click back button
  // useEffect(() => {
  //   const handleScroll = () => {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   };

  //   window.addEventListener("popstate", handleScroll);

  //   return () => {
  //     window.removeEventListener("popstate", handleScroll);
  //   };
  // }, []);

  return (
    <>
      <main className="main" ref={scrollViewRef}>
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/" rel="nofollow">
                <i className="fa fa-home"></i>Home
                <span> Payment Verifications</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="container pb-80 pt-50"
          style={{
            background: `url('/assets/imgs/thankyou_bg.jpg')`,
            backgroundSize: "cover",
          }}
        >
          <div className="row">
            <div className="col-md-6 m-auto">
              {errors ? (
                <div className="card bg-white py-4 border-0">
                  <div
                    style={{
                      borderRadius: "150px",
                      height: "150px",
                      width: "190px",
                      background: "#F8FAF5",
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src="/assets/imgs/failed-money.webp"
                      style={{
                        borderRadius: "150px",
                        height: "150px",
                        width: "190px",
                      }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <h1>Oops! Something Went Wrong</h1>
                    <p className="mt-3 mb-2">
                      We are sorry to say that, We can not process your request
                      at this moment
                      <br />
                      Please contact to support.
                    </p>
                    <Link className={"btn"} to={"/contact-us"}>
                      Contact us
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="card bg-white py-4 border-0">
                  <div
                    style={{
                      borderRadius: "150px",
                      height: "150px",
                      width: "150px",
                      background: "#F8FAF5",
                      margin: "0 auto",
                    }}
                  >
                    <img src="/assets/imgs/loading-money.gif" />
                  </div>
                  <div className="card-body text-center">
                    <h1>Payment Confirmation</h1>
                    <p className="mt-3">
                      We are still processiong you payment request
                      <br />
                      Please wait ...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentRedirectBackInstamojo;
