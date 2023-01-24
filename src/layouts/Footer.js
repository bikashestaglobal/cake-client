import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Config from "../config/Config";
import { CustomerContext } from "./Routes";
const Footer = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [contactUs, setContactUs] = useState({});
  const [socialLinks, setSocialLinks] = useState({});
  const [settings, setSettings] = useState({});

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

  // Get Setting
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/setting`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setContactUs(data?.body?.contactUs);
          setSocialLinks(data?.body?.socialLinks);
          setSettings(data.body);
        } else {
          console.log("Error Occured While loading headers : setting");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);
  const signOutHandler = (evt) => {
    evt.preventDefault();
    localStorage.removeItem("customerInfo");

    dispatch({ type: "CLEAR" });
    history.push("/account/login");
  };
  return (
    <footer className="main">
      <section className="featured section-padding bgcolorD">
        <div className="container">
          <div className="row">
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 mb-md-4 mb-xl-0">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/offer.png" alt="" />
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
                  <img src="/assets/imgs/fast-delivery.png" alt="" />
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
                  <img src="/assets/imgs/deal.png" alt="" />
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
                  <img src="/assets/imgs/assortment.png" alt="" />
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
                  <img src="/assets/imgs/returns.png" alt="" />
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
                  <Link to="/" className="mb-15">
                    <img
                      className="footer-logo"
                      src="/assets/imgs/theme/logo.png"
                      alt="logo"
                    />
                  </Link>
                  {/* <p className="font-lg text-heading">
                    WE BAKE IT, YOU HAVE IT
                  </p> */}
                </div>
                <ul className="contact-infor">
                  <li>
                    <i className="fa fa-map-marker"></i>
                    <strong>Address: </strong> <span>{contactUs.address}</span>
                  </li>
                  <li>
                    <i className="fa fa-headphones"></i>
                    <strong>Call Us:</strong>
                    <a href={`tel:${contactUs.customerSupportNumber}`}>
                      <span>(+91) {contactUs.customerSupportNumber}</span>
                    </a>
                  </li>
                  <li>
                    <i className="fa fa-paper-plane"></i>
                    <strong>Email:</strong>
                    <span>
                      <a href={`mailto:${contactUs.customerSupportEmail}`}>
                        <span> {contactUs.customerSupportEmail}</span>
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
                  <Link to="/about-us">About Us</Link>
                </li>
                <li>
                  <Link to="/delivery-information">Delivery Information</Link>
                </li>
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-and-condition">Terms &amp; Conditions </Link>
                </li>
                <li>
                  <Link to="/contact-us">Contact Us</Link>
                </li>
                {/* <li>
                  <Link to="/support-centre">Support Center</Link>
                </li>
                <li>
                  <Link to="/carrers">Careers</Link>
                </li> */}
              </ul>
            </div>
            <div className="footer-link-widget col">
              <h4 className="widget-title">Account</h4>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  {state?.jwtToken ? (
                    <Link onClick={signOutHandler} to="#">
                      Sign Out
                    </Link>
                  ) : (
                    <Link to="/account/login">Sign In</Link>
                  )}
                </li>
                <li>
                  <Link to={"/myCart"}>View Cart</Link>
                </li>
                <li>
                  <Link to="/account/my-account/wishlists">My Wishlist</Link>
                </li>
                <li>
                  <Link to="/account/my-account/orders">Track My Order</Link>
                </li>
                <li>
                  <a href="#">Help Ticket</a>
                </li>
                <li>
                  <Link to="/account/my-account/orders">Shipping Details</Link>
                </li>
                {/* <li>
                  <a href="#">Compare products</a>
                </li> */}
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
          <div className="col-xl-6 col-lg-6 col-md-6">
            <p className="font-sm mb-0">
              &copy; {year},<strong className="text-brand">The Cake Inc</strong>{" "}
              Powered by{" "}
              <strong className="text-brand">Creamy Cloud Pvt. Ltd.</strong>
              {" All rights reserved"}
            </p>
          </div>
          {/* <div className="col-xl-4 col-lg-6 text-center d-none d-xl-block">
            <div className="hotline d-lg-inline-flex mr-30">
              <img
                src="/assets/imgs/theme/icons/phone-call.svg"
                alt="hotline"
              />
              <p>
                <a href={`tel:${contactUs.mobile}`}>{contactUs.mobile}</a>
                <span>Working 8:00 - 22:00</span>
              </p>
            </div>
            <div className="hotline d-lg-inline-flex">
              <img
                src="/assets/imgs/theme/icons/phone-call.svg"
                alt="hotline"
              />
              <p>
                <a href={`tel:${contactUs.customerSupportNumber}`}>
                  {contactUs.customerSupportNumber}
                </a>
                <span>24/7 Support Center</span>
              </p>
            </div>
          </div> */}
          <div className="col-xl-6 col-lg-6 col-md-6 text-right d-none d-md-block">
            <div className="mobile-social-icon">
              <h6>Follow Us</h6>
              <a target={"_blank"} href={`${socialLinks.facebook}`}>
                <img
                  src="/assets/imgs/theme/icons/icon-facebook-white.svg"
                  alt=""
                />
              </a>
              <a target={"_blank"} href={`${socialLinks.twitter}`}>
                <img
                  src="/assets/imgs/theme/icons/icon-twitter-white.svg"
                  alt=""
                />
              </a>
              <a target={"_blank"} href={`${socialLinks.instagram}`}>
                <img
                  src="/assets/imgs/theme/icons/icon-instagram-white.svg"
                  alt=""
                />
              </a>
              <a target={"_blank"} href={`${socialLinks.pintrest}`}>
                <img
                  src="/assets/imgs/theme/icons/icon-pinterest-white.svg"
                  alt=""
                />
              </a>
              <a target={"_blank"} href={`${socialLinks.youtube}`}>
                <img
                  src="/assets/imgs/theme/icons/icon-youtube-white.svg"
                  alt=""
                />
              </a>
            </div>
            {/* <p className="font-sm">{settings.alertMessage}</p> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
