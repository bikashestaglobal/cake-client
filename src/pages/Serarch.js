import React, { useRef, useEffect, useState, useContext } from "react";

import { useHistory, useParams, Link, useLocation } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import ProductCard from "../components/ProductCard";
import ProductSkeletonLoader from "../components/ProductSkeletonLoader";
import { toast } from "react-toastify";
import SubscribeContainer from "../components/SubscribeContainer";
import SEO from "../components/SEO";
import Footer from "../layouts/Footer";

const Search = () => {
  const history = useHistory();
  const titleRef = useRef();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const maxPrice = queryParams.get("maxPrice");
  const minPrice = queryParams.get("minPrice");
  const flavour = queryParams.get("flavour");
  const occasion = queryParams.get("occasion");
  const color = queryParams.get("color");
  const shape = queryParams.get("shape");
  const cakeType = queryParams.get("cakeType");
  const q = queryParams.get("q");

  // read the parameter
  const { state, dispatch } = useContext(CustomerContext);
  const { shipping, cart } = state;

  const { parCatSlug, catSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isAllProductLoading, setIsAllProductLoding] = useState(true);
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

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFlavours, setSelectedFlavours] = useState([]);
  const [selectedCakeTypes, setSelectedCakeTypes] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);

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
  const [sortBy, setSortBy] = useState("default");
  const [categoryPageBanner, setCategoryPageBanner] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [myWishlists, setMyWishlist] = useState([]);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [removeFromWishlist, setRemoveFromWishlist] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const [productLoding, setProductLoding] = useState(true);
  const [range, setRange] = useState({
    min: 0,
    max: 5000,
  });

  useEffect(() => {
    setBreadcrumbTitle(q);
  }, [q]);

  // Get product
  //   useEffect(() => {
  //     fetch(`${Config.SERVER_URL}/product/search?query=${q}&skip=0&limit=10`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${customerInfo ? customerInfo.jwtToken : ""}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then(
  //         (result) => {
  //           setProductLoding(false);
  //           if (result.status == 200) {
  //             setProducts(result.body);
  //           } else {
  //             console.log(result);
  //           }
  //         },
  //         (error) => {
  //           console.log(error);
  //         }
  //       );
  //   }, [q]);

  useEffect(() => {
    titleRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [parCatSlug, products]);

  // Count Products
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/product/search?query=${q}?limit=0`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setPagination({
            ...pagination,
            totalRecord: data.body.length,
            skip: !data.body.length ? 0 : pagination.skip,
            currentPage: !data.body.length ? 1 : pagination.currentPage,
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
  }, [q]);

  // Sort By
  useEffect(() => {
    let unsortedProducts = [...products];
    if (sortBy == "default") {
    } else if (sortBy == "name-a-z") {
      unsortedProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (sortBy == "name-z-a") {
      unsortedProducts.sort((a, b) => (a.name < b.name ? 1 : -1));
    } else if (sortBy == "price-l-h") {
      unsortedProducts.sort((a, b) =>
        a.priceVariants[0].sellingPrice > b.priceVariants[0].sellingPrice
          ? 1
          : -1
      );
    } else if (sortBy == "price-h-l") {
      unsortedProducts.sort((a, b) =>
        a.priceVariants[0].sellingPrice > b.priceVariants[0].sellingPrice
          ? -1
          : 1
      );
    } else if (sortBy == "release-date") {
      unsortedProducts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    setProducts(unsortedProducts);
  }, [sortBy]);

  // Get Products
  useEffect(() => {
    setIsAllProductLoding(true);
    if (q) {
      fetch(`${Config.SERVER_URL}/product/search?query=${q}&limit=0&skip=0`, {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setIsAllProductLoding(false);
          if (data.status == 200) {
            let unsortedProducts = [...data.body];
            if (sortBy == "default") {
            } else if (sortBy == "name-a-z") {
              unsortedProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
            } else if (sortBy == "name-z-a") {
              unsortedProducts.sort((a, b) => (a.name < b.name ? 1 : -1));
            } else if (sortBy == "price-l-h") {
              unsortedProducts.sort((a, b) =>
                a.priceVariants[0].sellingPrice >
                b.priceVariants[0].sellingPrice
                  ? 1
                  : -1
              );
            } else if (sortBy == "price-h-l") {
              unsortedProducts.sort((a, b) =>
                a.priceVariants[0].sellingPrice >
                b.priceVariants[0].sellingPrice
                  ? -1
                  : 1
              );
            } else if (sortBy == "release-date") {
              unsortedProducts.sort((a, b) =>
                a.createdAt < b.createdAt ? 1 : -1
              );
            }
            setProducts(unsortedProducts);
            // setProducts(data.body);
          } else {
            console.log("Error Occured While loading product : Products");
          }
          setProductsLoaded(true);
        })
        .catch((error) => {
          console.error("Header Error:", error);
          setIsAllProductLoding(false);
        });
    }
  }, [q]);

  // clear filter handler
  const clearFilterHandler = () => {
    if (selectedColors.length) setSelectedColors([]);
    if (selectedFlavours.length) setSelectedFlavours([]);
    if (selectedShapes.length) setSelectedShapes([]);
    if (selectedOccasions.length) setSelectedOccasions([]);
    if (selectedCakeTypes.length) setSelectedCakeTypes([]);
    setIsFiltering(false);
  };

  // filter handler
  const filterHandler = () => {
    if (
      selectedColors.length ||
      selectedFlavours.length ||
      selectedShapes.length ||
      selectedOccasions.length ||
      selectedCakeTypes.length ||
      true
    ) {
      setIsAllProductLoding(true);
      fetch(`${Config.SERVER_URL}/product/filter`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // skip: pagination.skip,
          // limit: pagination.limit,
          colors: selectedColors,
          flavours: selectedFlavours,
          cakeTypes: selectedCakeTypes,
          shapes: selectedShapes,
          occasions: selectedOccasions,
          catId: category._id,
          parCatId: parentCategory._id,
          minPrice: range.min,
          maxPrice: range.max,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsAllProductLoding(false);
          // console.log("Filter", data);
          if (data.status == 200) {
            setProducts(data.body);
            setPagination({
              ...pagination,
              totalRecord: data.body.length,
              skip: !data.body.length ? 0 : pagination.skip,
              currentPage: !data.body.length ? 1 : pagination.currentPage,
              totalPage: Math.ceil(data.body.length / pagination.limit),
            });

            // go page to top
            titleRef.current.scrollIntoView();
          } else {
            toast.error(data.message);
            console.log(
              "Error Occured While loading shippingMethods : Products"
            );
          }
        })
        .catch((error) => {
          toast.error(error);
          console.error("Header Error:", error);
          setIsAllProductLoding(false);
        });
    } else {
      setClearfilter(!clearFilter);
      setIsAllProductLoding(false);
    }
  };

  // Filter product
  useEffect(() => {
    // filterHandler();

    // clear isFiltering when all are empty
    if (
      !selectedColors.length &&
      !selectedFlavours.length &&
      !selectedShapes.length &&
      !selectedOccasions.length &&
      !selectedCakeTypes.length &&
      range.max == 5000 &&
      range.min == 0
    ) {
      setIsFiltering(false);
    }
  }, [
    selectedColors,
    selectedFlavours,
    selectedShapes,
    selectedOccasions,
    selectedCakeTypes,
    range,
  ]);

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

    setPagination({
      ...pagination,
      currentPage:
        pagination.currentPage == pagination.totalPage
          ? pagination.totalPage
          : pagination.currentPage + 1,
      skip:
        pagination.currentPage == pagination.totalPage
          ? 0
          : pagination.currentPage * pagination.limit,
    });
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

  const [breadcrumbTitle, setBreadcrumbTitle] = useState(q);
  // scroll to top when user click back button
  // useEffect(() => {
  //   const handleScroll = () => {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   };

  //   window.addEventListener("popstate", handleScroll);

  //   return () => {
  //     window.removeEventListener("popstate", handleScroll);
  //   };
  // }, []);
  return (
    <>
      {/* Header Section */}
      <SEO
        title={parentCategory.metaTitle}
        description={parentCategory.metaDescription}
        keywords={parentCategory.keywords}
      />
      {/* <Header /> */}
      {/* Header Section */}
      <main className="main" style={{ transform: "none" }}>
        <div className="page-header mt-30">
          <div className="container">
            <div className="archive-header">
              <div className="row align-items-center">
                <div className="col-xl-12">
                  <h1 className="mb-15">
                    {breadcrumbTitle || parentCategory.name}
                  </h1>
                  <div className="breadcrumb" ref={titleRef}>
                    <Link to="/" rel="nofollow">
                      <i className="fa fa-home mr-5"></i>Home
                    </Link>
                    <span></span>
                    {parentCategory?.name}
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
            <div className="col-lg-5-4">
              {/* Filter */}
              <div className="shop-product-fillter">
                <div className="totall-product">
                  {/* <p>
                      We found
                      <strong className="text-brand">
                        {" "}
                        {pagination.totalRecord}{" "}
                      </strong>
                      items for you!
                    </p> */}
                </div>
                <div className="sort-by-product-area">
                  <div className="sort-by-cover mr-10">
                    {/* <div
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
                          <i class="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </div>
                    </div> */}
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
                              setPagination({ ...pagination, limit: 24 });
                            }}
                          >
                            24
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
                          Select
                          <i class="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`sort-by-dropdown ${
                        toggleSortBy ? "show" : ""
                      }`}
                    >
                      <ul>
                        {/* <li>
                            <Link
                              className=""
                              onClick={() => {
                                setToggleSortBy(!toggleSortBy);
                                setSortBy("featured");
                              }}
                            >
                              Featured
                            </Link>
                          </li> */}
                        <li>
                          <Link
                            className=""
                            onClick={() => {
                              setToggleSortBy(!toggleSortBy);
                              setSortBy("name-a-z");
                            }}
                          >
                            Name: (A-Z)
                          </Link>
                        </li>
                        <li>
                          <Link
                            className=""
                            onClick={() => {
                              setToggleSortBy(!toggleSortBy);
                              setSortBy("name-z-a");
                            }}
                          >
                            Name: (Z-A)
                          </Link>
                        </li>
                        <li>
                          <Link
                            className=""
                            onClick={() => {
                              setToggleSortBy(!toggleSortBy);
                              setSortBy("price-l-h");
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
                              setSortBy("price-h-l");
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
                              setSortBy("release-date");
                            }}
                          >
                            Release Date
                          </Link>
                        </li>

                        {/* <li>
                            <Link
                              className=""
                              onClick={() => {
                                setToggleSortBy(!toggleSortBy);
                                setSortBy("rating");
                              }}
                            >
                              Avg. Rating
                            </Link>
                          </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {isAllProductLoading ? (
                <div className="row">
                  {[...Array(8)].map((_, $) => {
                    return (
                      <div className="col-md-3" key={$}>
                        <ProductSkeletonLoader />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="row product-grid">
                    {/* Products */}
                    {products.map((product) => {
                      let totalRating = 0;
                      let avgRating = 0;
                      const allReviews = product?.reviews?.filter((review) =>
                        review.status ? true : false
                      );

                      if (allReviews.length) {
                        totalRating = product.reviews
                          .map((item) => {
                            return item.status == true ? item.rating : 0;
                          })
                          .reduce((prev, next) => prev + next);

                        avgRating = (totalRating / allReviews.length).toFixed(
                          1
                        );
                      }

                      // Check Item in available in the wishlist or not
                      let availableInWishlist = false;

                      let available = myWishlists.some((item) => {
                        return item.product._id == product._id;
                      });
                      if (available) availableInWishlist = true;

                      return (
                        <ProductCard
                          className="col-lg-1-4 col-md-3 col-6 col-sm-6"
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
                          {pagination.currentPage == 1 ? (
                            <li className="page-item">
                              <a
                                className="page-link"
                                href="#"
                                onClick={(evt) => {
                                  evt.preventDefault();
                                }}
                              >
                                <i className="fa fa-angle-left"></i>
                              </a>
                            </li>
                          ) : (
                            <li className="page-item">
                              <a
                                className="page-link"
                                href="#"
                                onClick={previousPageHandler}
                              >
                                <i className="fa fa-angle-left"></i>
                              </a>
                            </li>
                          )}

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

                          {pagination.totalPage <= pagination.currentPage ? (
                            <li className="page-item">
                              <a
                                className="page-link"
                                href="#"
                                onClick={(evt) => {
                                  evt.preventDefault();
                                }}
                              >
                                <i className="fa fa-angle-right"></i>
                              </a>
                            </li>
                          ) : (
                            <li className="page-item">
                              <a
                                className="page-link"
                                href="#"
                                onClick={nextPageHandler}
                              >
                                <i className="fa fa-angle-right"></i>
                              </a>
                            </li>
                          )}
                        </ul>
                      </nav>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-12 mt-5">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="text-center">
                            <img
                              src="/assets/imgs/no-product-found.png"
                              style={{ width: "200px" }}
                            ></img>
                            <h3 className="text-muted">No Product Available</h3>
                            <p className="text-muted mt-3">
                              There is no product's available in this category.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/*End Deals*/}
            </div>
          </div>
        </div>

        <SubscribeContainer />
      </main>
      <Footer />

      {/* Modal */}
    </>
  );
};

export default Search;
