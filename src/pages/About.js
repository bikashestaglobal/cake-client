import React, { useEffect, useState, useContext, useRef } from "react";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import Config from "../config/Config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Slider from "react-slick";
import SubscribeContainer from "../components/SubscribeContainer";

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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
                      src="/assets/imgs/page/login-1.png"
                      alt=""
                      className="border-radius-15 mb-md-3 mb-lg-0 mb-sm-4"
                    />
                  </div>
                  <div className="col-lg-6">
                    <div className="pl-25">
                      <h2 className="mb-30">Welcome to The Cake Inc</h2>
                      <p className="mb-25">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate id est laborum.
                      </p>
                      <p className="mb-50">
                        Ius ferri velit sanctus cu, sed at soleat accusata.
                        Dictas prompta et Ut placerat legendos interpre.Donec
                        vitae sapien ut libero venenatis faucibus. Nullam quis
                        ante Etiam sit amet orci eget. Quis commodo odio aenean
                        sed adipiscing. Turpis massa tincidunt dui ut ornare
                        lectus. Auctor elit sed vulputate mi sit amet. Commodo
                        consequat. Duis aute irure dolor in reprehenderit in
                        voluptate id est laborum.
                      </p>
                      {/* carausel */}
                      <div className="about-carausel">
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
                      </div>
                    </div>
                  </div>
                </section>

                <section className="row align-items-center mb-50">
                  <div className="row mb-50 align-items-center">
                    <div className="col-lg-7 pr-30">
                      <img
                        src="/assets/imgs/page/login-1.png"
                        alt=""
                        className="mb-md-3 mb-lg-0 mb-sm-4"
                      />
                    </div>
                    <div className="col-lg-5">
                      <h4 className="mb-20 text-muted">Our performance</h4>
                      <h1 className="heading-1 mb-40">
                        Your Partner for e-commerce grocery solution
                      </h1>
                      <p className="mb-30">
                        Ed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto
                      </p>
                      <p>
                        Pitatis et quasi architecto beatae vitae dicta sunt
                        explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                        aspernatur aut odit aut fugit, sed quia
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 pr-30 mb-md-5 mb-lg-0 mb-sm-5">
                      <h3 className="mb-30">Who we are</h3>
                      <p>
                        Volutpat diam ut venenatis tellus in metus. Nec dui nunc
                        mattis enim ut tellus eros donec ac odio orci ultrices
                        in. ellus eros donec ac odio orci ultrices in.
                      </p>
                    </div>
                    <div className="col-lg-4 pr-30 mb-md-5 mb-lg-0 mb-sm-5">
                      <h3 className="mb-30">Our history</h3>
                      <p>
                        Volutpat diam ut venenatis tellus in metus. Nec dui nunc
                        mattis enim ut tellus eros donec ac odio orci ultrices
                        in. ellus eros donec ac odio orci ultrices in.
                      </p>
                    </div>
                    <div className="col-lg-4">
                      <h3 className="mb-30">Our mission</h3>
                      <p>
                        Volutpat diam ut venenatis tellus in metus. Nec dui nunc
                        mattis enim ut tellus eros donec ac odio orci ultrices
                        in. ellus eros donec ac odio orci ultrices in.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SubscribeContainer />
      {/* <Footer /> */}
    </>
  );
};

export default About;
