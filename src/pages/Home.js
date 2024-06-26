import React, { useEffect, useState, useContext, useRef } from "react";
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
import SliderProductCard from "../components/SliderProductCard";
import { adonSliderSetting } from "../helpers/SliderHelper";
import Footer from "../layouts/Footer";

function SamplePrevArrow(props) {
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

function SampleNextArrow(props) {
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
  infinite: true,
  autoplay: true,
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
        slidesToShow: 2,
        slidesToScroll: 1,
        nextArrow: <></>,
        prevArrow: <></>,
      },
    },
  ],
};

var settings3 = {
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  initialSlide: 0,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
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

const mobileOfferSliderSetting = {
  autoplay: true,
  arrows: false,
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  initialSlide: 0,
};

const Home = () => {
  // State Variable
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [quickViewData, setQuickViewData] = useState(null);
  const { state, dispatch } = useContext(CustomerContext);
  const { cart, adonCart } = state;
  const [selectedParCat, setSelectedParCat] = useState("");
  const [selectedParCatSlug, setSelectedParCatSlug] = useState("");
  const [loadProduct, setLoadProduct] = useState(true);
  const [nextToSlider, setNextToSlider] = useState({});
  const [mainSlider, setMainSlider] = useState([]);
  const [offerBanner, setOfferBanner] = useState([]);
  const [bestSaleBanner, setbestSaleBanner] = useState({});
  const [formData, setFormData] = useState({ product: "" });
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [myWishlists, setMyWishlist] = useState([]);

  const [productLoaded, setProductsLoaded] = useState(false);
  const [bestProductLoaded, setBestProductsLoaded] = useState(false);

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [removeFromWishlist, setRemoveFromWishlist] = useState(false);

  const [newlyAddedProducts, setNewlyAddedProducts] = useState([]);
  const [adonProducts, setAdonProducts] = useState([]);
  const [popup, setPopup] = useState(false);
  const scrollRef = useRef(null);

  // open popup
  useEffect(() => {
    setTimeout(() => {
      setPopup(true);
    }, 10000);
  }, []);

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
    fetch(`${Config.SERVER_URL}/product?skip=0&limit=20`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          // setProducts(data.body);
          setNewlyAddedProducts(data.body);
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

  // Get Newly Added Products
  // useEffect(() => {
  //   setProductsLoaded(false);
  //   fetch(`${Config.SERVER_URL}/product?skip=0&limit=10`, {
  //     method: "GET", // or 'PUT'
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     // body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status == 200) {
  //         setNewlyAddedProducts(data.body);
  //       } else {
  //         console.log("Error Occured While loading products : Home");
  //       }
  //       setProductsLoaded(true);
  //     })
  //     .catch((error) => {
  //       console.error("Header Error:", error);
  //       setProductsLoaded(true);
  //     });
  // }, []);

  // Get Addon Producta
  useEffect(() => {
    // setProductsLoaded(false);
    fetch(`${Config.SERVER_URL}/adon-product?skip=0&limit=10`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setAdonProducts(data.body);
        } else {
          console.log("Error Occured While loading products : Home");
        }
        // setProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        // setProductsLoaded(true);
      });
  }, []);

  // Get Products when switch tab
  useEffect(() => {
    let url = `${
      Config.SERVER_URL
    }/product/for-home-page?limit=${20}&skip=${0}`;
    if (selectedParCat) {
      url = url + `&catId=${selectedParCat}`;
    }

    setProductsLoaded(false);
    fetch(url, {
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
        } else {
          console.log("Error Occured While loading product : Products");
        }
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setProductsLoaded(true);
      });
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
              // const keys = Object.keys(result.error);
              // keys.forEach((element) => {
              //   toast.error(result.error[element]);
              // });
              // toast.error(result.message);
            }
          },
          (error) => {
            toast.error(error.message);
          }
        );
    }
  }, [addedToWishlist, removeFromWishlist]);

  // get bestseller products at first time when page is loaded
  useEffect(() => {
    getBestSellerProducts();
  }, []);

  // Get bestseller Products
  const getBestSellerProducts = () => {
    fetch(`${Config.SERVER_URL}/product?skip=0&limit=10&bestseller=true`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setBestProducts(data.body);
        } else {
          console.log("Error Occured While loading products : Home");
        }
        setBestProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setBestProductsLoaded(true);
      });
  };

  // Get Featured Products
  const getFeaturedProducts = () => {
    fetch(`${Config.SERVER_URL}/product?skip=0&limit=10&featuredCake=true`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setBestProducts(data.body);
        } else {
          console.log("Error Occured While loading products : Home");
        }
        setBestProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setBestProductsLoaded(true);
      });
  };

  // Get Featured Products
  const getPopularProducts = () => {
    fetch(`${Config.SERVER_URL}/product?skip=0&limit=10&popularCake=true`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setBestProducts(data.body);
        } else {
          console.log("Error Occured While loading products : Home");
        }
        setBestProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setBestProductsLoaded(true);
      });
  };

  // Get new Added Products
  const getNewAddedProducts = () => {
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
          setBestProducts(data.body);
          console.log("Featured", data.body);
        } else {
          console.log("Error Occured While loading products : Home");
        }
        setBestProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setBestProductsLoaded(true);
      });
  };

  return (
    <>
      {/* Header Section */}
      {/* <Header /> */}
      {/* Header Section */}

      <main className="main" ref={scrollRef}>
        {/* d-sm-none d-md-none */}
        <section className="home-slider style-2 position-relative d-lg-block">
          <div className="">
            <div className="">
              <div className="">
                <div className="home-slide-cover ">
                  <div className="hero-slider-1 style-4 dot-style-1 dot-style-1-position-1">
                    <Slider {...settings3}>
                      {mainSlider.map((slider, index) => {
                        return (
                          <Link to={slider.webpageUrl} key={index}>
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
                          </Link>
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

        {/* Offer Banner for Web */}
        <section className="banners mb-10 web-offer-banner">
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
            </div>
          </div>
        </section>
        {/*End banners*/}

        {/* Offer Banner for Mobile */}
        <section className="banners mb-25 mobile-offer-banner">
          <div className="container">
            <div className="row">
              <Slider {...mobileOfferSliderSetting}>
                {offerBanner.length
                  ? offerBanner.map((banner, index) => {
                      const imgUrl =
                        banner.image ||
                        `assets/imgs/banner/banner-${++index}.png`;
                      return (
                        <div
                          key={`offer-${index}`}
                          className="col-lg-4 col-md-6"
                        >
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
              </Slider>
            </div>
          </div>
        </section>

        {/* Our Products Tab */}
        <section
          className="product-tabs section-padding position-relative"
          style={{ background: "#f8f5f0" }}
        >
          <div className="container">
            <div className="section-title style-2">
              <h3>Our Products</h3>

              {/*start desktop version */}
              <ul
                className="nav nav-tabs links desktopView"
                id="myTab"
                role="tablist"
              >
                {categories.map((cat, index) => {
                  return (
                    <li className="nav-item" role="presentation" key={cat._id}>
                      <button
                        className="nav-link"
                        id="nav-tab-seven"
                        data-bs-toggle="tab"
                        data-bs-target="#tab-one"
                        type="button"
                        role="tab"
                        aria-controls="tab-one"
                        aria-selected="false"
                        onClick={() => {
                          setSelectedParCat(cat._id);
                          setSelectedParCatSlug(cat.slug);
                        }}
                      >
                        {cat.name}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* end desktop version */}

              {/* start mobile version */}
              <div className="MobileTabView b-block d-lg-none">
                <ul className="nav nav-tabs links" id="myTab" role="tablist">
                  {categories.map((cat, index) => {
                    return (
                      <li
                        className="nav-item"
                        role="presentation"
                        key={cat._id}
                      >
                        <button
                          className="nav-link"
                          id="nav-tab-seven"
                          data-bs-toggle="tab"
                          data-bs-target="#tab-one"
                          type="button"
                          role="tab"
                          aria-controls="tab-one"
                          aria-selected="false"
                          onClick={() => {
                            setSelectedParCat(cat._id);
                            setSelectedParCatSlug(cat.slug);
                          }}
                        >
                          {cat.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* end mobile version */}
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
                  <div className="">
                    <div className="row product-grid-4">
                      {products.map((product) => {
                        let totalRating = 0;
                        let avgRating = 0;
                        if (product.reviews.length) {
                          totalRating = product.reviews
                            .map((item) => {
                              return item.status ? item.rating : 0;
                            })
                            .reduce((prev, next) => prev + next);

                          avgRating = (
                            totalRating / product.reviews.length
                          ).toFixed(1);
                        }

                        // Check Item in available in the wishlist or not
                        let availableInWishlist = false;

                        let available = myWishlists.some((item) => {
                          return item?.product?._id == product?._id;
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
                      })}

                      <div className="d-flex justify-content-center">
                        {selectedParCatSlug && (
                          <Link className="btn" to={`/${selectedParCatSlug}`}>
                            View More..
                          </Link>
                        )}
                      </div>
                    </div>
                    {/*end product card*/}
                  </div>
                ) : (
                  <div className="row product-grid-4">
                    {[...Array(5)].map((_, $) => {
                      return (
                        <div className="col-lg-1-5 col-md-4 col-6 col-sm-6">
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
              <h3 className="">Daily Best Sellers</h3>
              <ul className="nav nav-tabs links" id="myTab-2" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    onClick={getBestSellerProducts}
                    className="nav-link active"
                    id="nav-tab-one-1"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-one-1"
                    type="button"
                    role="tab"
                    aria-controls="tab-one"
                    aria-selected="false"
                  >
                    Best Seller
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    onClick={getFeaturedProducts}
                    className="nav-link"
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
                    onClick={getPopularProducts}
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
              </ul>
            </div>
            <div className="row">
              <div className="col-lg-3 d-none d-lg-flex">
                {/* <Link
                  to={`${bestSaleBanner.webpageUrl || "/"}`}
                  className="btn btn-xs"
                > */}
                <div
                  className="banner-img style-2"
                  style={{
                    background: `url(${
                      bestSaleBanner.image ||
                      "/assets/imgs/banner/banner-4.png1"
                    }) no-repeat center bottom`,
                  }}
                >
                  {/* <div className="banner-text">
                      <h2 className="mb-100"></h2>
                      Shop Now <i className="fa fa-angle-right"></i>
                    </div> */}
                </div>
                {/* </Link> */}
              </div>

              <div className="col-lg-9 col-md-12">
                <div className="tab-content mb-15" id="myTabContent-1">
                  <div
                    className="tab-pane fade show active"
                    id="tab-one-1"
                    role="tabpanel"
                    aria-labelledby="tab-one-1"
                  >
                    <div>
                      <div>
                        <Slider {...settings2}>
                          {bestProducts.map((product) => {
                            let totalRating = 0;
                            let avgRating = 0;
                            if (product.reviews.length) {
                              totalRating = product.reviews
                                .map((item) => {
                                  return item.status ? item.rating : 0;
                                })
                                .reduce((prev, next) => prev + next);

                              avgRating = (
                                totalRating / product.reviews.length
                              ).toFixed(1);
                            }

                            // Check Item in available in the wishlist or not
                            let availableInWishlist = false;

                            let available = myWishlists.some((item) => {
                              return item?.product?._id == product?._id;
                            });
                            if (available) availableInWishlist = true;
                            return (
                              <SliderProductCard
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

        {/* Newly Added Products */}
        <section
          className="section-padding pb-5"
          style={{ background: "#f8f5f0" }}
        >
          <div className="container">
            <div className="section-title">
              <h3 className="">Newly Added Products</h3>
            </div>
            <div className="">
              {productLoaded ? (
                <div className="row product-grid-4">
                  {newlyAddedProducts.map((product) => {
                    let totalRating = 0;
                    let avgRating = 0;
                    if (product.reviews.length) {
                      totalRating = product.reviews
                        .map((item) => {
                          return item.status ? item.rating : 0;
                        })
                        .reduce((prev, next) => prev + next);

                      avgRating = (
                        totalRating / product.reviews.length
                      ).toFixed(1);
                    }

                    // Check Item in available in the wishlist or not
                    let availableInWishlist = false;

                    let available = myWishlists.some((item) => {
                      return item?.product?._id == product?._id;
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
                        removeFromWishlistHandler={removeFromWishlistHandler}
                        availableInWishlist={availableInWishlist}
                      />
                    );
                  })}
                  {/*end product card*/}
                </div>
              ) : (
                <div className="row product-grid-4">
                  {[...Array(5)].map((_, $) => {
                    return (
                      <div className="col-lg-1-5 col-md-4 col-6 col-sm-6">
                        <ProductSkeletonLoader />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Adon Product Carousel*/}
        {/* <section className="section-padding pb-5">
          <div className="container">
            <div className="section-title">
              <h3 className="">Addon Products</h3>
            </div>
            <div className="AddOnSlider">
              <Slider {...adonSliderSetting}>
                {adonProducts.map((adonProduct, index) => {
                  return (
                    <div className="col-md-2 col-md-2-adon">
                      <div className="card border-0 rounded-4 shadow ">
                        <div
                          className="card-body"
                          style={{ background: "#fff" }}
                        >
                          <div className="d-flex justify-content-center">
                            <img
                              className="adon-product-image"
                              src={adonProduct.image}
                            />
                          </div>
                          <p className="adon-product-name">
                            {adonProduct?.name?.length > 15
                              ? adonProduct.name.slice(0, 15) + "."
                              : adonProduct.name}
                          </p>
                          <div className="d-flex justify-content-between">
                            <div>
                              <i className="fa fa-inr adon-product-icon"></i>
                              <span className="adon-product-price">
                                {adonProduct.sellingPrice}
                              </span>
                            </div>

                            <div className="">
                              {adonCart.some(
                                (value) => value.productId == adonProduct._id
                              ) ? (
                                <div
                                  className="d-flex justify-content-between"
                                  style={{ width: "100%", margin: "auto" }}
                                >
                                  <p className="">
                                    <button
                                      className="adon-cart-btn"
                                      onClick={() => {
                                        dispatch({
                                          type: "REMOVE_ADON_FROM_CART",
                                          payload: {
                                            productId: adonProduct._id,
                                          },
                                        });
                                      }}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </p>

                                  <button
                                    className="adon-cart-btn"
                                    onClick={() => {
                                      dispatch({
                                        type: "DECREASE_ADON_QUANTITY",
                                        payload: {
                                          productId: adonProduct._id,
                                        },
                                      });
                                    }}
                                  >
                                    <i className="fa fa-minus"></i>
                                  </button>

                                  <button
                                    className="border-0 py-0 px-2 adon-product-text"
                                    style={{ background: "none" }}
                                  >
                                    {
                                      adonCart.filter(
                                        (value) =>
                                          value.productId == adonProduct._id
                                      )[0].quantity
                                    }
                                  </button>

                                  <button
                                    className="adon-cart-btn"
                                    onClick={() => {
                                      dispatch({
                                        type: "INCREASE_ADON_QUANTITY",
                                        payload: {
                                          productId: adonProduct._id,
                                        },
                                      });
                                    }}
                                  >
                                    <i className="fa fa-plus"></i>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="adon-cart-btn"
                                  onClick={() => {
                                    dispatch({
                                      type: "ADD_ADON_TO_CART",
                                      payload: {
                                        name: adonProduct.name,
                                        slug: adonProduct.slug,
                                        productId: adonProduct._id,
                                        quantity: 1,
                                        price: adonProduct.sellingPrice,
                                        image: adonProduct.image,
                                      },
                                    });
                                  }}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        </section> */}

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

      <Footer showContent={true} />
      {/* Quick View */}

      {/* Popup */}
      <div className={`popup ${popup ? "active" : ""}`} id={"popup"}>
        <div
          className="overlay"
          onClick={() => {
            setPopup(false);
          }}
        ></div>

        <div className="popup-image">
          <div className="row">
            <div
              className="col-md-8 m-auto p-4"
              style={{ position: "relative" }}
            >
              <div
                className="close-popup"
                onClick={() => {
                  setPopup(false);
                }}
              >
                X
              </div>
              <img
                onClick={() => {
                  setPopup(false);
                  history.push("/all-cakes");
                }}
                className="img img-fluid"
                src="/assets/imgs/banner/cake-popup-box.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
