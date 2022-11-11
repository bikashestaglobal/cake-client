import React, { useContext, useState } from "react";
import Rating from "react-rating";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const AddReview = ({ product, callBack }) => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const [review, setReview] = useState({
    rating: 0,
    message: "",
  });

  const submitHandler = (evt) => {
    evt.preventDefault();

    const { jwtToken } = state;
    if (!jwtToken) {
      toast.success("To make review Need Loging !!");
      history.push("/account/login");
      return;
    }

    const newData = {
      rating: review.rating,
      message: review.message,
      product: product,
    };

    fetch(`${Config.SERVER_URL}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.jwtToken}`,
      },
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then((value) => {
        if (value.status == 200) {
          toast.success(value.message);
          callBack(value.body);
          setReview({
            rating: 0,
            message: "",
          });
        } else {
          toast.error(value.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="comment-form">
      <h4 className="mb-15">Add a review</h4>
      <Rating
        onChange={(value) => {
          setReview({ ...review, rating: value });
        }}
        emptySymbol="fa fa-star-o fa-1x"
        fullSymbol="fa fa-star fa-1x text-danger"
        initialRating={review.rating}
      />

      <div className="row">
        <div className="col-lg-8 col-md-12">
          <form
            className="form-contact comment_form"
            action="#"
            id="commentForm"
            onSubmit={submitHandler}
          >
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <textarea
                    className="form-control w-100"
                    name="comment"
                    id="comment"
                    cols="30"
                    value={review.message}
                    onChange={(evt) =>
                      setReview({ ...review, message: evt.target.value })
                    }
                    rows="9"
                    placeholder="Write Comment"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="button button-contactForm">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
