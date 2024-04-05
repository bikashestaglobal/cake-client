import React, { useContext, useState, useEffect, useRef } from "react";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Spinner from "../components/Spinner";
import Footer from "../layouts/Footer";
import Slider from "react-slick";
import { adonSliderSetting } from "../helpers/SliderHelper";
import parse from "html-react-parser";
import date from "date-and-time";

const ShoppingCart = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const { cart, token, shipping, adonCart = [] } = state;
  const [modalShow, setModalShow] = React.useState(false);

  const [shippingMethods, setShippingMethods] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [enteredCoupon, setEnteredCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "",
    discount: "",
    discountType: "",
  });

  const scrollView = useRef(null);

  const [subtotal, setSubtotal] = useState("");

  const [adonTotal, setAdonTotal] = useState("");
  const [discountWithCoupon, setDiscountWithCoupon] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [totalAmountAfterAdon, setTotalAmountAfterAdon] = useState("");
  const [adonProductModel, setAdonProductModel] = useState(false);
  const [adonProducts, setAdonProducts] = useState([]);
  const [product, setProduct] = useState({ priceVariants: [], shape: {} });
  const [productLoaded, setProductLoaded] = useState(false);
  const [price, setPrice] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [editCartProduct, setEditCartProduct] = useState({});

  // useEffect(() => {
  //   if (scrollView) {
  //     scrollView.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, []);

  // Get all Adon Products
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/adon-product?skip=0&limit=20`, {
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

  // Calculate amount
  useEffect(() => {
    // Calculate Shipping Amount
    if (cart.length > 1) {
      let isBentoCakeInCart = false;
      for (let item of cart) {
        if (item.isBentoCake) {
          isBentoCakeInCart = true;
        }
      }

      if (isBentoCakeInCart) {
        dispatch({
          type: "SHIPPING_METHOD",
          payload: {
            ...shipping,
            amount: 0,
          },
        });
      }
    } else if (cart.length == 1) {
      let isBentoCakeInCart = false;
      for (let item of cart) {
        if (item.isBentoCake) {
          isBentoCakeInCart = true;
        }
      }

      if (isBentoCakeInCart) {
        let selectedShippingMethodArray = shippingMethods.filter(
          (method) => method._id == shipping._id
        );

        let selectedShippingMethod = selectedShippingMethodArray[0];

        dispatch({
          type: "SHIPPING_METHOD",
          payload: {
            ...shipping,
            amount: Number(selectedShippingMethod?.bentoCakeAmount),
          },
        });
      }
    }

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
  }, [cart, appliedCoupon, adonCart, shippingMethods, shipping.amount]);

  // Get product when click on edit product button from cart
  const getProductHandler = (cartProduct) => {
    // Update price variable
    setPrice({
      mrp: cartProduct.mrp,
      sellingPrice: cartProduct.price,
      weight: cartProduct.weight,
    });

    setProductLoaded(false);
    fetch(`${Config.SERVER_URL}/product/${cartProduct.productId}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setProduct(data.body);
        } else {
          console.log("Error Occured While loading product : ProductDetails");
        }
        setProductLoaded(true);
      })
      .catch((error) => {
        console.error("Header Error:", error);
        setProductLoaded(true);
      });
  };

  // decrese quantity while updating cart
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

  const updateProductOnCartHandler = (productId) => {
    dispatch({
      type: "UPDATE_CART_PRODUCT",
      payload: {
        ...editCartProduct,
        quantity: quantity,
        mrp: price.mrp,
        price: price.sellingPrice,
        weight: price.weight,
      },
    });
    toast.success("Item Updated");
    setModalShow(false);
  };

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
      <main className="main" data-select2-id="17">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/" rel="nofollow">
                <i className="fa fa-home mr-5"></i>Home
              </Link>
              <span></span> Shop
              <span></span> Cart
            </div>
          </div>
        </div>

        <div className="container mb-80 mt-50">
          <div className="row">
            <div className="col-lg-8 mb-40">
              <h3 className="heading-2 mb-10" ref={scrollView}>
                My Cart
              </h3>
              <div className="d-flex justify-content-between">
                <h6 className="text-body">
                  There are <span className="text-brand"> {cart.length} </span>
                  products in your cart
                </h6>
                <h6 className="text-body">
                  {cart.length ? (
                    <Link
                      style={{ color: "#81391d" }}
                      href="#"
                      className=""
                      onClick={(evt) => {
                        evt.preventDefault();
                        dispatch({ type: "CLEAR_CART" });
                        toast.success("Cart Cleared");
                      }}
                    >
                      <i className="fa fa-trash mr-10"></i>
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
                            <td className="image product-thumbnail">
                              <img src={product.image} alt="#" />
                            </td>
                            <td className="product-des product-name">
                              <h6 className="mb-5">
                                <Link
                                  className="product-name mb-10 text-heading"
                                  to={`/product/${product.slug}`}
                                >
                                  {`${
                                    product.name.length > 25
                                      ? product.name.slice(0, 25) + ".."
                                      : product.name
                                  }`}
                                </Link>
                              </h6>
                              {/* <div className="product-rate-cover">
                              <span className="font-small ml-4 text-muted">
                                {product.flavour} | {product.color} |{" "}
                                {product.weight}
                              </span>
                            </div> */}
                              <div className="product-rate-cover">
                                <span className="font-small text-muted">
                                  Weight : {product.weight} | Qty{" : "}
                                  {product.quantity}
                                </span>
                              </div>
                              <div className="product-rate-cover">
                                {product.isBentoCake ? (
                                  <div className="">
                                    <div className="">
                                      <span className="font-small text-muted">
                                        Flavours
                                      </span>
                                    </div>
                                    <div className="flavour-lists cart-list">
                                      {parse(
                                        product.bentoFlavourDetails ||
                                          "<span></span>"
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="font-small text-muted">
                                    Flavour : {product.flavour}
                                  </span>
                                )}
                              </div>
                              <div className="product-rate-cover">
                                <span className="font-small ml-4 text-muted">
                                  <i className="fa fa-inr"></i> {product.price}
                                </span>{" "}
                                <span className="font-small ml-4 text-muted">
                                  <strike>
                                    <i className="fa fa-inr"></i>
                                    {product.mrp}
                                  </strike>
                                </span>{" "}
                                <span className="hot text-danger">
                                  {100 -
                                    Math.ceil(
                                      (product.price / product.mrp) * 100
                                    )}
                                  % off
                                </span>
                              </div>
                              <div className="">
                                <div className="">
                                  <span className="font-small text-muted">
                                    Delivery : {shipping.method}
                                  </span>
                                </div>
                                <div className="">
                                  <span className="font-small text-muted">
                                    Date :{" "}
                                    {shipping.date
                                      ? date.format(
                                          new Date(shipping.date),
                                          "DD-MM-YYYY"
                                        )
                                      : null}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="price" data-title="Unit Price">
                              <p className="">
                                {" "}
                                <i className="fa fa-inr" aria-hidden="true"></i>
                                {product.price}{" "}
                              </p>
                            </td>
                            <td
                              className="text-center price"
                              data-title="Quantity"
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
                            <td className="price" data-title="Subtotal">
                              <p className="text-brand">
                                <i className="fa fa-inr" aria-hidden="true"></i>
                                {product.quantity * product.price}
                              </p>
                            </td>
                            <td
                              className="price text-center"
                              data-title="Remove"
                            >
                              <div className="">
                                <Link
                                  to="#"
                                  className="text-body deleteIcon"
                                  title="Remove Product"
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

                                <Link
                                  to="#"
                                  className="text-body EditIcon"
                                  title="Update Product"
                                  onClick={(evt) => {
                                    evt.preventDefault();
                                    setModalShow(true);
                                    getProductHandler(product);
                                    setEditCartProduct(product);
                                    setQuantity(product.quantity);
                                  }}
                                >
                                  <i className="fa fa-pencil"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="divider-2 mb-30"></div>
                {/* Adon Products */}

                {adonCart.length ? (
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="font-weight-bold">Addon Products</h4>
                    <button
                      className="btn btn-info"
                      onClick={(evt) => {
                        evt.preventDefault();
                        setAdonProductModel(true);
                      }}
                    >
                      <i className="fa fa-pencil"></i> Update Addon
                    </button>
                  </div>
                ) : (
                  ""
                )}

                <div className="table-responsive shopping-summery">
                  <table className="table table-wishlist">
                    <tbody>
                      {adonCart.map((product) => {
                        return (
                          <tr className="pt-30">
                            <td className="image product-thumbnail">
                              <img src={product.image} alt="#" />
                            </td>
                            <td className="product-des product-name">
                              <h6 className="mb-5">
                                <Link
                                  className="product-name mb-10 text-heading"
                                  to={`#`}
                                >
                                  {`${
                                    product.name.length > 25
                                      ? product.name.slice(0, 25) + ".."
                                      : product.name
                                  }`}
                                </Link>
                              </h6>

                              <div className="product-rate-cover">
                                <span className="font-small text-muted">
                                  Qty {product.quantity}
                                </span>
                                {" | "}
                                <span className="font-small ml-4 text-muted">
                                  Price <i className="fa fa-inr"></i>{" "}
                                  {product.price}
                                </span>
                              </div>
                            </td>
                            <td className="price" data-title="Price">
                              <p className="">
                                <i className="fa fa-inr" aria-hidden="true"></i>
                                {product.price}
                              </p>
                            </td>
                            <td
                              className="text-center price"
                              data-title="Stock"
                            >
                              <div className="detail-extralink mr-15">
                                <div className="detail-qty border radius">
                                  <Link
                                    href="#"
                                    className="qty-up"
                                    onClick={() => {
                                      dispatch({
                                        type: "INCREASE_ADON_QUANTITY",
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
                                    onClick={() => {
                                      dispatch({
                                        type: "DECREASE_ADON_QUANTITY",
                                        payload: {
                                          productId: product.productId,
                                        },
                                      });
                                    }}
                                  >
                                    <i className="fa fa-angle-down"></i>
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="price" data-title="Price">
                              <p className="">
                                <i className="fa fa-inr" aria-hidden="true"></i>
                                {product.quantity * product.price}
                              </p>
                            </td>

                            <td
                              className="price text-center"
                              data-title="Remove"
                            >
                              <Link
                                to="#"
                                className="text-body deleteIcon"
                                onClick={() => {
                                  dispatch({
                                    type: "REMOVE_ADON_FROM_CART",
                                    payload: {
                                      productId: product.productId,
                                    },
                                  });
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
                <div className="border cart-totals">
                  <div className="table-responsive">
                    <table className="table no-border subtotalTable">
                      <tbody>
                        <tr>
                          <td className="cart_total_label">
                            <h6 className="">Subtotal</h6>
                          </td>
                          <td className="cart_total_amount">
                            <p className="text-brand">
                              <i
                                className="fa fa-inr mr-5"
                                aria-hidden="true"
                              ></i>
                              {subtotal || 0}
                            </p>
                          </td>
                        </tr>
                        {/* <tr>
                        <td scope="col" colspan="2">
                          <div className="divider-2 mt-10 mb-10"></div>
                        </td>
                      </tr> */}
                        <tr>
                          <td className="cart_total_label">
                            <h6 className="">Shipping</h6>
                          </td>
                          <td className="cart_total_amount">
                            <p className="text-heading">
                              <i
                                className="fa fa-inr mr-5"
                                aria-hidden="true"
                              ></i>
                              {shipping ? shipping.amount : 0}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="cart_total_label">
                            <h6 className="">Addon Total</h6>
                          </td>
                          <td className="cart_total_amount">
                            <p className="text-heading">
                              <i
                                className="fa fa-inr mr-5"
                                aria-hidden="true"
                              ></i>
                              {adonTotal ? adonTotal : 0}
                            </p>
                          </td>
                        </tr>
                        {appliedCoupon.code && (
                          <tr>
                            <td className="cart_total_label">
                              <h6 className="">Coupon</h6>
                            </td>
                            <td className="cart_total_amount">
                              <h5 className="text-heading">
                                <i
                                  className="fa fa-inr mr-5"
                                  aria-hidden="true"
                                ></i>
                                {discountWithCoupon || 0}
                              </h5>
                            </td>
                          </tr>
                        )}

                        {/* <tr>
                        <td scope="col" colspan="2">
                          <div className="divider-2 mt-10 mb-10"></div>
                        </td>
                      </tr> */}
                        <tr>
                          <td className="cart_total_label">
                            <h6 className="">Total</h6>
                          </td>
                          <td className="cart_total_amount">
                            <p className="text-brand">
                              <i
                                className="fa fa-inr mr-5"
                                aria-hidden="true"
                              ></i>
                              {totalAmountAfterAdon}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button
                    className="btn mb-20 w-100"
                    onClick={() => {
                      !adonCart.length
                        ? setAdonProductModel(true)
                        : history.push("/checkout");
                    }}
                    disabled={isNaN(totalAmount) ? true : false}
                  >
                    {isNaN(totalAmount) ? (
                      <>
                        Loading <Spinner />
                      </>
                    ) : (
                      <>
                        Proceed To CheckOut
                        <i className="fa fa-sign-out ml-15"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="alert alert-danger">No product in your cart</div>
              <Link to={"/"} className={"btn btn-info"}>
                Continue Shopping
              </Link>
            </>
          )}
        </div>

        {/* adon product modal  */}
        <div
          id="myModal"
          className="custom-modal2 "
          style={{
            display: adonProductModel ? "block" : "none",
          }}
        >
          <div className="custom-modal2-content">
            <span
              className="custom-modal2-close"
              onClick={() => {
                setAdonProductModel(false);
                history.push("/checkout");
              }}
            >
              &times;
            </span>

            <h5 className="mb-3">SELECT ADD ONS PPRODUCTS</h5>

            {/* Products List */}
            <div className="row">
              <Slider {...adonSliderSetting}>
                {adonProducts.map((product, index) => {
                  return (
                    <div className="col-md-3 col-6 pb-2" key={`adon-${index}`}>
                      <div className="card bg-white shadow-sm py-2 addon-card-pro">
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
                                  className="d-flex justify-content-between mt-2"
                                  style={{ width: "140px", margin: "auto" }}
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
                                        (value) =>
                                          value.productId == product._id
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
              </Slider>

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
                    {adonCart.length
                      ? "CONTINUE WITH ADD ONS"
                      : "CONTINUE WITHOUT ADD ONS"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update product modal */}
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
              {productLoaded ? (
                <div className="row">
                  <div className="col-md-6 col-sm-12 col-xs-12 mb-md-0 mb-sm-5">
                    <div className="detail-gallery">
                      {/* <span className="zoom-icon">
                      <i className="fa fa-search"></i>
                    </span> */}
                      {/* <div className="product-image-slider">
                      <figure className="border-radius-10"></figure>
                    </div> */}

                      <div className="slider-thumbnails">
                        <div className="p-2">
                          <img
                            onClick={(evt) => {
                              "setSliderDefaultImage(img.url);";
                            }}
                            // key={index}
                            src={product.defaultImage}
                            alt="product image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="detail-info pr-30 pl-30">
                      <h3 className="title-detail">
                        <Link
                          to={`/product/${product.slug}`}
                          className="text-heading"
                        >
                          {product.name}
                        </Link>
                      </h3>

                      <div className="clearfix product-price-cover">
                        <div className="product-price primary-color float-left">
                          <span className="current-price text-brand">
                            <i className="fa fa-inr"></i>
                            {price.sellingPrice}
                          </span>
                          <span>
                            <span className="save-price font-md color3 ml-15">
                              {Math.round(
                                100 - (price.sellingPrice * 100) / price.mrp
                              )}{" "}
                              % OFF
                            </span>
                            <span className="old-price font-md ml-15">
                              <i className="fa fa-inr"></i>
                              {price.mrp}
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
                            {product.priceVariants.map(
                              (priceVarient, index) => {
                                return (
                                  <li
                                    className="mr-5"
                                    key={`priceVarient-${index + 1}`}
                                  >
                                    <img
                                      style={{ height: "60px", width: "60px" }}
                                      src={product.defaultImage}
                                    />
                                    <a
                                      style={{
                                        background:
                                          price.mrp == priceVarient.mrp
                                            ? "#81391d"
                                            : "",
                                        color:
                                          price.mrp == priceVarient.mrp
                                            ? "#fff"
                                            : "",
                                      }}
                                      onClick={(evt) => {
                                        evt.preventDefault();
                                        setPrice({ ...price, ...priceVarient });
                                      }}
                                    >
                                      {priceVarient.weight}
                                    </a>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
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
                          <button
                            // onClick={addToWishlistHandler}
                            onClick={() => {
                              updateProductOnCartHandler(product.productId);
                            }}
                            type="submit"
                            className="button button-add-to-cart"
                          >
                            <i className="fa fa-shopping-cart"></i>Update Cart
                          </button>
                        </div>
                      </div>
                      <div className="font-xs">
                        <ul>
                          {/* <li className="mb-5">
                        Color:{" "}
                        <span className="text-brand">{product.color.name}</span>
                      </li> */}
                          {/* <li className="mb-5">
                          Shape:
                          <span className="text-brand">
                            {" "}
                            {product.shape.name}
                          </span>
                        </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div
                    className="col-md-12 justify-content-center d-flex align-items-center"
                    style={{ minHeight: "150px" }}
                  >
                    <Spinner />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </main>
      <Footer />
    </>
  );
};

export default ShoppingCart;
