import React, { useContext, useState, useEffect } from "react";
import { CustomerContext } from "../Routes";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Config from "../Config";

const ShoppingCart = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const { cart, token, shipping, adonCart = [] } = state;

  const [coupons, setCoupons] = useState([]);
  const [enteredCoupon, setEnteredCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "",
    discount: "",
    discountType: "",
  });

  const [subtotal, setSubtotal] = useState("");
  const [adonTotal, setAdonTotal] = useState("");
  const [discountWithCoupon, setDiscountWithCoupon] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [totalAmountAfterAdon, setTotalAmountAfterAdon] = useState("");
  const [adonProductModel, setAdonProductModel] = useState(false);
  const [adonProducts, setAdonProducts] = useState([]);

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

  const couponHandler = (evt) => {
    evt.preventDefault();

    fetch(`${Config.SERVER_URL}/coupon/verify/${enteredCoupon}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: "",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setCoupons(data.body);
        } else {
          console.log(
            "Error Occured While loading shippingMethods : ProductDetails"
          );
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });

    // const today = new Date();
    // const filteredCoupon = coupons.find(
    //   (coupon) => coupon.code == enteredCoupon
    // );

    // if (coupons.some((coupon) => coupon.code === enteredCoupon)) {
    //   setCouponMessage({
    //     ...couponMessage,
    //     message: "Coupon Applied",
    //     error: false,
    //   });

    // Set Coupon Information
    // setAppliedCoupon({
    //   ...appliedCoupon,
    //   code: filteredCoupon.code,
    //   discount: filteredCoupon.discount,
    //   discountType: filteredCoupon.discountType,
    // });

    // dispatch({
    //   type: "ADD_COUPON",
    //   payload: {
    //     code: filteredCoupon.code,
    //     discount: filteredCoupon.discount,
    //     discountType: filteredCoupon.discountType,
    //   },
    // });
    // } else {
    //   setCouponMessage({
    //     ...couponMessage,
    //     message: "Coupon Not Valid",
    //     error: true,
    //   });

    // Set Coupon Information
    // setAppliedCoupon({
    //   ...appliedCoupon,
    //   code: "",
    //   discount: "",
    //   discountType: "",
    // });
  };

  // Calculate amount
  useEffect(() => {
    // Calculate subtotal
    let sub_total = cart
      .map((product) => product.price * product.quantity)
      .reduce((prev, curr) => prev + curr, 0);

    // calculate coupon discount amount
    let dis_with_coupon = 0;
    if (appliedCoupon.code) {
      if (appliedCoupon.discountType === "PERCENTAGE") {
        dis_with_coupon = (subtotal * appliedCoupon.discount) / 100;
      } else {
        dis_with_coupon = appliedCoupon.discount;
      }
    }

    let adon_total = adonCart
      .map((product) => product.price * product.quantity)
      .reduce((prev, curr) => prev + curr, 0);

    // Calculate Total
    let total = sub_total + parseInt(shipping.amount) - dis_with_coupon;

    // Total after adon
    let totalAmountAfterAdon =
      sub_total + parseInt(shipping.amount) - dis_with_coupon + adon_total;
    setTotalAmount(total);
    setDiscountWithCoupon(dis_with_coupon);
    setSubtotal(sub_total);
    setAdonTotal(adon_total);
    setTotalAmountAfterAdon(totalAmountAfterAdon);
  }, [cart, appliedCoupon, adonCart]);

  return (
    <main className="main" data-select2-id="17">
      <div className="page-header breadcrumb-wrap">
        <div className="container">
          <div className="breadcrumb">
            <a href="index.html" rel="nofollow">
              <i className="fi-rs-home mr-5"></i>Home
            </a>
            <span></span> Shop
            <span></span> Cart
          </div>
        </div>
      </div>
      <div className="container mb-80 mt-50">
        <div className="row">
          <div className="col-lg-8 mb-40">
            <h3 className="heading-2 mb-10">Your Cart</h3>
            <div className="d-flex justify-content-between">
              <h6 className="text-body">
                There are <span className="text-brand"> {cart.length} </span>
                products in your cart
              </h6>
              <h6 className="text-body">
                {cart.length ? (
                  <Link
                    href="#"
                    className="text-muted"
                    onClick={(evt) => {
                      evt.preventDefault();
                      dispatch({ type: "CLEAR_CART" });
                      toast.success("Cart Cleared");
                    }}
                  >
                    <i className="fa fa-trash"></i>
                    Clear Cart
                  </Link>
                ) : (
                  ""
                )}
              </h6>
            </div>
          </div>
        </div>

        {cart.length ? (
          <div className="row" data-select2-id="16">
            <div className="col-lg-8" data-select2-id="15">
              <div className="table-responsive shopping-summery">
                <table className="table table-wishlist">
                  <thead>
                    <tr className="main-heading">
                      <th className="custome-checkbox start pl-30">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="checkbox"
                          id="exampleCheckbox11"
                          value=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleCheckbox11"
                        ></label>
                      </th>
                      <th scope="col" colspan="2">
                        Product
                      </th>
                      <th scope="col">Unit Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Subtotal</th>
                      <th scope="col" className="end">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((product) => {
                      return (
                        <tr className="pt-30">
                          <td className="custome-checkbox pl-30">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="checkbox"
                              id="exampleCheckbox1"
                              value=""
                            />
                            <label
                              className="form-check-label"
                              htmlFor="exampleCheckbox1"
                            ></label>
                          </td>
                          <td className="image product-thumbnail pt-40">
                            <img src={product.image} alt="#" />
                          </td>
                          <td className="product-des product-name">
                            <h6 className="mb-5">
                              <Link
                                className="product-name mb-10 text-heading"
                                to={`/product/${product.slug}`}
                              >
                                {`${product.name.slice(0, 25)}...`}
                              </Link>
                            </h6>
                            <div className="product-rate-cover">
                              <span className="font-small ml-4 text-muted">
                                {product.flavour} | {product.color} |{" "}
                                {product.weight}
                              </span>
                            </div>
                          </td>
                          <td className="price" data-title="Price">
                            <h4 className="text-body">
                              {" "}
                              <i className="fa fa-inr" aria-hidden="true"></i>
                              {product.price}{" "}
                            </h4>
                          </td>
                          <td
                            className="text-center detail-info"
                            data-title="Stock"
                          >
                            <div className="detail-extralink mr-15">
                              <div className="detail-qty border radius">
                                <Link
                                  href="#"
                                  className="qty-up"
                                  onClick={(evt) => {
                                    evt.preventDefault();

                                    dispatch({
                                      type: "INCREASE_QUANTITY",
                                      payload: {
                                        productId: product.productId,
                                      },
                                    });
                                  }}
                                >
                                  <i className="fa fa-angle-up"></i>
                                </Link>

                                <span className="qty-val">
                                  {product.quantity}
                                </span>

                                <Link
                                  to="#"
                                  className="qty-down"
                                  onClick={(evt) => {
                                    evt.preventDefault();
                                    if (product.quantity > 1) {
                                      dispatch({
                                        type: "DECREASE_QUANTITY",
                                        payload: {
                                          productId: product.productId,
                                        },
                                      });
                                    } else {
                                      toast.warning(
                                        "Quantity must be atleast one"
                                      );
                                    }
                                  }}
                                >
                                  <i className="fa fa-angle-down"></i>
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="price" data-title="Price">
                            <h4 className="text-brand">
                              <i className="fa fa-inr" aria-hidden="true"></i>
                              {product.quantity * product.price}
                            </h4>
                          </td>
                          <td
                            className="action text-center"
                            data-title="Remove"
                          >
                            <Link
                              to="#"
                              className="text-body"
                              onClick={(evt) => {
                                evt.preventDefault();
                                dispatch({
                                  type: "REMOVE_FROM_CART",
                                  payload: {
                                    productId: product.productId,
                                  },
                                });
                                toast.success("Item Removed");
                              }}
                            >
                              <i className="fa fa-trash"></i>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="divider-2 mb-30"></div>
              <div className="cart-action d-flex justify-content-between">
                <Link className="btn " onClick={(evt) => history.goBack()}>
                  <i className="fa fa-long-arrow-left mr-10"></i>
                  Go Back
                </Link>
                {/* <a className="btn  mr-10 mb-sm-15">
                  <i className="fa fa-refresh mr-10"></i>Update Cart
                </a> */}
              </div>
              <div className="row mt-50">
                {/* <div className="col-lg-7">
                  <div className="calculate-shiping p-40 border-radius-15 border">
                    <h4 className="mb-10">Calculate Shipping</h4>
                    <p className="mb-30">
                      <span className="font-lg text-muted">Flat rate:</span>
                      <strong className="text-brand">5%</strong>
                    </p>
                    <form
                      className="field_form shipping_calculator"
                      data-select2-id="14"
                    >
                      <div className="form-row" data-select2-id="13">
                        <div
                          className="form-group col-lg-12"
                          data-select2-id="12"
                        >
                          <div className="custom_select" data-select2-id="11">
                            <select
                              className="form-control select-active w-100 select2-hidden-accessible"
                              data-select2-id="7"
                              tabindex="-1"
                              aria-hidden="true"
                            >
                              <option value="" data-select2-id="9">
                                United Kingdom
                              </option>
                              
                              
                              <option value="YE" data-select2-id="259">
                                Yemen
                              </option>
                              <option value="ZM" data-select2-id="260">
                                Zambia
                              </option>
                              <option value="ZW" data-select2-id="261">
                                Zimbabwe
                              </option>
                            </select>
                            <span
                              className="select2 select2-container select2-container--default select2-container--above"
                              dir="ltr"
                              data-select2-id="8"
                              style={{ width: "385.292px" }}
                            >
                              <span className="selection">
                                <span
                                  className="select2-selection select2-selection--single"
                                  role="combobox"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  tabindex="0"
                                  aria-labelledby="select2-ez2u-container"
                                >
                                  <span
                                    className="select2-selection__rendered"
                                    id="select2-ez2u-container"
                                    role="textbox"
                                    aria-readonly="true"
                                    title="United Kingdom"
                                  >
                                    United Kingdom
                                  </span>
                                  <span
                                    className="select2-selection__arrow"
                                    role="presentation"
                                  >
                                    <b role="presentation"></b>
                                  </span>
                                </span>
                              </span>
                              <span
                                className="dropdown-wrapper"
                                aria-hidden="true"
                              ></span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="form-row row">
                        <div className="form-group col-lg-6">
                          <input
                            required="required"
                            placeholder="State / Country"
                            name="name"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-lg-6">
                          <input
                            required="required"
                            placeholder="PostCode / ZIP"
                            name="name"
                            type="text"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div> */}
                <div className="col-lg-5"></div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="border p-md-4 cart-totals ml-30">
                <div className="table-responsive">
                  <table className="table no-border">
                    <tbody>
                      <tr>
                        <td className="cart_total_label">
                          <h6 className="text-muted">Subtotal</h6>
                        </td>
                        <td className="cart_total_amount">
                          <h4 className="text-brand text-end">
                            <i className="fa fa-inr" aria-hidden="true"></i>
                            {subtotal}
                          </h4>
                        </td>
                      </tr>
                      <tr>
                        <td scope="col" colspan="2">
                          <div className="divider-2 mt-10 mb-10"></div>
                        </td>
                      </tr>
                      <tr>
                        <td className="cart_total_label">
                          <h6 className="text-muted">Shipping</h6>
                        </td>
                        <td className="cart_total_amount">
                          <h5 className="text-heading text-end">
                            <i className="fa fa-inr" aria-hidden="true"></i>
                            {shipping ? shipping.amount : ""}
                          </h5>
                        </td>
                      </tr>
                      {appliedCoupon.code && (
                        <tr>
                          <td className="cart_total_label">
                            <h6 className="text-muted">Coupon</h6>
                          </td>
                          <td className="cart_total_amount">
                            <h5 className="text-heading text-end">
                              <i className="fa fa-inr" aria-hidden="true"></i>
                              {discountWithCoupon}
                            </h5>
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td scope="col" colspan="2">
                          <div className="divider-2 mt-10 mb-10"></div>
                        </td>
                      </tr>
                      <tr>
                        <td className="cart_total_label">
                          <h6 className="text-muted">Total</h6>
                        </td>
                        <td className="cart_total_amount">
                          <h4 className="text-brand text-end">
                            <i className="fa fa-inr" aria-hidden="true"></i>
                            {totalAmount}
                          </h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                  className="btn mb-20 w-100"
                  onClick={() => {
                    setAdonProductModel(true);
                  }}
                >
                  Proceed To CheckOut<i className="fi-rs-sign-out ml-15"></i>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-danger">No product in your cart</div>
        )}
      </div>

      {/* Custom modal */}
      <div
        id="myModal"
        className="custom-modal2"
        style={{
          display: adonProductModel ? "block" : "none",
        }}
      >
        <div className="custom-modal2-content" style={{ width: "80%" }}>
          <span
            className="custom-modal2-close"
            onClick={() => {
              setAdonProductModel(false);
            }}
          >
            &times;
          </span>

          <h5 className="mb-3">Select Adon Products</h5>

          {/* Products List */}
          <div className="row" style={{ height: "430px" }}>
            {adonProducts.map((product, index) => {
              return (
                <div className="col-md-3 pb-2" key={`adon-${index}`}>
                  <div className="card bg-white shadow-sm py-2">
                    <img
                      src={product.image}
                      className="card-img-top adon-image"
                      alt="adon product"
                    />
                    <div className="card-body text-center">
                      <p className="card-title">
                        {" "}
                        {product.name.slice(0, 25)}
                        {".."}
                      </p>
                      <h6 className="text-danger">
                        {" "}
                        <i className="fa fa-inr"></i> {product.sellingPrice}{" "}
                      </h6>

                      <div className="add-cart">
                        {adonCart.some(
                          (value) => value.productId == product._id
                        ) ? (
                          <div
                            className="d-flex justify-content-between mt-2"
                            style={{ width: "140px", margin: "auto" }}
                          >
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
                        ) : (
                          <Link
                            className="add mt-2"
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
                <div className="">
                  <table className="">
                    <tr>
                      <th>DETAILS</th>
                      <td> {cart.length || 0} Base Item</td>
                      <td> {adonCart.length || 0} Add-ons</td>
                      <td> {adonCart.length || 0} Shipping</td>
                      <td> {adonCart.length || 0} TOTAL</td>
                    </tr>
                    <tr>
                      <th>PRICE</th>
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
                  className="btn"
                  to={"/checkout"}
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
  );
};

export default ShoppingCart;
