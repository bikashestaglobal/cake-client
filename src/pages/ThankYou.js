import React from "react";
import { Link, useHistory } from "react-router-dom";

const ThankYou = (state) => {
  const history = useHistory();
  const {
    location: {
      state: { orderId },
    },
  } = state;

  return (
    <div className="container-fluid text-center py-5">
      <header className="site-header" id="header">
        <h1
          className="site-header__title"
          data-lead-id="site-header-title"
          style={{ fontSize: "80px" }}
        >
          THANK YOU !
        </h1>
      </header>

      <div className="main-content">
        <i
          className="fa fa-check h1 text-info"
          id="checkmark"
          style={{ fontSize: "80px" }}
        ></i>
        <p className="main-content__body py-3" data-lead-id="main-content-body">
          Thanks a bunch for filling that out. It means a lot to us, just like
          you do! We really appreciate you giving us a moment of your time
          today. Thanks for being you.
        </p>
        <p>
          Your Order Id :{" "}
          <span className="badge bg-info text-light">{orderId || "N/A"}</span>{" "}
        </p>
        <Link
          onClick={(evt) => {
            evt.preventDefault();
            history.push(`/account/my-account/order/${orderId}`);
          }}
          className="btn btn-info"
          to={"/account/my-account/orders"}
        >
          Check My Order
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
