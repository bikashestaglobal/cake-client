import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import SubscribeContainer from "../components/SubscribeContainer";
import Footer from "../layouts/Footer";

const DeliveryInformation = () => {
  const scrollRef = useRef(null);
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();

  // Scroll to view

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
      {/* <Header /> */}
      <main class="main pages" style={{ transform: "none" }} ref={scrollRef}>
        <div class="page-header breadcrumb-wrap">
          <div class="container">
            <div class="breadcrumb">
              <Link to="/">
                <i className="fa fa-home mr-5"></i>Home
              </Link>
              <span></span> Delivery Information
            </div>
          </div>
        </div>
        <div class="page-content pt-50" style={{ transform: "none" }}>
          <div class="container" style={{ transform: "none" }}>
            <div class="row" style={{ transform: "none" }}>
              <div
                class="col-xl-12 col-lg-12 m-auto"
                style={{ transform: "none" }}
              >
                <div class="row" style={{ transform: "none" }}>
                  <div class="col-lg-10 m-auto">
                    <div class="single-page pr-30 mb-lg-0 mb-sm-5">
                      <div class="single-header style-2">
                        <h2>Delivery Information</h2>
                        {/* <div class="entry-meta meta-1 meta-3 font-xs mt-15 mb-15">
                          <span class="post-by">
                            By <a href="#">The Cake Inc</a>
                          </span>
                          <span class="post-on has-dot">20 June 2023</span>
                          <span class="time-reading has-dot">8 mins read</span>
                          <span class="hit-count has-dot">29k Views</span>
                        </div> */}
                      </div>
                      <div class="single-content mb-50">
                        <h3>Delivery options</h3>
                        <p>
                          We offer convenient delivery options to ensure your
                          cake reaches you on time and in perfect condition.
                        </p>

                        <h4>1. Standard Delivery</h4>
                        <p>
                          Our standard delivery service ensures that your
                          <strong> cake online </strong> is delivered to your
                          door within 24 hours of your order being confirmed.
                        </p>

                        <h4>2. Express Delivery</h4>
                        <p>
                          For last-minute surprises, we offer express
                          <strong> cake delivery in Kolkata </strong> within 3
                          hours of ordering. Please note that express delivery
                          charges may apply.
                        </p>

                        <h3>Shipping Costs</h3>
                        <p>
                          We offer free delivery on all orders above Rs.500. A
                          nominal delivery charge of INR 50 applies to orders
                          below this amount.
                        </p>

                        <h3>Delivery Time</h3>
                        <p>
                          Our delivery team works hard to ensure your cake is
                          delivered quickly. Here are our standard shipping
                          times:
                        </p>
                        <p>
                          Morning time: 9.00-12.00 Afternoon time: 12.00-15.00
                          Evening time: 15:00-18:00 Night time: 18.00-21.00
                        </p>
                        <p>
                          Select the desired time during the purchase process.
                        </p>
                        <h3>Delivery Area </h3>
                        <p>
                          We currently offer
                          <strong> online cake delivery within Kolkata </strong>
                          city limits. Delivery outside these areas may incur an
                          additional charge.
                        </p>

                        <h3>Order Tracking</h3>
                        <p>
                          Once your cake has been delivered, you will receive a
                          confirmation email with a tracking link. Just click
                          the link to track your order in real-time.
                        </p>
                        <h3>Contact Information</h3>
                        <p>
                          If you have any questions or need assistance with
                          shipping, please contact our customer support team at
                          <a href="tel:7890151818"> +91-7890151818 </a> or email
                          us at
                          <a href="mailto:support@thecakeinc.com">
                            {" "}
                            support@thecakeinc.com{" "}
                          </a>
                          We are here to help!
                        </p>
                        <p>
                          Thank you for choosing <strong> The Cake Inc </strong>
                          . for your <strong> cake delivery in Kolkata </strong>
                          . We are waiting for you with our delicious and
                          beautifully made cakes!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SubscribeContainer />
      <Footer />
    </>
  );
};

export default DeliveryInformation;
