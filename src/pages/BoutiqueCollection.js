import React, { useEffect, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CustomerContext } from "../layouts/Routes";
import SubscribeContainer from "../components/SubscribeContainer";
import Footer from "../layouts/Footer";

const BoutiqueCollection = () => {
  const scrollRef = useRef(null);
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();

  // Scroll to view
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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
      {/* <Header /> */}
      <main ref={scrollRef} className="main pages">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">
                <i className="fa fa-home mr-5"></i>Home
              </Link>
              <span></span> Boutique Collection
            </div>
          </div>
        </div>
        <div className="page-content pt-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-10 col-lg-12 m-auto">
                <section className="row align-items-center mb-50">
                  <div className="col-lg-12 text-center">
                    <h1 className="">
                      Opening
                      <br />
                      Soon
                    </h1>
                    <p className="mt-40">
                      A mesmerizing realm awaits, where dreams come alive and
                      wonders unfold. Prepare for an unforgettable experience
                    </p>
                    <img
                      src="/assets/imgs/shop/sweet-chocolate-cake-with-cherry.jpg"
                      alt="Welcome"
                      className="border-radius-15 mb-md-3 mb-lg-0 mb-sm-4"
                    />

                    <div className="d-flex"></div>
                  </div>
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

export default BoutiqueCollection;
