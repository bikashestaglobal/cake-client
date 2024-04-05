import React, { useState, useEffect, useContext } from "react";
import Config from "../config/Config";
import $ from "jquery";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const Header = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const { jwtToken, cart = [] } = state;
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));

  // State Variable
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [enteredQuery, setEnteredQuery] = useState("");
  const [focus, setFocus] = useState(false);
  const [flavours, setFlavours] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [myWishlists, setMyWishlist] = useState([]);
  const [contactUs, setContactUs] = useState({});
  const [socialLinks, setSocialLinks] = useState({});
  const [categoryNavigationBanner, setCategoryNavigationBanner] = useState([]);
  const [settings, setSettings] = useState({});
  const [year, setyear] = useState(new Date().getFullYear());
  const [mobileMenu, setMobileMenu] = useState({
    flavour: false,
    type: false,
    shape: false,
    occasion: false,
  });

  // Get All Categories
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/main.js";
    script.async = false;
    document.body.appendChild(script);

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

    var header = $(".sticky-bar");
    var win = $(window);
    win.on("scroll", function () {
      var scroll = win.scrollTop();
      if (scroll < 200) {
        header.removeClass("stick");
        $(".header-style-2 .categories-dropdown-active-large").removeClass(
          "open"
        );
        $(".header-style-2 .categories-button-active").removeClass("open");
      } else {
        header.addClass("stick");
      }
    });
  }, []);

  useEffect(() => {
    if (customerInfo && customerInfo.jwtToken) {
      dispatch({ type: "CUSTOMER", payload: customerInfo });
    }
  }, []);

  useEffect(() => {
    if (customerInfo) {
      dispatch({ type: "UPDATE_STATE", payload: customerInfo });
    }
  }, []);

  // Get All Sub Categories
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/category?skip=0&limit=50`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setSubCategories(data.body);
        } else {
          console.log("Error Occured While loading category : header");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });

    var header = $(".sticky-bar");
    var win = $(window);
    win.on("scroll", function () {
      var scroll = win.scrollTop();
      if (scroll < 200) {
        header.removeClass("stick");
        $(".header-style-2 .categories-dropdown-active-large").removeClass(
          "open"
        );
        $(".header-style-2 .categories-button-active").removeClass("open");
      } else {
        header.addClass("stick");
      }
    });
  }, []);

  // My Wishlists
  useEffect(() => {
    if (customerInfo && customerInfo.jwtToken) {
      fetch(`${Config.SERVER_URL}/wishlists/myWishlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${customerInfo.jwtToken}`,
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            if (result.status == 200) {
              setMyWishlist(result.body);
              // toast.success(result.message);
            } else {
              if (result.message == "jwt expired") {
                dispatch({ type: "CLEAR" });
                localStorage.removeItem("customerInfo");
                toast.error(result.message);
              }
            }
          },
          (error) => {
            // toast.error(error.message);
          }
        );
    }
  }, []);

  const signOut = (evt) => {
    evt.preventDefault();
    localStorage.removeItem("customerInfo");

    dispatch({ type: "CLEAR" });
    history.push("/account/login");
  };

  const mobileHeaderClose = () => {
    const container = $(".mobile-header-active");
    const wrapper4 = $("body");
    container.removeClass("sidebar-visible");
    wrapper4.removeClass("mobile-menu-active");
  };

  const mobileHeaderActive = (e) => {
    // const navbarTrigger = document.getElementsByClassName("burger-icon");

    var navbarTrigger = $(".burger-icon"),
      endTrigger = $(".mobile-menu-close"),
      container = $(".mobile-header-active"),
      wrapper4 = $("body");

    wrapper4.prepend('<div className="body-overlay-1"></div>');

    e.preventDefault();
    container.addClass("sidebar-visible");
    wrapper4.addClass("mobile-menu-active");

    endTrigger.on("click", function () {
      container.removeClass("sidebar-visible");
      wrapper4.removeClass("mobile-menu-active");
    });

    $(".body-overlay-1").on("click", function () {
      container.removeClass("sidebar-visible");
      wrapper4.removeClass("mobile-menu-active");
    });
  };

  // Search query handler
  const searchHandler = ({
    query = enteredQuery,
    category = selectedCategory,
  }) => {
    setProductLoading(true);
    if (query) {
      fetch(
        `${Config.SERVER_URL}/product/search?query=${query}&category=${category}&skip=0&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              customerInfo ? customerInfo.jwtToken : ""
            }`,
          },
        }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setProductLoading(false);
            if (result.status == 200) {
              setProducts(result.body);
            } else {
              console.log(result);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      setProducts([]);
      setProductLoading(false);
    }
  };

  // Submit query
  const handleSubmit = (event) => {
    event.preventDefault();
    setTimeout(() => {
      setFocus(false);
    }, 1000);
    mobileHeaderClose();
    history.push(`/search?q=${enteredQuery}`);
  };

  // Get Flavours
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/flavour?limit=20`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setFlavours(data.body);
        } else {
          console.log("Error Occured While loading headers : flavours");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get Types
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/type`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setTypes(data.body);
        } else {
          console.log("Error Occured While loading headers : types");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get Colors
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/color`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setColors(data.body);
        } else {
          console.log("Error Occured While loading headers : colors");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get Shapes
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/shape`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setShapes(data.body);
        } else {
          console.log("Error Occured While loading headers : shape");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get Occasions
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/occasions?limit=25`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setOccasions(data.body);
        } else {
          console.log("Error Occured While loading headers : shape");
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
          setCategoryNavigationBanner(data?.body?.categoryNavigationBanner);
        } else {
          console.log("Error Occured While loading headers : setting");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Clear shipping method when cart is empty
  // useEffect(() => {
  //   if (state?.cart?.length == 0) {
  //     dispatch({
  //       type: "CLEAR_SHIPPING_METHOD",
  //     });
  //   }
  // }, [state.cart]);

  // check shipping date and time
  useEffect(() => {
    if (customerInfo && customerInfo.shipping) {
      let shippingDateString = customerInfo?.shipping?.date;
      if (shippingDateString) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let shippingDate = new Date(shippingDateString);
        shippingDate.setHours(0, 0, 0, 0);
        if (shippingDate < today) {
          dispatch({ type: "CLEAR_SHIPPING_METHOD" });
          dispatch({ type: "CLEAR_CART" });
        }
      }
    }
  });

  // handleHideMegaMenu
  const handleHideMegaMenu = () => {
    const elements = document.querySelectorAll(".mega-menu");
    for (let element of elements) {
      element.style.display = "none";
    }
  };

  // handleShowMegaMenu
  const handleShowMegaMenu = () => {
    const elements = document.querySelectorAll(".mega-menu");
    for (let element of elements) {
      element.style.display = "block";
    }
  };

  // disable right click
  useEffect(() => {
    const handleContextmenu = (e) => {
      // e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  // clear localStorage
  // function handleStorageEvent() {
  //   localStorage.clear();
  // }

  // useEffect(() => {
  //   window.addEventListener("storage", handleStorageEvent);
  // });

  return (
    <>
      <ToastContainer />
      {/* Quick view */}
      <header className="header-area header-style-1 header-height-2">
        {settings.alertMessage ? (
          <div className="mobile-promotion px-3">
            {/* <marquee scrollamount="4">
              <span>{settings.alertMessage}</span>
            </marquee> */}
            <div className="d-flex justify-content-center">
              {/* <a
                className="text-brand text-white"
                href={`tel:${contactUs.mobile}`}
              >
                <i className="fa fa-phone"></i> +91-{contactUs.mobile}
              </a> */}

              <a
                className="text-brand text-white"
                href={`https://api.whatsapp.com/send?phone=${contactUs.whatsappNumber}&text=Hi TheCakeInc,\n I want to place an order.`}
              >
                Connect us on Whatsapp <i className="fa fa-whatsapp"></i> +91-
                {contactUs.whatsappNumber}
              </a>
            </div>
          </div>
        ) : null}
        <div className="header-top header-top-ptb-1 d-none d-lg-block">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6">
                {/* <!-- <div className="header-info">
                                <ul>
                                    <li><a href="page-about.htlm">About Us</a></li>
                                    <li><a href="page-account.html">My Account</a></li>
                                    <li><a href="shop-wishlist.html">Wishlist</a></li>
                                    <li><a href="shop-order.html">Order Tracking</a></li>
                                </ul>
                            </div> --> */}
              </div>

              <div className="col-xl-6 col-lg-6">
                <div className="header-info header-info-right">
                  <ul>
                    <li>
                      Need help? Call Us:{" "}
                      <strong className="text-brand">
                        {" "}
                        <a
                          className="text-brand"
                          href={`tel:${contactUs.mobile}`}
                        >
                          + 91 {contactUs.mobile}
                        </a>
                      </strong>
                    </li>
                    <li>
                      E-mail:{" "}
                      <strong className="text-brand">
                        <a
                          className="text-brand"
                          href={`mailto:${contactUs.email}`}
                        >
                          {contactUs.email}
                        </a>
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-middle header-middle-ptb-1 d-none d-lg-block">
          <div className="container">
            <div className="header-wrap">
              <div className="logo logo-width-1">
                <Link to="/">
                  <img
                    style={{ width: 150 }}
                    src="/assets/imgs/theme/logo.png"
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="header-right">
                <div className="search-style-2">
                  <form action="#" onSubmit={handleSubmit}>
                    <div className="input-group">
                      <input
                        name={"query"}
                        type="text"
                        value={enteredQuery}
                        onBlur={() => {
                          setTimeout(() => {
                            setFocus(false);
                          }, 1000);
                          // setEnteredQuery("");
                        }}
                        onChange={(evt) => {
                          setEnteredQuery(evt.target.value);
                          searchHandler({ query: evt.target.value });
                          setFocus(true);
                        }}
                        className="form-control"
                        placeholder={`Search for cakes & more...`}
                      />
                      <div className="input-group-append">
                        <button className="btn btn-secondary" type="submit">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>

                    <div className="searched-items" style={{ width: "100%" }}>
                      {focus
                        ? products.length
                          ? products.map((product) => {
                              return (
                                <>
                                  <Link
                                    to={`/search?q=${product.name}`}
                                    onClick={() => setProducts([])}
                                  >
                                    <div className="d-flex align-items-center mb-2 mt-1">
                                      <i className="fa fa-search me-2"></i>
                                      <span className=" d-block">
                                        {product.name}
                                      </span>
                                    </div>
                                  </Link>
                                </>
                                // <Link
                                //   to={`/product/${product.slug}`}
                                //   onClick={() => setProducts([])}
                                // >
                                //   <div className="d-flex justify-content-between mb-2">
                                //     <img src={product.defaultImage} alt="" />

                                //     {product.name}

                                //     <p>
                                //       <i className="fa fa-inr"></i>
                                //       {product.priceVariants[0].sellingPrice}
                                //     </p>
                                //   </div>
                                // </Link>
                              );
                            })
                          : ""
                        : ""}

                      {/* Spinner */}
                      {productLoading ? (
                        <div className="d-flex justify-content-center py-5">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {focus && !products.length ? (
                        <div className="text-danger text-center py-2">
                          Product not found
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </form>
                </div>
                <div className="header-action-right">
                  <div className="header-action-2">
                    {/* <div className="search-location">
                      <form action="#">
                        <select className="select-active">
                          <option>Your Location</option>
                          <option>Alabama</option>
                          <option>Alaska</option>
                          <option>Arizona</option>
                          <option>Delaware</option>
                          <option>Florida</option>
                          <option>Georgia</option>
                          <option>Hawaii</option>
                          <option>Indiana</option>
                          <option>Maryland</option>
                          <option>Nevada</option>
                          <option>New Jersey</option>
                          <option>New Mexico</option>
                          <option>New York</option>
                        </select>
                      </form>
                    </div> */}
                    {/* <div className="header-action-icon-2">
                      <Link to="shop-compare.html">
                        <img
                          className="svgInject"
                          alt="Nest"
                          src="/assets/imgs/theme/icons/icon-compare.svg"
                        />
                        <span className="pro-count blue">3</span>
                      </Link>
                      <Link to="shop-compare.html">
                        <span className="lable ml-0">Compare</span>
                      </Link>
                    </div> */}
                    {/* <Link
                      to={"/account/my-account/wallet"}
                      className="cart-icon"
                    >
                      <div className="">
                        <img
                          alt="Nest"
                          src="/assets/imgs/money.png"
                          width="25px"
                        />
                      </div>
                      <span className="cart">Wallet</span>
                    </Link> */}

                    <Link
                      to={
                        state.jwtToken
                          ? "/account/my-account/orders"
                          : "/account/login"
                      }
                      className="cart-icon"
                    >
                      <div className="">
                        <img
                          alt="Nest"
                          src="/assets/imgs/location.png"
                          width="30px"
                        />
                      </div>
                      <span className="cart">Track Order</span>
                    </Link>

                    {/* old cart */}
                    {/* <div className="header-action-icon-2">
                      <Link to="/account/my-account/wishlists">
                        <img
                          className="svgInject"
                          alt="Nest"
                          src="/assets/imgs/theme/icons/icon-heart.svg"
                        />
                        <span className="pro-count blue">
                          {myWishlists.length || 0}
                        </span>
                      </Link>
                      <Link to="/account/my-account/wishlists">
                        <span className="lable">Wishlist</span>
                      </Link>
                    </div> */}

                    <div className="header-action-icon-2">
                      <Link to={"/myCart"} className="cart-icon">
                        <div className="">
                          <img
                            alt=""
                            src="/assets/imgs/add-cart.png"
                            width="35px"
                          />
                        </div>
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            borderRadius: "8px",
                            backgroundColor: "rgb(255, 0, 0)",
                            position: "absolute",
                            marginLeft: "19px",
                            marginTop: "-27px",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <p className="wallet-points">{cart.length}</p>
                        </div>
                        <span className="cart">My Cart</span>
                      </Link>

                      <div className="cart-dropdown-wrap cart-dropdown-hm2">
                        <ul>
                          {cart.length ? (
                            cart.map((product) => {
                              return (
                                <li>
                                  <div className="shopping-cart-img">
                                    <Link to={`/product/${product.slug}`}>
                                      <img alt="Nest" src={product.image} />
                                    </Link>
                                  </div>
                                  <div className="shopping-cart-title">
                                    <h4>
                                      <Link to={`/product/${product.slug}`}>
                                        {product.name.slice(0, 10)}..
                                      </Link>
                                    </h4>
                                    <h4>
                                      <span>{product.quantity} × </span>
                                      <span className="fa fa-inr">
                                        {product.price}
                                      </span>
                                    </h4>
                                  </div>
                                  <div className="shopping-cart-delete">
                                    <Link
                                      to="#"
                                      className="text-danger"
                                      onClick={() => {
                                        dispatch({
                                          type: "REMOVE_FROM_CART",
                                          payload: {
                                            productId: product.productId,
                                          },
                                        });
                                      }}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </Link>
                                  </div>
                                </li>
                              );
                            })
                          ) : (
                            <div className="alert alert-danger">Empty Cart</div>
                          )}
                        </ul>
                        {cart.length ? (
                          <div className="shopping-cart-footer">
                            <div className="shopping-cart-total">
                              <h4>
                                Total
                                <span className="fa fa-inr">
                                  {cart
                                    .map(
                                      (product) =>
                                        product.price * product.quantity
                                    )
                                    .reduce((prev, curr) => prev + curr, 0)}
                                </span>
                              </h4>
                            </div>
                            <div className="shopping-cart-button">
                              <Link to="/mycart" className="outline">
                                View cart
                              </Link>
                              <Link to="/checkout">Checkout</Link>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    {jwtToken ? (
                      <div className="header-action-icon-2">
                        <div style={{ textAlign: "center" }}>
                          <Link
                            style={{
                              textDecoration: "none",
                              textAlign: "center",
                            }}
                            className="cart-icon"
                          >
                            <div className="">
                              <img
                                alt="Nest"
                                src="/assets/imgs/user.png"
                                width="22px"
                              />
                            </div>
                            <span className="account cart">Account</span>
                          </Link>
                        </div>

                        <div className="cart-dropdown-wrap cart-dropdown-hm2 account-dropdown">
                          <ul>
                            <li>
                              <Link to="/account/my-account">
                                <i className="fa fa-user mr-10"></i>My Account
                              </Link>
                            </li>
                            <li>
                              <Link to="/account/my-account/orders">
                                <i className="fa fa-tag mr-10"></i>My Orders
                              </Link>
                            </li>
                            {/* <li>
                              <Link to="/account/my-account/track-order">
                                <i className="fa fa-map-marker mr-10"></i>
                                Order Tracking
                              </Link>
                            </li> */}

                            <li>
                              <Link to="/account/my-account/account-detail">
                                <i className="fa fa-cog mr-10"></i>
                                Setting
                              </Link>
                            </li>
                            <li>
                              <Link to="/account/login" onClick={signOut}>
                                <i className="fa fa-sign-out mr-10"></i>
                                Sign out
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={"/account/login"}
                        style={{ textDecoration: "none" }}
                        className="cart-icon"
                      >
                        <div className="">
                          <img
                            alt="Nest"
                            src="/assets/imgs/user.png"
                            width="22px"
                          />
                        </div>
                        <span className="account cart">Login/Signup</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="header-bottom header-bottom-bg-color sticky-bar">
          <div className="container">
            <div className="header-wrap header-space-between position-relative">
              <div className="logo logo-width-1 d-block d-lg-none">
                <Link to="/">
                  <img src="/assets/imgs/theme/logo.png" alt="logo" />
                </Link>
              </div>
              <div className="header-nav d-none d-lg-flex">
                <div className="main-categori-wrap d-none d-lg-block">
                  <div className="Stikey-logo">
                    <Link to="/">
                      <img src="/assets/imgs/theme/logo.png" alt="logo" />
                    </Link>
                  </div>
                  {/* <a className="categories-button-active d-none d-lg-none" href="#">
                    <i className="fa fa-list-ul" aria-hidden="true"></i>
                    </a> */}
                  {/* <!-- &nbsp;Browse All Categories
                                    <i className="fa fa-angle-down"></i> --> */}

                  <div className="categories-dropdown-wrap categories-dropdown-active-large font-heading">
                    <div className="d-flex categori-dropdown-inner">
                      <ul>
                        {[
                          ...subCategories.slice(
                            0,
                            Math.trunc(subCategories.length / 2)
                          ),
                        ].map((category, index) => {
                          return (
                            <li key={index}>
                              <Link to={`/${category.slug}`}>
                                <img src={`${category.image}`} alt="" />
                                {category.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <ul className="end">
                        {[
                          ...subCategories.slice(
                            Math.trunc(subCategories.length / 2) - 1,
                            subCategories.length - 1
                          ),
                        ].map((category, index) => {
                          return (
                            <li key={index}>
                              <Link to={`/${category.slug}`}>
                                <img src={`${category.image}`} alt="" />
                                {category.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="main-menu main-menu-padding-1 main-menu-lh-2 d-none d-lg-block font-heading">
                  <nav>
                    {/* Old Navigation */}
                    <div className="">
                      {/* <ul>
                        {categories.length ? (
                          categories.map((value, index) => {
                            return (
                              <li key={`header-cat-${index}`}>
                                <Link to="#">
                                  {value.name}
                                  <i className="fa fa-angle-down"></i>
                                </Link>
                                {value.subCategories.length ? (
                                  <ul className="sub-menu">
                                    {value.subCategories.map((subValue) => {
                                      return (
                                        <li key={subValue._id}>
                                          <Link
                                            to={`/products/${subValue.slug}`}
                                          >
                                            {subValue.name}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : (
                                  ""
                                )}
                              </li>
                            );
                          })
                        ) : (
                          <li>
                            <Link to="#">Category Not Available</Link>
                          </li>
                        )}
                      </ul> */}
                    </div>
                    {/* Navigation with mega menu */}
                    <ul>
                      {/* <li className="hot-deals">
                        <img
                          src="/assets/imgs/theme/icons/hot-tub.png"
                          alt="hot deals"
                        />
                        <Link to="#">HOT DEALS</Link>
                      </li> */}

                      <li>
                        <Link className="active" to="/">
                          Home
                        </Link>
                      </li>

                      {categories.length ? (
                        categories.map((category, index) => {
                          if (category.showMegaMenu) {
                            return (
                              <li className="position-static" key={index}>
                                <Link
                                  to={`/${category.slug}`}
                                  onMouseOver={handleShowMegaMenu}
                                  onClick={handleHideMegaMenu}
                                >
                                  {category.name}{" "}
                                  <i className="fa fa-angle-down"></i>
                                </Link>

                                <ul className="mega-menu">
                                  <li className="sub-mega-menu sub-mega-menu-width-20">
                                    <a className="menu-title" href="#">
                                      CAKE BY FLAVOUR
                                    </a>
                                    {flavours.length ? (
                                      <ul className="">
                                        {flavours.map((flavour, fIndex) => {
                                          return (
                                            <li key={`flavour-${fIndex}`}>
                                              <Link
                                                onClick={handleHideMegaMenu}
                                                // to={`/${category.slug}?flavour=${flavour._id}`}
                                                to={`/${category.slug}?flavour=${flavour.slug}`}
                                              >
                                                {flavour.name}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    ) : (
                                      ""
                                    )}
                                  </li>

                                  <li className="sub-mega-menu sub-mega-menu-width-20">
                                    <a className="menu-title" href="#">
                                      CAKE BY TYPE
                                    </a>
                                    {types.length ? (
                                      <ul>
                                        {types.map((type, tIndex) => {
                                          return (
                                            <li key={`type-${tIndex}`}>
                                              <Link
                                                onClick={handleHideMegaMenu}
                                                // to={`/${category.slug}?cakeType=${type._id}`}
                                                to={`/${category.slug}?cakeType=${type.slug}`}
                                              >
                                                {type.name}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    ) : (
                                      ""
                                    )}
                                  </li>

                                  <li className="sub-mega-menu sub-mega-menu-width-20">
                                    <a className="menu-title" href="#">
                                      CAKE BY SHAPE
                                    </a>
                                    {shapes.length ? (
                                      <ul>
                                        {shapes.map((shape, shapeIndex) => {
                                          return (
                                            <li key={`shape-${shapeIndex}`}>
                                              <Link
                                                onClick={handleHideMegaMenu}
                                                // to={`/${category.slug}?shape=${shape._id}`}
                                                to={`/${category.slug}?shape=${shape.slug}`}
                                              >
                                                {shape.name}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    ) : (
                                      ""
                                    )}
                                  </li>

                                  <li className="sub-mega-menu sub-mega-menu-width-20">
                                    <a className="menu-title" href="#">
                                      CAKE BY OCCASIONS
                                    </a>
                                    {occasions.length ? (
                                      <ul className="cake-by-occasions">
                                        {occasions.map(
                                          (occasion, occasionIndex) => {
                                            return (
                                              <li
                                                key={`occasion-${occasionIndex}`}
                                              >
                                                <Link
                                                  onClick={handleHideMegaMenu}
                                                  // to={`/${category.slug}?occasion=${occasion._id}`}
                                                  to={`/${category.slug}?occasion=${occasion.slug}`}
                                                >
                                                  {occasion.name}
                                                </Link>
                                              </li>
                                            );
                                          }
                                        )}
                                      </ul>
                                    ) : (
                                      ""
                                    )}
                                  </li>

                                  <li className="sub-mega-menu sub-mega-menu-width-30">
                                    <div className="menu-banner-wrap">
                                      <Link
                                        to={"/all-cakes"}
                                        onClick={handleHideMegaMenu}
                                      >
                                        <img
                                          src={`/assets/imgs/banner/mega-menu-banner.jpg`}
                                          alt="Nest"
                                        />
                                      </Link>

                                      {/* {categoryNavigationBanner.some(
                                        (banner) =>
                                          banner?.parentCategory?._id ===
                                          category._id
                                      ) ? (
                                        <Link
                                          to={`${
                                            categoryNavigationBanner.filter(
                                              (banner) =>
                                                banner?.parentCategory?._id ==
                                                category._id
                                            )[0].webpageUrl
                                          }`}
                                        >
                                          <img
                                            src={`${
                                              categoryNavigationBanner.filter(
                                                (banner) =>
                                                  banner?.parentCategory?._id ==
                                                  category._id
                                              )[0].image
                                            }`}
                                            alt="Nest"
                                          />
                                        </Link>
                                      ) : null} */}

                                      {/* <div className="menu-banner-content">
                                        <h4>Hot deals</h4>
                                        <h3>
                                          Don't miss
                                          <br />
                                          Trending
                                        </h3>
                                        <div className="menu-banner-price">
                                          <span className="new-price text-success">
                                            Save to 50%
                                          </span>
                                        </div>
                                        <div className="menu-banner-btn">
                                          <a href="shop-product-right.html">
                                            Shop now
                                          </a>
                                        </div>
                                      </div>
                                      <div className="menu-banner-discount">
                                        <h3>
                                          <span>25%</span>
                                          off
                                        </h3>
                                      </div> */}
                                    </div>
                                  </li>
                                </ul>
                              </li>
                            );
                          } else {
                            return (
                              <li>
                                <Link to={`/${category.slug}`}>
                                  {category.name}
                                  {category.badge ? (
                                    <span className="badge badge-new">
                                      {category.badge}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            );
                          }
                        })
                      ) : (
                        <li>
                          <Link to="#">Category Not Available</Link>
                        </li>
                      )}

                      <li>
                        <Link className="active" to="/all-cakes">
                          By Occasions
                        </Link>
                        <ul className="sub-menu">
                          {occasions.map((occasion, index) => {
                            return (
                              <li key={occasion._id}>
                                <Link
                                  to={`/all-cakes?occasion=${occasion._id}`}
                                >
                                  {occasion.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>

                      {/* <li>
                        <Link className="active" to="/boutique-collection">
                          Boutique Collection
                        </Link>
                      </li> */}
                    </ul>
                  </nav>
                </div>
              </div>
              {/* <div className="hotline d-none d-lg-flex">
                <img
                  src="/assets/imgs/theme/icons/icon-headphone.svg"
                  alt="hotline"
                />
                <p>
                  1900 - 888<span>24/7 Support Center</span>
                </p>
              </div> */}
              <div className="header-action-icon-2 d-block d-lg-none">
                <div
                  className="burger-icon burger-icon-white"
                  onClick={mobileHeaderActive}
                >
                  <span className="burger-icon-top"></span>
                  <span className="burger-icon-mid"></span>
                  <span className="burger-icon-bottom"></span>
                </div>
              </div>
              <div className="header-action-right d-block d-lg-none">
                <div className="header-action-2">
                  {/* <div className="header-action-icon-2">
                    <Link to="shop-wishlist.html">
                      <img
                        alt="Nest"
                        src="/assets/imgs/theme/icons/icon-heart.svg"
                      />
                      <span className="pro-count white">4</span>
                    </Link>
                  </div> */}
                  <div className="header-action-icon-2">
                    <Link
                      onMouseOver={() => {
                        document
                          .querySelector("#cart-dropdown-wrap")
                          .classList.remove("hide");
                      }}
                      className="mini-cart-icon"
                      to="#"
                    >
                      <img
                        alt="Nest"
                        src="/assets/imgs/theme/icons/icon-cart.svg"
                      />
                      <span className="pro-count white"> {cart.length} </span>
                    </Link>
                    <div
                      id={"cart-dropdown-wrap"}
                      className="cart-dropdown-wrap cart-dropdown-hm2"
                    >
                      <ul>
                        {cart.length ? (
                          cart.map((item, index) => {
                            return (
                              <li className={index}>
                                <div className="shopping-cart-img">
                                  <Link to={`/product/${item.slug}`}>
                                    <img
                                      alt="Nest"
                                      src={
                                        item.image ||
                                        "/assets/imgs/shop/thumbnail-3.jpg"
                                      }
                                    />
                                  </Link>
                                </div>
                                <div className="shopping-cart-title">
                                  <h4>
                                    <Link to={`/product/${item.slug}`}>
                                      {item.name.slice(0, 10) + ".."}
                                    </Link>
                                  </h4>
                                  <h3>
                                    <span>{item.quantity} × </span>{" "}
                                    <i className="fa fa-inr"></i>
                                    {item.price}
                                  </h3>
                                </div>
                                <div className="shopping-cart-delete">
                                  <Link
                                    to="#"
                                    className="text-danger"
                                    onClick={() => {
                                      dispatch({
                                        type: "REMOVE_FROM_CART",
                                        payload: {
                                          productId: item.productId,
                                        },
                                      });
                                    }}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </Link>
                                </div>
                              </li>
                            );
                          })
                        ) : (
                          <div className="alert alert-danger">Empty Cart</div>
                        )}
                      </ul>
                      {cart.length ? (
                        <div className="shopping-cart-footer">
                          <div className="shopping-cart-total">
                            <h4>
                              Total
                              <span className="fa fa-inr">
                                {cart
                                  .map(
                                    (product) =>
                                      product.price * product.quantity
                                  )
                                  .reduce((prev, curr) => prev + curr, 0)}
                              </span>
                            </h4>
                          </div>
                          <div className="shopping-cart-button">
                            <Link
                              onClick={() => {
                                document
                                  .querySelector("#cart-dropdown-wrap")
                                  .classList.add("hide");
                              }}
                              to="/myCart"
                              className="outline"
                            >
                              View cart
                            </Link>
                            <Link
                              onClick={() => {
                                document
                                  .querySelector("#cart-dropdown-wrap")
                                  .classList.add("hide");
                              }}
                              to="/checkout"
                            >
                              Checkout
                            </Link>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mobile-header-active mobile-header-wrapper-style">
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-top">
            <div className="mobile-header-logo">
              <Link to="/" onClick={mobileHeaderClose}>
                <img
                  src="/assets/imgs/theme/logo.png
"
                  alt="logo"
                />
              </Link>
            </div>
            <div className="mobile-menu-close close-style-wrap close-style-position-inherit">
              <button className="close-style search-close">
                <i className="icon-top"></i>
                <i className="icon-bottom"></i>
              </button>
            </div>
          </div>
          <div className="mobile-header-content-area">
            <div className="mobile-search search-style-3 mobile-header-border">
              <form action="#" onSubmit={handleSubmit}>
                <input
                  name={"query"}
                  type="text"
                  value={enteredQuery}
                  onBlur={() => {
                    setTimeout(() => {
                      setFocus(false);
                    }, 1000);
                    // setEnteredQuery("");
                  }}
                  onChange={(evt) => {
                    setEnteredQuery(evt.target.value);
                    searchHandler({ query: evt.target.value });
                    setFocus(true);
                  }}
                  placeholder={`Search for Cakes & More…`}
                />
                <button type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </form>
            </div>
            <div className="mobile-search search-style-3 mobile-header-border">
              <div className="col-md-12">
                {focus
                  ? products.length
                    ? products.map((product) => {
                        return (
                          <>
                            <Link
                              to={`/search?q=${product.name}`}
                              onClick={() => {
                                setProducts([]);
                                mobileHeaderClose();
                              }}
                            >
                              <div className="d-flex align-items-center mb-2 mt-1">
                                <i className="fa fa-search me-2"></i>
                                <span className=" d-block">{product.name}</span>
                              </div>
                            </Link>
                          </>
                          // <Link
                          //   to={`/product/${product.slug}`}
                          //   onClick={(evt) => setProducts([])}
                          // >
                          //   <div
                          //     onClick={mobileHeaderClose}
                          //     className="d-flex justify-content-between px-2 my-2 bg-light"
                          //   >
                          //     <img
                          //       src={product?.images[0]?.url}
                          //       alt=""
                          //       style={{
                          //         height: "40px",
                          //         width: "40px",
                          //         borderRadius: "20px",
                          //       }}
                          //     />

                          //     {product.name.slice(0, 30) + ".."}

                          //     <p>
                          //       <i className="fa fa-inr"></i>
                          //       {product.priceVariants[0].sellingPrice}
                          //     </p>
                          //   </div>
                          // </Link>
                        );
                      })
                    : ""
                  : ""}

                {/* Spinner */}
                {productLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {focus && !products.length ? (
                  <div className="text-danger text-center py-2">
                    Product not found
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="mobile-menu-wrap mobile-header-border">
              {/* mobile menu start */}

              <nav>
                <ul className="mobile-menu font-heading">
                  <li className="menu-item-has-children">
                    <Link onClick={mobileHeaderClose} to="/">
                      Home
                    </Link>
                  </li>
                  {categories.map((cat, i) => {
                    return (
                      <li className="menu-item-has-children">
                        <Link onClick={mobileHeaderClose} to={`/${cat.slug}`}>
                          {cat.name}
                          {cat.badge ? (
                            <span className="badge badge-new">{cat.badge}</span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}

                  {/* By Occasion */}
                  <li
                    className={`menu-item-has-children ${
                      mobileMenu.occasion ? "active" : ""
                    }`}
                  >
                    <Link to="#">Cake By Occasions</Link>
                    <span className="menu-expand">
                      <i
                        className={`fa ${
                          mobileMenu.occasion
                            ? "fa-angle-down"
                            : "fa-angle-right"
                        }`}
                        onClick={() => {
                          setMobileMenu({
                            ...mobileMenu,
                            occasion: !mobileMenu.occasion,
                          });
                        }}
                      ></i>
                    </span>
                    <ul
                      className="dropdown"
                      style={{ display: mobileMenu.occasion ? "" : "none" }}
                    >
                      {occasions.map((occasion, index) => {
                        return (
                          <li>
                            <Link
                              onClick={mobileHeaderClose}
                              // to={`/all-cakes?occasion=${occasion._id}`}
                              to={`/all-cakes?occasion=${occasion.slug}`}
                            >
                              {occasion.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>

                  {/* By Flavour */}
                  <li
                    className={`menu-item-has-children ${
                      mobileMenu.flavour ? "active" : ""
                    }`}
                  >
                    <Link to="#">Cake By Flavours</Link>
                    <span className="menu-expand">
                      <i
                        className={`fa ${
                          mobileMenu.flavour
                            ? "fa-angle-down"
                            : "fa-angle-right"
                        }`}
                        onClick={() => {
                          setMobileMenu({
                            ...mobileMenu,
                            flavour: !mobileMenu.flavour,
                          });
                        }}
                      ></i>
                    </span>
                    <ul
                      className="dropdown"
                      style={{ display: mobileMenu.flavour ? "" : "none" }}
                    >
                      {flavours.map((flavour, index) => {
                        return (
                          <li>
                            <Link
                              onClick={mobileHeaderClose}
                              // to={`/all-cakes?flavour=${flavour._id}`}
                              to={`/all-cakes?flavour=${flavour.slug}`}
                            >
                              {flavour.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>

                  {/* By Shapes */}
                  <li
                    className={`menu-item-has-children ${
                      mobileMenu.shape ? "active" : ""
                    }`}
                  >
                    <Link to="#">Cake By Shapes</Link>
                    <span className="menu-expand">
                      <i
                        className={`fa ${
                          mobileMenu.shape ? "fa-angle-down" : "fa-angle-right"
                        }`}
                        onClick={() => {
                          setMobileMenu({
                            ...mobileMenu,
                            shape: !mobileMenu.shape,
                          });
                        }}
                      ></i>
                    </span>
                    <ul
                      className="dropdown"
                      style={{ display: mobileMenu.shape ? "" : "none" }}
                    >
                      {shapes.map((shape, index) => {
                        return (
                          <li>
                            <Link
                              onClick={mobileHeaderClose}
                              // to={`/all-cakes?shape=${shape._id}`}
                              to={`/all-cakes?shape=${shape.slug}`}
                            >
                              {shape.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>

                  {/* By Cake Type */}
                  <li
                    className={`menu-item-has-children ${
                      mobileMenu.type ? "active" : ""
                    }`}
                  >
                    <Link to="#">Cake By Types</Link>
                    <span className="menu-expand">
                      <i
                        className={`fa ${
                          mobileMenu.type ? "fa-angle-down" : "fa-angle-right"
                        }`}
                        onClick={() => {
                          setMobileMenu({
                            ...mobileMenu,
                            type: !mobileMenu.type,
                          });
                        }}
                      ></i>
                    </span>
                    <ul
                      className="dropdown"
                      style={{ display: mobileMenu.type ? "" : "none" }}
                    >
                      {types.map((type, index) => {
                        return (
                          <li>
                            <Link
                              onClick={mobileHeaderClose}
                              // to={`/all-cakes?type=${type._id}`}
                              to={`/all-cakes?type=${type.slug}`}
                            >
                              {type.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>

                  {/* <li className="menu-item-has-children">
                    <Link onClick={mobileHeaderClose} to="/boutique-collection">
                      Boutique Collection
                    </Link>
                  </li> */}
                </ul>
              </nav>
              {/* mobile menu end */}
            </div>
            <div className="mobile-header-info-wrap">
              <div className="single-mobile-header-info">
                {/* <Link to="page-contact.html">
                  <i className="fi-rs-marker"></i> Our location
                </Link> */}
              </div>
              <div className="single-mobile-header-info">
                <Link to="#">
                  {jwtToken ? (
                    <Link
                      to={"/account/my-account"}
                      onClick={mobileHeaderClose}
                    >
                      <i className="fa fa-user"></i> My Account
                    </Link>
                  ) : (
                    <Link to={"/account/login"} onClick={mobileHeaderClose}>
                      <i className="fa fa-user"></i> Log In / Sign Up
                    </Link>
                  )}
                </Link>
              </div>
              <div className="single-mobile-header-info">
                {/* <Link to="#">
                  <i className="fi-rs-headphones"></i>(+01) - 2345 - 6789
                </Link> */}
              </div>
            </div>
            <div className="mobile-social-icon mb-50">
              <h6 className="mb-15">Follow Us</h6>
              <a target={"_blank"} href={`${socialLinks?.facebook}`}>
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
              <a target={"_blank"} href={`${socialLinks?.instagram}`}>
                <img
                  src="/assets/imgs/theme/icons/icon-instagram-white.svg"
                  alt=""
                />
              </a>
              <a target={"_blank"} href={`${socialLinks?.pintrest}`}>
                <img
                  src="/assets/imgs/theme/icons/icon-pinterest-white.svg"
                  alt=""
                />
              </a>
              <a target={"_blank"} href={`${socialLinks?.youtube}`}>
                <img
                  src="/assets/imgs/theme/icons/icon-youtube-white.svg"
                  alt=""
                />
              </a>
            </div>
            <div className="site-copyright">
              Copyright {year} © The Cake Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/*End header*/}
    </>
  );
};

export default Header;
