import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Footer from "../layouts/Footer";

const PaymentPending = (props) => {
  const history = useHistory();

  const { state, dispatch } = useContext(CustomerContext);
  const orderId = props?.location?.orderId;
  if (!orderId) {
    history.replace({ pathname: "/" });
  }

  const scrollViewRef = useRef(null);

  // Scroll into view
  useEffect(() => {
    if (scrollViewRef.current) scrollViewRef.current.scrollIntoView();
  }, []);

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
      <main className="main">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/" rel="nofollow">
                <i className="fa fa-home"></i>Home
                <span> Payment Pending</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="container pb-80 pt-50"
          ref={scrollViewRef}
          style={{
            background: `url('/assets/imgs/thankyou_bg.jpg')`,
            backgroundSize: "cover",
          }}
        >
          <div className="row">
            <div className="col-md-6 m-auto">
              <div className="card bg-white py-4 border-0">
                <div
                  style={{
                    borderRadius: "100px",
                    height: "150px",
                    width: "190px",
                    background: "#F8FAF5",
                    margin: "0 auto",
                  }}
                >
                  <img
                    src="/assets/imgs/failed-money.webp"
                    style={{
                      borderRadius: "100px",
                      height: "150px",
                      width: "190px",
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h1>Payment Pending</h1>
                  <p className="mt-3">
                    We regret to inform you that your payment is still pending.
                    <br />
                    Please check your payment details.
                  </p>
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

export default PaymentPending;
