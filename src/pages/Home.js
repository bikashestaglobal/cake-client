import React, { useEffect, useState, useContext } from "react";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Slider from "react-slick";
import $ from "jquery";
import { Link, useHistory } from "react-router-dom";
import Rating from "react-rating";
import parse from "html-react-parser";
import ProductSkeletonLoader from "../components/ProductSkeletonLoader";
import Subscribe from "../components/Subscribe";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import SubscribeContainer from "../components/SubscribeContainer";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slider-arrow slider-btn slider-prev`}
      style={{
        ...style,
      }}
      id="carausel-4-columns-2-arrows"
      onClick={onClick}
    >
      <span className="slider-btn slider-prev slick-arrow">
        <i className="fa fa-angle-left"></i>
      </span>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slider-arrow slider-arrow-2 carausel-4-columns-arrow`}
      id="carausel-4-columns-2-arrows"
      style={{ ...style }}
      onClick={onClick}
    >
      <span className="slider-btn slider-next slick-arrow">
        <i className="fa fa-angle-right"></i>
      </span>
    </div>
  );
}

var settings2 = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  swipeToSlide: true,
  initialSlide: 0,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

var settings3 = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  initialSlide: 0,
  prevArrow: <SampleNextArrow />,
  nextArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Home = () => {
  // State Variable
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [quickViewData, setQuickViewData] = useState(null);
  const { state, dispatch } = useContext(CustomerContext);
  const { cart } = state;
  const [selectedParCat, setSelectedParCat] = useState("");
  const [loadProduct, setLoadProduct] = useState(true);
  const [nextToSlider, setNextToSlider] = useState({});
  const [mainSlider, setMainSlider] = useState([]);
  const [offerBanner, setOfferBanner] = useState([]);
  const [bestSaleBanner, setbestSaleBanner] = useState({});
  const [formData, setFormData] = useState({ product: "" });
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [myWishlists, setMyWishlist] = useState([]);

  const [productLoaded, setProductsLoaded] = useState(false);

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [removeFromWishlist, setRemoveFromWishlist] = useState(false);
  // Get All Categories
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/parent-category?skip=0&limit=20`, {
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
          console.log("Error Occured While loading category : home");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get All Sub Categories
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/main.js";
    script.async = true;
    document.body.appendChild(script);

    fetch(`${Config.SERVER_URL}/category?skip=0&limit=20`, {
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
          console.log("Error Occured While loading category : home");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get All Products
  useEffect(() => {
    setProductsLoaded(false);
    fetch(`${Config.SERVER_URL}/product?skip=0&limit=10`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setProducts(data.body);
          console.log(data.body);
        } else {
          console.log("Error Occured While loading products : Home");
        }
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setProductsLoaded(true);
      });
  }, [loadProduct]);

  // Get Products when switch tab
  useEffect(() => {
    if (selectedParCat) {
      setProductsLoaded(false);
      fetch(
        `${
          Config.SERVER_URL
        }/product/by-par-category-slug/${selectedParCat}?limit=${10}&skip=${0}`,
        {
          method: "GET", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(data),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 200) {
            setProducts(data.body);
          } else {
            console.log("Error Occured While loading product : Products");
          }
          setProductsLoaded(true);
        })
        .catch((error) => {
          console.error("Header Error:", error);
          setProductsLoaded(true);
        });
    }
  }, [selectedParCat]);

  // Get Settings
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/setting`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            if (result.body.nextToSlider) {
              setNextToSlider({ ...nextToSlider, ...result.body.nextToSlider });
            }
            setMainSlider(result.body.slider || []);
            setbestSaleBanner(result.body.bestSaleBanner || {});
            setOfferBanner(result.body.offerBanner || []);
          } else {
            // toast.e();
          }
        },
        (error) => {
          // M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/main.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // addToWishlistHandler
  const addToWishlistHandler = (evt, product) => {
    evt.preventDefault();
    setWishlistLoading(true);

    if (!customerInfo) {
      history.push("/account/login");
      return;
    }

    if (customerInfo && !customerInfo.jwtToken) {
      history.push("/account/login");
      return;
    }

    fetch(`${Config.SERVER_URL}/wishlists`, {
      method: "POST",
      body: JSON.stringify({ product }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo.jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            setFormData({ email: "" });
            toast.success(result.message);
            setAddedToWishlist(!addedToWishlist);
          } else {
            const keys = Object.keys(result.error);
            keys.forEach((element) => {
              toast.error(result.error[element]);
            });
            toast.error(result.message);
          }
          setWishlistLoading(false);
        },
        (error) => {
          toast.error(error.message);
          setWishlistLoading(false);
        }
      );
  };

  // removeFromWishlistHandler
  const removeFromWishlistHandler = (evt, widhlistId) => {
    evt.preventDefault();
    setWishlistLoading(true);

    if (!customerInfo && !customerInfo.jwtToken) {
      history.push("/login");
      return;
    }

    fetch(`${Config.SERVER_URL}/wishlists/${widhlistId}`, {
      method: "DELETE",
      // body: JSON.stringify({ product }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo.jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            setFormData({ email: "" });
            toast.success(result.message);
            setRemoveFromWishlist(!removeFromWishlist);
          } else {
            const keys = Object.keys(result.error);
            keys.forEach((element) => {
              toast.error(result.error[element]);
            });
            toast.error(result.message);
          }
          setWishlistLoading(false);
        },
        (error) => {
          toast.error(error.message);
          setWishlistLoading(false);
        }
      );
  };

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
              const keys = Object.keys(result.error);
              keys.forEach((element) => {
                toast.error(result.error[element]);
              });
              toast.error(result.message);
            }
          },
          (error) => {
            toast.error(error.message);
          }
        );
    }
  }, [addedToWishlist, removeFromWishlist]);

  return (
    <>
      {/* Header Section */}
      {/* <Header /> */}
      {/* Header Section */}

      <main className="main">
        <section className="home-slider style-2 position-relative mb-50 d-sm-none d-md-none d-lg-block">
          <div className="">
            <div className="">
              <div className="">
                <div className="home-slide-cover ">
                  <div className="hero-slider-1 style-4 dot-style-1 dot-style-1-position-1">
                    <Slider {...settings3}>
                      {mainSlider.map((slider, index) => {
                        return (
                          <span key={index}>
                            <div
                              className="single-hero-slider single-animation-wrap"
                              style={{
                                backgroundImage: `url(${slider.image})`,
                              }}
                            >
                              <div className="slider-content">
                                <h1 className="display-2 mb-40">
                                  {parse(slider.title)}
                                </h1>
                                <p className="mb-65">{slider.subTitle}</p>
                              </div>
                            </div>
                          </span>
                        );
                      })}
                    </Slider>
                  </div>
                  <div className="slider-arrow hero-slider-1-arrow"></div>
                </div>
              </div>
              {/* <div className="col-xl-12 col-lg-12">
                <div className="home-slide-cover">
                  <div className="hero-slider-1 style-4 dot-style-1 dot-style-1-position-1">
                    <Slider {...settings3}>
                      {mainSlider.map((slider, index) => {
                        return (
                          <span>
                            <div
                              className="single-hero-slider single-animation-wrap"
                              style={{
                                backgroundImage: `url("assets/imgs/slider/slider-3.png")`,
                              }}
                            >
                              <div className="slider-content">
                                <h1 className="display-2 mb-40">
                                  Pure Coffe
                                  <br />
                                  Big discount
                                </h1>
                                <p className="mb-65">
                                  Save up to 50% off on your first order
                                </p>
                              </div>
                            </div>
                          </span>
                        );
                      })}
                    </Slider>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </section>
        {/*End hero slider*/}
        <section className="banners mb-25">
          <div className="container">
            <div className="row">
              {offerBanner.length
                ? offerBanner.map((banner, index) => {
                    const imgUrl =
                      banner.image ||
                      `assets/imgs/banner/banner-${++index}.png`;
                    return (
                      <div key={`offer-${index}`} className="col-lg-4 col-md-6">
                        <div className="banner-img">
                          <img src={imgUrl} alt="" />
                          <div className="banner-text">
                            <h4>{parse(banner.title)}</h4>
                            <Link
                              to={banner.webpageUrl || "/"}
                              className="btn btn-xs"
                            >
                              Shop Now <i className="fa fa-angle-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
              {/* <div className="col-lg-4 col-md-6">
                <div className="banner-img">
                  <img src="assets/imgs/banner/banner-2.png" alt="" />
                  <div className="banner-text">
                    <h4>
                      Make your Breakfast
                      <br />
                      Healthy and Easy
                    </h4>
                    <a href="shop-grid-right.html" className="btn btn-xs">
                      Shop Now <i className="fi-rs-arrow-small-right"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 d-md-none d-lg-flex">
                <div className="banner-img mb-sm-0">
                  <img src="assets/imgs/banner/banner-3.png" alt="" />
                  <div className="banner-text">
                    <h4>
                      The best Organic <br />
                      Products Online
                    </h4>
                    <a href="shop-grid-right.html" className="btn btn-xs">
                      Shop Now <i className="fi-rs-arrow-small-right"></i>
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </section>
        {/*End banners*/}
        <section
          className="product-tabs section-padding position-relative"
          style={{ background: "#f8f5f0" }}
        >
          <div className="container">
            <div className="section-title style-2">
              <h3>Our Products</h3>
              <ul className="nav nav-tabs links" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="nav-tab-one"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-one"
                    type="button"
                    role="tab"
                    aria-controls="tab-one"
                    aria-selected="true"
                    onClick={() => setLoadProduct(!loadProduct)}
                  >
                    All
                  </button>
                </li>

                {categories.map((cat) => {
                  return (
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="nav-tab-seven"
                        data-bs-toggle="tab"
                        data-bs-target="#tab-one"
                        type="button"
                        role="tab"
                        aria-controls="tab-one"
                        aria-selected="false"
                        onClick={() => setSelectedParCat(cat.slug)}
                      >
                        {cat.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/*End nav-tabs*/}
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="tab-one"
                role="tabpanel"
                aria-labelledby="tab-one"
              >
                {productLoaded ? (
                  <div className="row product-grid-4">
                    {products.length ? (
                      products.map((product) => {
                        let totalRating = 0;
                        let avgRating = 0;
                        if (product.reviews.length) {
                          totalRating = product.reviews
                            .map((item) => item.rating)
                            .reduce((prev, next) => prev + next);

                          avgRating = (
                            totalRating / product.reviews.length
                          ).toFixed(1);
                        }

                        // Check Item in available in the wishlist or not
                        let availableInWishlist = false;

                        let available = myWishlists.some((item) => {
                          return item.product._id == product._id;
                        });
                        if (available) availableInWishlist = true;
                        // if (myWishlists.length) {
                        // }

                        return (
                          <ProductCard
                            product={product}
                            totalRating={totalRating}
                            avgRating={avgRating}
                            addToWishlistHandler={addToWishlistHandler}
                            wishlistLoading={wishlistLoading}
                            myWishlists={myWishlists}
                            removeFromWishlistHandler={
                              removeFromWishlistHandler
                            }
                            availableInWishlist={availableInWishlist}
                          />
                        );
                      })
                    ) : (
                      <div className="alert alert-danger">
                        Product Not Available in This Category
                      </div>
                    )}
                    {/*end product card*/}
                  </div>
                ) : (
                  <div className="row product-grid-4">
                    {[...Array(5)].map((_, $) => {
                      return (
                        <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                          <ProductSkeletonLoader />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {/*En tab one*/}
            </div>
            {/*End tab-content*/}
          </div>
        </section>
        {/*Products Tabs*/}
        <section className="section-padding pb-5">
          <div className="container">
            <div className="section-title">
              <h3 className="">Daily Best Sells</h3>
              <ul className="nav nav-tabs links" id="myTab-2" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="nav-tab-one-1"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-one-1"
                    type="button"
                    role="tab"
                    aria-controls="tab-one"
                    aria-selected="true"
                  >
                    Featured
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="nav-tab-one-1"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-one-1"
                    type="button"
                    role="tab"
                    aria-controls="tab-one"
                    aria-selected="false"
                  >
                    Popular
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="nav-tab-one-1"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-one-1"
                    type="button"
                    role="tab"
                    aria-controls="tab-one"
                    aria-selected="false"
                  >
                    New added
                  </button>
                </li>
              </ul>
            </div>
            <div className="row">
              <div className="col-lg-3 d-none d-lg-flex">
                <div
                  className="banner-img style-2"
                  style={{
                    background: `url(${
                      bestSaleBanner.image ||
                      "/assets/imgs/banner/banner-4.png1"
                    }) no-repeat center bottom`,
                  }}
                >
                  <div className="banner-text">
                    <h2 className="mb-100">Bring nature into your home</h2>
                    <Link
                      to={`${bestSaleBanner.webpageUrl || "/"}`}
                      className="btn btn-xs"
                    >
                      Shop Now <i className="fa fa-angle-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-12">
                <div className="tab-content" id="myTabContent-1">
                  <div
                    className="tab-pane fade show active"
                    id="tab-one-1"
                    role="tabpanel"
                    aria-labelledby="tab-one-1"
                  >
                    <div>
                      <div className="">
                        <Slider {...settings2}>
                          {products.map((product) => {
                            let totalRating = 0;
                            let avgRating = 0;
                            if (product.reviews.length) {
                              totalRating = product.reviews
                                .map((item) => item.rating)
                                .reduce((prev, next) => prev + next);

                              avgRating = (
                                totalRating / product.reviews.length
                              ).toFixed(1);
                            }
                            return (
                              <div className="px-1">
                                <div className="product-cart-wrap">
                                  <div className="product-img-action-wrap">
                                    <div className="product-img product-img-zoom">
                                      <Link to={`/product/${product.slug}`}>
                                        <img
                                          className="default-img"
                                          src={product.defaultImage}
                                          alt=""
                                        />
                                        <img
                                          className="hover-img"
                                          src={
                                            product.images.length
                                              ? product.images[0].url
                                              : ""
                                          }
                                          alt=""
                                        />
                                      </Link>
                                    </div>
                                    <div className="product-action-1">
                                      <a
                                        aria-label="Add To Wishlist"
                                        className="action-btn"
                                        href="#"
                                      >
                                        <i className="fa fa-heart-o"></i>
                                      </a>

                                      <a
                                        aria-label="Quick view"
                                        className="action-btn"
                                        data-bs-toggle="modal"
                                        data-bs-target="#quickViewModal"
                                        onClick={(evt) => {
                                          evt.preventDefault();
                                          setQuickViewData(product);
                                        }}
                                      >
                                        <i
                                          className="fa fa-eye"
                                          aria-hidden="true"
                                        ></i>
                                      </a>
                                    </div>
                                    <div className="product-badges product-badges-position product-badges-mrg">
                                      <span className="hot">
                                        {100 -
                                          Math.ceil(
                                            (product.priceVariants[0]
                                              .sellingPrice /
                                              product.priceVariants[0].mrp) *
                                              100
                                          )}
                                        % off
                                      </span>
                                    </div>
                                  </div>
                                  <div className="product-content-wrap">
                                    <div className="product-category">
                                      <Link to={`#`}>
                                        {product.flavour.name}
                                      </Link>
                                    </div>
                                    <h2>
                                      <Link to={`/product/${product.slug}`}>
                                        {product.name.length > 22
                                          ? product.name.slice(0, 22) + ".."
                                          : product.name}
                                      </Link>
                                    </h2>
                                    <div className="product-rate-cover">
                                      <Rating
                                        emptySymbol="fa fa-star-o fa-1x"
                                        fullSymbol="fa fa-star fa-1x text-danger"
                                        readonly
                                        initialRating={avgRating}
                                      />
                                      <span className="font-small ml-5 text-muted">
                                        ({avgRating})
                                      </span>
                                    </div>
                                    <div className="product-price">
                                      <span>
                                        {" "}
                                        <i className="fa fa-inr"></i>{" "}
                                        {product.priceVariants[0].sellingPrice}
                                      </span>
                                      <span className="old-price">
                                        <i className="fa fa-inr"></i>{" "}
                                        {product.priceVariants[0].mrp}
                                      </span>
                                    </div>
                                    <div className="sold mt-5 mb-15">
                                      {/* <div className="progress mb-0">
                                        <div
                                          className="progress-bar"
                                          role="progressbar"
                                          style={{ width: "50%" }}
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        ></div>
                                      </div> */}

                                      <span className="font-small text-muted">
                                        Shape:{" "}
                                        <Link to="">{product.shape.name}</Link>
                                      </span>
                                      <br />
                                      {/* <span className="font-small text-muted">
                                        Color:{" "}
                                        <Link to="">{product.color.name}</Link>
                                      </span> */}
                                    </div>
                                    <Link
                                      to={`/product/${product.slug}`}
                                      className="btn w-100 hover-up"
                                    >
                                      <i className="fa fa-shopping-cart mr-5"></i>
                                      Add To Cart
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                        {/*End product Wrap*/}
                      </div>
                    </div>
                  </div>
                  {/*End tab-pane*/}
                </div>
                {/*End tab-content*/}
              </div>
              {/*End Col-lg-9*/}
            </div>
          </div>
        </section>

        {/* Commented Section */}
        <section
        // className="section-padding mb-30"
        >
          {/* <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-6 mb-sm-5 mb-md-0">
                <h4 className="section-title style-1 mb-30 animated animated">
                  Top Selling
                </h4>
                <div className="product-list-small animated animated">
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-1.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Nestle Original Coffee-Mate Coffee Creamer
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-2.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Nestle Original Coffee-Mate Coffee Creamer
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-3.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Nestle Original Coffee-Mate Coffee Creamer
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 mb-md-0">
                <h4 className="section-title style-1 mb-30 animated animated">
                  Trending Products
                </h4>
                <div className="product-list-small animated animated">
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-4.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Organic Cage-Free Grade A Large Brown Eggs
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-5.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Seeds of Change Organic Quinoa, Brown, & Red Rice
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-6.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Naturally Flavored Cinnamon Vanilla Light Roast Coffee
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 mb-sm-5 mb-md-0 d-none d-lg-block">
                <h4 className="section-title style-1 mb-30 animated animated">
                  Recently added
                </h4>
                <div className="product-list-small animated animated">
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-7.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Pepperidge Farm Farmhouse Hearty White Bread
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-8.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Organic Frozen Triple Berry Blend
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-9.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Oroweat Country Buttermilk Bread
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 mb-sm-5 mb-md-0 d-none d-xl-block">
                <h4 className="section-title style-1 mb-30 animated animated">
                  Top Rated
                </h4>
                <div className="product-list-small animated animated">
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-10.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Foster Farms Takeout Crispy Classic Buffalo Wings
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-11.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          Angie’s Boomchickapop Sweet & Salty Kettle Corn
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                  <article className="row align-items-center hover-up">
                    <figure className="col-md-4 mb-0">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/shop/thumbnail-12.jpg" alt="" />
                      </a>
                    </figure>
                    <div className="col-md-8 mb-0">
                      <h6>
                        <a href="shop-product-right.html">
                          All Natural Italian-Style Chicken Meatballs
                        </a>
                      </h6>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (4.0)
                        </span>
                      </div>
                      <div className="product-price">
                        <span>$32.85</span>
                        <span className="old-price">$33.8</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div> */}
        </section>

        {/*End 4 columns*/}
        {/* <section className="popular-categories section-padding">
          <div className="container">
            <div className="section-title">
              <div className="title">
                <h3>Shop by Categories</h3>
                
              </div>
              <div
                className="slider-arrow slider-arrow-2 flex-right carausel-8-columns-arrow"
                id="carausel-8-columns-arrows"
              ></div>
            </div>

            
            <div className="">
              <div>
                <Slider {...settings}>
                  {subCategories.map((value, index) => {
                    return (
                      <div className="p-2">
                        <div className="card-1 p-3" key={`cat-${value._id}`}>
                          <figure className="img-hover-scale overflow-hidden">
                            <Link
                              to={`/${value.parentCategories[0].slug}/${value.slug}`}
                            >
                              <img
                                src={
                                  value.image != "null"
                                    ? value.image
                                    : "assets/imgs/theme/icons/category-1.svg"
                                }
                                alt=""
                              />
                            </Link>
                          </figure>
                          <h6 className="p-0 m-0">
                            <Link
                              to={`/${value.parentCategories[0].slug}/${value.slug}`}
                            >
                              {value.name}
                            </Link>
                          </h6>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
          </div>
        </section> */}

        {/*End category slider*/}
        <SubscribeContainer />
      </main>

      {/* <Footer /> */}
      {/* Quick View */}
    </>
  );
};

export default Home;
