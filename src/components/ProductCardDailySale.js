import React, { useState } from "react";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import Spinner from "./Spinner";

const ProductCardDailySale = ({
  product = {},
  totalRating,
  avgRating,
  addToWishlistHandler,
  wishlistLoading,
  myWishlists = [],
  removeFromWishlistHandler,
  availableInWishlist,
}) => {
  const [quickViewData, setQuickViewData] = useState(null);

  return (
    <>
      <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
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
                data-bs-toggle="modal"
                data-bs-target="#quickViewModal"
                onClick={(evt) => {
                  evt.preventDefault();
                  setQuickViewData(product);
                }}
              >
                <i class="fa fa-eye" aria-hidden="true"></i>
              </a>
            </div>

            <div className="product-badges product-badges-position product-badges-mrg">
              <span className="hot">
                {100 -
                  Math.ceil(
                    (product.skus[0].sellingPrice / product.skus[0].mrp) * 100
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
              <span className="font-small text-muted">
                Color: <Link to="">{product.color.name}</Link>
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
                  <i className="fa fa-inr"></i> {product.skus[0].sellingPrice}
                </span>
                <span className="old-price">
                  <i className="fa fa-inr"></i> {product.skus[0].mrp}
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
                      product.skus[0].sellingPrice,
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

export default ProductCardDailySale;
