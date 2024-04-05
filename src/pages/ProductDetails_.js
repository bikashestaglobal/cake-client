import React, { useRef, useEffect, useState, useContext } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { BiRupee } from "react-icons/bi";
import parse from "html-react-parser";
import date from "date-and-time";
import { toast } from "react-toastify";
import AddReview from "../components/AddReview";
import ReviewCard from "../components/ReviewCard";
import Rating from "react-rating";
import { storage } from "../firebase/FirebaseConfig";
import ReactImageZoom from "react-image-zoom";
import Slider from "react-slick";
import SubscribeContainer from "../components/SubscribeContainer";
import SEO from "../components/SEO";
import $ from "jquery";
import { validatePincode } from "../helpers/Validation";

const emptyObject = (obj) => {
  return Object.keys(obj).length ? false : true;
};

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
var sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  swipeToSlide: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
  ],
};

// Create the function
export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = false;
  document.body.appendChild(script);
}

const ProductDetails = () => {
  const history = useHistory();
  const titleRef = useRef();
  const [inputType, setInputType] = useState("text");

  // read the parameter
  const { state, dispatch } = useContext(CustomerContext);
  const { cart, token, shipping, adonCart = [] } = state;

  const [adonProductModel, setAdonProductModel] = useState(false);
  const [subtotal, setSubtotal] = useState("");
  const [adonTotal, setAdonTotal] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [totalAmountAfterAdon, setTotalAmountAfterAdon] = useState("");
  const [adonProducts, setAdonProducts] = useState([]);
  const { slug } = useParams();
  const [product, setProduct] = useState({
    images: [],
    shape: {},
    color: {},
    flavour: {},
    priceVariants: [],
    description: "",
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [price, setPrice] = useState({});
  const [pincodes, setPincodes] = useState([]);
  const [productLoaded, setProductLoaded] = useState(false);
  const [relProductLoaded, setRelProductLoaded] = useState(false);
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

  const [shippingMethods, setShippingMethods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgReviews, setAvgRating] = useState([]);
  const [imageOnCake, setImageOnCake] = useState("");
  const [messageOnCake, setMessageOnCake] = useState("");
  const [progress, setProgress] = useState(0);
  const [sliderDefaultImage, setSliderDefaultImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // useEffect(() => {
  //   titleRef.current.scrollIntoView({ behavior: "smooth" });
  //   window.scrollTo(0, 0);
  // }, [slug]);

  // Calculate amount
  useEffect(() => {
    // Calculate subtotal
    let sub_total = cart
      .map((product) => product.price * product.quantity)
      .reduce((prev, curr) => prev + curr, 0);

    let adon_total = adonCart
      .map((product) => product.price * product.quantity)
      .reduce((prev, curr) => prev + curr, 0);

    // Calculate Total
    let total = sub_total + parseInt(shipping.amount);

    // Total after adon
    let totalAmountAfterAdon =
      sub_total + parseInt(shipping.amount) + adon_total;
    setTotalAmount(total);

    setSubtotal(sub_total);
    setAdonTotal(adon_total);
    setTotalAmountAfterAdon(totalAmountAfterAdon);
  }, [cart, adonCart]);

  // Get all Adon Products
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/adon-product?skip=0&limit=4`, {
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
          console.log(
            "Error Occured While loading shippingMethods : AdonProducts"
          );
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get Product
  useEffect(() => {
    setProductLoaded(false);
    fetch(`${Config.SERVER_URL}/product/by-slug/${slug}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          if (data?.body?.flavour) {
            loadRelatedProducts(data?.body?.flavour?._id);
          }

          setProduct(data.body);

          setPrice(data.body.priceVariants[0]);

          setSliderDefaultImage(data.body.defaultImage);

          // Calculate Avarage reviews
          const rvws = data?.body?.reviews.filter(
            (review) => review.status == true
          );

          setReviews(rvws || []);

          if (rvws) {
            const totalRating = rvws
              .map((item) => item.rating)
              .reduce((prev, next) => prev + next);
            setAvgRating((totalRating / rvws.length).toFixed(1));
          }
        } else {
          console.log("Error Occured While loading product : ProductDetails");
        }
        setProductLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setProductLoaded(true);
      });
  }, [slug]);

  // Get related Product
  const loadRelatedProducts = (flavour) => {
    fetch(`${Config.SERVER_URL}/product/?flavour=${flavour}&skip=0&limit=4`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setRelProductLoaded(true);

        if (data.status == 200) {
          const productWithoutCurrent = data.body.filter((item) => {
            return product._id != item._id;
          });

          setRelatedProducts(data.body);
        } else {
          console.log("Error Occured While loading product : ProductDetails");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setRelProductLoaded(true);
      });
  };

  function loadReviews(product) {
    fetch(`${Config.SERVER_URL}/product/by-slug/${slug}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          // Calculate Avarage reviews
          const rvws = data?.body?.reviews.filter(
            (review) => review.status == true
          );

          setReviews(rvws || []);

          if (rvws) {
            const totalRating = rvws
              .map((item) => item.rating)
              .reduce((prev, next) => prev + next);
            setAvgRating((totalRating / rvws.length).toFixed(1));
          }
          // if (true) {
          //   setReviews(data.body.reviews || []);
          //   // Calculate Avarage reviews
          //   if (data.body.reviews) {
          //     const totalRating = data.body.reviews
          //       .map((item) => item.rating)
          //       .reduce((prev, next) => prev + next);
          //     setAvgRating((totalRating / data.body.reviews.length).toFixed(1));
          //   }
          // }
        } else {
          console.log("Error Occured While loading product : ProductDetails");
        }
        // setProductLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }

  // Get Pincodes
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/pincode?skip=0&limit=0`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setPincodes(data.body);
        } else {
          console.log("Error Occured While loading pincode : ProductDetails");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get Shipping methods
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/shipping-method`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setShippingMethods(data.body);
        } else {
          console.log(
            "Error Occured While loading shippingMethods : ProductDetails"
          );
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

  const reviewCallBack = (response) => {
    loadReviews(product._id);
  };

  const pincodeChangeHandler = (evt) => {
    // Validate Pincode
    // let value = evt.target.value.replace(/\D/g, "");
    let value = validatePincode(evt)?.target?.value;

    if (value.length < 6) {
      setEnteredPincode({
        date: "",
        method: "",
        startTime: "",
        endTime: "",
        amount: "",
        message: "Please enter 6-digits Pincode.",
        error: true,
        pincode: value,
      });
      dispatch({
        type: "SHIPPING_METHOD",
        payload: {
          date: "",
          method: "",
          startTime: "",
          endTime: "",
          amount: "",
          pincode: value,
        },
      });
      return;
    }

    if (value.length >= 6) {
      value = value.slice(0, 6);
      const found = pincodes.some((pin) => pin.pincode == value);
      if (found) {
        setEnteredPincode({
          date: "",
          method: "",
          startTime: "",
          endTime: "",
          amount: "",
          message: "This pincode is available for delivery",
          error: false,
          pincode: value,
        });
      } else {
        setEnteredPincode({
          date: "",
          method: "",
          startTime: "",
          endTime: "",
          amount: "",
          message: "Delivery is not available in this pincode",
          error: true,
          pincode: value,
        });
      }

      dispatch({
        type: "SHIPPING_METHOD",
        payload: {
          date: "",
          method: "",
          startTime: "",
          endTime: "",
          amount: "",
          pincode: value,
        },
      });
    }
  };

  const checkPinCode = (value) => {
    value = value.slice(0, 6);
    if (value.length >= 6) {
      const found = pincodes.some((pin) => pin.pincode == value);
      if (found) {
        setEnteredPincode({
          ...enteredPincode,
          message: "This pincode is available for delivery",
          error: false,
          pincode: value,
        });
      } else {
        setEnteredPincode({
          ...enteredPincode,
          message: "Delivery is not available in this pincode",
          error: true,
          pincode: value,
        });
      }
    } else if (value.length > 0) {
      setEnteredPincode({
        ...enteredPincode,
        message: "Delivery is not available in this pincode",
        error: true,
        pincode: value,
      });
    }
  };

  useEffect(() => {
    checkPinCode(state?.shipping?.pincode);
  }, [state?.shipping?.pincode, pincodes]);

  const addToCartHandler = async (fromWhere) => {
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

    if (product.isPhotoCake && !imageOnCake) {
      toast.warning("Must Upload Image for Cake");
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        name: product.name,
        slug: product.slug,
        parentCategories: product.parentCategories.map((item) => {
          return item._id;
        }),
        categories: product.categories.map((item) => {
          return item._id;
        }),
        productId: product._id,
        quantity: quantity,
        price: price.sellingPrice,
        mrp: price.mrp,
        weight: price.weight,
        // color: product.color.name,
        flavour: product.flavour.name,
        shape: product.shape.name,
        cakeType: product.type.name,
        image: product.defaultImage,
        images: product.images,
        breadType: product.breadType,
        messageOnCake: messageOnCake,
        imageOnCake: imageOnCake,
      },
    });

    // Update to database
    if (state.jwtToken) {
      const response = await fetch(`${Config.SERVER_URL}/cart-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.jwtToken}`,
        },
        body: JSON.stringify({ product: product._id }),
      });
      const result = await response.json();
      // console.log(result);
    } else {
      const response = await fetch(
        `${Config.SERVER_URL}/cart-products/createForGuest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product: product._id }),
        }
      );
      const result = await response.json();
      // console.log(result);
    }

    setAdonProductModel(true);

    if (fromWhere == "BUY_NOW") {
      history.push("/checkout");
    }
  };

  const decreaseQuantity = (evt) => {
    evt.preventDefault();
    if (quantity <= 1) {
      toast.warn("Quantity must be at least one");
      setQuantity(1);
    } else {
      setQuantity((old) => {
        return old - 1;
      });
    }
  };

  const increaseQuantity = (evt) => {
    evt.preventDefault();
    if (quantity >= 5) {
      toast.warn("Only 5 Cakes are allowd at a time");
      setQuantity(5);
    } else {
      setQuantity((old) => {
        return old + 1;
      });
    }
  };

  // Iamege Change
  const imageChangeHandler = (event) => {
    if (event.target.files && event.target.files.length) {
      if (!event.target.files[0].name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
        toast.error("Image Supported only jpg|jpeg|png");
        return false;
      }

      if (
        event.target.files[0].size < 500000 ||
        event.target.files[0].size > 2000000
      ) {
        toast.error("Image Size must Between 500kb-2mb");
        return false;
      }

      handleUpload(event.target.files[0]);
    }
  };

  // Upload Image
  const handleUpload = (image, i) => {
    const uploadTask = storage.ref(`cakes/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // console.log(i, progress);
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("cakes")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setImageOnCake(url);
          });
      }
    );
  };

  return (
    <>
      {/* Header Section */}
      <SEO
        title={product.metaTitle}
        description={product?.metaDescription}
        keyword={product?.metaKeywords}
      />

      {/* <Header /> */}
      {/* Header Section */}
      <main className="main" ref={titleRef}>
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/" rel="nofollow">
                <i className="fa fa-home mr-5"></i>Home
              </Link>
              <i className="fa fa-angle-right mr-5 ml-5"></i>
              <Link to={`/product/${slug}`}>{slug}</Link>
              {/* <span></span> {Object.keys(product).length && product.name} */}
            </div>
          </div>
        </div>

        <div className="container mb-30">
          <div className="row">
            <div className="col-xl-10 col-lg-12 m-auto">
              <div className="product-detail accordion-detail">
                {productLoaded ? (
                  <div className="row mb-50 mt-30">
                    <div className="col-md-6 col-sm-12 col-xs-12 mb-md-0 mb-sm-5">
                      {/* Slider */}
                      <div className="detail-gallery">
                        {/* <span className="zoom-icon">
                          <i className="fa fa-search"></i>
                        </span> */}
                        {/* MAIN SLIDES */}
                        <div className="product-image-slider">
                          <figure className="border-radius-10">
                            {sliderDefaultImage ? (
                              // (
                              //   <ReactImageZoom
                              //     {...{
                              //       img: sliderDefaultImage,
                              //       width: 600,
                              //       height: 600,
                              //       zoomWidth: 600,
                              //       zoomPosition: "original",
                              //     }}
                              //   />
                              // )
                              <img src={sliderDefaultImage} />
                            ) : (
                              ""
                            )}
                          </figure>
                        </div>
                        {/* THUMBNAILS */}
                        <div className="slider-thumbnails">
                          <Slider {...sliderSettings}>
                            {product.images.map((img, index) => {
                              return (
                                <div className="p-2">
                                  <img
                                    onClick={(evt) => {
                                      setSliderDefaultImage(img.url);
                                    }}
                                    key={index}
                                    src={img.url}
                                    alt="product image"
                                  />
                                </div>
                              );
                            })}
                            <div className="p-2">
                              <img
                                onClick={(evt) => {
                                  setSliderDefaultImage(product.defaultImage);
                                }}
                                src={product.defaultImage}
                                alt="product image"
                              />
                            </div>
                          </Slider>
                        </div>
                      </div>
                      {/* End Gallery */}
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12">
                      <div className="detail-info pr-30 pl-30">
                        {/* <span className="stock-status out-stock">
                          {product.bestseller == true
                            ? "Bestseller"
                            : product.featuredCake == true
                            ? "Featured"
                            : "Hot"}
                        </span> */}
                        <h4 className="title-detail">
                          {!emptyObject(product) && product.name}
                        </h4>
                        <div className="product-detail-rating">
                          <div className="text-end">
                            <Rating
                              emptySymbol="fa fa-star-o fa-1x"
                              fullSymbol="fa fa-star fa-1x text-danger"
                              readonly
                              initialRating={avgReviews}
                            />
                            <span className="font-small ml-5 text-muted">
                              ({reviews.length} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="clearfix product-price-cover">
                          <div className="product-price primary-color float-left">
                            <span className="current-price text-brand">
                              <i className="fa fa-inr"></i>
                              {price?.sellingPrice}
                            </span>
                            <span>
                              <span className="save-price font-md color3 ml-15">
                                {!emptyObject(price) &&
                                  100 -
                                    Math.ceil(
                                      (price?.sellingPrice / price.mrp) * 100
                                    )}
                                % OFF
                              </span>
                              <span className="old-price font-md ml-15">
                                <i className="fa fa-inr"></i>
                                {!emptyObject(price) && price.mrp}
                              </span>
                            </span>
                          </div>
                        </div>
                        {/* <div className="short-desc">
                          <p className="font-lg">{product.shortDescription}</p>
                        </div> */}

                        {/* Size/Weight */}
                        <div className="mt-2">
                          <h6 className="mb-3">
                            <strong className="mr-10">Size / Weight: </strong>
                          </h6>
                          <div className="attr-detail attr-size mb-15">
                            <div className="clearfix"></div>
                            <ul className="list-filter size-filter font-small">
                              {product.priceVariants.map((sku, index) => {
                                return (
                                  <li className="mr-5" key={`sku-${index + 1}`}>
                                    <img
                                      style={{ height: "auto", width: "60px" }}
                                      src={product.defaultImage}
                                    />
                                    <a
                                      style={{
                                        background:
                                          price.mrp == sku.mrp ? "#81391d" : "",
                                        color:
                                          price.mrp == sku.mrp ? "#fff" : "",
                                      }}
                                      onClick={(evt) => {
                                        evt.preventDefault();
                                        setPrice({ ...price, ...sku });
                                      }}
                                    >
                                      {sku.weight}
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>

                        {/* <div className="d-flex flex-row DtlRadio">
                          <div className="form-check">
                            <input
                              checked={product.isEgggCake ? true : false}
                              disabled={!product.isEgggCake ? true : false}
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                            />

                            <label
                              className="form-check-label"
                              for="flexRadioDefault1"
                            >
                              With Egg
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              checked={!product.isEgggCake ? true : false}
                              disabled={product.isEgggCake ? true : false}
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault2"
                            />
                            <label
                              className="form-check-label"
                              for="flexRadioDefault2"
                            >
                              Eggless
                            </label>
                          </div>
                        </div> */}

                        <div className="Pincode-dtl">
                          <div className="col-md-12">
                            <p
                              className={`${
                                enteredPincode.error
                                  ? "text-danger"
                                  : !enteredPincode.error &&
                                    enteredPincode.pincode
                                  ? "text-success"
                                  : ""
                              }`}
                            >
                              {enteredPincode.message}
                            </p>
                          </div>
                          <div className="row mt-15 mb-15">
                            <div className="col-md-6 location">
                              <div
                                className={`input-group mb-3 ${
                                  enteredPincode.pincode ? "" : ""
                                }`}
                              >
                                <div className="input-group-prepend">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    <i className="fa fa-map-marker"></i>
                                  </span>
                                </div>

                                <input
                                  type="text"
                                  onChange={pincodeChangeHandler}
                                  className={`form-control ${
                                    enteredPincode.error ? "red-border" : ""
                                  }`}
                                  value={enteredPincode.pincode}
                                  placeholder="Enter Pincode"
                                  aria-label="Username"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                            <div className="col-md-6 location">
                              <div
                                className={`input-group mb-3 ${
                                  enteredPincode.pincode &&
                                  !shippingDateTime.date &&
                                  !enteredPincode.error
                                    ? "heart"
                                    : ""
                                }`}
                              >
                                <div className="input-group-prepend">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    <i className="fa fa-calendar"></i>
                                  </span>
                                </div>

                                <input
                                  type={"date"}
                                  onClick={() => {
                                    setShippingDataTime({
                                      ...shippingDateTime,
                                      date: "",
                                      startTime: "",
                                      endTime: "",
                                    });

                                    dispatch({
                                      type: "SHIPPING_METHOD",
                                      payload: {
                                        ...shippingDateTime,
                                        date: "",
                                        startTime: "",
                                        endTime: "",
                                      },
                                    });
                                  }}
                                  onChange={(evt) => {
                                    setShippingDataTime({
                                      ...shippingDateTime,
                                      date: evt.target.value,
                                      startTime: "",
                                      endTime: "",
                                    });
                                  }}
                                  onBlur={(evt) => {
                                    if (evt.target.value) {
                                      const today = date.format(
                                        new Date(),
                                        "YYYY-MM-DD"
                                      );

                                      if (
                                        new Date(evt.target.value) <
                                        new Date(today)
                                      ) {
                                        toast.error("Delivery date is invalid");
                                      } else {
                                        setShippingMethodModel(true);
                                        dispatch({
                                          type: "SHIPPING_METHOD",
                                          payload: {
                                            ...shippingDateTime,
                                            date: evt.target.value,
                                            startTime: "",
                                            endTime: "",
                                          },
                                        });
                                      }
                                    }
                                  }}
                                  value={date.format(
                                    new Date(shippingDateTime.date),
                                    "YYYY-MM-DD"
                                  )}
                                  min={date.format(new Date(), "YYYY-MM-DD")}
                                  className="form-control"
                                  placeholder="Select Date"
                                  disabled={
                                    !enteredPincode.pincode ||
                                    enteredPincode.error
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                            </div>

                            <div className="col-md-12 mb-2 ">
                              {shippingDateTime.method &&
                              shippingDateTime.startTime ? (
                                <p className="text-success">
                                  {shippingDateTime.method} ,
                                  {`${date.transform(
                                    shippingDateTime.startTime,
                                    "HH:mm",
                                    "hh:mm A"
                                  )}-${date.transform(
                                    shippingDateTime.endTime,
                                    "HH:mm",
                                    "hh:mm A"
                                  )}`}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Form */}
                        {/* <div className="pb-2 mb-3 d-flex justify-content-between">
                          <input
                            type="text"
                            placeholder="Message on Cake"
                            className="form-control mr-1"
                            onChange={(evt) =>
                              setMessageOnCake(evt.target.value)
                            }
                            value={messageOnCake}
                          />
                          {product.isPhotoCake ? (
                            <div className="">
                              <div className="custom-file">
                                <input
                                  type="file"
                                  onChange={imageChangeHandler}
                                  className="custom-file-input"
                                  id="inputGroupFile04"
                                  accept="image/png, image/gif, image/jpeg"
                                  aria-describedby="inputGroupFileAddon04"
                                />
                                <label
                                  className="custom-file-label"
                                  htmlFor="inputGroupFile04"
                                >
                                  Image for Cake (Size 500kb - 2mb)
                                </label>
                                {progress ? (
                                  <div className="progress mt-2">
                                    <div
                                      className="progress-bar bg-success"
                                      style={{
                                        width: `${progress}%`,
                                        height: "15px",
                                      }}
                                      role="progressbar"
                                    >
                                      {progress}%
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {imageOnCake && (
                                  <img
                                    src={imageOnCake}
                                    style={{ height: "80px", width: "80px" }}
                                    alt="image on cake"
                                  ></img>
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div> */}

                        {/* Old Section */}
                        {/* <div className="font-xs d-flex p-2">
                          <ul className="mr-50">
                            <li className="mb-5">
                              Shape:{" "}
                              <span className="text-brand">
                                {product.shape.name}
                              </span>
                            </li>
                            <li className="mb-5">
                              Flavour:{" "}
                              <span className="text-brand">
                                {product.flavour.name}
                              </span>
                            </li>
                           
                          </ul>
                          <ul className="">
                            <li className="mb-5">
                              SKU: {}{" "}
                              <span className="text-brand">
                                {product.sku || "FWM15VKT"}
                              </span>
                            </li>

                            <li className="mb-5">
                              Egg Cake:{" "}
                              <span className="text-brand">
                                {product.isEgggCake ? "Yes" : "No"}
                              </span>
                            </li>
                          </ul>
                        </div> */}

                        {/* New Place */}
                        <div className="pb-2 mb-3 d-flex justify-content-between">
                          <input
                            type="text"
                            placeholder="Message on Cake"
                            className="form-control mr-1"
                            onChange={(evt) =>
                              setMessageOnCake(evt.target.value)
                            }
                            value={messageOnCake}
                          />
                          {product.isPhotoCake ? (
                            <div className="">
                              <div className="custom-file">
                                <input
                                  type="file"
                                  onChange={imageChangeHandler}
                                  className="custom-file-input"
                                  id="inputGroupFile04"
                                  accept="image/png, image/gif, image/jpeg"
                                  aria-describedby="inputGroupFileAddon04"
                                />
                                <label
                                  className="custom-file-label"
                                  htmlFor="inputGroupFile04"
                                >
                                  Image for Cake (Size 500kb - 2mb)
                                </label>
                                {progress ? (
                                  <div className="progress mt-2">
                                    <div
                                      className="progress-bar bg-success"
                                      style={{
                                        width: `${progress}%`,
                                        height: "15px",
                                      }}
                                      role="progressbar"
                                    >
                                      {progress}%
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {imageOnCake && (
                                  <img
                                    src={imageOnCake}
                                    style={{ height: "80px", width: "80px" }}
                                    alt="image on cake"
                                  ></img>
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="detail-extralink mb-3">
                          <div className="detail-qty border radius">
                            <a
                              href="#"
                              onClick={decreaseQuantity}
                              className="qty-down"
                            >
                              <i
                                className="fa fa-angle-down"
                                aria-hidden="true"
                              ></i>
                            </a>
                            <span className="qty-val">{quantity}</span>
                            <a
                              href="#"
                              className="qty-up"
                              onClick={increaseQuantity}
                            >
                              <i
                                className="fa fa-angle-up"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </div>

                          <div className="product-extra-link2">
                            {/* Add to cart */}
                            {cart.some(
                              (value) => value.productId == product._id
                            ) ? (
                              <button
                                type="submit"
                                className="button button-add-to-cart"
                                // style={{ background: "rgb(255, 45, 85)" }}
                                onClick={() => {
                                  history.push("/myCart");
                                }}
                              >
                                <i className="fa fa-shopping-cart"></i>
                                Go To Cart
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="button button-add-to-cart"
                                onClick={addToCartHandler}
                              >
                                <i className="fa fa-shopping-cart"></i>
                                Add to cart
                              </button>
                            )}

                            {cart.some(
                              (value) => value.productId == product._id
                            ) ? (
                              <button
                                type="submit"
                                className="button button-add-to-cart"
                                // style={{ background: "rgb(255, 45, 85)" }}
                                onClick={() => {
                                  history.push(
                                    `/${product.parentCategories[0].slug}`
                                  );
                                }}
                              >
                                <i className="fa fa-shopping-cart"></i>
                                Continue
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="button button-add-to-cart"
                                onClick={() => addToCartHandler("BUY_NOW")}
                              >
                                <i className="fa fa-shopping-cart"></i>
                                Buy Now
                              </button>
                            )}
                          </div>
                        </div>

                        {/* New Section */}
                        <div className="row">
                          <div className="DeliverIcon col-md-3 col-6">
                            <div className="">
                              {/* <div className="mr-3 Tickicon">
                                <img src="/assets/imgs/check-mark.png" />
                              </div> */}
                              <div className="time">
                                <div className="DlIcon">
                                  <img
                                    src="/assets/imgs/boiled-egg.png"
                                    alt=""
                                  />
                                </div>
                                <span className="font-weight-bold">
                                  100% Eggless
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="DeliverIcon col-md-3 col-6">
                            <div className="">
                              {/* <div className="mr-3 Tickicon">
                                <img src="/assets/imgs/check-mark.png" />
                              </div> */}
                              <div className="time">
                                <div className="DlIcon">
                                  <img src="/assets/imgs/pancake.png" alt="" />
                                </div>
                                <span className="font-weight-bold">
                                  100% Fresh Cream
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="DeliverIcon col-md-3 col-6">
                            <div className="">
                              {/* <div className="mr-3 Tickicon">
                                <img src="/assets/imgs/check-mark.png" />
                              </div> */}
                              <div className="time">
                                <div className="DlIcon">
                                  <img
                                    src="/assets/imgs/fast-delivery.png"
                                    alt=""
                                  />
                                </div>
                                <span className="font-weight-bold">
                                  Express Delivery
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="DeliverIcon col-md-3 col-6">
                            <div className="">
                              {/* <div className="mr-3 Tickicon">
                                <img src="/assets/imgs/check-mark.png" />
                              </div> */}
                              <div className="time">
                                <div className="DlIcon">
                                  <img
                                    src="/assets/imgs/assortment.png"
                                    alt=""
                                  />
                                </div>
                                <span className="font-weight-bold">
                                  25K+ Smiles Delivered
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* New Place */}
                        <div className="short-desc">
                          <p className="font-lg">{product.shortDescription}</p>
                        </div>
                      </div>
                      {/* Detail Info */}
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {/* Descriptions & Reviews */}

                <div className="product-info d-block d-lg-block d-sm-none">
                  <div className="tab-style3">
                    <ul className="nav nav-tabs text-uppercase">
                      <li className="nav-item active">
                        <a
                          className="nav-link active"
                          id="Description-tab"
                          data-bs-toggle="tab"
                          href="#Description"
                        >
                          Description
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link "
                          id="product-details-tab"
                          data-bs-toggle="tab"
                          href="#product-details"
                        >
                          Product Details
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link "
                          id="delivery-details-tab"
                          data-bs-toggle="tab"
                          href="#delivery-details"
                        >
                          Delivery Details
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link "
                          id="care-instructions-tab"
                          data-bs-toggle="tab"
                          href="#care-instructions"
                        >
                          Care Instructions
                        </a>
                      </li>{" "}
                      <li className="nav-item">
                        <a
                          className="nav-link "
                          id="extra-note-tab"
                          data-bs-toggle="tab"
                          href="#extra-notes"
                        >
                          Extra Note
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="Reviews-tab"
                          data-bs-toggle="tab"
                          href="#Reviews"
                        >
                          Reviews
                          {/* ({reviews.length}) */}
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content shop_info_tab entry-main-content">
                      <div
                        className="tab-pane fade show active"
                        id="Description"
                      >
                        <div className="">
                          {parse(product.description) || "<snap></snap>"}
                        </div>
                      </div>
                      <div className="tab-pane fade show" id="product-details">
                        <div className="">
                          {parse(product?.productDetails || "<snap></snap>")}
                        </div>
                      </div>

                      <div className="tab-pane fade show" id="delivery-details">
                        <div className="">
                          {parse(product?.deliveryDetails || "<snap></snap>")}
                        </div>
                      </div>

                      <div
                        className="tab-pane fade show"
                        id="care-instructions"
                      >
                        <div className="">
                          {parse(product?.careInstructions || "<snap></snap>")}
                        </div>
                      </div>

                      <div className="tab-pane fade show" id="extra-notes">
                        <div className="">
                          {parse(product?.extraNotes || "<snap></snap>")}
                        </div>
                      </div>

                      <div className="tab-pane fade" id="Reviews">
                        {/*Comments*/}
                        {/* {reviews.length ? (
                          <ReviewCard reviews={reviews} />
                        ) : (
                          <div className="alert alert-danger">
                            No reviews ret
                          </div>
                        )} */}

                        {/* Add Review */}
                        {!emptyObject(product) && (
                          <AddReview
                            product={product._id}
                            callBack={reviewCallBack}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description For Mobile */}
                <div class="accordion d-block d-lg-none" id="accordionExample">
                  {/* Description */}
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingZero">
                      <button
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseZero"
                        aria-expanded="true"
                        aria-controls="collapseZero"
                      >
                        Description
                      </button>
                    </h2>
                    <div
                      id="collapseZero"
                      class="accordion-collapse collapse show"
                      aria-labelledby="headingZero"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <ul className="ProdtlList">
                          {/* <li>
                            <i class="fa fa-angle-right mr-10"></i> Cake Flavor:
                            Pineapple
                          </li> */}
                          {parse(
                            product?.description ||
                              "<span className='badge text-danger'>Not Available</span>"
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                      <button
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Product Details
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <ul className="ProdtlList">
                          {/* <li>
                            <i class="fa fa-angle-right mr-10"></i> Cake Flavor:
                            Pineapple
                          </li> */}
                          {parse(
                            product?.productDetails ||
                              "<span className='badge text-danger'>Not Available</span>"
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingTwo">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Delivery Details
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <ul className="ProdtlList">
                          {/* <li>
                            <i class="fa fa-angle-right mr-10"></i>Every cake we
                            offer is handcrafted and since each chef has his/her
                            own way of baking and designing a cake, there might
                            be slight variation in the product in terms of
                            design and shape.
                          </li> */}
                          {parse(
                            product?.deliveryDetails ||
                              "<span className='badge text-danger'>Not Available</span>"
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Care Instructions */}
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingThree">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Care Instructions
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <ul className="ProdtlList">
                          {/* <li>
                            <i class="fa fa-angle-right mr-10"></i>Consume the
                            cake within 24 hours.
                          </li> */}

                          {parse(
                            product?.careInstructions ||
                              "<span className='badge text-danger'>Not Available</span>"
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Extra Note */}
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingFour">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                      >
                        Extra Note
                      </button>
                    </h2>
                    <div
                      id="collapseFour"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <ul className="ProdtlList">
                          {/* <li>
                            <i class="fa fa-angle-right mr-10"></i>Consume the
                            cake within 24 hours.
                          </li> */}

                          {parse(
                            product?.extraNotes ||
                              "<span className='badge text-danger'>Not Available</span>"
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingFive">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFive"
                        aria-expanded="false"
                        aria-controls="collapseFive"
                      >
                        Reviews
                      </button>
                    </h2>
                    <div
                      id="collapseFive"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingFive"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <div className="comment-form">
                          {/* Add Review */}
                          {!emptyObject(product) && (
                            <AddReview
                              product={product._id}
                              callBack={reviewCallBack}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Products */}
                <div className="row mt-60">
                  <div className="col-12">
                    <h2 className="section-title style-1 mb-30">
                      Related products
                    </h2>
                  </div>
                  <div className="col-12">
                    <div className="row related-products">
                      {relProductLoaded ? (
                        relatedProducts.map((rProduct) => {
                          // Review calculate
                          let totalRating = 0;
                          let avgRating = 0;
                          if (rProduct.reviews.length) {
                            totalRating = rProduct.reviews
                              .map((item) => {
                                return item.status == true ? item.rating : 0;
                              })
                              .reduce((prev, next) => prev + next);

                            avgRating = (
                              totalRating / rProduct.reviews.length
                            ).toFixed(1);
                          }
                          return (
                            <div className="col-lg-3 col-md-4 col-6 col-sm-6">
                              <div className="product-cart-wrap hover-up">
                                <div className="product-img-action-wrap">
                                  <div className="product-img product-img-zoom">
                                    <Link
                                      to={`/product/${rProduct.slug}`}
                                      tabIndex="0"
                                    >
                                      <img
                                        className="default-img"
                                        src={rProduct.defaultImage}
                                        alt={"image"}
                                      />
                                      <img
                                        className="hover-img"
                                        src={
                                          rProduct?.images[0]?.url ||
                                          "/assets/imgs/shop/product-2-2.jpg"
                                        }
                                        alt={"image"}
                                      />
                                    </Link>
                                  </div>
                                  {/* <div className="product-action-1">
                                      <a
                                        aria-label="Quick view"
                                        className="action-btn small hover-up"
                                        data-bs-toggle="modal"
                                        href={"#"}
                                        data-bs-target="#quickViewModal"
                                      >
                                        <i className="fa fa-search"></i>
                                      </a>
                                      <a
                                        aria-label="Add To Wishlist"
                                        className="action-btn small hover-up"
                                        href="shop-wishlist.html"
                                        tabIndex="0"
                                      >
                                        <i className="fa fa-heart"></i>
                                      </a>
                                      <a
                                        aria-label="Compare"
                                        className="action-btn small hover-up"
                                        href="shop-compare.html"
                                        tabIndex="0"
                                      >
                                        <i className="fa fa-shuffle"></i>
                                      </a>
                                    </div> */}
                                  <div className="product-badges product-badges-position product-badges-mrg">
                                    <span className="hot">
                                      {100 -
                                        Math.ceil(
                                          (rProduct.priceVariants[0]
                                            .sellingPrice /
                                            rProduct.priceVariants[0].mrp) *
                                            100
                                        )}
                                      % OFF
                                    </span>
                                  </div>
                                </div>
                                <div className="product-content-wrap">
                                  <h2>
                                    <Link
                                      to={`/product/${rProduct.slug}`}
                                      tabIndex="0"
                                    >
                                      {rProduct.name.length > 25
                                        ? rProduct.name.slice(0, 25) + ".."
                                        : rProduct.name}
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
                                  <div className="product-price">
                                    <span>
                                      <i
                                        className="fa fa-inr"
                                        style={{ fontSize: "16px" }}
                                      ></i>
                                      {rProduct?.priceVariants[0]?.sellingPrice}
                                    </span>
                                    <span className="old-price">
                                      <i
                                        className="fa fa-inr"
                                        style={{ fontSize: "12px" }}
                                      ></i>
                                      {rProduct?.priceVariants[0]?.mrp}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="d-flex justify-content-center py-5">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SubscribeContainer />

        {/* Delivery Method modal */}
        <div
          id="myModal"
          className="custom-modal2"
          style={{
            display: shippingMethodModel ? "block" : "none",
          }}
        >
          <div className="custom-modal2-content">
            <span
              className="custom-modal2-close"
              onClick={() => {
                setShippingMethodModel(false);
              }}
            >
              &times;
            </span>

            <h5>Select Your Shipping Time</h5>

            <div
              className="accordion accordion-flush mt-3"
              id="accordionFlushExample"
            >
              {shippingMethods.map((method, index) => {
                return (
                  <div className="accordion-item">
                    <h2 className="accordion-header " id="flush-headingOne">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        onClick={(evt) => {
                          setShippingDataTime({
                            ...shippingDateTime,
                            method: method.name,
                            amount: method.amount,
                          });
                        }}
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapseOne${index}`}
                        aria-expanded="false"
                        aria-controls={`flush-collapseOne${index}`}
                      >
                        <div className="d-flex" style={{ gap: "30px" }}>
                          <p>{method.name}</p>
                          <p className="ml-4">
                            <BiRupee style={{ marginTop: "-4px" }} />
                            {method.amount}
                          </p>
                        </div>
                      </button>
                    </h2>
                    <div
                      id={`flush-collapseOne${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div key={`time-${index}`} className="accordion-body">
                        {method.shippingTimes.map((time, index) => {
                          const today = date.format(new Date(), "DD-MM-YYYY");
                          const currentTime = date.format(
                            date.addHours(new Date(), 4),
                            "HH:mm A"
                          );
                          const selectedDate = date.format(
                            new Date(shippingDateTime.date),
                            "DD-MM-YYYY"
                          );

                          const endTime = date.transform(
                            time.endTime,
                            "HH:mm",
                            "HH:mm A"
                          );

                          // New Code
                          let cTime = new Date();
                          cTime.setHours(cTime.getHours() + 4);

                          let eTime = new Date(
                            `${shippingDateTime.date} ${time.endTime}`
                          );

                          return (
                            <div className="py-1 px-2 border mb-2">
                              <div
                                className="form-check m-0"
                                key={`time-${index}`}
                              >
                                <input
                                  onChange={(evt) => {
                                    setShippingDataTime({
                                      ...shippingDateTime,
                                      startTime: time.startTime,
                                      endTime: time.endTime,
                                    });
                                  }}
                                  className="form-check-input ml-3"
                                  type="radio"
                                  name="flexRadioDefault"
                                  checked={
                                    shippingDateTime.startTime == time.startTime
                                  }
                                  id={`flexRadioDefault${index}`}
                                  disabled={
                                    today == selectedDate && cTime > eTime
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  for={`flexRadioDefault${index}`}
                                >
                                  {date.transform(
                                    time.startTime,
                                    "HH:mm",
                                    "hh:mm A"
                                  )}
                                  -
                                  {date.transform(
                                    time.endTime,
                                    "HH:mm",
                                    "hh:mm A"
                                  )}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="">
                <button
                  className="btn"
                  disabled={!shippingDateTime.startTime}
                  onClick={() => {
                    dispatch({
                      type: "SHIPPING_METHOD",
                      payload: {
                        ...shippingDateTime,
                        pincode: enteredPincode.pincode,
                      },
                    });
                    setShippingMethodModel(false);
                  }}
                >
                  Coninue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Adon Product modal */}
        <div
          id="myModal"
          className="custom-modal2"
          style={{
            display: adonProductModel ? "block" : "none",
          }}
        >
          <div className="custom-modal2-content">
            <span
              className="custom-modal2-close"
              onClick={() => {
                setAdonProductModel(false);
                history.push("/myCart");
              }}
            >
              &times;
            </span>

            <h5 className="mb-3">Select Addon Products</h5>

            {/* Products List */}
            <div className="row">
              {adonProducts.map((product, index) => {
                return (
                  <div className="col-md-3 col-6 pb-2" key={`adon-${index}`}>
                    <div className="card bg-white shadow-sm py-2">
                      <img
                        src={product.image}
                        className="card-img-top adon-image"
                        alt="adon product"
                      />
                      <div className="card-body text-center">
                        <p className="card-title">
                          {product.name.length > 22
                            ? product.name.slice(0, 22) + ".."
                            : product.name}
                        </p>
                        <h6 className="text-danger">
                          {" "}
                          <i className="fa fa-inr"></i> {product.sellingPrice}{" "}
                        </h6>

                        <div className="add-cart">
                          {adonCart.some(
                            (value) => value.productId == product._id
                          ) ? (
                            <>
                              <div>
                                <Link
                                  className="add"
                                  href="shop-cart.html"
                                  onClick={() => {
                                    dispatch({
                                      type: "REMOVE_ADON_FROM_CART",
                                      payload: {
                                        productId: product._id,
                                      },
                                    });
                                  }}
                                >
                                  <i className="fa fa-trash mr-5"></i>
                                  Remove
                                </Link>
                              </div>

                              <div
                                className="d-flex justify-content-between"
                                style={{
                                  width: "100%",
                                  margin: "auto",
                                  background: "#e4e4e4",
                                  marginTop: "13px",
                                }}
                              >
                                <button
                                  className="btn btn-info rounded py-1 px-2"
                                  onClick={() => {
                                    dispatch({
                                      type: "DECREASE_ADON_QUANTITY",
                                      payload: {
                                        productId: product._id,
                                      },
                                    });
                                  }}
                                >
                                  -
                                </button>

                                <button
                                  className="border-0"
                                  style={{ background: "none" }}
                                >
                                  {
                                    adonCart.filter(
                                      (value) => value.productId == product._id
                                    )[0].quantity
                                  }
                                </button>

                                <button
                                  className="btn btn-info rounded py-1 px-2"
                                  onClick={() => {
                                    dispatch({
                                      type: "INCREASE_ADON_QUANTITY",
                                      payload: {
                                        productId: product._id,
                                      },
                                    });
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </>
                          ) : (
                            <Link
                              className="add mt-2 btn"
                              href="shop-cart.html"
                              onClick={() => {
                                dispatch({
                                  type: "ADD_ADON_TO_CART",
                                  payload: {
                                    name: product.name,
                                    slug: product.slug,
                                    productId: product._id,
                                    quantity: 1,
                                    price: product.sellingPrice,
                                    image: product.image,
                                  },
                                });
                              }}
                            >
                              <i className="fa fa-shopping-cart mr-5"></i>
                              Add
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {adonCart.length ? (
                <div className="col-md-12">
                  {/* shipping amount */}
                  <div className="table-responsive">
                    <table className="">
                      <tr>
                        <th>DETAILS</th>
                        <th> {cart.length || 0} Base Item</th>
                        <th> {adonCart.length || 0} Add-ons</th>
                        <th> {adonCart.length || 0} Shipping</th>
                        <th> {adonCart.length || 0} TOTAL</th>
                      </tr>
                      <tr>
                        <td>PRICE</td>
                        <td>
                          <i className="fa fa-inr"></i> {subtotal}
                        </td>
                        <td>
                          <i className="fa fa-inr"></i>
                          {adonTotal}
                        </td>
                        <td>
                          <i className="fa fa-inr"></i>
                          {shipping.amount}
                        </td>
                        <td>
                          <i className="fa fa-inr"></i>
                          {totalAmountAfterAdon}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="">
                <div className="">
                  <Link
                    className="add mt-2 btn"
                    to={"/myCart"}
                    onClick={() => {
                      // dispatch({
                      //   type: "SHIPPING_METHOD",
                      //   payload: {
                      //     ...shippingDateTime,
                      //     pincode: enteredPincode.pincode,
                      //   },
                      // });
                      setAdonProductModel(false);
                    }}
                  >
                    {adonCart.length ? "Continue" : "Skip"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
