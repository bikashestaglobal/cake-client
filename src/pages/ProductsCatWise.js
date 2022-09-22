import React, {
  useRef,
  useEffect,
  createRef,
  useState,
  useContext,
} from "react";

import { useHistory, useParams, Link } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import parse from "html-react-parser";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import date from "date-and-time";
import { toast } from "react-toastify";
import Rating from "react-rating";

const emptyObject = (obj) => {
  return Object.keys(obj).length ? false : true;
};

const ProductsCatWise = () => {
  const history = useHistory();
  const titleRef = useRef();
  // read the parameter
  const { state, dispatch } = useContext(CustomerContext);
  const { shipping, cart } = state;

  const { cat } = useParams();
  const [products, setProducts] = useState([]);

  const [colors, setColors] = useState([]);
  const [category, setCategory] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [relProductLoaded, setRelProductLoaded] = useState(false);
  const [isAllProductLoaded, setIsAllProductLoaded] = useState(false);
  const [allProduct, setAllProduct] = useState(false);
  const [enteredPincode, setEnteredPincode] = useState({
    error: false,
    message: "Enter correct Pincode for hassle free timely delivery",
    pincode: "",
  });
  const [shippingMethodModel, setShippingMethodModel] = useState(false);
  const [shippingDateTime, setShippingDataTime] = useState({
    date: "",
    method: "",
    startTime: "",
    endTime: "",
    amount: "",
  });

  const [flavours, setFlavours] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFlavours, setSelectedFlavours] = useState([]);
  const [clearFilter, setClearfilter] = useState(true);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 12,
    totalRecord: 0,
    totalPage: 0,
    currentPage: 1,
  });
  useEffect(() => {
    titleRef.current.scrollIntoView({ behavior: "smooth" });
  }, [cat, products]);

  // Count Records
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/product/by-category-slug/${cat}?limit=${pagination.limit}&skip=${pagination.skip}`,
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
          setPagination({
            ...pagination,
            totalRecord: data.body.length,
            totalPage: Math.ceil(data.body.length / pagination.limit),
          });
        } else {
          console.log("Error Occured While loading product : Products");
        }
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get Products
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/product/by-category-slug/${cat}?limit=${pagination.limit}&skip=${pagination.skip}`,
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
      });
  }, [cat, clearFilter, pagination]);

  // Get Colors
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/color/withProductsByCategory?slug=${cat}`, {
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
          console.log("Error Occured While loading pincode : Products");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [cat]);

  // Get Category
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/category/bySlug/${cat}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setCategory(data.body);
        } else {
          console.log("Error Occured While loading pincode : Products");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [cat]);

  // Get All Gategory
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/parent-category?skip=0&limit=5`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setAllCategories(data.body);
        } else {
          console.log("Error Occured While loading pincode : Products");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [cat]);

  // Get Flavours
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/flavour/withProductsByCategory?slug=${cat}`, {
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
          console.log("Error Occured While loading shippingMethods : Products");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  useEffect(() => {
    setShippingDataTime({ ...shippingDateTime, ...state.shipping });
    setEnteredPincode({ ...enteredPincode, pincode: state.shipping.pincode });
  }, [state]);

  const pincodeChangeHandler = (evt) => {
    const found = pincodes.some((pin) => pin.pincode == evt.target.value);
    if (found) {
      setEnteredPincode({
        ...enteredPincode,
        message: "This pincode is available for delivery",
        error: false,
        pincode: evt.target.value,
      });
    } else {
      setEnteredPincode({
        ...enteredPincode,
        message: "Delivery is not available in this pincode",
        error: true,
        pincode: evt.target.value,
      });
    }
  };

  const addToCartHandler = () => {
    if (enteredPincode.error || !enteredPincode.pincode) {
      toast.warning("Must Enter Pincode");
      return;
    }
    if (!shippingDateTime.date) {
      toast.warning("Select Shipping Date First");
      return;
    }

    if (!shippingDateTime.endTime) {
      toast.warning("Select Shipping Time First");
      setShippingMethodModel(true);
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        // name: product.name,
        // slug: product.slug,
        // productId: product._id,
        // quantity: 1,
        // price: price.sellingPrice,
        // weight: price.weight,
        // color: color.name,
        // flavour: flavour.name,
        // image: product.images[0].url,
      },
    });
  };

  const filterHandler = () => {
    if (selectedColors.length || selectedFlavours.length) {
      fetch(
        `${Config.SERVER_URL}/product/filter?skip=${pagination.skip}&limit=${pagination.limit}`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skip: 0,
            limit: 10,
            colors: selectedColors,
            flavours: selectedFlavours,
            catId: category._id,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 200) {
            setProducts(data.body);
          } else {
            console.log(
              "Error Occured While loading shippingMethods : Products"
            );
          }
        })
        .catch((error) => {
          console.error("Header Error:", error);
        });
    } else {
      setClearfilter(!clearFilter);
    }
  };

  const colorChangeHandler = (evt) => {
    let filtered = [...selectedColors];
    let exist = filtered.some((value) => value == evt.target.value);
    if (exist) {
      filtered = filtered.filter((value) => value != evt.target.value);
    } else {
      filtered.push(evt.target.value);
    }
    setSelectedColors([...filtered]);
  };

  const limitHandler = (e) => {
    const limit = e.target.value;
    const totalPage = Math.ceil(pagination.totalRecord / limit);
    setPagination({
      ...pagination,
      limit,
      totalPage,
    });
  };

  const pageHandler = (e, page) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      skip: page == 1 ? 0 : (page - 1) * pagination.limit,
      currentPage: page,
    });
  };

  const previousPageHandler = (e) => {
    e.preventDefault();
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage: pagination.currentPage == 1 ? 1 : pagination.currentPage - 1,
      skip:
        pagination.currentPage == 1
          ? 0
          : (pagination.currentPage - 2) * pagination.limit,
    });
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage:
        pagination.currentPage == pagination.totalPage
          ? pagination.totalPage
          : pagination.currentPage + 1,
      skip:
        pagination.currentPage == pagination.totalPage
          ? 0
          : (pagination.currentPage + 1) * pagination.limit,
    });
  };

  const flavourChangeHandler = (evt) => {
    let filtered = [...selectedFlavours];
    let exist = filtered.some((value) => value == evt.target.value);
    if (exist) {
      filtered = filtered.filter((value) => value != evt.target.value);
    } else {
      filtered.push(evt.target.value);
    }
    setSelectedFlavours([...filtered]);
  };

  return (
    <>
      {/* Header Section */}
      {/* <Header /> */}
      {/* Header Section */}
      <main className="main" style={{ transform: "none" }}>
        <div className="page-header mt-30 mb-50">
          <div className="container">
            <div className="archive-header">
              <div className="row align-items-center">
                <div className="col-xl-12">
                  <h1 className="mb-15"> {category.name} </h1>
                  <div className="breadcrumb" ref={titleRef}>
                    <a href="index.html" rel="nofollow">
                      <i className="fi-rs-home mr-5"></i>Home
                    </a>
                    <span></span> Shop <span></span> {category.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mb-30" style={{ transform: "none" }}>
          <div className="row flex-row-reverse" style={{ transform: "none" }}>
            <div className="col-lg-4-5">
              <div className="shop-product-fillter">
                <div className="totall-product">
                  <p>
                    We found
                    <strong className="text-brand"> {products.length} </strong>
                    items for you!
                  </p>
                </div>
                <div className="sort-by-product-area">
                  <div className="sort-by-cover mr-10">
                    <div className="sort-by-product-wrap">
                      <div className="sort-by">
                        <span>
                          <i className="fi-rs-apps"></i>Show:
                        </span>
                      </div>
                      <div className="sort-by-dropdown-wrap">
                        <span>
                          50 <i className="fi-rs-angle-small-down"></i>
                        </span>
                      </div>
                    </div>
                    <div className="sort-by-dropdown">
                      <ul>
                        <li>
                          <a className="active" href="#">
                            50
                          </a>
                        </li>
                        <li>
                          <a href="#">100</a>
                        </li>
                        <li>
                          <a href="#">150</a>
                        </li>
                        <li>
                          <a href="#">200</a>
                        </li>
                        <li>
                          <a href="#">All</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="sort-by-cover">
                    <div className="sort-by-product-wrap">
                      <div className="sort-by">
                        <span>
                          <i className="fi-rs-apps-sort"></i>Sort by:
                        </span>
                      </div>
                      <div className="sort-by-dropdown-wrap">
                        <span>
                          Featured <i className="fi-rs-angle-small-down"></i>
                        </span>
                      </div>
                    </div>
                    <div className="sort-by-dropdown">
                      <ul>
                        <li>
                          <a className="active" href="#">
                            Featured
                          </a>
                        </li>
                        <li>
                          <a href="#">Price: Low to High</a>
                        </li>
                        <li>
                          <a href="#">Price: High to Low</a>
                        </li>
                        <li>
                          <a href="#">Release Date</a>
                        </li>
                        <li>
                          <a href="#">Avg. Rating</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row product-grid">
                {/* Products */}
                {products.map((product, index) => {
                  // Review calculate
                  let totalRating = 0;
                  let avgRating = 0;
                  if (product.reviews.length) {
                    totalRating = product.reviews
                      .map((item) => item.rating)
                      .reduce((prev, next) => prev + next);

                    avgRating = (totalRating / product.reviews.length).toFixed(
                      1
                    );
                  }
                  return (
                    <div
                      className="col-lg-1-4 col-md-3 col-12 col-sm-6"
                      key={index}
                    >
                      <div className="product-cart-wrap mb-30">
                        <div className="product-img-action-wrap">
                          <div className="product-img product-img-zoom">
                            <Link to={`/p/${product.slug}`}>
                              <img
                                className="default-img"
                                src={
                                  product.images.length
                                    ? product.images[0].url
                                    : "assets/imgs/shop/product-1-2.jpg"
                                }
                                alt=""
                              />
                              <img
                                className="hover-img"
                                src="assets/imgs/shop/product-1-2.jpg"
                                alt=""
                              />
                            </Link>
                          </div>
                          <div className="product-action-1">
                            {/* <a
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
                            >
                              <i className="fi-rs-eye"></i>
                            </a> */}
                          </div>
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
                            <Link href="shop-grid-right.html">
                              {product.shape.name} | {product.flavour.name}
                            </Link>
                          </div>
                          <h2>
                            <Link to={`/p/${product.slug}`}>
                              {product.name}
                            </Link>
                          </h2>
                          <div className="" title="">
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
                          <div></div>
                          <div className="product-card-bottom">
                            <div className="product-price">
                              <span>
                                <i className="fa fa-inr"></i>
                                {product.skus[0].sellingPrice}
                              </span>
                              <span className="old-price">
                                <i className="fa fa-inr"></i>
                                {product.skus[0].mrp}
                              </span>
                            </div>
                            {/* <div className="add-cart">
                              <a className="add" href="shop-cart.html">
                                <i className="fi-rs-shopping-cart mr-5"></i>Add
                              </a>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* end product card */}
              </div>

              {/*Pagination*/}
              {products.length ? (
                <div className="pagination-area mt-20 mb-20">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-start">
                      <li className="page-item">
                        <a
                          className="page-link"
                          href="#"
                          onClick={previousPageHandler}
                        >
                          <i className="fa fa-angle-left"></i>
                        </a>
                      </li>
                      {[...Array(pagination.totalPage)].map((_, i) => {
                        return (
                          <li className="page-item">
                            <a
                              className="page-link"
                              href="#"
                              onClick={(e) => pageHandler(e, i + 1)}
                            >
                              {i + 1}
                            </a>
                          </li>
                        );
                      })}
                      <li className="page-item">
                        <a
                          className="page-link"
                          href="#"
                          onClick={nextPageHandler}
                        >
                          <i className="fa fa-angle-right"></i>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              ) : (
                ""
              )}

              {/*End Deals*/}
            </div>
            <div
              className="col-lg-1-5 primary-sidebar sticky-sidebar"
              style={{
                position: "relative",
                overflow: "visible",
                boxSizing: "border-box",
                minHeight: "1px",
              }}
            >
              {/* Fillter By Price */}

              {/* Product sidebar Widget */}

              <div
                className="theiaStickySidebar"
                style={{
                  paddingTop: "0px",
                  paddingBottom: "1px",
                  position: "static",
                  transform: "none",
                  top: "0px",
                  left: "12px",
                }}
              >
                <div className="sidebar-widget widget-category-2 mb-30">
                  <h5 className="section-title style-1 mb-30">Category</h5>
                  <ul>
                    {allCategories.map((cat, index) => {
                      return (
                        <li key={index}>
                          <Link to={`/${cat.slug}`}>
                            <img
                              src={cat.image}
                              alt=""
                              style={{
                                height: "30px",
                                width: "40px",
                                borderRadius: "20px",
                              }}
                            />
                            {cat.name}
                          </Link>
                          {/* <span className="count">30</span> */}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="sidebar-widget price_range range mb-30">
                  <h5 className="section-title style-1 mb-30">
                    Fillter by Color & Flavour
                  </h5>
                  <div className="price-filter">
                    <div className="price-filter-inner">
                      <div id="slider-range" className="mb-20"></div>
                      <div className="d-flex justify-content-between">
                        <div className="caption">
                          From:
                          <strong
                            id="slider-range-value1"
                            className="text-brand"
                          ></strong>
                        </div>
                        <div className="caption">
                          To:
                          <strong
                            id="slider-range-value2"
                            className="text-brand"
                          ></strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="list-group">
                    <div className="list-group-item mb-10 mt-10">
                      {/*Colors  */}
                      <label className="fw-900">Color</label>
                      <div className="custome-checkbox">
                        {colors.map((color, index) => {
                          return (
                            <div className="">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={colorChangeHandler}
                                name="checkbox"
                                id={`color-${index}`}
                                value={color._id}
                              />
                              <label
                                className="form-check-label"
                                for={`color-${index}`}
                              >
                                <span>
                                  {color.name} ({color.products.length})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>

                      {/* Flavours */}
                      <label className="fw-900">Flavours</label>
                      <div className="custome-checkbox">
                        {flavours.map((flavour, index) => {
                          return (
                            <div className="">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={flavourChangeHandler}
                                name="checkbox"
                                id={`flavour-${index}`}
                                value={flavour._id}
                              />
                              <label
                                className="form-check-label"
                                for={`flavour-${index}`}
                              >
                                <span>
                                  {flavour.name} ({flavour.products.length})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    href="shop-grid-right.html"
                    className="btn btn-sm btn-default"
                    onClick={filterHandler}
                  >
                    <i className="fa fa-filter mr-5"></i> Fillter
                  </button>
                </div>
                <div className="sidebar-widget product-sidebar mb-30 p-30 bg-grey border-radius-10">
                  <h5 className="section-title style-1 mb-30">New products</h5>
                  <div className="single-post clearfix">
                    <div className="image">
                      <img src="/assets/imgs/shop/thumbnail-3.jpg" alt="#" />
                    </div>
                    <div className="content pt-10">
                      <h5>
                        <a href="shop-product-detail.html">Chen Cardigan</a>
                      </h5>
                      <p className="price mb-0 mt-5">$99.50</p>
                      <div className="product-rate">
                        <div
                          className="product-rating"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post clearfix">
                    <div className="image">
                      <img src="/assets/imgs/shop/thumbnail-4.jpg" alt="#" />
                    </div>
                    <div className="content pt-10">
                      <h6>
                        <a href="shop-product-detail.html">Chen Sweater</a>
                      </h6>
                      <p className="price mb-0 mt-5">$89.50</p>
                      <div className="product-rate">
                        <div
                          className="product-rating"
                          style={{ width: "80%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post clearfix">
                    <div className="image">
                      <img src="/assets/imgs/shop/thumbnail-5.jpg" alt="#" />
                    </div>
                    <div className="content pt-10">
                      <h6>
                        <a href="shop-product-detail.html">Colorful Jacket</a>
                      </h6>
                      <p className="price mb-0 mt-5">$25</p>
                      <div className="product-rate">
                        <div
                          className="product-rating"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="banner-img wow fadeIn mb-lg-0 animated d-lg-block d-none animated"
                  style={{ visibility: "visible" }}
                >
                  <img src="/assets/imgs/banner/banner-11.png" alt="" />
                  <div className="banner-text">
                    <span>Oganic</span>
                    <h4>
                      Save 17% <br />
                      on <span className="text-brand">Oganic</span>
                      <br />
                      Juice
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductsCatWise;
