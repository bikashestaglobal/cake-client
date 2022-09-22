import React, { useRef, useEffect, useState, useContext } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { BiRupee } from "react-icons/bi";
import parse from "html-react-parser";
import date from "date-and-time";
import { toast } from "react-toastify";
import AddReview from "./AddReview";
import ReviewCard from "./ReviewCard";
import Rating from "react-rating";
import { storage } from "../firebase/FirebaseConfig";
import ReactImageZoom from "react-image-zoom";
import Slider from "react-slick";

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
  // read the parameter
  const { state, dispatch } = useContext(CustomerContext);
  const { cart } = state;

  const { slug } = useParams();
  const [product, setProduct] = useState({
    images: [],
    shape: {},
    color: {},
    flavour: {},
    skus: [],
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

  useEffect(() => {
    titleRef.current.scrollIntoView({ behavior: "smooth" });
  }, [slug]);

  // Get Product
  useEffect(() => {
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
          if (data.body.categories.length) {
            loadRelatedProducts(data.body.categories[0]._id);
          }

          setProduct(data.body);
          setPrice(data.body.skus[0]);
          setReviews(data.body.reviews || []);
          setSliderDefaultImage(data.body.defaultImage);

          // Calculate Avarage reviews
          if (data.body.reviews) {
            const totalRating = data.body.reviews
              .map((item) => item.rating)
              .reduce((prev, next) => prev + next);
            setAvgRating((totalRating / data.body.reviews.length).toFixed(1));
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
  const loadRelatedProducts = (category) => {
    fetch(
      `${Config.SERVER_URL}/product/by/category/?categoryId=${category}&skip=0&limit=4`,
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
          if (true) {
            setReviews(data.body.reviews || []);
            // Calculate Avarage reviews
            if (data.body.reviews) {
              const totalRating = data.body.reviews
                .map((item) => item.rating)
                .reduce((prev, next) => prev + next);
              setAvgRating((totalRating / data.body.reviews.length).toFixed(1));
            }
          }
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
    fetch(`${Config.SERVER_URL}/pincode`, {
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
    const found = pincodes.some((pin) => pin.pincode == evt.target.value);
    dispatch({
      type: "SHIPPING_METHOD",
      payload: {
        ...shippingDateTime,
        pincode: evt.target.value,
      },
    });

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

  const addToCartHandler = (fromWhere) => {
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
        color: product.color.name,
        flavour: product.flavour.name,
        image: product.images[0].url,
        messageOnCake: messageOnCake,
        imageOnCake: imageOnCake,
      },
    });

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
                        <span className="zoom-icon">
                          <i className="fa fa-search"></i>
                        </span>
                        {/* MAIN SLIDES */}
                        <div className="product-image-slider">
                          <figure className="border-radius-10">
                            {sliderDefaultImage ? (
                              <ReactImageZoom
                                {...{
                                  img: sliderDefaultImage,
                                  width: 600,
                                  height: 600,
                                  zoomWidth: 600,
                                  zoomPosition: "original",
                                }}
                              />
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
                        <span className="stock-status out-stock">
                          {!emptyObject(price) &&
                            100 -
                              Math.ceil((price.sellingPrice / price.mrp) * 100)}
                          % OFF
                        </span>
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
                              {price.sellingPrice}
                            </span>
                            <span>
                              <span className="save-price font-md color3 ml-15">
                                {!emptyObject(price) &&
                                  100 -
                                    Math.ceil(
                                      (price.sellingPrice / price.mrp) * 100
                                    )}
                                % OFF
                              </span>
                              <span className="old-price font-md ml-15">
                                <BiRupee />
                                {!emptyObject(price) && price.mrp}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Size/Weight */}
                        <div className="mt-2">
                          <h6 class="mb-3">
                            <strong class="mr-10">Size / Weight: </strong>
                          </h6>
                          <div class="attr-detail attr-size mb-30">
                            <div class="clearfix"></div>
                            <ul class="list-filter size-filter font-small">
                              {product.skus.map((sku, index) => {
                                return (
                                  <li className="mr-5" key={`sku-${index + 1}`}>
                                    <img
                                      style={{ height: "75px", width: "75px" }}
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

                        <div class="d-flex flex-row DtlRadio">
                          <div class="form-check">
                            <input
                              checked={product.isEgggCake ? true : false}
                              disabled={!product.isEgggCake ? true : false}
                              class="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                            />
                            <label
                              class="form-check-label"
                              for="flexRadioDefault1"
                            >
                              With Egg
                            </label>
                          </div>
                          <div class="form-check">
                            <input
                              checked={!product.isEgggCake ? true : false}
                              disabled={product.isEgggCake ? true : false}
                              class="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault2"
                            />
                            <label
                              class="form-check-label"
                              for="flexRadioDefault2"
                            >
                              Eggless
                            </label>
                          </div>
                        </div>

                        <div className="Pincode-dtl">
                          <div className="col-md-12">
                            <p
                              className={`${
                                enteredPincode.error
                                  ? "text-danger"
                                  : "text-success"
                              } fw-bold`}
                            >
                              {enteredPincode.message}
                            </p>
                          </div>
                          <div className="row mt-15 mb-15">
                            <div className="col-md-6 location">
                              <div
                                className={`input-group mb-3 ${
                                  enteredPincode.pincode ? "" : "heart"
                                }`}
                              >
                                <div className="input-group-prepend">
                                  <span
                                    class="input-group-text"
                                    id="basic-addon1"
                                  >
                                    <i class="fa fa-map-marker"></i>
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
                                  type="date"
                                  onChange={(evt) => {
                                    if (evt.target.value) {
                                      setShippingMethodModel(true);
                                    }
                                    setShippingDataTime({
                                      ...shippingDateTime,
                                      date: evt.target.value,
                                    });

                                    dispatch({
                                      type: "SHIPPING_METHOD",
                                      payload: {
                                        ...shippingDateTime,
                                        date: evt.target.value,
                                      },
                                    });
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

                            <div className="col-md-12 mb-2">
                              {shippingDateTime.method ? (
                                <span>
                                  {shippingDateTime.method} ,
                                  {`${date.transform(
                                    shippingDateTime.startTime,
                                    "HH:mm",
                                    "hh:mm"
                                  )}-${date.transform(
                                    shippingDateTime.endTime,
                                    "HH:mm",
                                    "hh:mm A"
                                  )}`}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Form */}
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
                                  aria-describedby="inputGroupFileAddon04"
                                />
                                <label
                                  className="custom-file-label"
                                  htmlFor="inputGroupFile04"
                                >
                                  Image for Cake
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

                        <div className="detail-extralink mb-50">
                          <div class="detail-qty border radius">
                            <a
                              href="#"
                              onClick={decreaseQuantity}
                              class="qty-down"
                            >
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                              ></i>
                            </a>
                            <span class="qty-val">{quantity}</span>
                            <a
                              href="#"
                              class="qty-up"
                              onClick={increaseQuantity}
                            >
                              <i class="fa fa-angle-up" aria-hidden="true"></i>
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
                                Added to Cart
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
                                  history.push("/myCart");
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

                        <div className="font-xs d-flex p-2">
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
                            <li className="mb-5">
                              Color:{" "}
                              <span className="text-brand">
                                {product.color.name}
                              </span>
                            </li>
                          </ul>
                          <ul className="">
                            <li className="mb-5">
                              SKU: {}{" "}
                              <a href="#">{product.sku || "FWM15VKT"}</a>
                            </li>

                            <li className="mb-5">
                              Egg Cake:{" "}
                              <span className="text-brand">
                                {product.isEgggCake ? "Yes" : "No"}
                              </span>
                            </li>
                          </ul>
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
                <div className="product-info">
                  <div className="tab-style3">
                    <ul className="nav nav-tabs text-uppercase">
                      <li className="nav-item">
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
                          className="nav-link"
                          id="Reviews-tab"
                          data-bs-toggle="tab"
                          href="#Reviews"
                        >
                          Reviews ({reviews.length})
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content shop_info_tab entry-main-content">
                      <div
                        className="tab-pane fade show active"
                        id="Description"
                      >
                        <div className="">{parse(product.description)}</div>
                      </div>

                      <div className="tab-pane fade" id="Reviews">
                        {/*Comments*/}
                        {reviews.length ? (
                          <ReviewCard reviews={reviews} />
                        ) : (
                          <div className="alert alert-danger">
                            No reviews ret
                          </div>
                        )}

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
                              .map((item) => item.rating)
                              .reduce((prev, next) => prev + next);

                            avgRating = (
                              totalRating / rProduct.reviews.length
                            ).toFixed(1);
                          }
                          return (
                            <div className="col-lg-3 col-md-4 col-12 col-sm-6">
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
                                          rProduct.images[0].url ||
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
                                        <i className="fi-rs-heart"></i>
                                      </a>
                                      <a
                                        aria-label="Compare"
                                        className="action-btn small hover-up"
                                        href="shop-compare.html"
                                        tabIndex="0"
                                      >
                                        <i className="fi-rs-shuffle"></i>
                                      </a>
                                    </div> */}
                                  <div className="product-badges product-badges-position product-badges-mrg">
                                    <span className="hot">
                                      {100 -
                                        Math.ceil(
                                          (rProduct.skus[0].sellingPrice /
                                            rProduct.skus[0].mrp) *
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
                                      <i className="fa fa-inr"></i>
                                      {rProduct.skus[0].sellingPrice}
                                    </span>
                                    <span className="old-price">
                                      <i className="fa fa-inr"></i>
                                      {rProduct.skus[0].mrp}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                          // return product._id != rProduct._id ? (
                          //   <div className="col-lg-3 col-md-4 col-12 col-sm-6">
                          //     <div className="product-cart-wrap hover-up">
                          //       <div className="product-img-action-wrap">
                          //         <div className="product-img product-img-zoom">
                          //           <Link
                          //             to={`/product/${rProduct.slug}`}
                          //             tabIndex="0"
                          //           >
                          //             <img
                          //               className="default-img"
                          //               src={rProduct.images[0].url}
                          //               alt={"image"}
                          //             />
                          //             <img
                          //               className="hover-img"
                          //               src="/assets/imgs/shop/product-2-2.jpg"
                          //               alt={"image"}
                          //             />
                          //           </Link>
                          //         </div>
                          //         <div className="product-action-1">
                          //           <a
                          //             aria-label="Quick view"
                          //             className="action-btn small hover-up"
                          //             data-bs-toggle="modal"
                          //             href={"#"}
                          //             data-bs-target="#quickViewModal"
                          //           >
                          //             <i className="fa fa-search"></i>
                          //           </a>
                          //           <a
                          //             aria-label="Add To Wishlist"
                          //             className="action-btn small hover-up"
                          //             href="shop-wishlist.html"
                          //             tabIndex="0"
                          //           >
                          //             <i className="fi-rs-heart"></i>
                          //           </a>
                          //           <a
                          //             aria-label="Compare"
                          //             className="action-btn small hover-up"
                          //             href="shop-compare.html"
                          //             tabIndex="0"
                          //           >
                          //             <i className="fi-rs-shuffle"></i>
                          //           </a>
                          //         </div>
                          //         <div className="product-badges product-badges-position product-badges-mrg">
                          //           <span className="hot">Hot</span>
                          //         </div>
                          //       </div>
                          //       <div className="product-content-wrap">
                          //         <h2>
                          //           <Link
                          //             to={`/product/${rProduct.slug}`}
                          //             tabIndex="0"
                          //           >
                          //             {rProduct.name}
                          //           </Link>
                          //         </h2>
                          //         <div className="" title="">
                          //           <Rating
                          //             emptySymbol="fa fa-star-o fa-1x"
                          //             fullSymbol="fa fa-star fa-1x text-danger"
                          //             readonly
                          //             initialRating={avgRating}
                          //           />
                          //           <span className="font-small ml-5 text-muted">
                          //             ({avgRating})
                          //           </span>
                          //         </div>
                          //         <div className="product-price">
                          //           <span>
                          //             <i className="fa fa-inr"></i>
                          //             {rProduct.skus[0].sellingPrice}
                          //           </span>
                          //           <span className="old-price">
                          //             <i className="fa fa-inr"></i>
                          //             {rProduct.skus[0].mrp}
                          //           </span>
                          //         </div>
                          //       </div>
                          //     </div>
                          //   </div>
                          // ) : (
                          //   ""
                          // );
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

        {/* Custom modal */}
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

            <h5>Select Shipping Methods</h5>
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
                        <p>{method.name}</p>
                        <p className="text-white">
                          ...............................
                        </p>
                        <p className="ml-4">
                          <BiRupee style={{ marginTop: "-4px" }} />
                          {method.amount}
                        </p>
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
                            "HH:mm"
                          );
                          const selectedDate = date.format(
                            new Date(shippingDateTime.date),
                            "DD-MM-YYYY"
                          );

                          const endTime = date.transform(
                            time.endTime,
                            "HH:mm",
                            "HH:mm"
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
                                  id="flexRadioDefault1"
                                  disabled={
                                    today == selectedDate &&
                                    currentTime > endTime
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  for="flexRadioDefault1"
                                >
                                  {date.transform(
                                    time.startTime,
                                    "HH:mm",
                                    "hh:mm"
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
      </main>
    </>
  );
};

export default ProductDetails;
