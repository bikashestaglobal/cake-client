import React, {
  useRef,
  useEffect,
  createRef,
  useState,
  useContext,
} from "react";

import {
  useHistory,
  useParams,
  Link,
  useLocation,
  useQueryParams,
} from "react-router-dom";
import Config from "../Config";

import { CustomerContext } from "../Routes";

import Rating from "react-rating";
import parse from "html-react-parser";
const emptyObject = (obj) => {
  return Object.keys(obj).length ? false : true;
};

const ProductsPerCatWise = () => {
  const history = useHistory();
  const titleRef = useRef();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const maxPrice = queryParams.get("maxPrice");
  const minPrice = queryParams.get("minPrice");
  const flavour = queryParams.get("flavour");
  const color = queryParams.get("color");
  const shape = queryParams.get("shape");
  // read the parameter
  const { state, dispatch } = useContext(CustomerContext);
  const { shipping, cart } = state;

  const { parCatSlug, catSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [price, setPrice] = useState({});

  const [colors, setColors] = useState([]);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allParCategories, setAllParCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
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
  const [toggleLimit, setToggleLimit] = useState(false);
  const [toggleSortBy, setToggleSortBy] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [categoryPageBanner, setCategoryPageBanner] = useState({});

  useEffect(() => {
    titleRef.current.scrollIntoView({ behavior: "smooth" });
  }, [parCatSlug, products]);

  // Count Products
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/product/by/category?parCatSlug=${parCatSlug}&catSlug=${catSlug}&minPrice=${minPrice}&maxPrice=${maxPrice}&flavour=${flavour}&color=${color}&shape=${shape}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
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
  }, [parCatSlug, catSlug, flavour, color, minPrice, maxPrice, shape]);

  // Get Products
  useEffect(() => {
    setIsAllProductLoaded(false);
    fetch(
      `${Config.SERVER_URL}/product/by/category?parCatSlug=${parCatSlug}&catSlug=${catSlug}&limit=${pagination.limit}&skip=${pagination.skip}&minPrice=${minPrice}&maxPrice=${maxPrice}&flavour=${flavour}&color=${color}&shape=${shape}`,
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
        console.log(data);
        setIsAllProductLoaded(true);
        if (data.status == 200) {
          setProducts(data.body);
        } else {
          console.log("Error Occured While loading product : Products");
        }
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setIsAllProductLoaded(true);
      });
  }, [
    parCatSlug,
    catSlug,
    clearFilter,
    pagination,
    minPrice,
    maxPrice,
    shape,
    color,
    flavour,
  ]);

  // Get Colors
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/color/withProductsByCategory?parCatSlug=${parCatSlug}&catSlug=${catSlug}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
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
  }, [parCatSlug, catSlug]);

  // Get Categories by parent category slug
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/category/get/byParentCategorySlug/${parCatSlug}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          const filteredData = data.body.filter(
            (item) => item.parentCategories.length
          );

          setCategories(filteredData);
        } else {
          console.log(
            "Error Occured While loading Category : ProductParCategoryWise"
          );
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [parCatSlug]);

  // Get parent category by slug
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/parent-category/bySlug/${parCatSlug}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setParentCategory(data.body);
        } else {
          console.log(
            "Error Occured While loading Category : ProductParCategoryWise"
          );
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [parCatSlug]);

  // Get category by slug
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/category/bySlug/${catSlug}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setCategory(data.body);
        } else {
          console.log(
            "Error Occured While loading Category : ProductParCategoryWise"
          );
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [catSlug]);

  // Get Flavours
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/flavour/withProductsByCategory?parCatSlug=${parCatSlug}&catSlug=${catSlug}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
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
  }, [parCatSlug, catSlug]);

  useEffect(() => {
    setShippingDataTime({ ...shippingDateTime, ...state.shipping });
    setEnteredPincode({ ...enteredPincode, pincode: state.shipping.pincode });
  }, [state]);

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
            setCategoryPageBanner(result.body.categoryPageBanner || {});
          } else {
            // toast.e();
          }
        },
        (error) => {
          // M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  const filterHandler = () => {
    console.log("colors", selectedColors);
    console.log("flavour", selectedFlavours);

    if (selectedColors.length || selectedFlavours.length) {
      fetch(`${Config.SERVER_URL}/product/filter`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skip: pagination.skip,
          limit: pagination.limit,
          colors: selectedColors,
          flavours: selectedFlavours,
          catId: category._id,
          parCatId: parentCategory._id,
        }),
      })
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
    return;
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
                  <h1 className="mb-15"> {parentCategory.name} </h1>
                  <div className="breadcrumb" ref={titleRef}>
                    <a href="index.html" rel="nofollow">
                      <i className="fi-rs-home mr-5"></i>Home
                    </a>
                    <span></span> Shop <span></span> {parentCategory.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mb-30" style={{ transform: "none" }}>
          <div className="row flex-row-reverse" style={{ transform: "none" }}>
            <div className="col-lg-4-5">
              {isAllProductLoaded ? (
                <>
                  <div className="shop-product-fillter">
                    <div className="totall-product">
                      <p>
                        We found
                        <strong className="text-brand">
                          {" "}
                          {pagination.totalRecord}{" "}
                        </strong>
                        items for you!
                      </p>
                    </div>
                    <div className="sort-by-product-area">
                      <div className="sort-by-cover mr-10">
                        <div
                          className="sort-by-product-wrap"
                          onClick={() => setToggleLimit(!toggleLimit)}
                        >
                          <div className="sort-by">
                            <span>
                              <i class="fa fa-th-large" aria-hidden="true"></i>
                              Show:
                            </span>
                          </div>
                          <div className="sort-by-dropdown-wrap">
                            <span>
                              {pagination.limit}
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </div>
                        </div>
                        <div
                          className={`sort-by-dropdown ${
                            toggleLimit ? "show" : ""
                          }`}
                        >
                          <ul>
                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleLimit(!toggleLimit);
                                  setPagination({ ...pagination, limit: 12 });
                                }}
                              >
                                12
                              </Link>
                            </li>
                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleLimit(!toggleLimit);
                                  setPagination({ ...pagination, limit: 36 });
                                }}
                              >
                                36
                              </Link>
                            </li>
                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleLimit(!toggleLimit);
                                  setPagination({ ...pagination, limit: 60 });
                                }}
                              >
                                60
                              </Link>
                            </li>
                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleLimit(!toggleLimit);
                                  setPagination({
                                    ...pagination,
                                    limit: pagination.totalRecord,
                                  });
                                }}
                              >
                                All
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="sort-by-cover">
                        <div
                          className="sort-by-product-wrap"
                          onClick={() => setToggleSortBy(!toggleSortBy)}
                        >
                          <div className="sort-by">
                            <span>
                              <i class="fa fa-th-large" aria-hidden="true"></i>
                              Sort by:
                            </span>
                          </div>
                          <div className="sort-by-dropdown-wrap">
                            <span>
                              Featured
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </div>
                        </div>
                        <div
                          className={`sort-by-dropdown ${
                            toggleSortBy ? "show" : ""
                          }`}
                        >
                          <ul>
                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleSortBy(!toggleSortBy);
                                  setSortBy("Featured");
                                }}
                              >
                                Featured
                              </Link>
                            </li>
                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleSortBy(!toggleSortBy);
                                  setSortBy("Price: Low to High");
                                }}
                              >
                                Price: Low to High
                              </Link>
                            </li>
                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleSortBy(!toggleSortBy);
                                  setSortBy("Price: High to Low");
                                }}
                              >
                                Price: High to Low
                              </Link>
                            </li>
                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleSortBy(!toggleSortBy);
                                  setSortBy("Release Date");
                                }}
                              >
                                Release Date
                              </Link>
                            </li>

                            <li>
                              <Link
                                className=""
                                onClick={() => {
                                  setToggleSortBy(!toggleSortBy);
                                  setSortBy("Avg. Rating");
                                }}
                              >
                                Avg. Rating
                              </Link>
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

                        avgRating = (
                          totalRating / product.reviews.length
                        ).toFixed(1);
                      }
                      return (
                        <div
                          className="col-lg-1-4 col-md-3 col-12 col-sm-6"
                          key={index}
                        >
                          <div className="product-cart-wrap mb-30">
                            <div className="product-img-action-wrap">
                              <div className="product-img product-img-zoom">
                                <Link to={`/product/${product.slug}`}>
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
                                    src={
                                      product.images.length &&
                                      product.images.length > 1
                                        ? product.images[1].url
                                        : "assets/imgs/shop/product-1-2.jpg"
                                    }
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
                                  {product.skus.length
                                    ? 100 -
                                      Math.ceil(
                                        (product.skus[0].sellingPrice /
                                          product.skus[0].mrp) *
                                          100
                                      )
                                    : ""}
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
                                <Link to={`/product/${product.slug}`}>
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
                </>
              ) : (
                <div className="d-flex justify-content-center py-5">
                  <div className="py-5">
                    <div className="spinner-grow spinner-grow-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow spinner-grow-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow spinner-grow-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
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
                    {categories.map((item, index) => {
                      return (
                        <li key={index}>
                          <Link to={`/${parCatSlug}/${item.slug}`}>
                            <img
                              src={item.image}
                              alt=""
                              style={{
                                height: "30px",
                                width: "40px",
                                borderRadius: "20px",
                              }}
                            />
                            {item.name}
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

                {/* New Products */}

                {/* <div className="sidebar-widget product-sidebar mb-30 p-30 bg-grey border-radius-10">
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
                </div> */}

                {/* Banner */}
                <div
                  className="banner-img wow fadeIn mb-lg-0 animated d-lg-block d-none animated"
                  style={{ visibility: "visible" }}
                >
                  <img
                    src={
                      categoryPageBanner.image ||
                      "/assets/imgs/banner/banner-11.png"
                    }
                    alt=""
                  />
                  <div className="banner-text">
                    <span>Oganic</span>
                    <h4>{parse(categoryPageBanner.title || "")}</h4>
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

export default ProductsPerCatWise;
