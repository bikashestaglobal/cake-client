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
import MultiRangeSlider from "../components/multiRangeSlider/MultiRangeSlider";
import SubscribeContainer from "../components/SubscribeContainer";
import SEO from "../components/SEO";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "../layouts/Footer";

const Listing = () => {
  const scrollingRef = useRef();
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
  const [isAllProductLoading, setIsAllProductLoding] = useState(true);
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
  const [shapes, setShapes] = useState([]);
  const [occasions, setOccasions] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFlavours, setSelectedFlavours] = useState([]);
  const [selectedCakeTypes, setSelectedCakeTypes] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);

  const [clearFilter, setClearfilter] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalRecord: 0,
    totalPage: 0,
    page: 1,
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
  const [initialRange, setInitialRange] = useState({
    min: 0,
    max: 5000,
  });
  const [range, setRange] = useState({
    min: 0,
    max: 5000,
  });

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  // useEffect(() => {
  //   titleRef.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "end",
  //     inline: "nearest",
  //   });
  // }, [parCatSlug]);

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
    // setProducts(unsortedProducts);
  }, [sortBy]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Get Products
  useEffect(() => {
    // console.log("Getting Products");
    setIsAllProductLoding(true);
    fetch(
      `${Config.SERVER_URL}/product/by/category?parCatSlug=${parCatSlug}&catSlug=${catSlug}&limit=${pagination.limit}&page=${pagination.page}&minPrice=${minPrice}&maxPrice=${maxPrice}&flavour=${flavour}&color=${color}&shape=${shape}&occasion=${occasion}&cakeType=${cakeType}`,
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
        setIsAllProductLoding(false);
        if (data.status == 200) {
          // Pagination
          setPagination({
            ...pagination,
            totalRecords: data.totalRecords,
            page: data.page,
            totalPages: data.totalPages,
          });

          let unsortedProducts = [...data.body];
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
            unsortedProducts.sort((a, b) =>
              a.createdAt < b.createdAt ? 1 : -1
            );
          }
          // setProducts(shuffleArray(unsortedProducts));
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
  }, [
    parCatSlug,
    catSlug,
    clearFilter,
    pagination.page,
    pagination.limit,
    minPrice,
    maxPrice,
    shape,
    occasion,
    color,
    flavour,
    cakeType,
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
          if (!flavour && !cakeType && !shape && !occasion) {
            setBreadcrumbTitle(data?.body?.name);
          }
        } else {
          console.log(
            "Error Occured While loading Category : ProductParCategoryWise"
          );
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [parCatSlug, flavour, shape, occasion]);

  // Get category by slug
  // useEffect(() => {
  //   fetch(`${Config.SERVER_URL}/category/bySlug/${catSlug}`, {
  //     method: "GET", // or 'PUT'
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status == 200) {
  //         setCategory(data.body);
  //       } else {
  //         console.log(
  //           "Error Occured While loading Category : ProductParCategoryWise"
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Header Error:", error);
  //     });
  // }, [catSlug]);

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

  // Get shapes
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/shape/withProductsByCategory?parCatSlug=${parCatSlug}&catSlug=${catSlug}`,
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
          setShapes(data.body);
        } else {
          console.log(
            "Error Occured While loading shapes : at Listing",
            data.error
          );
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, [parCatSlug, catSlug]);

  // Get Occasions
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/occasions/withProductsByCategory?parCatSlug=${parCatSlug}&catSlug=${catSlug}`,
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
          setOccasions(data.body);
        } else {
          console.log(
            "Error Occured While loading Occasions : at Listing",
            data.error
          );
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

  // clearFilterHandler
  const clearFilterHandler = () => {
    if (selectedColors.length) setSelectedColors([]);
    if (selectedFlavours.length) setSelectedFlavours([]);
    if (selectedShapes.length) setSelectedShapes([]);
    if (selectedOccasions.length) setSelectedOccasions([]);
    if (selectedCakeTypes.length) setSelectedCakeTypes([]);
    setInitialRange({ min: 0, max: 5000 });
    setIsFiltering(false);
    setClearfilter(!clearFilter);
  };

  // filter handler
  const filterHandler = () => {
    // console.log("Filtering Products");
    if (
      selectedColors.length ||
      selectedFlavours.length ||
      selectedShapes.length ||
      selectedOccasions.length ||
      selectedCakeTypes.length ||
      range.min > 0 ||
      range.max < 5000
    ) {
      setIsAllProductLoding(true);
      fetch(`${Config.SERVER_URL}/product/filter`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
            // setProducts(data.body);

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
      setClearfilter(!clearFilter);
    } else {
      filterHandler();
    }
  }, [
    selectedColors,
    selectedFlavours,
    selectedShapes,
    selectedOccasions,
    selectedCakeTypes,
    range,
  ]);

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

  const pageHandler = (e, page) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page: page,
    });
    titleRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const previousPageHandler = (e) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page: pagination.page >= 2 ? pagination.page - 1 : 1,
    });
    titleRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page:
        parseInt(pagination.page) < pagination.totalPages
          ? parseInt(pagination.page) + 1
          : pagination.totalPages,
    });
    titleRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
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
    setIsFiltering(true);
  };

  const shapeChangeHandler = (evt) => {
    let filtered = [...selectedShapes];
    let exist = filtered.some((value) => value == evt.target.value);
    if (exist) {
      filtered = filtered.filter((value) => value != evt.target.value);
    } else {
      filtered.push(evt.target.value);
    }
    setSelectedShapes([...filtered]);
    setIsFiltering(true);
  };

  const occasionChangeHandler = (evt) => {
    let filtered = [...selectedOccasions];
    let exist = filtered.some((value) => value == evt.target.value);
    if (exist) {
      filtered = filtered.filter((value) => value != evt.target.value);
    } else {
      filtered.push(evt.target.value);
    }
    setSelectedOccasions([...filtered]);
    setIsFiltering(true);
  };

  const cakeTypeChangeHandler = (evt) => {
    let filtered = [...selectedCakeTypes];
    let exist = filtered.some((value) => value == evt.target.value);
    if (exist) {
      filtered = filtered.filter((value) => value != evt.target.value);
    } else {
      filtered.push(evt.target.value);
    }
    setSelectedCakeTypes([...filtered]);
    setIsFiltering(true);
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

  const [breadcrumbTitle, setBreadcrumbTitle] = useState("");
  const [breadcrumbTitleLoding, setBreadcrumbTitleLoding] = useState(true);

  // Get falvour details if available
  useEffect(() => {
    const getFlavour = async () => {
      try {
        const apiResponse = await fetch(
          `${Config.SERVER_URL}/flavour/${flavour}`
        );
        const apiData = await apiResponse.json();

        setBreadcrumbTitleLoding(false);
        if (apiData.status == 200) {
          setBreadcrumbTitle(apiData?.body?.name);
        }
      } catch (error) {
        setBreadcrumbTitleLoding(false);
      }
    };

    if (flavour) getFlavour();
  }, [flavour]);

  // Get Cake Type details if available
  useEffect(() => {
    const getData = async () => {
      try {
        const apiResponse = await fetch(
          `${Config.SERVER_URL}/type/${cakeType}`
        );
        const apiData = await apiResponse.json();

        setBreadcrumbTitleLoding(false);
        if (apiData.status == 200) {
          setBreadcrumbTitle(apiData?.body?.name);
        }
      } catch (error) {
        setBreadcrumbTitleLoding(false);
      }
    };

    if (cakeType) getData();
  }, [cakeType]);

  // Get Shape details if available
  useEffect(() => {
    const getData = async () => {
      try {
        const apiResponse = await fetch(`${Config.SERVER_URL}/shape/${shape}`);
        const apiData = await apiResponse.json();

        setBreadcrumbTitleLoding(false);
        if (apiData.status == 200) {
          setBreadcrumbTitle(apiData?.body?.name);
        }
      } catch (error) {
        setBreadcrumbTitleLoding(false);
      }
    };

    if (shape) getData();
  }, [shape]);

  // Get Occasion details if available
  useEffect(() => {
    const getData = async () => {
      try {
        const apiResponse = await fetch(
          `${Config.SERVER_URL}/occasions/${occasion}`
        );
        const apiData = await apiResponse.json();

        setBreadcrumbTitleLoding(false);
        if (apiData.status == 200) {
          setBreadcrumbTitle(apiData?.body?.name);
        }
      } catch (error) {
        setBreadcrumbTitleLoding(false);
      }
    };

    if (occasion) getData();
  }, [occasion]);

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
            <div className="col-lg-4-5">
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
                          <i class="fa fa-angle-down" aria-hidden="true"></i>
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
                                limit: pagination.totalRecords,
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

              {/* <InfiniteScroll
                dataLength={products.length} //This is important field to render the next data
                next={() => {
                  console.log("calling next");
                }}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
                // below props only if you need pull down functionality
                refreshFunction={() => {
                  console.log("refreshing");
                }}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                  <h3 style={{ textAlign: "center" }}>
                    &#8595; Pull down to refresh
                  </h3>
                }
                releaseToRefreshContent={
                  <h3 style={{ textAlign: "center" }}>
                    &#8593; Release to refresh
                  </h3>
                }
              >
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

                    avgRating = (totalRating / allReviews.length).toFixed(1);
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
                <div className="row product-grid"></div>
              </InfiniteScroll> */}

              {isAllProductLoading ? (
                <div className="row">
                  {[...Array(pagination.limit)].map((_, $) => {
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
                      {!isFiltering ? (
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-start">
                            {pagination.page == 1 ? (
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
                                  className="page-link active"
                                  href="#"
                                  onClick={previousPageHandler}
                                >
                                  <i className="fa fa-angle-left"></i>
                                </a>
                              </li>
                            )}

                            {[...Array(pagination.totalPages)].map((_, i) => {
                              return (
                                <li className="page-item">
                                  <a
                                    style={{
                                      backgroundColor:
                                        i + 1 == pagination.page
                                          ? "#81391d"
                                          : null,
                                    }}
                                    className="page-link"
                                    href="#"
                                    onClick={(e) => pageHandler(e, i + 1)}
                                  >
                                    {i + 1}
                                  </a>
                                </li>
                              );
                            })}

                            {pagination.totalPages <= pagination.page ? (
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
                      ) : null}
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
                {/* Cake Type */}
                {/* <div className="sidebar-widget widget-category-2 mb-30">
                  <h5 className="section-title style-1 mb-30">Cake Type</h5>
                  <div className="custome-checkbox">
                    {types.map((cakeType, index) => {
                      return (
                        <div className="">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={cakeTypeChangeHandler}
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
                              ({cakeType.products.length})
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div> */}
                <div
                  className="sidebar-widget price_range range mb-30"
                  style={{ background: "#fff" }}
                >
                  <h5 className="section-title style-1 mb-30">
                    <i>
                      Filter
                      {isFiltering ? (
                        <button
                          className="clear-filter"
                          onClick={clearFilterHandler}
                        >
                          <i className="fa fa-filter"></i>
                          <i className="close-btn">X</i>
                        </button>
                      ) : null}
                    </i>
                  </h5>
                  {/* <div className="price-filter">
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
                  </div> */}

                  <div className="list-group">
                    {/* Price */}

                    <div
                      className="list-group-item mb-10 mt-10 sidebar-price"
                      style={{ paddingBottom: "20px" }}
                    >
                      <label className="fw-900">Price</label>
                      <MultiRangeSlider
                        min={initialRange.min}
                        max={initialRange.max}
                        onChange={({ min, max }) => {
                          setRange({
                            ...range,
                            min: min,
                            max: max,
                          });

                          if (min != 0 || max != 5000) {
                            setIsFiltering(true);
                          }
                        }}
                      />
                    </div>

                    {/* Flavour */}
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
                      <label className="fw-600">Flavours</label>
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
                                checked={selectedFlavours.some(
                                  (f) => f == flavour._id
                                )}
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

                    {/* Cake Shape */}
                    <div className="list-group-item mb-10 mt-10">
                      <label className="fw-600">Shapes</label>
                      <div className="custome-checkbox">
                        {shapes.map((shape, index) => {
                          return (
                            <div className="">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={shapeChangeHandler}
                                name="checkbox"
                                id={`shape-${index}`}
                                value={shape._id}
                                checked={selectedShapes.some(
                                  (s) => s == shape._id
                                )}
                              />
                              <label
                                className="form-check-label"
                                for={`shape-${index}`}
                              >
                                <span>
                                  {shape.name} ({shape.products.length})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cake Occasion */}
                    <div className="list-group-item mb-10 mt-10">
                      <label className="fw-600">Occasions</label>
                      <div className="custome-checkbox">
                        {occasions.map((occasion, index) => {
                          return (
                            <div className="">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={occasionChangeHandler}
                                name="checkbox"
                                id={`occasion-${index}`}
                                value={occasion._id}
                                checked={selectedOccasions.some(
                                  (o) => o == occasion._id
                                )}
                              />
                              <label
                                className="form-check-label"
                                for={`occasion-${index}`}
                              >
                                <span>
                                  {occasion?.name} ({occasion?.products.length})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cake Types */}
                    <div className="list-group-item mb-10 mt-10">
                      <label className="fw-600">Cake Type</label>
                      <div className="custome-checkbox">
                        {types.map((cakeType, index) => {
                          return (
                            <div className="">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={cakeTypeChangeHandler}
                                name="checkbox"
                                id={`cakeType-${index}`}
                                value={cakeType._id}
                                checked={selectedCakeTypes.some(
                                  (t) => t == cakeType._id
                                )}
                              />
                              <label
                                className="form-check-label"
                                for={`cakeType-${index}`}
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
                  </div>
                  {/* <button
                    href="shop-grid-right.html"
                    className="btn btn-sm btn-default"
                    onClick={filterHandler}
                  >
                    <i className="fa fa-filter mr-5"></i> Filter
                  </button> */}
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
                {/* <div
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
                </div> */}
              </div>
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

export default Listing;
