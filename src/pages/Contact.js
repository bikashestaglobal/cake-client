import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Config from "../config/Config";
// import Loader from "../components/Loader";
import Header from "../layouts/Header";

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
    purpose: "product",
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
            setFormData({ name: "", email: "", message: "", purpose: "" });
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              toast.error(result.errors[key]);
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/main.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Get Contact Us details
  useEffect(() => {
    setContactDetailsLoading(true);
    fetch(`${Config.SERVER_URL}/settings/`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setContactDetailsLoading(false);
        if (data.status == 200) {
          setContactDetails(data.body.contactUs || {});
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* <Header /> */}
      {/*====================  breadcrumb area ====================*/}

      {/*====================  End of breadcrumb area  ====================*/}
      {/*====================  page content area ====================*/}
      <div className="page-content-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/*=======  page wrapper  =======*/}
              <div className="page-wrapper">
                <div className="page-content-wrapper">
                  {/*=============================================
                    =            google map container         =
                    =============================================*/}

                  <div className="google-map-container">
                    <div id="google-map">
                      <iframe
                        src={
                          contactDetails.googleMapUrl ||
                          "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6173744.205570939!2d82.24481834291522!3d20.903283504650048!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xe4e50a1d1e293926!2sFerra%20Indica!5e0!3m2!1sen!2sin!4v1662980796958!5m2!1sen!2sin"
                        }
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>

                  {/*=====  End of google map container  ======*/}

                  <div className="row">
                    <div className="col-lg-5 offset-lg-1 col-md-12 order-1 order-lg-2">
                      {/*=======  contact page side content  =======*/}

                      <div className="contact-page-side-content">
                        <h3 className="contact-page-title">Contact Us</h3>
                        <p className="contact-page-message">
                          {contactDetails.address}
                        </p>
                        {/*=======  single contact block  =======*/}

                        <div className="single-contact-block">
                          <h4>
                            <i className="fa fa-fax"></i> Address
                          </h4>
                          <p>{contactDetails.address || ""}</p>
                        </div>

                        {/*=======  End of single contact block  =======*/}

                        {/*=======  single contact block  =======*/}

                        <div className="single-contact-block">
                          <h4>
                            <i className="fa fa-phone"></i> Phone
                          </h4>
                          <p>
                            Mobile :{" "}
                            <a href={`tel:${contactDetails.mobile}`}>
                              {contactDetails.mobile}
                            </a>
                          </p>
                          <p>
                            Customer Support :{" "}
                            <a
                              href={`tel:${contactDetails.customerCareNumber}`}
                            >
                              {contactDetails.customerCareNumber}
                            </a>
                          </p>
                        </div>

                        {/*=======  End of single contact block  =======*/}

                        {/*=======  single contact block  =======*/}

                        <div className="single-contact-block">
                          <h4>
                            <i className="fa fa-envelope-o"></i> Email
                          </h4>
                          <p>
                            <a href={`mailto:${contactDetails.email}`}>
                              {" "}
                              {contactDetails.email}{" "}
                            </a>
                          </p>
                          <p>
                            <a href={`mailto:${contactDetails.supportEmail}`}>
                              {" "}
                              {contactDetails.supportEmail}{" "}
                            </a>
                          </p>
                        </div>

                        {/*=======  End of single contact block  =======*/}
                      </div>

                      {/*=======  End of contact page side content  =======*/}
                    </div>
                    <div className="col-lg-6 col-md-12 order-2 order-lg-1">
                      {/*=======  contact form content  =======*/}

                      <div className="contact-form-content">
                        <h3 className="contact-page-title">
                          Tell Us Your Message
                        </h3>

                        <div className="contact-form">
                          <form
                            id="contact-form"
                            action="http://hasthemes.com/file/mail.php"
                            method="post"
                            onSubmit={submitHandler}
                          >
                            <div className="form-group">
                              <label>
                                Your Name <span className="required">*</span>
                              </label>
                              <input
                                type="text"
                                name="con_name"
                                id="con_name"
                                value={formData.name}
                                onChange={(evt) => {
                                  setFormData({
                                    ...formData,
                                    name: evt.target.value,
                                  });
                                }}
                              />
                            </div>

                            <div className="form-group">
                              <label>
                                Your Mobile <span className="required">*</span>
                              </label>
                              <input
                                type="tel"
                                name="con_email"
                                id="con_email"
                                value={formData.mobile}
                                onChange={(evt) => {
                                  setFormData({
                                    ...formData,
                                    mobile: evt.target.value,
                                  });
                                }}
                              />
                            </div>

                            <div className="form-group">
                              <label>
                                Your Email <span className="required">*</span>
                              </label>

                              <input
                                type="email"
                                name="con_email"
                                id="con_email"
                                value={formData.email}
                                onChange={(evt) => {
                                  setFormData({
                                    ...formData,
                                    email: evt.target.value,
                                  });
                                }}
                              />
                            </div>

                            <div className="form-group">
                              <label>Inquiry Purpose</label>
                              {/* Single Product */}
                              <div
                                className="form-check form-check-inline"
                                style={{ width: "30%" }}
                              >
                                <input
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  className="form-check-input"
                                  type="radio"
                                  onChange={(evt) => {
                                    setFormData({
                                      ...formData,
                                      purpose: evt.target.value,
                                    });
                                  }}
                                  name="inquiryPurpose"
                                  id="inlineRadio1"
                                  value={"product"}
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio1"
                                  style={{ margin: "-7px 20px" }}
                                >
                                  Product
                                </label>
                              </div>

                              {/* Bulk Product */}
                              <div
                                className="form-check form-check-inline"
                                style={{ width: "30%" }}
                              >
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="inquiryPurpose"
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  id="inlineRadio2"
                                  onChange={(evt) => {
                                    setFormData({
                                      ...formData,
                                      purpose: evt.target.value,
                                    });
                                  }}
                                  value={"products"}
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio2"
                                  style={{ margin: "-7px 20px" }}
                                >
                                  Bulk Products
                                </label>
                              </div>

                              {/* Other */}
                              <div
                                className="form-check form-check-inline"
                                style={{ width: "30%" }}
                              >
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="inquiryPurpose"
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  id="other"
                                  onChange={(evt) => {
                                    setFormData({
                                      ...formData,
                                      purpose: evt.target.value,
                                    });
                                  }}
                                  value={"other"}
                                />
                                <label
                                  className="form-check-label"
                                  for="other"
                                  style={{ margin: "-7px 20px" }}
                                >
                                  Other
                                </label>
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Your Message</label>
                              <textarea
                                name="con_message"
                                id="con_message"
                                value={formData.message}
                                onChange={(evt) => {
                                  setFormData({
                                    ...formData,
                                    message: evt.target.value,
                                  });
                                }}
                              ></textarea>
                            </div>
                            <div className="form-group mb-0">
                              <button
                                type="submit"
                                value="submit"
                                id="submit"
                                className="contact-button"
                                name="submit"
                              >
                                {/* {isAddLoaded ? "Send" : <Loader />} */}
                              </button>
                            </div>
                          </form>
                        </div>
                        <p className="form-messege"></p>
                      </div>

                      {/*=======  End of contact form content =======*/}
                    </div>
                  </div>
                </div>
              </div>
              {/*=======  End of page wrapper  =======*/}
            </div>
          </div>
        </div>
      </div>
      {/*====================  End of page content area  ====================*/}
      {/*====================  newsletter area ====================*/}
    </>
  );
};

export default Contact;
