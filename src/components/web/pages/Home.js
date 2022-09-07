import React, { useEffect, useState, useContext } from "react";
import { CustomerContext } from "../Routes";
import Config from "../Config";
import Slider from "react-slick";
import $ from "jquery";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import parse from "html-react-parser";

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

var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 8,
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
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [loadProduct]);

  // Get Products when switch tab
  useEffect(() => {
    if (selectedParCat) {
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
          // setProductsLoaded(true);
        })
        .catch((error) => {
          console.error("Header Error:", error);
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

  return (
    <>
      {/* Header Section */}
      {/* <Header /> */}
      {/* Header Section */}

      <main className="main">
        <section className="home-slider style-2 position-relative mb-50">
          <div className="container">
            <div className="row">
              <div class="col-xl-12 col-lg-12">
                <div class="home-slide-cover">
                  <div class="hero-slider-1 style-4 dot-style-1 dot-style-1-position-1">
                    <Slider {...settings3}>
                      <>
                        <div
                          class="single-hero-slider single-animation-wrap"
                          style={{
                            backgroundImage: `url("assets/imgs/slider/slider-3.png")`,
                          }}
                        >
                          <div class="">
                            <h1 class="display-2 mb-40">
                              Pure Coffe
                              <br />
                              Big discount
                            </h1>
                            <p class="mb-65">
                              Save up to 50% off on your first order
                            </p>
                          </div>
                        </div>
                      </>
                      <>
                        <div
                          class="single-hero-slider single-animation-wrap"
                          style={{
                            backgroundImage: `url("assets/imgs/slider/slider-4.png")`,
                          }}
                        >
                          <div class="slider-content">
                            <h1 class="display-2 mb-40">
                              Snacks box
                              <br />
                              daily save
                            </h1>
                            <p class="mb-65">
                              Save up to 20% off on your first order
                            </p>
                            <form class="form-subcriber d-flex">
                              <input
                                type="email"
                                placeholder="Your emaill address"
                              />
                              <button class="btn" type="submit">
                                Subscribe
                              </button>
                            </form>
                          </div>
                        </div>
                      </>
                    </Slider>
                  </div>
                  <div class="slider-arrow hero-slider-1-arrow"></div>
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
                              class="single-hero-slider single-animation-wrap"
                              style={{
                                backgroundImage: `url("assets/imgs/slider/slider-3.png")`,
                              }}
                            >
                              <div class="slider-content">
                                <h1 class="display-2 mb-40">
                                  Pure Coffe
                                  <br />
                                  Big discount
                                </h1>
                                <p class="mb-65">
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

                      return (
                        <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                          <div className="product-cart-wrap mb-30">
                            <div className="product-img-action-wrap">
                              <div className="product-img product-img-zoom">
                                <Link to={`/product/${product.slug}`}>
                                  <img
                                    className="default-img"
                                    src={
                                      product.images.length
                                        ? product.images[0].url
                                        : "/assets/imgs/shop/product-1-2.jpg"
                                    }
                                    alt=""
                                  />
                                  <img
                                    className="hover-img"
                                    src={
                                      product.images.length > 1
                                        ? product.images[1].url
                                        : "/assets/imgs/shop/product-1-2.jpg"
                                    }
                                    alt=""
                                  />
                                </Link>
                              </div>
                              {/* <div className="product-action-1">
                                <a
                                  aria-label="Add To Wishlist"
                                  className="action-btn"
                                  href="shop-wishlist.html"
                                >
                                  <i className="fi-rs-heart"></i>
                                </a>
                                <a
                                  aria-label="Compare"
                                  className="action-btn"
                                  href="shop-compare.html"
                                >
                                  <i className="fi-rs-shuffle"></i>
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
                                  <i className="fi-rs-eye"></i>
                                </a>
                              </div> */}
                              <div className="product-badges product-badges-position product-badges-mrg">
                                <span className="hot">
                                  {100 -
                                    Math.ceil(
                                      (product.skus[0].sellingPrice /
                                        product.skus[0].mrp) *
                                        100
                                    )}
                                  % off
                                </span>
                              </div>
                            </div>
                            <div className="product-content-wrap">
                              <div className="product-category">
                                <Link to={`/product/${product.slug}`}>
                                  {/* {product.shape} */}
                                </Link>
                              </div>
                              <h2>
                                <Link to={`/product/${product.slug}`}>
                                  {product.name || ""}
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
                              <div>
                                {/* <span className="font-small text-muted">
                                  By{" "}
                                  <a href="vendor-details-1.html">NestFood</a>
                                </span> */}
                              </div>
                              <div className="product-card-bottom">
                                <div className="product-price">
                                  <span>
                                    {" "}
                                    <i className="fa fa-inr"></i>{" "}
                                    {product.skus[0].sellingPrice}
                                  </span>
                                  <span className="old-price">
                                    <i className="fa fa-inr"></i>{" "}
                                    {product.skus[0].mrp}
                                  </span>
                                </div>
                                {/* <div className="add-cart">
                                {cart.some(
                                  (value) => value.productId == product._id
                                ) ? (
                                  <Link
                                    className="add"
                                    href="shop-cart.html"
                                    onClick={() => {
                                      dispatch({
                                        type: "REMOVE_FROM_CART",
                                        payload: {
                                          productId: product._id,
                                        },
                                      });
                                    }}
                                  >
                                    <i className="fi-rs-shopping-cart mr-5"></i>
                                    Remove
                                  </Link>
                                ) : (
                                  <Link
                                    className="add"
                                    href="shop-cart.html"
                                    onClick={() => {
                                      dispatch({
                                        type: "ADD_TO_CART",
                                        payload: {
                                          name: product.name,
                                          slug: product.slug,
                                          productId: product._id,
                                          quantity: 1,
                                          price: product.skus[0].sellingPrice,
                                          image: product.images[0].url,
                                        },
                                      });
                                    }}
                                  >
                                    <i className="fi-rs-shopping-cart mr-5"></i>
                                    Add
                                  </Link>
                                )}
                              </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="alert alert-danger">
                      Product Not Available in This Category
                    </div>
                  )}
                  {/*end product card*/}
                </div>
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
                                          src={
                                            product.images.length
                                              ? product.images[0].url
                                              : ""
                                          }
                                          alt=""
                                        />
                                        <img
                                          className="hover-img"
                                          src={
                                            product.images.length > 1
                                              ? product.images[1].url
                                              : ""
                                          }
                                          alt=""
                                        />
                                      </Link>
                                    </div>
                                    <div className="product-action-1"></div>
                                    <div className="product-badges product-badges-position product-badges-mrg">
                                      <span className="hot">
                                        {100 -
                                          Math.ceil(
                                            (product.skus[0].sellingPrice /
                                              product.skus[0].mrp) *
                                              100
                                          )}
                                        % off
                                      </span>
                                    </div>
                                  </div>
                                  <div className="product-content-wrap">
                                    <div className="product-category">
                                      {/* <a href="shop-grid-right.html">
                                      Hodo Foods
                                    </a> */}
                                    </div>
                                    <h2>
                                      <Link to={`/product/${product.slug}`}>
                                        {product.name}
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
                                        {product.skus[0].sellingPrice}
                                      </span>
                                      <span className="old-price">
                                        <i className="fa fa-inr"></i>{" "}
                                        {product.skus[0].mrp}
                                      </span>
                                    </div>
                                    <div className="sold mt-15 mb-15">
                                      <div className="progress mb-5">
                                        <div
                                          className="progress-bar"
                                          role="progressbar"
                                          style={{ width: "50%" }}
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        ></div>
                                      </div>
                                      <span className="font-xs text-heading h6">
                                        Flavour: {product.flavour.name}
                                      </span>
                                      <br />
                                      <span className="font-xs text-heading h6">
                                        Shape: {product.shape.name}
                                      </span>
                                      <br />
                                      <span className="font-xs text-heading h6">
                                        Color: {product.color.name}
                                      </span>
                                    </div>
                                    <Link
                                      to={`/product/${product.slug}`}
                                      className="btn w-100 hover-up"
                                    >
                                      <i className="fa fa-shopping-cart mr-5"></i>
                                      View Details
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

        {/*End Best Sales*/}
        {/* <section className="section-padding pb-5">
          <div className="container">
            <div className="section-title">
              <h3 className="">Deals Of The Day</h3>
              <a className="show-all" href="shop-grid-right.html">
                All Deals
                <i className="fi-rs-angle-right"></i>
              </a>
            </div>
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="product-cart-wrap style-2">
                  <div className="product-img-action-wrap">
                    <div className="product-img">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/banner/banner-5.png" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="product-content-wrap">
                    <div className="deals-countdown-wrap">
                      <div
                        className="deals-countdown"
                        data-countdown="2025/03/25 00:00:00"
                      ></div>
                    </div>
                    <div className="deals-content">
                      <h2>
                        <a href="shop-product-right.html">
                          Seeds of Change Organic Quinoa, Brown, & Red Rice
                        </a>
                      </h2>
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
                      <div>
                        <span className="font-small text-muted">
                          By <a href="vendor-details-1.html">NestFood</a>
                        </span>
                      </div>
                      <div className="product-card-bottom">
                        <div className="product-price">
                          <span>$32.85</span>
                          <span className="old-price">$33.8</span>
                        </div>
                        <div className="add-cart">
                          <a className="add" href="shop-cart.html">
                            <i className="fi-rs-shopping-cart mr-5"></i>Add
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="product-cart-wrap style-2">
                  <div className="product-img-action-wrap">
                    <div className="product-img">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/banner/banner-6.png" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="product-content-wrap">
                    <div className="deals-countdown-wrap">
                      <div
                        className="deals-countdown"
                        data-countdown="2026/04/25 00:00:00"
                      ></div>
                    </div>
                    <div className="deals-content">
                      <h2>
                        <a href="shop-product-right.html">
                          Perdue Simply Smart Organics Gluten Free
                        </a>
                      </h2>
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
                      <div>
                        <span className="font-small text-muted">
                          By
                          <a href="vendor-details-1.html">Old El Paso</a>
                        </span>
                      </div>
                      <div className="product-card-bottom">
                        <div className="product-price">
                          <span>$24.85</span>
                          <span className="old-price">$26.8</span>
                        </div>
                        <div className="add-cart">
                          <a className="add" href="shop-cart.html">
                            <i className="fi-rs-shopping-cart mr-5"></i>Add
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 d-none d-lg-block">
                <div className="product-cart-wrap style-2">
                  <div className="product-img-action-wrap">
                    <div className="product-img">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/banner/banner-7.png" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="product-content-wrap">
                    <div className="deals-countdown-wrap">
                      <div
                        className="deals-countdown"
                        data-countdown="2027/03/25 00:00:00"
                      ></div>
                    </div>
                    <div className="deals-content">
                      <h2>
                        <a href="shop-product-right.html">
                          Signature Wood-Fired Mushroom and Caramelized
                        </a>
                      </h2>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (3.0)
                        </span>
                      </div>
                      <div>
                        <span className="font-small text-muted">
                          By <a href="vendor-details-1.html">Progresso</a>
                        </span>
                      </div>
                      <div className="product-card-bottom">
                        <div className="product-price">
                          <span>$12.85</span>
                          <span className="old-price">$13.8</span>
                        </div>
                        <div className="add-cart">
                          <a className="add" href="shop-cart.html">
                            <i className="fi-rs-shopping-cart mr-5"></i>Add
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 d-none d-xl-block">
                <div className="product-cart-wrap style-2">
                  <div className="product-img-action-wrap">
                    <div className="product-img">
                      <a href="shop-product-right.html">
                        <img src="assets/imgs/banner/banner-8.png" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="product-content-wrap">
                    <div className="deals-countdown-wrap">
                      <div
                        className="deals-countdown"
                        data-countdown="2025/02/25 00:00:00"
                      ></div>
                    </div>
                    <div className="deals-content">
                      <h2>
                        <a href="shop-product-right.html">
                          Simply Lemonade with Raspberry Juice
                        </a>
                      </h2>
                      <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (3.0)
                        </span>
                      </div>
                      <div>
                        <span className="font-small text-muted">
                          By <a href="vendor-details-1.html">Yoplait</a>
                        </span>
                      </div>
                      <div className="product-card-bottom">
                        <div className="product-price">
                          <span>$15.85</span>
                          <span className="old-price">$16.8</span>
                        </div>
                        <div className="add-cart">
                          <a className="add" href="shop-cart.html">
                            <i className="fi-rs-shopping-cart mr-5"></i>Add
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        {/*End Deals*/}

        {/* Commented Section */}
        <section className="section-padding mb-30">
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
        <section className="newsletter mb-15">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="position-relative newsletter-inner">
                  <div className="newsletter-content">
                    <h2 className="mb-20">
                      Stay home & get your daily <br />
                      needs from our shop
                    </h2>
                    <p className="mb-45">
                      Start You'r Daily Shopping with
                      <span className="text-brand">Cake Shop </span>
                    </p>
                    <form className="form-subcriber d-flex">
                      <input type="email" placeholder="Your emaill address" />
                      <button className="btn" type="submit">
                        Subscribe
                      </button>
                    </form>
                  </div>
                  {/* <img src="//assets/imgs/banner/banner-9.png" alt="newsletter" /> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
      {/* Quick View */}

      <div
        className="modal fade custom-modal"
        id="quickViewModal"
        tabIndex="-1"
        aria-labelledby="quickViewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 col-sm-12 col-xs-12 mb-md-0 mb-sm-5">
                  <div className="detail-gallery">
                    <span className="zoom-icon">
                      <i className="fi-rs-search"></i>
                    </span>
                    {/* MAIN SLIDES */}
                    <div className="product-image-slider">
                      <figure className="border-radius-10">
                        <img
                          src="assets/imgs/shop/product-16-4.jpg"
                          alt="product image"
                        />
                      </figure>
                      <figure className="border-radius-10">
                        <img
                          src="assets/imgs/shop/product-16-5.jpg"
                          alt="product image"
                        />
                      </figure>
                      <figure className="border-radius-10">
                        <img
                          src="assets/imgs/shop/product-16-6.jpg"
                          alt="product image"
                        />
                      </figure>
                      <figure className="border-radius-10">
                        <img
                          src="assets/imgs/shop/product-16-7.jpg"
                          alt="product image"
                        />
                      </figure>
                    </div>

                    {/* THUMBNAILS */}
                    <div className="slider-nav-thumbnails">
                      <div>
                        <img
                          src="assets/imgs/shop/thumbnail-4.jpg"
                          alt="product image"
                        />
                      </div>
                      <div>
                        <img
                          src="assets/imgs/shop/thumbnail-5.jpg"
                          alt="product image"
                        />
                      </div>
                      <div>
                        <img
                          src="assets/imgs/shop/thumbnail-6.jpg"
                          alt="product image"
                        />
                      </div>
                      <div>
                        <img
                          src="assets/imgs/shop/thumbnail-7.jpg"
                          alt="product image"
                        />
                      </div>
                      <div>
                        <img
                          src="assets/imgs/shop/thumbnail-8.jpg"
                          alt="product image"
                        />
                      </div>
                      <div>
                        <img
                          src="assets/imgs/shop/thumbnail-9.jpg"
                          alt="product image"
                        />
                      </div>
                    </div>
                  </div>
                  {/* End Gallery */}
                </div>
                <div className="col-md-6 col-sm-12 col-xs-12">
                  <div className="detail-info pr-30 pl-30">
                    <span className="stock-status out-stock"> Sale Off </span>
                    <h3 className="title-detail">
                      <Link
                        to="shop-product-right.html"
                        className="text-heading"
                      >
                        {quickViewData && quickViewData.name}
                      </Link>
                    </h3>
                    <div className="product-detail-rating">
                      <div className="product-rate-cover text-end">
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          (32 reviews)
                        </span>
                      </div>
                    </div>
                    <div className="clearfix product-price-cover">
                      <div className="product-price primary-color float-left">
                        <span className="current-price text-brand">
                          {quickViewData && quickViewData.skus[0].sellingPrice}
                        </span>
                        <span>
                          <span className="save-price font-md color3 ml-15">
                            {quickViewData &&
                              100 -
                                Math.ceil(
                                  (quickViewData.skus[0].sellingPrice /
                                    quickViewData.skus[0].mrp) *
                                    100
                                )}{" "}
                            % OFF
                          </span>
                          <span className="old-price font-md ml-15">
                            {quickViewData && quickViewData.skus[0].mrp}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="detail-extralink mb-30">
                      <div className="detail-qty border radius">
                        <Link to="#" className="qty-down">
                          <i className="fi-rs-angle-small-down"></i>
                        </Link>
                        <span className="qty-val">1</span>
                        <Link to="#" className="qty-up">
                          <i className="fi-rs-angle-small-up"></i>
                        </Link>
                      </div>
                      <div className="product-extra-link2">
                        <button
                          type="submit"
                          className="button button-add-to-cart"
                        >
                          <i className="fi-rs-shopping-cart"></i>Add to cart
                        </button>
                      </div>
                    </div>
                    <div className="font-xs">
                      <ul>
                        <li className="mb-5">
                          Vendor: <span className="text-brand">Nest</span>
                        </li>
                        <li className="mb-5">
                          MFG:
                          <span className="text-brand"> Jun 4.2022</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Detail Info */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
