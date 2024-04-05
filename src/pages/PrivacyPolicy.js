import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import SubscribeContainer from "../components/SubscribeContainer";
import Footer from "../layouts/Footer";

const PrivacyPolicy = () => {
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
              <span></span> Privacy Policy
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
                        <h2>Privacy Policy</h2>
                        {/* <div class="entry-meta meta-1 meta-3 font-xs mt-15 mb-15">
                          <span class="post-by">
                            By <a href="#">The Cake Inc</a>
                          </span>
                          <span class="post-on has-dot">20 June 2023</span>
                          <span class="time-reading has-dot">8 mins read</span>
                          <span class="hit-count has-dot">29k Views</span>
                        </div> */}
                      </div>
                      <div class="single-content mb-10">
                        <p>
                          Welcome to the Cake Inc.’s Privacy Policy. This page
                          provides necessary information about the collection,
                          utilization, and protection of your data when you
                          visit our website,{" "}
                          <Link href="/">http://www.thecakeinc.com/</Link>.
                        </p>
                        <p>
                          As a reputable cake-selling brand in Kolkata, we
                          strictly value safeguarding your privacy and making
                          sure that you avail yourself of a safe online
                          experience.
                        </p>
                      </div>
                      <div class="single-content mb-50">
                        {/* 1. Information We Collect */}
                        <>
                          <h4>1. Information We Collect</h4>
                          <p>
                            When you navigate through our website, make a
                            purchase, or simply browse it, we may collect
                            certain personal information, such as name, contact
                            details, delivery address, and email.
                          </p>
                          <p>
                            Note that it won't cause a threat to your privacy.
                            We just do so to process your orders and offer you
                            our <strong>online cake</strong> serving aids
                            efficiently. Be assured as we do not collect or
                            misuse any sensitive information without your
                            consent for any particular purpose.
                          </p>
                        </>

                        {/* Use of Collected Information */}
                        <>
                          <h4>2. Use of Collected Information</h4>
                          <p>
                            We utilize the collected orders to fulfill your
                            orders, process payments, and deliver your chosen
                            <strong>cakes online</strong>.
                          </p>
                          <p>
                            In addition, we may use your contact details to
                            communicate with you regarding your bookings, and
                            previous order updates when you
                            <strong> order cakes online </strong>, and inform
                            you about the latest insights, promotions, and our
                            special festive offers.
                          </p>
                          <p>
                            We may also use your data for internal purposes such
                            as analyzing website usage metrics and improving our
                            solutions.
                          </p>
                        </>

                        {/* Data Security */}
                        <>
                          <h4>Data Security</h4>
                          <p>
                            Protecting your sensitive information is our
                            priority. We have carried out industry-standard
                            security measures to protect your data from
                            unauthorized attacks or disclosure.
                          </p>

                          <p>
                            Our website makes use of
                            <strong> Secure Socket Layer (SSL) </strong>
                            encryption to encourage the safe transmission of
                            your information. Also, we regularly update our
                            security audits and conduct site audits to maintain
                            your data uprightness.
                          </p>
                        </>

                        {/* Cookies and Tracking Technologies */}
                        <>
                          <h4>Cookies and Tracking Technologies</h4>
                          <p>
                            We utilize cookies and tracking technologies to
                            enhance your browsing experience and offer
                            tailor-made services.
                          </p>
                          <p>
                            These help us remember your preferences, revamp our
                            website’s performance, and collect statistical
                            information about our website’s organic traffic.
                          </p>
                          <p>
                            You may have the option of disabling the cookies
                            function in your browser’s settings, but it may
                            impact our website’s performance.
                          </p>
                        </>

                        {/* Third-Party Disclosure */}
                        <>
                          <h4>Third-Party Disclosure</h4>
                          <p>
                            We may circulate your personal information with
                            trusted third parties who assist us in offering our
                            services of selling <strong> cakes online </strong>.
                            These parties are contractually obliged to protect
                            your data and use it solely for the causes
                            highlighted in this privacy policy.
                          </p>
                          <p>
                            We do not sell, trade, or transmit your sensitive or
                            personal information for marketing purposes without
                            your consent.
                          </p>
                        </>

                        {/* Your Rights */}
                        <>
                          <h4>Your Rights</h4>
                          <p>
                            You hold the right to access, correct, or delete the
                            information shared with us. If you wish to do so or
                            have any queries about our privacy policy, please
                            contact us through the details shared below.
                          </p>
                        </>

                        {/* Compliance with Laws */}
                        <>
                          <h4>Compliance with Laws</h4>
                          <p>
                            We stick to all applicable laws and regulations
                            related to safeguarding personal data. This includes
                            compliance with the{" "}
                            <strong>
                              General Data Protection Regulation (GDPR)
                            </strong>{" "}
                            and other privacy laws.
                          </p>
                        </>

                        {/* Updates to Privacy Policy */}
                        <>
                          <h4>Updates to Privacy Policy</h4>
                          <p>
                            We reserve the right to renovate this privacy policy
                            at any time. Any changes made will be visible on
                            this page with a revised “Last Updated” date. We
                            motivate you to review this privacy policy
                            periodically to stay updated with the latest trend
                            on how we protect your personal information.
                          </p>
                        </>

                        {/* Contact Us */}
                        <>
                          <h4 className={"text-center"}>Contact Us</h4>
                          <p>
                            Have any questions or queries related to our privacy
                            policy? Please talk to us at:
                          </p>
                          <p>
                            <strong>
                              Email:{" "}
                              <a href="mailto:support@thecakeinc.com">
                                support@thecakeinc.com
                              </a>{" "}
                              <br />
                              Address: Kolkata, India <br />
                              Phone: <a href="tel:7890151818">
                                +91-7890151818
                              </a>{" "}
                              <br />
                              Hours: 10:00 AM to 6:00 PM IST (Mon-Sat)
                            </strong>
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

export default PrivacyPolicy;
