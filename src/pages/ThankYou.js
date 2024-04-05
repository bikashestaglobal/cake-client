import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Footer from "../layouts/Footer";
const ThankYou = (props) => {
  const history = useHistory();

  let orderId = props?.location?.orderId;
  let customOrderId = props?.location?.customOrderId;

  // Scroll To Top
  useEffect(() => {
    // window.scrollTo(0, 0);
    let totalAmount = localStorage.getItem("totalAmount");
    if (!totalAmount) totalAmount = 1;
    else {
      totalAmount = Number(totalAmount).toFixed(2);
    }

    window.fbq("track", "Purchase", {
      value: totalAmount,
      currency: "INR",
    });
  }, []);

  if (!orderId) {
    history.replace({ pathname: "/" });
  }

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
      <div
        className="page-content Thankyou"
        // style="background: url(assets/imgs/thankyou_bg.jpg) 0 0 no-repeat; background-size:cover;"
        // style={{
        //   background: ``,
        // }}
      >
        <div className="container">
          <div className="col-xl-12 col-lg-12 col-md-12 m-auto text-center">
            <div className="FoundSec1">
              <img src="/assets/imgs/tick-2.png" />
              <h2>Thank You</h2>
              <p>
                Hello! Your Order has been successfully placed. We will serve
                you the
                <strong> best cake </strong> from our oven, do leave a rating &
                review on the product as it will help us to serve you better.
              </p>
              <p className="mt-20">
                Your Order Id{" "}
                <span className="orderBg">{customOrderId || "N/A"}</span>
              </p>

              <Link
                onClick={(evt) => {
                  evt.preventDefault();
                  history.push(`/account/my-account/order/${orderId}`);
                }}
                className="foundBtn"
                to={"/account/my-account/orders"}
              >
                Check My Order
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThankYou;
