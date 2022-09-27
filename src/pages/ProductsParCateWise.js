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
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import ProductCard from "../components/ProductCard";
import Rating from "react-rating";
import parse from "html-react-parser";
import ProductSkeletonLoader from "../components/ProductSkeletonLoader";
import { toast } from "react-toastify";
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
  const [types, setTypes] = useState([]);

  const { parCatSlug, catSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [price, setPrice] = useState({});
  const [quickViewData, setQuickViewData] = useState(null);

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
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [myWishlists, setMyWishlist] = useState([]);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [removeFromWishlist, setRemoveFromWishlist] = useState(false);
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  useEffect(() => {
    titleRef.current.scrollIntoView({ behavior: "smooth" });
  }, [parCatSlug, products]);

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
            // setFormData({ email: "" });
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
            // setFormData({ email: "" });
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
  return (
    <>
      {/* Header Section */}
      {/* <Header /> */}
      {/* Header Section */}
      <main className="main" style={{ transform: "none" }}>
        <div className="page-header mt-30">
          <div className="container">
            <div className="archive-header">
              <div className="row align-items-center">
                <div className="col-xl-12">
                  <h1 className="mb-15"> {parentCategory.name} </h1>
                  <div className="breadcrumb" ref={titleRef}>
                    <Link to="/" rel="nofollow">
                      <i className="fa fa-home mr-5"></i>Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="container pb-30 pt-50"
          style={{ transform: "none", background: "#f8f5f0" }}
        >
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
                          className="col-lg-1-4 col-md-3 col-12 col-sm-6"
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
                <div className="row">
                  {[...Array(8)].map((_, $) => {
                    return (
                      <div className="col-md-3">
                        <ProductSkeletonLoader />
                      </div>
                    );
                  })}
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
                  <h5 className="section-title style-1 mb-30">Cake Type</h5>
                  <div className="custome-checkbox">
                    {types.map((cakeType, index) => {
                      return (
                        <div className="">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={flavourChangeHandler}
                            name="checkbox"
                            id={`type-${index}`}
                            value={cakeType._id}
                          />
                          <label
                            className="form-check-label"
                            for={`type-${index}`}
                          >
                            <span>
                              {cakeType.name}
                              {/* ({cakeType.products.length}) */}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="sidebar-widget price_range range mb-30">
                  <h5 className="section-title style-1 mb-30">Fillter</h5>
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
                      {/* <label className="fw-900">Color</label> */}
                      {/* <div className="custome-checkbox">
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
                      </div> */}

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

      {/* Modal */}
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

export default ProductsPerCatWise;
