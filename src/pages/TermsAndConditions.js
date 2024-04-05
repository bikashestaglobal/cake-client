import React, { useEffect, useState, useContext, useRef } from "react";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Slider from "react-slick";
import SubscribeContainer from "../components/SubscribeContainer";

const TermsAndConditions = () => {
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
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return () => {
      unlisten();
    };
  }, [history]);

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
              <span></span> Payment & Refund Policy
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
                        <h2>Payment & Refund Policy</h2>
                        {/* <div class="entry-meta meta-1 meta-3 font-xs mt-15 mb-15">
                          <span class="post-by">
                            By <a href="#">Thecakeinc</a>
                          </span>
                          <span class="post-on has-dot">20 June 2023</span>
                          <span class="time-reading has-dot">8 mins read</span>
                          <span class="hit-count has-dot">29k Views</span>
                        </div> */}
                      </div>
                      <div class="single-content mb-10">
                        <p>
                          Welcome to The Cake Inc. These terms set out the rules
                          and regulations governing the use of our website. By
                          accessing and using our website, you agree to be bound
                          by these terms. Read them carefully.
                        </p>
                      </div>
                      <div class="single-content mb-50">
                        {/* General Information */}
                        <>
                          <h4>General Information </h4>
                          <ol>
                            <li>
                              <strong> The Cake Inc. </strong> is an
                              <strong> online bakery in Kolkata </strong>
                              specializing in a wide variety of
                              <strong> delicious cakes.</strong> We offer a
                              variety of flavors and designs for a variety of
                              occasions including birthdays, weddings,
                              anniversaries, bachelorette parties, baby showers
                              and more.
                            </li>
                            <li>
                              Our intended audience for this website is the city
                              of Kolkata where we provide our services. We
                              strive to serve Kolkatans with quality
                              <strong> delicious designer cakes online </strong>
                              on their festive occasions.
                            </li>
                          </ol>
                        </>
                        {/* Order Process */}
                        <>
                          <h4>Order Process</h4>
                          <ol>
                            <li>
                              Placing an order requires that you are at least 18
                              years old or have the permission of a parent or
                              guardian.
                            </li>
                            <li>
                              Browse our website to view our range of
                              <strong> cakes </strong> and select your preferred
                              flavors, sizes and designs.
                            </li>
                            <li>
                              <stron>Customized cakes</stron>, such as
                              <strong>
                                {" "}
                                cakes with a name or special decorations
                              </strong>
                              , must be given clear instructions at the time of
                              ordering.
                            </li>
                            <li>
                              We strive to provide accurate information on our
                              website, but apologize for any inconsistencies.
                            </li>
                          </ol>
                        </>

                        {/* Delivery */}
                        <>
                          <h4>Delivery</h4>
                          <ol>
                            <li>
                              We offer
                              <srong>
                                {" "}
                                home delivery of cakes within Kolkata{" "}
                              </srong>
                              city limits. Delivery charges may apply depending
                              on location and distance.
                            </li>
                            <li>
                              Delivery times may vary depending on
                              <strong> cake </strong>
                              availability and delivery address. We will do our
                              best to deliver your cake on the specified date
                              and time.
                            </li>
                            <li>
                              Ensure that the delivery address and contact
                              information provided during the ordering process
                              are correct and complete.
                            </li>
                          </ol>
                        </>

                        {/* Payment */}
                        <>
                          <h4>Payment</h4>
                          <ol>
                            <li>
                              Cakes and delivery charges can be paid using our
                              secure online payment system. We accept a variety
                              of payment methods including credit cards, debit
                              cards, online banking & upi.
                            </li>
                            <li>
                              The prices displayed on our website include
                              applicable taxes and fees.
                            </li>
                            <li>
                              Cancellation is only allowed until our team has
                              not confirmed the order. You can view the order
                              status under your My Account section. In case of
                              major problem you can reach out to our customer
                              support.
                            </li>
                            <li>
                              In case of cancellation, refunds will be processed
                              within 7-10 working days. Refunds for other issues
                              such as damaged <strong>cakes online</strong> are
                              handled on a case-by-case basis.
                            </li>
                          </ol>
                        </>

                        {/* Intellectual Property */}
                        <>
                          <h4>Intellectual Property</h4>
                          <ol>
                            <li>
                              All content on our website, including text, logos
                              and designs, etc. is protected by trademark and
                              intellectual property. You may not use, reproduce
                              or distribute our content without our written
                              permission.
                            </li>
                          </ol>
                        </>

                        {/* Disclaimer */}
                        <>
                          <h4>Disclaimer</h4>
                          <ol>
                            <li>
                              Although we strive to provide accurate and
                              up-to-date information on our website, we make no
                              warranties, express or implied, as to the
                              completeness, accuracy, reliability, suitability
                              or availability of the website.
                            </li>
                            <li>
                              We disclaim any responsibility for any errors or
                              omissions in the content of our website.
                            </li>
                            <li>
                              Our <strong> cakes in Kolkata </strong> may
                              contain allergens such as eggs, dairy, nuts and
                              wheat. It is the customer's responsibility to
                              notify us of any special dietary restrictions or
                              allergies. We cannot guarantee a completely
                              allergen-free environment and are not responsible
                              for any adverse effects caused by the consumption
                              of our products.
                            </li>
                            <li>
                              We reserve the right to change or discontinue any
                              product or service without notice. We may also
                              update these Terms from time to time and it is
                              your responsibility to review them regularly.
                            </li>
                          </ol>
                        </>

                        {/* Applicable Legislation */}
                        <>
                          <h4>Applicable Legislation</h4>
                          <p>
                            These Terms shall be governed by and construed by
                            laws of the State of West Bengal, India. Any dispute
                            arising out of the use of our website shall be
                            subject to the exclusive jurisdiction of the courts
                            of Kolkata.
                          </p>
                        </>

                        {/* Contact Information */}
                        <>
                          <h4>Contact Information</h4>
                          <p>
                            If you have any questions or concerns about these
                            Terms or our website, please contact us using the
                            following information:
                          </p>
                          <p>
                            Email:{" "}
                            <a href="mailto:contact@thecakeinc.com">
                              contact@thecakeinc.com
                            </a>{" "}
                            <br />
                            Telephone: <a href="tel:7890151818">7890151818</a>
                          </p>
                          <p>
                            Thank you for choosing us for your
                            <strong> cake needs in Kolkata. </strong>
                          </p>
                        </>
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

export default TermsAndConditions;
