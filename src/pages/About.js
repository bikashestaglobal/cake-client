import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import SubscribeContainer from "../components/SubscribeContainer";
import Footer from "../layouts/Footer";
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

var carauselSetting = {
  dots: false,
  infinite: true,
  autoPlay: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  swipeToSlide: true,
  initialSlide: 0,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const About = () => {
  const scrollRef = useRef(null);
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();

  // Scroll to view

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, []);

  return (
    <>
      {/* <Header /> */}

      <main ref={scrollRef} className="main pages">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">
                <i className="fa fa-home mr-5"></i>Home
              </Link>
              <span></span> About us
            </div>
          </div>
        </div>
        <div className="page-content pt-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-10 col-lg-12 m-auto">
                <section className="row align-items-center mb-50">
                  <div className="col-lg-6">
                    <img
                      src="/assets/imgs/page/about.jpg"
                      alt="About Us Image"
                      className="border-radius-15 mb-md-3 mb-lg-0 mb-sm-4"
                    />
                  </div>
                  <div className="col-lg-6">
                    <div className="pl-25">
                      <h2 className="mb-20">About Us</h2>
                      <h5 className="mb-15">
                        Welcome to The Cake Inc., Your Premier Destination for
                        Ordering Delectable Cakes in Kolkata!
                      </h5>
                      <p className="mb-15">
                        Hello folks! So your taste buds have finally compelled
                        you to <strong>order cakes online</strong>? Well,
                        congratulations then! We're here to satisfy your
                        cravings.
                      </p>
                      <p className="mb-15">
                        We know you're craving a mouth-watering
                        <strong> chocolate cake</strong>,
                        <strong> red velvet cake</strong>, and other exciting
                        flavors at affordable rates!
                      </p>
                      <p className="mb-15">
                        However, some of you want something completely
                        vegetarian. Additionally, many of you want a cake with
                        less sugar.
                      </p>
                      <p className="mb-15">
                        We've come up with a solution for all these preferences
                        of yours. Our bakers are experts in baking
                        <strong> customized cakes in Kolkata</strong>. Moreover,
                        we take care to add less sugar to our
                        <strong> designer cakes </strong> for those who're
                        health-conscious. Isn't it exciting? Great then!
                      </p>
                      <p className="mb-15">
                        Guess what we have baked for your binge meal? Yes, a
                        black forest cake and other appetizing intricacies!
                      </p>
                      <p className="mb-15">
                        We take immense pride in crafting unique and delectable
                        delicacies for your other functions too, such as a
                        <strong> wedding cake</strong>,{" "}
                        <strong> fresh cream birthday cake</strong>,{" "}
                        <strong> Valentine's special cake</strong>,{" "}
                        <strong> 3-tier engagement cake</strong>,{" "}
                        <strong> bachelor party cake</strong>,{" "}
                        <strong> company anniversary cake</strong>, and so on.
                      </p>

                      {/* carausel */}
                      {/* <div className="about-carausel">
                        <Slider {...carauselSetting}>
                          <div className="p-1">
                            <img
                              src="/assets/imgs/shop/product-1-1.jpg"
                              alt=""
                              className="slick-slide slick-cloned"
                              data-slick-index="-3"
                              id=""
                              aria-hidden="true"
                              style={{ width: "181px" }}
                              tabIndex="-1"
                            />
                          </div>
                          <div className="p-1">
                            <img
                              src="/assets/imgs/shop/product-1-1.jpg"
                              alt=""
                              className="slick-slide slick-cloned"
                              data-slick-index="-3"
                              id=""
                              aria-hidden="true"
                              style={{ width: "181px" }}
                              tabIndex="-1"
                            />
                          </div>
                          <div className="p-1">
                            <img
                              src="/assets/imgs/shop/product-1-1.jpg"
                              alt=""
                              className="slick-slide slick-cloned"
                              data-slick-index="-3"
                              id=""
                              aria-hidden="true"
                              style={{ width: "181px" }}
                              tabIndex="-1"
                            />
                          </div>
                          <div className="p-1">
                            <img
                              src="/assets/imgs/shop/product-1-1.jpg"
                              alt=""
                              className="slick-slide slick-cloned"
                              data-slick-index="-3"
                              id=""
                              aria-hidden="true"
                              style={{ width: "181px" }}
                              tabIndex="-1"
                            />
                          </div>
                        </Slider>
                      </div> */}
                    </div>
                  </div>
                  <p className="mb-15 mt-20">
                    Having been in the cake delivery business for a while now,
                    we now aim to expand pan India and bring a smile to the face
                    of all sweet lovers like you. Support us by trying out our{" "}
                    <strong> butterscotch cake design for kids</strong>,
                    <strong> retirement party cake</strong>,{" "}
                    <strong> heart-shaped cake</strong>, or whatever flavor and
                    design you like!
                  </p>
                  <p className="mb-15">
                    <Link to="/">
                      <strong>At The Cake Inc</strong>
                    </Link>
                    ., We perfectly understand the needs of dessert lovers.
                    Thus, every detail matters. That's why our bakers try hard
                    and fast to deliver appealing and mouth-watering{" "}
                    <strong>cakes online</strong> to not only make your day
                    special but also satisfy your taste buds!
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SubscribeContainer />
      <Footer />
    </>
  );
};

export default About;
