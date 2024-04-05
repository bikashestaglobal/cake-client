import React, { useContext, useState } from "react";
import Rating from "react-rating";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { reviewSchema } from "../yupSchemas";
import { validateText } from "../helpers/Validation";

const AddReview = ({ product, callBack }) => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    name: "",
    message: "",
  });

  const initialValues = {
    name: "",
    message: "",
  };

  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    setFieldError,
  } = useFormik({
    initialValues: initialValues,
    onSubmit: (values, helpers) => {
      const { jwtToken } = state;
      if (!jwtToken) {
        toast.success("To make review Need Login !!");
        history.push("/account/login");
        return;
      }

      setLoading(true);
      fetch(Config.SERVER_URL + "/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.jwtToken}`,
        },
        body: JSON.stringify({ ...values, rating: review.rating, product }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setLoading(false);

            if (result.status == 200) {
              // toast.success(result.message);
              toast.success(result.message);
              callBack(result.body);
              helpers.resetForm();
            } else {
              const error = result.error;
              if (error) helpers.setErrors(error);
              toast.error(result.message);
            }
          },
          (error) => {
            setLoading(false);
            toast.error(error.message);
          }
        );
    },
    validationSchema: reviewSchema,
  });

  const submitHandler = (evt) => {
    evt.preventDefault();

    const { jwtToken } = state;
    if (!jwtToken) {
      toast.success("To make review Need Login !!");
      history.push("/account/login");
      return;
    }

    const newData = {
      rating: review.rating,
      message: review.message,
      name: review.name,
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
          if (value?.error?.message) toast.error(value?.error?.message);
          if (value?.error?.rating) toast.error(value?.error?.rating);
          if (value?.error?.name) toast.error(value?.error?.name);
          toast.error(value.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleNameValidation = (event) => {
    // let value = event.target.value.replace(/[^a-zA-Z ]+|(?<= ) +/g, "");
    // event.target.value = value;
    handleChange(validateText(event));
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
            // onSubmit={submitHandler}
            onSubmit={handleSubmit}
          >
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={values.name}
                    placeholder="Enter your name"
                    onChange={handleNameValidation}
                    onBlur={handleBlur}
                  />
                  {errors.name && touched.name ? (
                    <p className={"mt-1"} style={{ color: "red" }}>
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control w-100"
                    name="message"
                    id="message"
                    cols="30"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="9"
                    placeholder="Write Comment"
                  ></textarea>
                  {errors.message && touched.message ? (
                    <p className={"mt-1 text-danger"} style={{ color: "red" }}>
                      {errors.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className="button button-contactForm"
              >
                {loading ? "Loading.." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
