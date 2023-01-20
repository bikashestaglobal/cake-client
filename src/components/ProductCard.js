import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Rating from "react-rating";
import Spinner from "./Spinner";
import ReactImageZoom from "react-image-zoom";
import { thumbSliderSetting } from "../helpers/SliderHelper";
import Slider from "react-slick";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { storage } from "../firebase/FirebaseConfig";
import { CustomerContext } from "../layouts/Routes";

const ProductCard = ({
  className,
  product = {},
  totalRating,
  avgRating,
  addToWishlistHandler,
  wishlistLoading,
  myWishlists = [],
  removeFromWishlistHandler,
  availableInWishlist,
}) => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const { cart = [] } = state;
  const [quickViewData, setQuickViewData] = useState(null);
  const [price, setPrice] = useState(product?.priceVariants[0]);
  const [sliderDefaultImage, setSliderDefaultImage] = useState(
    product.defaultImage
  );

  const [quantity, setQuantity] = useState(1);
  const [modalShow, setModalShow] = React.useState(false);

  const [imageOnCake, setImageOnCake] = useState("");
  const [messageOnCake, setMessageOnCake] = useState("");
  const [progress, setProgress] = useState(0);
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

  const addToCartHandler = (fromWhere) => {
    if (product?.isPhotoCake && !imageOnCake) {
      toast.warning("Must Upload Image for Cake");
      return;
    }

    const payloadObj = {
      name: product.name,
      slug: product.slug,
      parentCategories: product?.parentCategories.map((item) => {
        return item._id;
      }),
      categories: product?.categories.map((item) => {
        return item._id;
      }),
      productId: product._id,
      quantity: quantity,
      price: price.sellingPrice,
      mrp: price.mrp,
      weight: price.weight,
      flavour: product.flavour.name,
      shape: product.shape.name,
      cakeType: product.type.name,
      image: product.defaultImage,
      images: product.images,
      breadType: product.breadType,
      messageOnCake: messageOnCake,
      imageOnCake: imageOnCake,
    };

    dispatch({
      type: "ADD_TO_CART",
      payload: payloadObj,
    });

    toast.success("Item added to cart");

    // if (fromWhere == "BUY_NOW") {
    //   history.push("/checkout");
    // }
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
      <div className={className || "col-lg-1-5 col-md-4 col-12 col-sm-6"}>
        <div className="product-cart-wrap mb-30">
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
                      : "/assets/imgs/shop/product-1-2.jpg"
                  }
                  alt=""
                />
              </Link>
            </div>
            <div class="product-action-1">
              {availableInWishlist ? (
                <a
                  onClick={(evt) => {
                    const wishList = myWishlists.filter((item) => {
                      return item.product._id == product._id;
                    });
                    removeFromWishlistHandler(evt, wishList[0]._id);
                  }}
                  aria-label="Remove From Wishlist"
                  class="action-btn"
                  href="#"
                >
                  {wishlistLoading ? <Spinner /> : <i class="fa fa-heart"></i>}
                </a>
              ) : (
                <a
                  onClick={(evt) => {
                    addToWishlistHandler(evt, product._id);
                  }}
                  title="Add to Wishlist"
                  aria-label="Add To Wishlist"
                  class="action-btn"
                  href="#"
                >
                  {wishlistLoading ? (
                    <Spinner />
                  ) : (
                    <i class="fa fa-heart-o"></i>
                  )}
                </a>
              )}

              <a
                aria-label="Quick view"
                class="action-btn"
                // data-bs-toggle="modal"
                // data-bs-target="#quickViewModal"
                onClick={(evt) => {
                  evt.preventDefault();
                  setModalShow(true);
                  //   setQuickViewData(product);
                }}
              >
                <i class="fa fa-eye" aria-hidden="true"></i>
              </a>
            </div>

            <div className="product-badges product-badges-position product-badges-mrg">
              <span className="hot">
                {100 -
                  Math.ceil(
                    (product.priceVariants[0].sellingPrice /
                      product.priceVariants[0].mrp) *
                      100
                  )}
                % off
              </span>
            </div>
          </div>
          <div className="product-content-wrap">
            <div className="product-category">
              <Link to={`#`}>{product.flavour.name}</Link>
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
              <span className="font-small ml-5 text-muted">({avgRating})</span>
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
                Shape: <Link to="">{product.shape.name}</Link>
              </span>
              <br />
              {/* <span className="font-small text-muted">
                Color: <Link to="">{product.color.name}</Link>
              </span> */}
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
                  {product.priceVariants[0].sellingPrice}
                </span>
                <span className="old-price">
                  <i className="fa fa-inr"></i> {product.priceVariants[0].mrp}
                </span>
              </div>

              <div className="add-cart">
                <Link className="add" to={`/product/${product.slug}`}>
                  <i className="fa fa-shopping-cart mr-5"></i>
                  Add
                </Link>

                {/* {cart.some(
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
              <i className="fa fa-shopping-cart mr-5"></i>
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
                    price:
                      product.priceVariants[0].sellingPrice,
                    image: product.images[0].url,
                  },
                });
              }}
            >
              <i className="fa fa-shopping-cart mr-5"></i>
              Add
            </Link>
          )} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className={"preview-modal"}
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="">
          <button
            onClick={() => {
              setModalShow(false);
            }}
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
                    <i className="fa fa-search"></i>
                  </span>
                  <div className="product-image-slider">
                    <figure className="border-radius-10">
                      <ReactImageZoom
                        {...{
                          img: sliderDefaultImage,
                          width: 500,
                          height: 400,
                          zoomWidth: 500,
                          zoomPosition: "original",
                        }}
                      />
                    </figure>
                  </div>

                  <div className="slider-thumbnails">
                    <Slider {...thumbSliderSetting}>
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
              </div>
              <div className="col-md-6 col-sm-12 col-xs-12">
                <div className="detail-info pr-30 pl-30">
                  <span className="stock-status out-stock"> Sale Off </span>
                  <h3 className="title-detail">
                    <Link to="shop-product-right.html" className="text-heading">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="product-detail-rating">
                    <div className="product-rate-cover text-end">
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
                  </div>
                  <div className="clearfix product-price-cover">
                    <div className="product-price primary-color float-left">
                      <span className="current-price text-brand">
                        <i className="fa fa-inr"></i>
                        {product.priceVariants[0].sellingPrice}
                      </span>
                      <span>
                        <span className="save-price font-md color3 ml-15">
                          {100 -
                            Math.ceil(
                              (product.priceVariants[0].sellingPrice /
                                product.priceVariants[0].mrp) *
                                100
                            )}{" "}
                          % OFF
                        </span>
                        <span className="old-price font-md ml-15">
                          <i className="fa fa-inr"></i>
                          {product.priceVariants[0].mrp}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h6 class="mb-3">
                      <strong class="mr-10">Size / Weight: </strong>
                    </h6>
                    <div class="attr-detail attr-size mb-30">
                      <div class="clearfix"></div>
                      <ul class="list-filter size-filter font-small">
                        {product.priceVariants.map((sku, index) => {
                          return (
                            <li className="mr-5" key={`sku-${index + 1}`}>
                              <img
                                style={{ height: "60px", width: "60px" }}
                                src={product.defaultImage}
                              />
                              <a
                                style={{
                                  background:
                                    price.mrp == sku.mrp ? "#81391d" : "",
                                  color: price.mrp == sku.mrp ? "#fff" : "",
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

                  {/* Form */}
                  <div className="pb-2 mb-3">
                    <input
                      type="text"
                      placeholder="Message on Cake"
                      className="form-control mr-1"
                      onChange={(evt) => setMessageOnCake(evt.target.value)}
                      value={messageOnCake}
                    />
                    {product.isPhotoCake ? (
                      <div className="mt-2">
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

                  <div className="detail-extralink mb-30">
                    <div className="detail-qty border radius">
                      <Link
                        to="#"
                        className="qty-down"
                        onClick={decreaseQuantity}
                      >
                        <i className="fa fa-angle-down"></i>
                      </Link>
                      <span className="qty-val"> {quantity} </span>
                      <Link
                        to="#"
                        className="qty-up"
                        onClick={increaseQuantity}
                      >
                        <i className="fa fa-angle-up"></i>
                      </Link>
                    </div>
                    <div className="product-extra-link2">
                      {cart.some((value) => value.productId == product?._id) ? (
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
                      {/* <button
                        onClick={addToCartHandler}
                        type="submit"
                        className="button button-add-to-cart"
                      >
                        <i className="fa fa-shopping-cart"></i>Add to cart
                      </button> */}
                    </div>
                  </div>
                  <div className="font-xs">
                    <ul>
                      {/* <li className="mb-5">
                        Color:{" "}
                        <span className="text-brand">{product.color.name}</span>
                      </li> */}
                      <li className="mb-5">
                        Shape:
                        <span className="text-brand">
                          {" "}
                          {product.shape.name}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal */}
      {/* <div
        className={`modal fade custom-modal ${modalShow ? "show" : ""}`}
        id="quickViewModal"
        tabIndex="-1"
        aria-labelledby="quickViewModalLabel"
        aria-hidden="true"
        style={{ display: modalShow ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              onClick={() => {
                setModalShow(false);
              }}
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
                      <i className="fa fa-search"></i>
                    </span>
                    <div className="product-image-slider">
                      <figure className="border-radius-10">
                        <ReactImageZoom
                          {...{
                            img: sliderDefaultImage,
                            width: 500,
                            height: 400,
                            zoomWidth: 500,
                            zoomPosition: "original",
                          }}
                        />
                      </figure>
                    </div>

                    <div className="slider-thumbnails">
                      <Slider {...thumbSliderSetting}>
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
                </div>
                <div className="col-md-6 col-sm-12 col-xs-12">
                  <div className="detail-info pr-30 pl-30">
                    <span className="stock-status out-stock"> Sale Off </span>
                    <h3 className="title-detail">
                      <Link
                        to="shop-product-right.html"
                        className="text-heading"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <div className="product-detail-rating">
                      <div className="product-rate-cover text-end">
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
                    </div>
                    <div className="clearfix product-price-cover">
                      <div className="product-price primary-color float-left">
                        <span className="current-price text-brand">
                          <i className="fa fa-inr"></i>
                          {product.priceVariants[0].sellingPrice}
                        </span>
                        <span>
                          <span className="save-price font-md color3 ml-15">
                            {100 -
                              Math.ceil(
                                (product.priceVariants[0].sellingPrice /
                                  product.priceVariants[0].mrp) *
                                  100
                              )}{" "}
                            % OFF
                          </span>
                          <span className="old-price font-md ml-15">
                            <i className="fa fa-inr"></i>
                            {product.priceVariants[0].mrp}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h6 class="mb-3">
                        <strong class="mr-10">Size / Weight: </strong>
                      </h6>
                      <div class="attr-detail attr-size mb-30">
                        <div class="clearfix"></div>
                        <ul class="list-filter size-filter font-small">
                          {product.priceVariants.map((sku, index) => {
                            return (
                              <li className="mr-5" key={`sku-${index + 1}`}>
                                <img
                                  style={{ height: "60px", width: "60px" }}
                                  src={product.defaultImage}
                                />
                                <a
                                  style={{
                                    background:
                                      price.mrp == sku.mrp ? "#81391d" : "",
                                    color: price.mrp == sku.mrp ? "#fff" : "",
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
                    <div className="detail-extralink mb-30">
                      <div className="detail-qty border radius">
                        <Link to="#" className="qty-down">
                          <i className="fa fa-angle-down"></i>
                        </Link>
                        <span className="qty-val">1</span>
                        <Link to="#" className="qty-up">
                          <i className="fa fa-angle-up"></i>
                        </Link>
                      </div>
                      <div className="product-extra-link2">
                        <button
                          type="submit"
                          className="button button-add-to-cart"
                        >
                          <i className="fa fa-shopping-cart"></i>Add to cart
                        </button>
                      </div>
                    </div>
                    <div className="font-xs">
                      <ul>
                        <li className="mb-5">
                          Color:{" "}
                          <span className="text-brand">
                            {product.color.name}
                          </span>
                        </li>
                        <li className="mb-5">
                          Shape:
                          <span className="text-brand">
                            {" "}
                            {product.shape.name}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default ProductCard;
