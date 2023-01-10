import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Config from "../config/Config";
const Footer = () => {
  const [categories, setCategories] = useState([]);
  // Get All Categories
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/parent-category?skip=0&limit=10`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setCategories(data.body);
        } else {
          console.log("Error Occured While loading category : header");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);
  return (
    <footer className="main">
      <section
        className="featured section-padding"
        style={{ background: "#545151" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 mb-md-4 mb-xl-0">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/price-tag.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">Best prices & offers</h3>
                  <p>Orders $50 or more</p>
                </div>
              </div>
            </div>
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/free-delivery.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">Free delivery</h3>
                  <p>24/7 amazing services</p>
                </div>
              </div>
            </div>
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/handshake.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">Great daily deal</h3>
                  <p>When you sign up</p>
                </div>
              </div>
            </div>
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/team.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">Wide assortment</h3>
                  <p>Mega Discounts</p>
                </div>
              </div>
            </div>
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/return.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">Easy returns</h3>
                  <p>Within 30 days</p>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 d-xl-none">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/theme/icons/icon-6.svg" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">Safe delivery</h3>
                  <p>Within 30 days</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <section className="section-padding footer-mid">
        <div className="container pt-15 pb-20">
          <div className="row">
            <div className="col">
              <div className="widget-about font-md mb-md-3 mb-lg-3 mb-xl-0">
                <div className="logo mb-30">
                  <a href="index.html" className="mb-15">
                    <img src="/assets/imgs/theme/logo.png" alt="logo" />
                  </a>
                  <p className="font-lg text-heading">
                    Awesome grocery store website template
                  </p>
                </div>
                <ul className="contact-infor">
                  <li>
                    <i className="fa fa-map-marker"></i>
                    <strong>Address: </strong>{" "}
                    <span>
                      5171 W Campbell Ave undefined Kent, Utah 53127 United
                      States
                    </span>
                  </li>
                  <li>
                    <i className="fa fa-headphones"></i>
                    <strong>Call Us:</strong>
                    <span>(+91) - 540-025-124553</span>
                  </li>
                  <li>
                    <i className="fa fa-paper-plane"></i>
                    <strong>Email:</strong>
                    <span>
                      <a
                        href="/cdn-cgi/l/email-protection"
                        className="__cf_email__"
                        data-cfemail="4536242920050b2036316b262a28"
                      >
                        [email&#160;protected]
                      </a>
                    </span>
                  </li>
                  <li>
                    <i className="fa fa-clock-o"></i>
                    <strong>Hours:</strong>
                    <span>10:00 - 18:00, Mon - Sat</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-link-widget col">
              <h4 className="widget-title">Company</h4>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Delivery Information</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms &amp; Conditions</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Support Center</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
              </ul>
            </div>
            <div className="footer-link-widget col">
              <h4 className="widget-title">Account</h4>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  <a href="#">Sign In</a>
                </li>
                <li>
                  <a href="#">View Cart</a>
                </li>
                <li>
                  <a href="#">My Wishlist</a>
                </li>
                <li>
                  <a href="#">Track My Order</a>
                </li>
                <li>
                  <a href="#">Help Ticket</a>
                </li>
                <li>
                  <a href="#">Shipping Details</a>
                </li>
                <li>
                  <a href="#">Compare products</a>
                </li>
              </ul>
            </div>
            <div className="footer-link-widget col">
              <h4 className="widget-title">Corporate</h4>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  <a href="#">Become a Vendor</a>
                </li>
                <li>
                  <a href="#">Affiliate Program</a>
                </li>
                <li>
                  <a href="#">Farm Business</a>
                </li>
                <li>
                  <a href="#">Farm Careers</a>
                </li>
                <li>
                  <a href="#">Our Suppliers</a>
                </li>
                <li>
                  <a href="#">Accessibility</a>
                </li>
                <li>
                  <a href="#">Promotions</a>
                </li>
              </ul>
            </div>
            <div className="footer-link-widget col">
              <h4 className="widget-title">Popular</h4>
              <ul className="footer-list mb-sm-5 mb-md-0">
                {categories.length
                  ? categories.map((cat, i) => {
                      return (
                        <li key={i}>
                          <Link to={`/${cat.slug}`}> {cat.name} </Link>
                        </li>
                      );
                    })
                  : ""}
              </ul>
            </div>
            {/* <div className="footer-link-widget widget-install-app col">
                            <h4 className="widget-title">Install App</h4>
                            <p className="wow fadeIn animated">From App Store or Google Play</p>
                            <div className="download-app">
                                <a href="#" className="hover-up mb-sm-2 mb-lg-0"><img className="active" src="/assets/imgs/theme/app-store.jpg" alt="" /></a>
                                <a href="#" className="hover-up mb-sm-2"><img src="/assets/imgs/theme/google-play.jpg" alt="" /></a>
                            </div>
                            <p className="mb-20">Secured Payment Gateways</p>
                            <img className="wow fadeIn animated" src="/assets/imgs/theme/payment-method.png" alt="" />
                        </div>  */}
          </div>
        </div>
      </section>

      <div className="container pb-30">
        <div className="row align-items-center">
          <div className="col-12 mb-30">
            <div className="footer-bottom"></div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <p className="font-sm mb-0">
              &copy; 2022, <strong className="text-brand">Cake Shop</strong>
              <br />
              All rights reserved
            </p>
          </div>
          <div className="col-xl-4 col-lg-6 text-center d-none d-xl-block">
            <div className="hotline d-lg-inline-flex mr-30">
              <img
                src="/assets/imgs/theme/icons/phone-call.svg"
                alt="hotline"
              />
              <p>
                1900 - 6666<span>Working 8:00 - 22:00</span>
              </p>
            </div>
            <div className="hotline d-lg-inline-flex">
              <img
                src="/assets/imgs/theme/icons/phone-call.svg"
                alt="hotline"
              />
              <p>
                1900 - 8888<span>24/7 Support Center</span>
              </p>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 text-end d-none d-md-block">
            <div className="mobile-social-icon">
              <h6>Follow Us</h6>
              <a href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-facebook-white.svg"
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-twitter-white.svg"
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-instagram-white.svg"
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-pinterest-white.svg"
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-youtube-white.svg"
                  alt=""
                />
              </a>
            </div>
            <p className="font-sm">
              Up to 15% discount on your first subscribe
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
