import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Config from "../config/Config";
import Footer from "../layouts/Footer";

const Contact = () => {
  const [contactDetails, setContactDetails] = useState({});
  const [contactDetailsLoading, setContactDetailsLoading] = useState(true);

  const [expCentres, setExpCentres] = useState([]);
  const [expCentresLoading, setExpCentresLoading] = useState(true);

  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
    purpose: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
    evt.preventDefault();

    fetch(Config.SERVER_URL + "/inquiries", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            toast.success(result.message);
            setFormData({
              name: "",
              email: "",
              message: "",
              purpose: "",
              mobile: "",
            });
          } else {
            const errorKeys = Object.keys(result.error);
            errorKeys.forEach((key) => {
              toast.error(result.error[key]);
            });
            toast.error(result.message);
          }
          setIsAddLoaded(true);
        },
        (error) => {
          setIsAddLoaded(true);
          toast.error(error);
        }
      );
  };

  // Get Contact Us details
  useEffect(() => {
    setContactDetailsLoading(true);
    fetch(`${Config.SERVER_URL}/setting/`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setContactDetailsLoading(false);
        if (data.status == 200) {
          setContactDetails(data?.body?.contactUs || {});
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setContactDetailsLoading(false);
        toast.warning(error);
      });
  }, []);

  // Scroll To Top

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
      {/*====================  breadcrumb area ====================*/}

      {/*====================  End of breadcrumb area  ====================*/}
      {/*====================  page content area ====================*/}
      <main className="main pages">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/" rel="nofollow">
                <i className="fa fa-home mr-5"></i>Home
              </Link>
              <span></span> Contact
            </div>
          </div>
        </div>
        <div className="page-content pt-50">
          <section className="container mb-50 d-none d-md-block">
            <div className="border-radius-15 overflow-hidden">
              <div id="">
                <iframe
                  src={`${contactDetails.googleMapUrl}`}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>
          <div className="container">
            <div className="row">
              <div className="col-xl-10 col-lg-12 m-auto">
                <section className="mb-50">
                  <div className="row">
                    <div className="col-xl-8">
                      <div className="contact-from-area padding-20-row-col">
                        <h5 className="text-brand mb-10">Contact form</h5>
                        <h2 className="mb-10">Drop Us a Line</h2>
                        <p className="text-muted mb-30 font-sm">
                          Your email address will not be published. Required
                          fields are marked *
                        </p>
                        <form
                          className="contact-form-style mt-30"
                          id="contact-form"
                          action="#"
                          method="post"
                          onSubmit={submitHandler}
                        >
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="input-style mb-20">
                                <input
                                  name="name"
                                  placeholder="First Name"
                                  type="text"
                                  onChange={(evt) =>
                                    setFormData({
                                      ...formData,
                                      name: evt.target.value,
                                    })
                                  }
                                  value={formData.name}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="input-style mb-20">
                                <input
                                  name="email"
                                  placeholder="Your Email"
                                  type="email"
                                  onChange={(evt) =>
                                    setFormData({
                                      ...formData,
                                      email: evt.target.value,
                                    })
                                  }
                                  value={formData.email}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="input-style mb-20">
                                <input
                                  name="telephone"
                                  placeholder="Your Phone"
                                  type="tel"
                                  onChange={(evt) =>
                                    setFormData({
                                      ...formData,
                                      mobile: evt.target.value,
                                    })
                                  }
                                  value={formData.mobile}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="input-style mb-20">
                                <input
                                  name="subject"
                                  placeholder="Subject"
                                  type="text"
                                  onChange={(evt) =>
                                    setFormData({
                                      ...formData,
                                      purpose: evt.target.value,
                                    })
                                  }
                                  value={formData.purpose}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="textarea-style mb-30">
                                <textarea
                                  name="message"
                                  placeholder="Message"
                                  onChange={(evt) =>
                                    setFormData({
                                      ...formData,
                                      message: evt.target.value,
                                    })
                                  }
                                  value={formData.message}
                                ></textarea>
                              </div>
                              <button
                                disabled={!isAddLoaded}
                                id="submit-auto-width"
                                className="submit submit-auto-width"
                                type="submit"
                              >
                                {isAddLoaded
                                  ? "Send message"
                                  : "Wait Loading..."}
                              </button>
                            </div>
                          </div>
                        </form>
                        <p className="form-messege"></p>
                      </div>
                    </div>
                    <div className="col-lg-4 pl-50 d-lg-block d-none">
                      <div className="addDtl">
                        <h4 className="mb-15 text-brand">Office</h4>
                        <p>
                          <i className="fa fa-map" aria-hidden="true"></i>
                          {contactDetails?.address}
                          {/* <br />
                          Chicago, 60601, USA
                          <br /> */}
                        </p>
                        <p>
                          <abbr title="Phone">
                            <i className="fa fa-phone" aria-hidden="true"></i>
                            Phone:{" "}
                          </abbr>
                          <a href={`tel:${contactDetails.mobile}`}>
                            {contactDetails.mobile}
                          </a>
                          <br />
                        </p>
                        <p>
                          <abbr title="Email">
                            <i
                              className="fa fa-envelope"
                              aria-hidden="true"
                            ></i>
                            Email:{" "}
                          </abbr>
                          <a href={`mailto:${contactDetails.email}`}>
                            {contactDetails.email}
                          </a>
                          <br />
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {/*====================  End of page content area  ====================*/}
      {/*====================  newsletter area ====================*/}
    </>
  );
};

export default Contact;
