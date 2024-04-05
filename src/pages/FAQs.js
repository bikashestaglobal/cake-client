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

const FAQs = ({ navigation }) => {
  const scrollRef = useRef(null);
  const { state, dispatch } = useContext(CustomerContext);

  // Scroll to view

  // useEffect(() => {
  //   if (scrollRef?.current) {
  //     scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, []);

  return (
    <>
      {/* <Header /> */}
      <main class="main pages" style={{ transform: "none" }} ref={scrollRef}>
        <div class="page-header breadcrumb-wrap">
          <div class="container">
            <div class="breadcrumb">
              <Link to="/">
                <i className="fa fa-home mr-5"></i>Home
              </Link>
              <span></span> Frequently Asked Questions
            </div>
          </div>
        </div>
        <div class="page-content pt-50" style={{ transform: "none" }}>
          <div class="container" style={{ transform: "none" }}>
            <div class="row" style={{ transform: "none" }}>
              <div
                class="col-xl-12 col-lg-12 m-auto"
                style={{ transform: "none" }}
              >
                <div class="row" style={{ transform: "none" }}>
                  <div class="col-lg-10 m-auto">
                    <div class="single-page pr-30 mb-lg-0 mb-sm-5">
                      <div class="single-header style-2">
                        <h2>Frequently Asked Questions</h2>
                        {/* <div class="entry-meta meta-1 meta-3 font-xs mt-15 mb-15">
                          <span class="post-by">
                            By <a href="#">The Cake Inc</a>
                          </span>
                          <span class="post-on has-dot">20 June 2023</span>
                          <span class="time-reading has-dot">8 mins read</span>
                          <span class="hit-count has-dot">29k Views</span>
                        </div> */}
                      </div>

                      <div className="mb-40">
                        <div class="accordion" id="accordionExample">
                          {/* 1. How do you ask for a cake order? */}
                          <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                              <button
                                class="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="true"
                                aria-controls="collapseOne"
                              >
                                1. How do you ask for a cake order?
                              </button>
                            </h2>
                            <div
                              id="collapseOne"
                              class="accordion-collapse collapse show"
                              aria-labelledby="headingOne"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body">
                                <p>
                                  At The Cake Inc, we've made it easy and
                                  convenient to
                                  <strong> order cakes online. </strong> Request
                                  the cake you want by following these simple
                                  instructions:
                                </p>
                                <ul
                                  style={{
                                    listStyleType: "disc",
                                    listStylePosition: "inside",
                                  }}
                                >
                                  <li>
                                    Visit our website at www.thecakeinc.com and
                                    go to <strong>Order Now</strong> or{" "}
                                    <strong>Cake Catalog.</strong>
                                  </li>
                                  <li>
                                    Browse our wide selection of cakes,
                                    categorized by occasion, taste and design.
                                  </li>
                                  <li>
                                    Take the time to explore the options and
                                    choose the perfect cake that suits your
                                    preferences.
                                  </li>
                                  <li>
                                    Once you've found a cake you like, click on
                                    it to see more details, including size,
                                    flavor and customization options.
                                  </li>
                                  <li>
                                    If you want to personalize your cake, such
                                    as adding a name or a special message, you
                                    can specify this information in the
                                    personalization section.
                                  </li>
                                  <li>
                                    Choose the quantity and size of the cake
                                    according to your needs.
                                  </li>
                                  <li>
                                    We offer different portion sizes for
                                    different groups.
                                  </li>
                                  <li>
                                    Click the "Add to Cart" button to add the
                                    cake to your cart.
                                  </li>
                                  <li>
                                    Once you have selected all the cakes you
                                    need, go to the payment page by clicking on
                                    the shopping icon.
                                  </li>
                                  <li>
                                    Check the order summary on the payment page
                                    to make sure everything is correct.
                                  </li>
                                  <li>
                                    You can also use promotional codes or
                                    discounts if possible.
                                  </li>
                                  <li>
                                    Enter the required delivery information,
                                    including the date, time and location where
                                    you would like the cake delivered.
                                  </li>
                                  <li>
                                    We provide delivery services all over
                                    Kolkata for your convenience.
                                  </li>
                                  <li>
                                    Enter your contact information, including
                                    your name, phone number and email address.
                                    This is how we can communicate with you
                                    about your order.
                                  </li>
                                  <li>
                                    Finally, choose your preferred payment
                                    method and make the payment securely through
                                    our encrypted system.
                                  </li>
                                </ul>
                                <p>
                                  Once your cake order has been successfully
                                  placed, you will receive an order confirmation
                                  via email with all the necessary information.
                                  Our team will carefully prepare your cake,
                                  ensuring it meets our high standards of
                                  quality and taste.
                                </p>
                                <p>
                                  On the scheduled delivery date and time, your
                                  delicious cake will be delivered to your
                                  chosen location in Kolkata. If you have any
                                  further questions or need help ordering a
                                  cake, please contact our customer support
                                  team. We are always ready to help you create a
                                  memorable cake experience with The Cake Inc.
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* 2. What is the cost per slice of a wedding cake? */}
                          <div class="accordion-item">
                            <h2 class="accordion-header" id="headingTwo">
                              <button
                                class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                              >
                                2. What is the cost per slice of a wedding cake?
                              </button>
                            </h2>
                            <div
                              id="collapseTwo"
                              class="accordion-collapse collapse"
                              aria-labelledby="headingTwo"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body">
                                <p>
                                  The cost per slice of a
                                  <strong> wedding cake </strong> depends upon
                                  many factors, such as the design complexity,
                                  the ingredients used, the customization level,
                                  and the reputation of the bakery. To get an
                                  accurate idea of the exact price, get in touch
                                  with us through call or text.
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* 3. How big is a 500-gram cake? */}
                          <div class="accordion-item">
                            <h2 class="accordion-header" id="headingThree">
                              <button
                                class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                3. How big is a 500-gram cake?
                              </button>
                            </h2>
                            <div
                              id="collapseThree"
                              class="accordion-collapse collapse"
                              aria-labelledby="headingThree"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body">
                                <p>
                                  The size of a <strong> 500-gram cake </strong>
                                  can vary according to the type and model of
                                  the cake. In general, a 500-gram cake is
                                  usually a smaller cake that is suitable for
                                  about 4-6 people. Exact measurements and
                                  servings may vary depending on factors such as
                                  cake shape (round, square, etc.) and desired
                                  serving size.
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* 4. What is the size of a 300-gram cake? */}
                          <div class="accordion-item">
                            <h2 class="accordion-header" id="headingFour">
                              <button
                                class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseFour"
                                aria-expanded="false"
                                aria-controls="collapseFour"
                              >
                                4. What is the size of a 300-gram cake?
                              </button>
                            </h2>
                            <div
                              id="collapseFour"
                              class="accordion-collapse collapse"
                              aria-labelledby="headingFour"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body">
                                <p>
                                  The size of a <strong> 300-gram cake </strong>
                                  can vary according to the type and design of
                                  the cake. However, in general, a
                                  <strong> 300-gram cake </strong> is usually
                                  considered a small cake that serves about 2-4
                                  people. Exact measurements and servings may
                                  vary depending on factors such as cake shape
                                  (round, square, etc.) and desired serving
                                  size.
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* 5. Which cake is tastier for a birthday? */}
                          <div class="accordion-item">
                            <h2 class="accordion-header" id="headingFive">
                              <button
                                class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseFive"
                                aria-expanded="false"
                                aria-controls="collapseFive"
                              >
                                5. Which cake is tastier for a birthday?
                              </button>
                            </h2>
                            <div
                              id="collapseFive"
                              class="accordion-collapse collapse"
                              aria-labelledby="headingFive"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body">
                                <p>
                                  You could check out our
                                  <strong> chocolate birthday cake </strong>
                                  which is usually the most ordered. However, as
                                  a general rule of thumb, you can go for any
                                  flavors you like, such as a
                                  <strong> black forest cake </strong>,
                                  <strong> chocolate butterscotch cake </strong>
                                  , <strong> red velvet birthday cake </strong>,
                                  , and a lot more.
                                </p>
                              </div>
                            </div>
                          </div>
                          {/*  6. What's trending in cakes? */}
                          <div class="accordion-item">
                            <h2 class="accordion-header" id="headingSix">
                              <button
                                class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseSix"
                                aria-expanded="false"
                                aria-controls="collapseSix"
                              >
                                6. What's trending in cakes?
                              </button>
                            </h2>
                            <div
                              id="collapseSix"
                              class="accordion-collapse collapse"
                              aria-labelledby="headingSix"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body">
                                <p>
                                  At <strong> The Cake Inc. </strong> , we pride
                                  ourselves on keeping up with the
                                  <strong> latest cake trends </strong> to bring
                                  you the most innovative and exciting options.
                                  Here are some of the current
                                  <strong> cake trends </strong> that are
                                  catching the attention of cake lovers:
                                </p>

                                <ul
                                  style={{
                                    listStyleType: "disc",
                                    listStylePosition: "inside",
                                  }}
                                >
                                  <li>
                                    <strong> Drip Cakes : </strong>
                                    <strong> Drip cakes in Kolkata </strong>
                                    have become very popular in recent years.
                                    These cakes have a beautiful cascading
                                    effect created by drops of decadent
                                    chocolate, caramel or colorful ganache.
                                    <strong> Falcon cakes </strong> add elegance
                                    and playfulness to any occasion.
                                  </li>

                                  <li>
                                    <strong> Geode Cakes : </strong>
                                    <strong> Geode cakes </strong> are inspired
                                    by the natural beauty of geode crystals.
                                    These cakes feature beautiful sugar or
                                    edible rock formations that resemble jewels,
                                    creating a mesmerizing and unique design.
                                    <strong> Geode cakes </strong> are perfect
                                    for adding glamor to a wedding or special
                                    event.
                                  </li>

                                  <li>
                                    <strong> Floral Patterns : </strong>
                                    <strong> Floral patterns on cakes </strong>
                                    are a timeless trend that is still popular
                                    today. From delicate handmade buttercream
                                    flowers to intricately shaped sugar flowers,
                                    floral patterns add elegance and natural
                                    beauty to any cake.
                                  </li>
                                  <li>
                                    <strong> Metallic Accents : </strong>
                                    <strong> Metallic accents </strong> like
                                    gold and silver add luxury to modern cakes.
                                    Edible metallic finishes including glitter
                                    dust, edible paint and edible gold leaf are
                                    used to create stunning metallic effects
                                    that enhance the overall look of the cake.
                                  </li>
                                  <li>
                                    <strong> Minimalist Cakes : </strong>
                                    <strong> Minimalist cakes </strong> are all
                                    about simplicity and clean lines. These
                                    cakes have an understated design, smooth
                                    finish and minimal decorations. The focus is
                                    on quality ingredients and expert
                                    craftsmanship, resulting in a refined and
                                    elegant cake.
                                  </li>
                                  <li>
                                    <strong>
                                      {" "}
                                      Whimsical and Novelty Cakes :
                                    </strong>
                                    <strong>
                                      {" "}
                                      Whimsical and novelty cakes{" "}
                                    </strong>{" "}
                                    are perfect for those who want to add a fun
                                    and playful element to their party. These
                                    cakes can be shaped like cartoons, animals
                                    or objects, and are often decorated with
                                    bright colors and creative designs.
                                  </li>
                                  <li>
                                    <strong>
                                      {" "}
                                      Custom and Personalized Cakes :
                                    </strong>
                                    Personalization and customization are
                                    becoming an increasingly popular trend.
                                    Customers are looking for cakes that reflect
                                    their individuality and unique preferences.
                                    <strong> Personalized cakes </strong> can
                                    include custom designs, monograms, names or
                                    even photo prints to create a truly unique
                                    cake.
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          {/* 7. How do I package my cake? */}
                          <div class="accordion-item">
                            <h2 class="accordion-header" id="headingSeven">
                              <button
                                class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseSeven"
                                aria-expanded="false"
                                aria-controls="collapseSeven"
                              >
                                7. How do I package my cake?
                              </button>
                            </h2>
                            <div
                              id="collapseSeven"
                              class="accordion-collapse collapse"
                              aria-labelledby="headingSeven"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body">
                                <p>
                                  When packing a cake, it is important to ensure
                                  its safe transport and preserve its
                                  appearance. <strong> The Cake Inc </strong>.
                                  offers useful guidelines for effective cake
                                  packaging:
                                </p>
                                <ul
                                  style={{
                                    listStyleType: "disc",
                                    listStylePosition: "inside",
                                  }}
                                >
                                  <li>
                                    <strong> Choose the right cake box </strong>{" "}
                                    Choose a sturdy and appropriately sized cake
                                    box that offers plenty of room for your cake
                                    without squeezing it.
                                  </li>
                                  <li>
                                    <strong> Prepare the box </strong> Line the
                                    bottom of the box with a non-slip mat or
                                    attach a non-slip bottom to prevent the cake
                                    from sliding during transport.
                                  </li>
                                  <li>
                                    <strong> To secure the cake board </strong>{" "}
                                    Place the cake on a sturdy cake board
                                    appropriate for its size. Use a dab of cold
                                    or non-toxic glue to attach the cake plate
                                    to the bottom of the box.
                                  </li>
                                  <li>
                                    <strong> Cake Padding </strong> You can
                                    prevent the cake from moving or getting
                                    damaged by bubble or foam padding around the
                                    edges of the cake tin. This extra padding
                                    provides stability and protection during
                                    transport.
                                  </li>
                                  <li>
                                    <strong> Closing the box </strong> Close the
                                    cake box carefully and make sure it is
                                    tightly closed. You can use tape or cake box
                                    closures to keep the box intact. Label the
                                    box: Clearly label the box "Fragile" or
                                    "Handle with care" to alert handlers to the
                                    sensitive contents inside.
                                  </li>
                                  <li>
                                    <strong> Keep the cake cool </strong> If the
                                    weather is hot, consider placing an ice pack
                                    or cool gel pack next to the cake box to
                                    keep it fresh during transport.
                                  </li>
                                  <li>
                                    <strong> Transport caution: </strong> When
                                    transporting the cake, keep the box
                                    horizontal and avoid sudden movements or
                                    tilting, which could damage the cake. Place
                                    the box on a flat surface in the vehicle and
                                    secure it to prevent it from sliding.
                                  </li>
                                </ul>

                                <p>
                                  Remember that it is always best to transport
                                  cakes in a cool, air-conditioned environment
                                  to avoid possible melting or damage. If you
                                  are unsure about packing your cake, our team
                                  at <strong> The Cake Inc </strong> can offer
                                  professional packing services to ensure your
                                  cake arrives safely and in perfect condition.
                                </p>

                                <p>
                                  For more detailed instructions or specific
                                  packaging recommendations, we recommend
                                  visiting our website to
                                  <strong> order cakes online </strong> or
                                  contacting our customer support team. We will
                                  help you pack the cake carefully so that the
                                  cake is smooth and pleasant.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

export default FAQs;
