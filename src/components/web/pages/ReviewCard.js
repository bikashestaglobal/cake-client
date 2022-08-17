import React, { useState, useEffect } from "react";

import date from "date-and-time";
import Rating from "react-rating";

const ReviewCard = ({ reviews = [] }) => {
  const [avgRating, setAvgRating] = useState(0);
  const [ratings, setRatings] = useState({
    fiveStar: "",
    fourStar: "",
    threeStar: "",
    twoStar: "",
    oneStar: "",
  });

  useEffect(() => {
    calculateAvarageRating();
    countRating(5, "fiveStar");
    countRating(4, "fourStar");
    countRating(3, "threeStar");
    countRating(2, "twoStar");
    countRating(1, "oneStar");
  }, [reviews]);

  const calculateAvarageRating = () => {
    const totalRating = reviews
      .map((item) => item.rating)
      .reduce((prev, next) => prev + next);
    setAvgRating((totalRating / reviews.length).toFixed(1));
  };

  const countRating = (star, key) => {
    const count = reviews.filter((review) => review.rating == star).length;
    const percentage = ((count * 100) / reviews.length).toFixed(1);

    setRatings((old) => {
      return { ...old, [key]: percentage };
    });
  };

  return (
    <div className="comments-area">
      <div className="row">
        <div className="col-lg-8">
          <h4 className="mb-30">Customer questions & answers</h4>
          <div className="comment-list">
            {reviews.map((review) => {
              return (
                <div className="single-comment justify-content-between d-flex">
                  <div className="user justify-content-between d-flex">
                    <div className="thumb text-center">
                      <img src="assets/imgs/blog/author-4.png" alt={"image"} />
                      <a href="#" className="font-heading text-brand">
                        {review.customer.name}
                      </a>
                    </div>
                    <div className="desc">
                      <div className="d-flex justify-content-between mb-10">
                        <div className="d-flex align-items-center">
                          <span className="font-xs text-muted">
                            {date.format(
                              new Date(review.createdAt),
                              "MMM, DD, YYYY hh:mm A"
                            )}
                          </span>
                        </div>
                        <div className="d-inline-block">
                          <Rating
                            emptySymbol="fa fa-star-o fa-1x"
                            fullSymbol="fa fa-star fa-1x text-danger"
                            readonly
                            initialRating={review.rating}
                          />
                        </div>
                      </div>
                      <p className="mb-10">
                        {review.message}
                        {/* <a href="#" className="reply">
                          Reply
                        </a> */}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* reply */}
            {/* <div className="single-comment justify-content-between d-flex mb-30 ml-30">
              <div className="user justify-content-between d-flex">
                <div className="thumb text-center">
                  <img src="assets/imgs/blog/author-3.png" alt={"image"} />
                  <a href="#" className="font-heading text-brand">
                    Brenna
                  </a>
                </div>
                <div className="desc">
                  <div className="d-flex justify-content-between mb-10">
                    <div className="d-flex align-items-center">
                      <span className="font-xs text-muted">
                        December 4, 2021 at 3:12 pm
                      </span>
                    </div>
                    <div className="product-rate d-inline-block">
                      <div
                        className="product-rating"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>
                  <p className="mb-10">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Delectus, suscipit exercitationem accusantium obcaecati quos
                    voluptate nesciunt facilis itaque modi commodi dignissimos
                    sequi repudiandae minus ab deleniti totam officia id
                    incidunt?
                    <a href="#" className="reply">
                      Reply
                    </a>
                  </p>
                </div>
              </div>
            </div> */}

            {/* <div className="single-comment justify-content-between d-flex">
              <div className="user justify-content-between d-flex">
                <div className="thumb text-center">
                  <img src="assets/imgs/blog/author-4.png" alt={"image"} />
                  <a href="#" className="font-heading text-brand">
                    Gemma
                  </a>
                </div>
                <div className="desc">
                  <div className="d-flex justify-content-between mb-10">
                    <div className="d-flex align-items-center">
                      <span className="font-xs text-muted">
                        December 4, 2021 at 3:12 pm
                      </span>
                    </div>
                    <div className="product-rate d-inline-block">
                      <div
                        className="product-rating"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>
                  <p className="mb-10">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Delectus, suscipit exercitationem accusantium obcaecati quos
                    voluptate nesciunt facilis itaque modi commodi dignissimos
                    sequi repudiandae minus ab deleniti totam officia id
                    incidunt?
                    <a href="#" className="reply">
                      Reply
                    </a>
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="col-lg-4">
          <h4 className="mb-30">Customer reviews</h4>
          <div className="d-flex mb-30">
            <div className="d-inline-block mr-15">
              {/* <div className="product-rating" style={{ width: "90%" }}></div> */}
              <Rating
                emptySymbol="fa fa-star-o fa-1x"
                fullSymbol="fa fa-star fa-1x text-danger"
                readonly
                initialRating={avgRating}
              />
            </div>
            <h6>{avgRating} out of 5</h6>
          </div>
          <div className="progress">
            <span>5 star</span>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${ratings.fiveStar || 0}%` }}
              aria-valuenow="50"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {ratings.fiveStar || "0%"}
            </div>
          </div>
          <div className="progress">
            <span>4 star</span>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${ratings.fourStar || 0}%` }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {ratings.fourStar || "0%"}%
            </div>
          </div>
          <div className="progress">
            <span>3 star</span>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${ratings.threeStar}%` }}
              aria-valuenow="45"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {ratings.threeStar}%
            </div>
          </div>
          <div className="progress">
            <span>2 star</span>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${ratings.twoStar || 0}%` }}
              aria-valuenow="65"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {ratings.twoStar || "0%"}%
            </div>
          </div>
          <div className="progress mb-30">
            <span>1 star</span>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${ratings.oneStar || 0}%` }}
              aria-valuenow="85"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {ratings.oneStar}%
            </div>
          </div>
          <a href="#" className="font-xs text-muted">
            How are ratings calculated?
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
