import React, { useState, useEffect, useContext } from "react";
import Config from "./Config";
import $ from "jquery";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [colors, setColors] = useState([]);
  const [shapes, setShapes] = useState([]);

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

  // Get Flavours
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/flavour`, {
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

  return (
    <>
      <ToastContainer />
      {/* Quick view */}
      <header className="header-area header-style-1 header-height-2">
        <div className="mobile-promotion">
          <span>
            , <strong>up to 15%</strong> off all items. Only
            <strong>3 days</strong> left
          </span>
        </div>
        <div className="header-middle header-middle-ptb-1 d-none d-lg-block">
          <div className="container">
            <div className="header-wrap">
              <div className="logo logo-width-1">
                <Link to="/">
                  <img src="/assets/imgs/theme/logo.png" alt="logo" />
                </Link>
              </div>
              <div className="header-right">
                <div className="search-style-2">
                  <form action="#">
                    {/* <div
                      className="p-0"
                      style={{ width: "150px", height: "50px" }}
                    >
                      <Select options={options} placeholder={"Category"} />
                    </div> */}
                    <select
                      // className="select-active"
                      name={"category"}
                      onChange={(evt) => {
                        evt.preventDefault();
                        setSelectedCategory(evt.target.value);
                        searchHandler({ category: evt.target.value });
                      }}
                    >
                      <option value={""}>Categories</option>
                      {subCategories.map((cat, index) => {
                        return (
                          <option key={`sub-cat-${index}`} value={cat._id}>
                            {cat.name}
                          </option>
                        );
                      })}
                    </select>
                    <input
                      name={"query"}
                      type="text"
                      value={enteredQuery}
                      onBlur={() => setFocus(false)}
                      onChange={(evt) => {
                        setEnteredQuery(evt.target.value);
                        searchHandler({ query: evt.target.value });
                        setFocus(true);
                      }}
                      placeholder="Search for items..."
                    />
                  </form>
                  <div className="searched-items">
                    {products.length
                      ? products.map((product) => {
                          return (
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={() => setProducts([])}
                            >
                              <div className="d-flex justify-content-between mb-2">
                                <img src={product.images[0].url} alt="" />

                                {product.name}

                                <p>
                                  <i className="fa fa-inr"></i>
                                  {product.skus[0].sellingPrice}
                                </p>
                              </div>
                            </Link>
                          );
                        })
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
                <div className="header-action-right">
                  <div className="header-action-2">
                    <div className="search-location">
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
                    </div>
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
                    {/* <div className="header-action-icon-2">
                      <Link to="shop-wishlist.html">
                        <img
                          className="svgInject"
                          alt="Nest"
                          src="/assets/imgs/theme/icons/icon-heart.svg"
                        />
                        <span className="pro-count blue">6</span>
                      </Link>
                      <Link to="shop-wishlist.html">
                        <span className="lable">Wishlist</span>
                      </Link>
                    </div> */}
                    <div className="header-action-icon-2">
                      <Link className="mini-cart-icon" to="shop-cart.html">
                        <img
                          alt="Nest"
                          src="/assets/imgs/theme/icons/icon-cart.svg"
                        />
                        <span className="pro-count blue">{cart.length}</span>
                      </Link>
                      <Link to="shop-cart.html">
                        <span className="lable">Cart</span>
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
                                      {product.price}
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
                                <span>
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
                              <Link to="shop-checkout.html">Checkout</Link>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    {jwtToken ? (
                      <div className="header-action-icon-2">
                        <Link to="page-account.html">
                          <img
                            className="svgInject"
                            alt="Nest"
                            src="/assets/imgs/theme/icons/icon-user.svg"
                          />
                        </Link>
                        <Link to="page-account.html">
                          <span className="lable ml-0">Account</span>
                        </Link>
                        <div className="cart-dropdown-wrap cart-dropdown-hm2 account-dropdown">
                          <ul>
                            <li>
                              <Link to="/account/my-account">
                                <i className="fi fi-rs-user mr-10"></i>My
                                Account
                              </Link>
                            </li>
                            <li>
                              <Link to="/account/my-account/orders">
                                <i className="fi fi-rs-label mr-10"></i>My
                                Orders
                              </Link>
                            </li>
                            <li>
                              <Link to="/account/my-account/track-order">
                                <i className="fi fi-rs-location-alt mr-10"></i>
                                Order Tracking
                              </Link>
                            </li>

                            <li>
                              <Link to="/account/my-account/account-detail">
                                <i className="fi fi-rs-settings-sliders mr-10"></i>
                                Setting
                              </Link>
                            </li>
                            <li>
                              <Link to="/account/login" onClick={signOut}>
                                <i className="fi fi-rs-sign-out mr-10"></i>
                                Sign out
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="header-action-icon-2">
                        <Link to="/login">
                          <img
                            className="svgInject"
                            alt="Nest"
                            src="/assets/imgs/theme/icons/icon-user.svg"
                          />
                        </Link>
                        <Link to="/account/login">
                          <span className="lable ml-0">Login/Signup</span>
                        </Link>
                      </div>
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
                  <Link className="categories-button-active" to="#">
                    <i className="fa fa-list-ul" aria-hidden="true"></i>&nbsp;
                    <span className="et">Browse</span> All Categories
                    <i className="fa fa-angle-down"></i>
                  </Link>
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
                      {categories.length ? (
                        categories.map((value, index) => {
                          return (
                            <li
                              key={`header-cat-${index}`}
                              className={"position-static"}
                            >
                              <Link to={`/${value.slug}`}>
                                {value.name}
                                <i className="fa fa-angle-down"></i>
                              </Link>

                              <ul className="mega-menu">
                                <li className="sub-mega-menu sub-mega-menu-width-22">
                                  <a className="menu-title" href="#">
                                    By Price
                                  </a>
                                  <ul>
                                    <li>
                                      <Link to={`/${value.slug}?maxPrice=400`}>
                                        Under 400
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to={`/${value.slug}?minPrice=500&maxPrice=599`}
                                      >
                                        500 To 599
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to={`/${value.slug}?minPrice=600&maxPrice=999`}
                                      >
                                        600 To 999
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to={`/${value.slug}?minPrice=1000&maxPrice=1500`}
                                      >
                                        1000 To 1500
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to={`/${value.slug}?minPrice=1500&maxPrice=1500`}
                                      >
                                        Above 1500
                                      </Link>
                                    </li>
                                  </ul>
                                </li>

                                <li className="sub-mega-menu sub-mega-menu-width-22">
                                  <a className="menu-title" href="#">
                                    By Type
                                  </a>
                                  {value.subCategories.length ? (
                                    <ul className="">
                                      {value.subCategories.map((subValue) => {
                                        return (
                                          <li key={subValue._id}>
                                            <Link
                                              to={`/${value.slug}/${subValue.slug}`}
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

                                <li className="sub-mega-menu sub-mega-menu-width-22">
                                  <a className="menu-title" href="#">
                                    By Flavours
                                  </a>
                                  {flavours.length ? (
                                    <ul>
                                      {flavours.map((flavour, flavourIndex) => {
                                        return (
                                          <li
                                            key={`flavour-menu-${flavourIndex}`}
                                          >
                                            <Link
                                              to={`/${value.slug}?flavour=${flavour._id}`}
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

                                <li className="sub-mega-menu sub-mega-menu-width-22">
                                  <a className="menu-title" href="#">
                                    By Color
                                  </a>
                                  {colors.length ? (
                                    <ul>
                                      {colors.map((color, colorIndex) => {
                                        return (
                                          <li key={`color-menu-${colorIndex}`}>
                                            <Link
                                              to={`/${value.slug}?color=${color._id}`}
                                            >
                                              {color.name}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                </li>

                                <li className="sub-mega-menu sub-mega-menu-width-22">
                                  <a className="menu-title" href="#">
                                    By Shape
                                  </a>
                                  {shapes.length ? (
                                    <ul>
                                      {shapes.map((shape, shapeIndex) => {
                                        return (
                                          <li key={`shape-menu-${shapeIndex}`}>
                                            <Link
                                              to={`/${value.slug}?shape=${shape._id}`}
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
                              </ul>
                            </li>
                          );
                        })
                      ) : (
                        <li>
                          <Link to="#">Category Not Available</Link>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="hotline d-none d-lg-flex">
                <img
                  src="/assets/imgs/theme/icons/icon-headphone.svg"
                  alt="hotline"
                />
                <p>
                  1900 - 888<span>24/7 Support Center</span>
                </p>
              </div>
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
                    <Link className="mini-cart-icon" to="shop-cart.html">
                      <img
                        alt="Nest"
                        src="/assets/imgs/theme/icons/icon-cart.svg"
                      />
                      <span className="pro-count white"> {cart.length} </span>
                    </Link>
                    <div className="cart-dropdown-wrap cart-dropdown-hm2">
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
                            <Link to="/mycart" className="outline">
                              View cart
                            </Link>
                            <Link to="shop-checkout.html">Checkout</Link>
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
              <form action="#">
                <input
                  name={"query"}
                  type="text"
                  value={enteredQuery}
                  onBlur={() => setFocus(false)}
                  onChange={(evt) => {
                    setEnteredQuery(evt.target.value);
                    searchHandler({ query: evt.target.value });
                    setFocus(true);
                  }}
                  placeholder="Search for items..."
                />
                <button type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </form>

              <div className="col-md-12">
                {products.length
                  ? products.map((product) => {
                      return (
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={(evt) => setProducts([])}
                        >
                          <div
                            onClick={mobileHeaderClose}
                            className="d-flex justify-content-between px-2 my-2 bg-light"
                          >
                            <img
                              src={product.images[0].url}
                              alt=""
                              style={{
                                height: "40px",
                                width: "40px",
                                borderRadius: "20px",
                              }}
                            />

                            {product.name.slice(0, 30) + ".."}

                            <p>
                              <i className="fa fa-inr"></i>
                              {product.skus[0].sellingPrice}
                            </p>
                          </div>
                        </Link>
                      );
                    })
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
                        </Link>
                      </li>
                    );
                  })}

                  {/* <li className="menu-item-has-children">
                    <Link to="#">By Flavour</Link>
                    <ul className="dropdown">
                      {flavours.map((flavour, index) => {
                        return (
                          <li>
                            <Link to={`${flavour.slug}`}>{flavour.name}</Link>
                          </li>
                        );
                      })}
                    </ul>
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
                <Link to="page-login.html">
                  {jwtToken ? (
                    <Link
                      to={"/account/my-account"}
                      onClick={mobileHeaderClose}
                    >
                      <i className="fa fa-user"></i> My Account
                    </Link>
                  ) : (
                    <Link to={"/account/login"}>
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
              <Link to="#">
                <img
                  src="/assets/imgs/theme/icons/icon-facebook-white.svg"
                  alt=""
                />
              </Link>
              <Link to="#">
                <img
                  src="/assets/imgs/theme/icons/icon-twitter-white.svg"
                  alt=""
                />
              </Link>
              <Link to="#">
                <img
                  src="/assets/imgs/theme/icons/icon-instagram-white.svg"
                  alt=""
                />
              </Link>
              <Link to="#">
                <img
                  src="/assets/imgs/theme/icons/icon-pinterest-white.svg"
                  alt=""
                />
              </Link>
              <Link to="#">
                <img
                  src="/assets/imgs/theme/icons/icon-youtube-white.svg"
                  alt=""
                />
              </Link>
            </div>
            <div className="site-copyright">
              Copyright 2022 © Cake Shop. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/*End header*/}
    </>
  );
};

export default Header;