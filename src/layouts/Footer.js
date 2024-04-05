import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Config from "../config/Config";
import { CustomerContext } from "./Routes";
const Footer = ({ showContent = false, showBentoCakeContents = false }) => {
  const { state, dispatch } = useContext(CustomerContext);
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [contactUs, setContactUs] = useState({});
  const [socialLinks, setSocialLinks] = useState({});
  const [settings, setSettings] = useState({});

  // Get All Categories
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/parent-category?skip=0&limit=10`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setCategories(data.body);
        } else {
          console.log("Error Occured While loading category : header");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get Setting
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/setting`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setContactUs(data?.body?.contactUs);
          setSocialLinks(data?.body?.socialLinks);
          setSettings(data.body);
        } else {
          console.log("Error Occured While loading headers : setting");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get All Occasions
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/occasions?skip=0&limit=0`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setOccasions(data.body);
        } else {
          console.log("Error Occured While loading occasion : footer");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  // Get All Flavours
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/flavour?skip=0&limit=0`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setFlavours(data.body);
        } else {
          console.log("Error Occured While loading occasion : footer");
        }
      })
      .catch((error) => {
        console.error("Header Error:", error);
      });
  }, []);

  const signOutHandler = (evt) => {
    evt.preventDefault();
    localStorage.removeItem("customerInfo");

    dispatch({ type: "CLEAR" });
    history.push("/account/login");
  };

  return (
    <footer className="main">
      <section className="featured section-padding bgcolorD">
        <div className="container">
          <div className="row">
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 mb-md-4 mb-xl-0">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/boiled-egg.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">100% Eggless</h3>
                  {/* <p>Orders Rs1000 or more</p> */}
                </div>
              </div>
            </div>
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/pancake.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">100% Fresh Cream</h3>
                  {/* <p>24/7 amazing services</p> */}
                </div>
              </div>
            </div>
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/fast-delivery.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">Express Delivery</h3>
                  {/* <p>When you sign up</p> */}
                </div>
              </div>
            </div>
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/assortment.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">25K+ Smiles Delivered</h3>
                  {/* <p>Mega Discounts</p> */}
                </div>
              </div>
            </div>
            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/secure-payment.png" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">100% Secured Payments</h3>
                  {/* <p>Within 30 days</p> */}
                </div>
              </div>
            </div>
            {/* <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 d-xl-none">
              <div className="banner-left-icon d-flex align-items-center wow fadeIn animated">
                <div className="banner-icon">
                  <img src="/assets/imgs/theme/icons/icon-6.svg" alt="" />
                </div>
                <div className="banner-text">
                  <h3 className="icon-box-title">Safe delivery</h3>
                  <p>Within 30 days</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Static Contents for bento cake */}
      {showBentoCakeContents ? (
        <section className="FtrConent section-padding">
          <div className="container-fluid">
            <p className="mb-2">
              Welcome to The Cake Inc's <strong>Bento Cake</strong> Wonderland
              in Kolkata!
            </p>
            <p className="mb-2">Hey there, sweet tooth!</p>
            <p className="mb-2">
              We've got some exciting news to share - The Cake Inc. has just
              unveiled our latest obsession: <strong>Bento Cakes</strong>!
            </p>{" "}
            <p className="mb-2">
              Picture this: a magical blend of art, flavour, and a sprinkle of
              joy - all crafted just for you.
            </p>
            <h4 className="mb-3 mt-3">
              Step into the World of Bento Cake Design
            </h4>
            <p>
              Imagine a world where cakes aren't just desserts; they're edible
              masterpieces. Our <strong>Bento Cake designs</strong> are like
              little stories waiting to be told. From playful patterns to
              jaw-dropping colours, each creation is a canvas of sugary wonders
              that'll have you saying, "Is it even okay to eat something this
              beautiful?"
            </p>
            <h4 className="mb-3 mt-3">Mini Cakes for Maximum Happiness</h4>
            <p>
              Now, let's talk about our <strong>mini cake online</strong> -
              small wonders that pack a punch!
            </p>
            <p className="mb-2">
              Perfect for those moments when you crave a little sweetness
              without the fuss. Birthdays, celebrations, or just a Tuesday - our{" "}
              <strong>Mini Cakes</strong> are here to turn any day into a party.
            </p>
            <h4 className="mb-3 mt-3">A Mini Birthday Cake to Remember</h4>
            <p>Birthdays are special, right?</p>
            <p className="mb-2">
              That's why we've crafted the most adorable Mini Birthday Cakes.
              They may be small in size, but they're big on making memories.
              Personalized with love and baked with a dash of nostalgia, our{" "}
              <strong>Mini Birthday Cakes</strong> are designed to be the star
              of the celebration.
            </p>
            <h4 className="mb-3 mt-3">
              Order Bento Cake Online - Because Convenience is King
            </h4>
            <p>
              We get it; life can be a bit hectic. That's why we've made it
              super easy to bring the Bento magic to your doorstep. Browse our
              collection, click a few buttons, and voila - your{" "}
              <strong>Bento Cake</strong> is on its way to sweeten your day!
            </p>
            <h4 className="mb-3 mt-3">
              Order Bento Valentine's Cake - Because Love Deserves a Sweet
              Celebration
            </h4>
            <p>
              Love is sweet, and so are our{" "}
              <strong>Bento Valentine's Cakes</strong>! Surprise your sweetheart
              with a gesture that's as unique as your love story. Order{" "}
              <strong>Bento Valentine's Cakes</strong> online and let the
              romance unfold one delicious bite at a time. Check out our{" "}
              <strong>Valentine's Cake Designs</strong>.
            </p>
            <h4 className="mb-3 mt-3">
              Bento Cake Price - Because Everyone Deserves a Slice of Happiness
            </h4>
            <p>
              Good news - indulgence doesn't have to break the bank! Our{" "}
              <strong>Bento Cakes</strong> come with a price tag that won't make
              your wallet cry. At The Cake Inc., we believe everyone deserves a
              slice of happiness without the guilt.
            </p>
            <h4>
              Order Bento Cake Online in Kolkata - Where the Magic Happens
            </h4>
            <p>
              Kolkata, we're in your city, and we're here to spread the joy of
              <strong>Bento Cakes</strong>!
            </p>
            <p className="mb-2">
              Our commitment to quality and a sprinkle of happiness make us your
              go-to destination for the most enchanting{" "}
              <strong>Bento Cakes</strong> in town
            </p>
            <h3 className="mt-3 mb-3">(FAQs)Frequently Asked Questions</h3>
            <h5 className="mt-3 mb-3">1: What is a bento cake?</h5>
            <p>
              Say hello to <strong>Bento Cakes</strong>! These pint-sized
              delights, 2-4 inches in size, come in a takeout box, making them
              the cutest little treats. Popular in South Korea, these affordable
              gems are decorated with sweet messages or simple designs. The word
              "bento" is Japanese, meaning lunch box, and these cakes are
              perfect for one or two people. Sweet, simple, and oh-so-charming!
            </p>
            <h5 className="mt-3 mb-3">2: What size is a bento cake?</h5>
            <p>
              Usually, about 4 inches in diameter, though sometimes they can
              stretch to a whopping 6 or even 8 inches in size!
            </p>
            <h5 className="mt-3 mb-3">
              3: What is the difference between bento cake and normal cake?
            </h5>
            <p>
              <strong>Bento cakes</strong>, sized 2-4 inches and served solo in
              a bento box, are petite delights with artistic flair. Despite
              being half the size of regular cakes, they boast the same
              ingredients, offering a budget-friendly option. "Bento," a
              Japanese term for "convenience," traces its roots to 12th-century
              Japan, evolving into these delightful single-serving treats.
            </p>
            <h5 className="mt-3 mb-3">4: Why bento cake is popular?</h5>
            <p>Bento cakes win hearts for several reasons:</p>
            <ul>
              <li>
                <strong> Small Size:</strong> Perfect for smaller parties or
                intimate gatherings.
              </li>
              <li>
                <strong>Perfectly Portioned:</strong> Unlike regular cakes,{" "}
                <strong>bento cakes</strong> are easy to serve and share.
              </li>
              <li>
                <strong>Customizable:</strong> Tailor-made for small surprises
                with 2-3 servings and fully customizable.
              </li>
              <li>
                <strong>Convenient Alternative:</strong> Mini bento cakes became
                a cute and convenient substitute for big birthday cakes during
                the COVID-19 pandemic.
              </li>
              <li>
                <strong>Ideal Dessert:</strong> Just right for sharing between
                two people, making them the perfect dessert for intimate
                moments.
              </li>
              <li>
                <strong>Japanese Charm:</strong> The term "bento" originates
                from Japanese, meaning convenient, and these cakes carry on the
                tradition of single-serving lunch boxes.
              </li>
            </ul>
            <h5 className="mt-3 mb-3">5: Why is it called bento cake?</h5>
            <p>
              <strong>Bento cakes</strong> take their name from the Japanese
              word "bento," meaning "lunchbox" or "boxed meal." Resembling the
              size of a small lunchbox, these cakes are typically served in a
              bento box, inspired by the tradition dating back to 12th-century
              Japan.
            </p>
            <p className="mb-2">
              Also known as lunchbox cakes, these treats measure around two by
              four inches and weigh approximately 300-350 grams. Made often from
              rice cereal, they embrace a minimalist style. The trend for{" "}
              <strong>Bento cakes</strong> originated in South Korea.
            </p>
            <h5 className="mt-3 mb-3">6: Are bento and mini cakes the same?</h5>
            <p>
              Indeed, <strong>Bento cakes</strong> go by the name{" "}
              <strong>mini cakes</strong> or lunchbox cakes. These petite
              delights, originating in South Korea, are compact layer cakes,
              usually measuring 2-4 inches and weighing between 240-400 grams.
              Served in takeout boxes resembling bento boxes, these cakes are
              inspired by the simplicity of lunchtime treats.
            </p>
            <h4 className="mt-3 mb-3">Online Bento Cake Delivery in Kolkata</h4>
            <table className="table table-responsive table-striped">
              <thead className="bg-dark">
                <tr>
                  <th className="text-light">Location</th>
                  <th className="text-light">Pincode</th>
                  <th className="text-light">Location</th>
                  <th className="text-light">Pincode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Council House Street</td>
                  <td>700001</td>
                  <td>Amrita Bazar Patrika</td>
                  <td>700003</td>
                </tr>
                <tr>
                  <td>Beadon Street</td>
                  <td>700006</td>
                  <td>Archana</td>
                  <td>700007</td>
                </tr>
                <tr>
                  <td>Dharmatala</td> <td>700013</td> <td>Asylum Lane</td>
                  <td>700014</td>
                </tr>
                <tr>
                  <td>Elliot Road</td> <td>700016</td> <td>Circus Avenue</td>
                  <td>700017</td>
                </tr>
                <tr>
                  <td>Ballygunge</td>
                  <td>700019</td> <td>Fort William</td>
                  <td>700021</td>
                </tr>
                <tr>
                  <td>Bakery Road</td> <td>700022</td>
                  <td>Garden Reach</td>
                  <td>700024</td>
                </tr>
                <tr>
                  <td>Bhawanipore</td> <td>700025</td> <td>Kalighat</td>
                  <td>700026</td>
                </tr>
                <tr>
                  <td>Alipore</td> <td>700027</td> <td>Dover Lane</td>
                  <td>700029</td>
                </tr>
                <tr>
                  <td>Ashokegarh</td> <td>700030</td> <td>Dhakuria</td>
                  <td>700031</td>
                </tr>
                <tr>
                  <td>Bijoygarh</td> <td>700032</td> <td>Indrani Park</td>
                  <td>700033</td>
                </tr>
                <tr>
                  <td>Behala</td> <td>700034</td> <td>Netaji Nagar</td>
                  <td>700040</td>
                </tr>
                <tr>
                  <td>Bhawanipore</td> <td>700041</td>
                  <td>Kalighat</td>
                  <td>700042</td>
                </tr>
                <tr>
                  <td>Alipore</td>
                  <td>700047</td>
                  <td>Dover Lane</td>
                  <td>700053</td>
                </tr>
                <tr>
                  <td>Ashokegarh</td>
                  <td>700054</td>
                  <td>Dhakuria</td>
                  <td>700068</td>
                </tr>
                <tr>
                  <td>Bijoygarh</td>
                  <td>700069</td>
                  <td>Indrani Park</td>
                  <td>700071</td>
                </tr>
                <tr>
                  <td>Behala</td>
                  <td>700073</td>
                  <td>Netaji Nagar</td>
                  <td>700075</td>
                </tr>
                <tr>
                  <td>Ashokegarh</td>
                  <td>700078</td>
                  <td>Dhakuria</td>
                  <td>700082</td>
                </tr>
                <tr>
                  <td>Bijoygarh</td>
                  <td>700086</td>
                  <td>Indrani Park</td>
                  <td>700087</td>
                </tr>
                <tr>
                  <td>Behala</td>
                  <td>700095</td>
                  <td>Netaji Nagar</td>
                  <td>700099</td>
                </tr>
                <tr>
                  <td>Salt Lake Sector 1</td>
                  <td>700064</td>
                  <td>Salt Lake Sector 2</td>
                  <td>700091</td>
                </tr>
                <tr>
                  <td>Salt Lake Sector 3</td>
                  <td>700106</td>
                  <td>Salt Lake Sector 5</td>
                  <td>700091</td>
                </tr>
                <tr>
                  <td>New Town</td>
                  <td>700156</td>
                  <td>Action Area 1</td>
                  <td>700163</td>
                </tr>
                <tr>
                  <td>Action Area 2</td>
                  <td>700161</td>
                  <td>Action Area 3</td>
                  <td>700160</td>
                </tr>
                <tr>
                  <td>Rajarhat</td>
                  <td>700135</td>
                  <td>Shapurji</td>
                  <td>700135</td>
                </tr>
                <tr>
                  <td>Eco Park</td>
                  <td>700156</td>
                  <td>Eco Space</td>
                  <td>700156</td>
                </tr>
                <tr>
                  <td>Chinar Park</td>
                  <td>700157</td>
                  <td>Baguiati</td>
                  <td>700159</td>
                </tr>
                <tr>
                  <td>Keshtopur</td>
                  <td>700102</td>
                  <td>Lake town</td>
                  <td>700089</td>
                </tr>
                <tr>
                  <td>Bangur</td>
                  <td>700055</td>
                  <td>Kankurgachi</td>
                  <td>700054</td>
                </tr>
                <tr>
                  <td>Maniktala</td>
                  <td>700006</td>
                  <td>Girish park</td>
                  <td>700006 </td>
                </tr>
                <tr>
                  <td>MG Road</td>
                  <td>700009</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <h4 className="mt-3 mb-3">Find More Products:</h4>
            <h6>Cakes for Popular Occasions:</h6>
            <ul className="Ftrlist mt-3">
              {occasions.map((occasion, index) => {
                return (
                  <li key={`o-${occasion._id}`}>
                    <Link to={`/all-cakes?occasion=${occasion.slug}`}>
                      <i className="fa fa-chevron-right" aria-hidden="true"></i>
                      {occasion.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <h6>Cake By Category:</h6>
            <ul className="Ftrlist mt-3">
              <li>
                <Link to={`/all-cakes`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i> All
                  Cakes
                </Link>
              </li>{" "}
              <li>
                <Link to={`/designer-cakes`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>{" "}
                  Designer Cakes
                </Link>
              </li>
              <li>
                <Link to={`/best-seller`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>{" "}
                  Bestseller Cakes
                </Link>
              </li>
              <li>
                <Link to={`/kid's-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>{" "}
                  Kid's Cake
                </Link>
              </li>
              <li>
                <Link to={`/new-arrivals`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i> New
                  Arrivals Cakes
                </Link>
              </li>
              <li>
                <Link to={`/combo`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>{" "}
                  Combo Cakes
                </Link>
              </li>
            </ul>
          </div>
        </section>
      ) : null}

      {showContent ? (
        <section className="FtrConent section-padding">
          <div className="container-fluid">
            <h4 className="mb-3 mt-3">
              The Cake Inc: Online Cake Delivery In Kolkata
            </h4>
            <p>
              Welcome to <strong>The Cake Inc</strong>., the leading{" "}
              <strong>online cake delivery service in Kolkata</strong>.
            </p>
            <p className="mt-2">
              We take pride in our commitment to delivering delicious and
              visually stunning cakes that make every occasion truly special.
              From birthdays and weddings to anniversaries and corporate events,
              our wide range of flavours,{" "}
              <Link to={"/best-seller"}>
                <strong>designs of cake</strong>
              </Link>
              , and customisation options, whatever you want to{" "}
              <strong>buy cakes online In Kolkata</strong>, will ensure that you
              find the perfect{" "}
              <Link to={"/kid%27s-cake"}>
                <strong>kid's cake</strong>
              </Link>{" "}
              and adult cakes to suit your needs. Join us on a delightful
              journey of indulgence as we bring joy and sweetness to your
              celebrations and <strong>order cake online</strong> with{" "}
              <strong>The Cake Inc</strong>.
            </p>
            <h4 className="mb-3 mt-3">
              The Cake Inc: A Journey of Sweet Delights
            </h4>
            <p>
              The Cake Inc. embarked on its culinary adventure with a singular
              goal: to spread happiness through the art of baking. Our humble
              beginnings in Kolkata soon blossomed into a thriving{" "}
              <strong>online cake delivery service</strong>.<br />
              We owe our success to our passionate team of skilled bakers who
              pour their hearts and soul into crafting each cake. With years of
              experience and an unwavering commitment to quality,{" "}
              <strong>
                The Cake Inc., an Online Cake Delivery in Kolkata
              </strong>{" "}
              has become synonymous with celebration and joy in the city.
            </p>
            <h4 className="mb-3 mt-3">
              Order Your Favourite Cakes in Kolkata Online to Make the Occasion
              Special
            </h4>
            <p>
              We Kolkatans prefer mishti (sweets) on any type of special
              occasion. But at the same time, Kolkatans always want to do
              something out of the box or want to break the stereotypes, and
              that is why, they look for{" "}
              <strong>early morning delivery in Kolkata</strong> and{" "}
              <strong>buy cake online</strong> for their favourite cakes to
              start the special day with some mishti mukh.
            </p>
            <p className="mt-2">
              The best part is that <strong>The Cake Inc</strong>. is prepared
              to serve Kolkata people with a huge collection of designer cakes
              in Kolkata. Here they are:
            </p>
            <ul className="Ftrlist mt-3">
              {occasions.map((occasion, index) => {
                return (
                  <li key={`o-${occasion._id}`}>
                    <Link to={`/all-cakes?occasion=${occasion.slug}`}>
                      <i className="fa fa-chevron-right" aria-hidden="true"></i>
                      {occasion.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p>
              These are not the only options we have to sweeten your occasion.
              You’ll find cakes for more different occasions during the season
              on{" "}
              <strong>The Cake Inc, an Online Cake Delivery in Kolkata</strong>.
              The best part is that we also deliver{" "}
              <strong>Customised cakes in Kolkata</strong>.
            </p>
            <h4 className="font-weight-bold mt-3 mb-3">
              What This Online Cake Shop in Kolkata Have for You: A Wide Variety
              of Temptations
            </h4>
            <p>
              At <strong>The Cake Inc</strong>., the{" "}
              <strong>online cake order in Kolkata</strong>, we understand that
              no two celebrations are alike, which is why we offer an extensive
              selection of flavours, designs, and sizes to cater to your unique
              preferences.
            </p>
            <p className="mt-2">
              Indulge in classic flavours like chocolate, vanilla, butterscotch,
              and strawberry, or explore more exotic choices such as red velvet,
              pineapple, and fresh fruit passion. Our talented bakers are
              constantly innovating to bring you new and exciting flavours that
              will tantalise your taste buds.
            </p>
            <p className="mt-2">
              Our <strong>cake designs</strong> range from elegant and
              sophisticated to fun and whimsical, ensuring that your cake
              becomes the centrepiece of your celebration.
            </p>
            <p className="mt-2">
              Whether you're looking for a simple, elegant cake for a formal
              event or a <strong>themed cake</strong> that reflects your
              personality and interests, we have got you covered. We also offer
              customization options such as personalised messages,{" "}
              <strong>photo cakes</strong>, and even 3D designs that will truly
              make your cake stand out.
            </p>
            <p className="font-weight-bold">
              Here is a list of <strong>The Cake Inc's</strong> favourite{" "}
              <strong>cakes in Kolkata</strong>.
            </p>
            <ul className="Ftrlist mt-3">
              {flavours.map((flavour, index) => {
                return (
                  <li key={`f-${flavour._id}`}>
                    <Link to={`/all-cakes?flavour=${flavour.slug}`}>
                      <i className="fa fa-chevron-right" aria-hidden="true"></i>
                      {flavour.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <h4 className="mt-3 mb-3">What’s So Special About The Cake Inc?</h4>
            <p>
              We are living in a digital world, where we look for a digital and
              modern solution to all of our problems. So, honestly,{" "}
              <strong>The Cake Inc</strong>
              is not the only <strong>online cake delivery in Kolkata</strong>,
              there are dozens of them.
            </p>
            <p className="mt-2">
              And the truth is that some of them are good at what they are
              doing. We are not here in the market to be just another{" "}
              <strong>cake delivery service in Kolkata</strong>. We are bringing
              something new to the table.
            </p>
            <p className="mt-2">
              All those other <strong>cake delivery services in Kolkata</strong>{" "}
              have plenty of options to choose from and make your special
              occasion sweeter. But when it comes to presenting veg or eggless
              options, they are limited.
            </p>
            <p className="mt-2">
              Yes, you’ll not find a lot of options if you have decided to go
              with an <strong>eggless cake</strong>. And that is why, often you
              need to settle for something that is not your first choice, or
              that is not making your mind say, “Oh! This is the one!”
            </p>
            <p className="mt-2">
              But, with The Cake Inc, you’ll only get eggless options. That
              means, now, you can even share the sweetness of your special
              occasion with all your loved ones who are completely vegetarian.
              And trust us, you won’t even understand the difference in taste.
            </p>
            <p className="mt-2">
              So, if you are looking for{" "}
              <strong>online eggless cake delivery in Kolkata</strong>, you just
              need to look for <strong>The Cake Inc</strong>. on Google and you
              will find our <strong>online bakery in Kolkata</strong>.
            </p>
            <h4 className="mt-3 mb-3">
              How to order cakes online In Kolkata from The Cake Inc: Simple and
              Convenient
            </h4>
            <p>
              Ordering your favourite cakes in Kolkata from{" "}
              <strong>The Cake Inc., an Online Cake Delivery in Kolkata</strong>{" "}
              is a breeze, thanks to our user-friendly website. Follow these
              easy steps to place your order:
            </p>
            <br />
            <p>
              <span className="font-weight-bold">a. Browse our website:</span>{" "}
              Explore our extensive collection of cakes and find the one that
              catches your eye. We have conveniently categorised our cakes to
              make your search easier.
            </p>
            <p>
              <span className="font-weight-bold">b. Select your cake:</span>{" "}
              Once you've found the perfect cake, choose the flavour, size, and
              design that best suits your occasion. Don't forget to check if any{" "}
              <Link to={"/all-cakes?shape=custom-shape"}>
                <strong>customization options</strong>
              </Link>{" "}
              are available
            </p>
            <p>
              <span className="font-weight-bold">c. Add to cart: </span> After
              making your selection, simply click the "Add to Cart" button. You
              can continue browsing for more items or proceed to checkout.
            </p>
            <p>
              <span className="font-weight-bold">
                d. Provide delivery details:{" "}
              </span>{" "}
              Enter the delivery address, date, and time slot when prompted.
              Double-check the information to ensure accurate and timely
              delivery.
            </p>
            <p>
              <span className="font-weight-bold">e. Review your order: </span>{" "}
              Take a moment to review your order summary, including the cake
              details, delivery information, and any special requests. If
              everything looks good, proceed to checkout.
            </p>
            <p>
              <span className="font-weight-bold">f. Payment: </span> Choose your
              preferred payment method and complete the secure transaction. We
              accept various payment options, including credit/debit cards, net
              banking, and mobile wallets.
            </p>
            <p>
              <span className="font-weight-bold">g. Sit back and relax: </span>{" "}
              Once your <strong>“ordering cake online in Kolkata”</strong> is
              confirmed, our skilled bakers will begin preparing your cake with
              love and care. We use only the finest ingredients to ensure the
              highest quality.
            </p>
            <p>
              <span className="font-weight-bold">h. Delivery: </span> On the
              scheduled date and time, your scrumptious creation will be
              delivered to your doorstep. Our delivery team takes utmost care to
              ensure that your cake arrives in perfect condition.
            </p>
            <p>
              <span className="font-weight-bold">i. Enjoy and celebrate: </span>{" "}
              Finally, it's time to indulge in the heavenly flavours of your
              cake. Share the joy with your loved ones and create beautiful
              memories that will last a lifetime.
            </p>
            <h4 className="mt-3 mb-3">
              Enjoy Online Midnight Cake Delivery in Kolkata
            </h4>
            <p>
              There's something undeniably enchanting about celebrating special
              moments at midnight. It's a time when the world is quiet, and
              anticipation fills the air. Imagine the look of delight on your
              loved one's face when, just as the clock strikes twelve, a
              beautifully crafted cake arrives at their doorstep
            </p>
            <p className="mt-2">
              Our Online <strong>Midnight Cake Delivery service</strong> is
              designed to capture the essence of these magical moments, allowing
              you to create memories that will be cherished forever. You just
              need to <strong>send cakes online</strong> to your loved ones.
            </p>
            <p lassName="mt-2">
              Placing an order for our{" "}
              <strong>Midnight Cake Delivery in Kolkata</strong> is as simple as
              ordering during regular hours. Here's how it works:
            </p>
            <p>
              <span className="font-weight-bold">a. Visit our website: </span>
              Begin by browsing through our mouthwatering cake collection to
              find the perfect one for your midnight surprise.
            </p>
            <p>
              <span className="font-weight-bold">
                b. Select midnight delivery time:{" "}
              </span>
              During the ordering process, you will have the option to choose a
              specific time slot for midnight delivery. Select this option to
              proceed from our <strong>Online Cake Delivery in Kolkata</strong>.
            </p>
            <p>
              <span className="font-weight-bold">c. Customise your cake: </span>
              Choose the flavour, size, and design that will make your loved
              one's heart skip a beat. Add any special requests or customisation
              options to make the cake truly personal.
            </p>
            <p>
              <span className="font-weight-bold">
                d. Provide delivery details:{" "}
              </span>
              Enter the recipient's address and ensure accuracy, as we want to
              make sure the cake arrives at the right place at the right time,
              as we always prioritise <strong>same-day cake delivery</strong>.
            </p>
            <p>
              <span className="font-weight-bold">e. Review and checkout: </span>
              Take a moment to review your order summary, including the delivery
              time slot. Once you're satisfied, proceed to checkout and make the
              payment using our secure online payment options.
            </p>
            <p>
              <span className="font-weight-bold">f. Await the magic: </span>
              Sit back and eagerly await the arrival of midnight. Our dedicated
              team will ensure that the cake is prepared with the utmost care
              and delivered right on time, surprising your loved one with the
              sweetest gift at the stroke of twelve.
            </p>
            <h4 className="mt-3 mb-3">
              The Delight of Midnight Cake Delivery in Kolkata
            </h4>
            <p>
              Our{" "}
              <strong>Online Midnight Cake Delivery service in Kolkata</strong>{" "}
              is designed to add an element of surprise, joy, and anticipation
              to your celebrations. Here's why it's a truly delightful
              experience:
            </p>
            <p>
              <span className="font-weight-bold">a. Magical moments: </span>
              There's something incredibly special about receiving a cake when
              the world is asleep. The element of surprise and the anticipation
              of the clock striking twelve make the moment even more memorable
              with our <strong>best birthday cake designs</strong>.
            </p>
            <p>
              <span className="font-weight-bold">b. Express your love: </span>
              Whether it's a birthday, anniversary, or any other special
              occasion, surprising your loved one with a{" "}
              <strong>romantic anniversary cake</strong>, or the{" "}
              <strong>best birthday cake</strong> at midnight is a wonderful way
              to express your love and show them how much they mean to you.
            </p>
            <p>
              <span className="font-weight-bold">
                c. Create lasting memories:{" "}
              </span>
              The joy and happiness that a{" "}
              <strong>midnight cake delivery</strong> brings will create lasting
              memories for both the recipient and the sender. It's a moment that
              will be remembered and cherished for years to come.
              <br />
              Imagine you are out of the station and can not be with your better
              half on the day of your <strong>wedding anniversary</strong>. Now,
              the doorbell rang and your loved one opened the door just to
              receive a <strong>Happy wedding anniversary cake</strong>. It
              can’t replace your company but it definitely will bring a huge
              smile to their face.
            </p>
            <p>
              <span className="font-weight-bold">
                d. Unique and unforgettable:{" "}
              </span>
              Our <strong>Midnight Cake Delivery service</strong> sets your
              celebration apart from the rest. It adds a touch of uniqueness and
              surprise that will leave a lasting impression on your loved one.
            </p>
            <p>
              <span className="font-weight-bold">
                e. Hassle-free experience:{" "}
              </span>
              We understand the importance of convenience, even for midnight
              deliveries. Our seamless ordering process ensures that you can
              surprise your loved one without any hassle or stress.
            </p>
            <p>
              <span className="font-weight-bold">
                f. Wide variety of options:{" "}
              </span>
              Choose from our extensive collection of flavours, designs, and
              sizes to find the perfect cake for your midnight surprise. Whether
              it's a classic flavour or a unique creation, we have something to
              suit every taste.
            </p>
            {/* Continue */}
            <h4 className="mt-3 mb-3">
              Now What about An Early Morning Delivery in Kolkata
            </h4>
            <p>
              There's a unique charm and serenity to early mornings. The world
              is still waking up, and the air is filled with a sense of
              possibility. Imagine the delight on your loved one's face when
              they receive a beautifully crafted cake delivered right to their
              doorstep in the early hours.
            </p>
            <p className="mt-2">
              Our Early <strong>Morning Cake Delivery service</strong> aims to
              capture the essence of these quiet and precious moments, creating
              memories that will be cherished for a lifetime.
            </p>
            <p className="mt-2">
              We all want to start our day fresh and happy. On special occasions
              like anniversaries, birthdays or any other, there’s nothing better
              than to brighten up your loved one’s day by starting it with a
              surprise. That is when an early morning delivery of a romantic
              anniversary cake or a designer birthday cake can get your back.
            </p>
            <p className="mt-2">
              Our{" "}
              <strong>Early Morning Cake Delivery service in Kolkata</strong>{" "}
              offers a host of benefits and joys that make it an exceptional
              experience:
            </p>
            <p>
              <span className="font-weight-bold">
                a. Surprise and delight:{" "}
              </span>
              Imagine the sheer surprise and joy on your loved one's face when
              they receive a scrumptious cake delivered right to their doorstep
              in the early hours. It's an unexpected gesture that will make
              their day truly special.
            </p>
            <p>
              <span className="font-weight-bold">b. Freshness and aroma: </span>
              Our <strong>cakes in Kolkata</strong> are baked with the freshest
              ingredients and delivered in the early morning hours, ensuring
              that your loved ones experience the delightful aroma and taste of
              a freshly baked cake.
            </p>
            <p>
              <span className="font-weight-bold">
                c. Start the day on a sweet note:{" "}
              </span>
              A <strong>delicious cake</strong> delivered in the early morning
              sets the tone for a wonderful day ahead. It's the perfect way to
              show your love and care, setting a joyous atmosphere right from
              the start. Do choose any of the{" "}
              <strong>best anniversary cakes</strong> or{" "}
              <strong>best birthday cakes</strong>
              from our wide range and surprise your special one.
            </p>
            <p>
              <span className="font-weight-bold">d. Memorable moments: </span>
              Early morning celebrations are rare and precious, making them
              memorable for both the recipient and the sender. The
              thoughtfulness of an <strong>
                early morning cake delivery
              </strong>{" "}
              will create lasting memories and strengthen bonds.
            </p>
            <p>
              <span className="font-weight-bold">
                e. Convenient and hassle-free:{" "}
              </span>
              Our seamless <strong>Online Cake Delivery in Kolkata</strong>{" "}
              process ensures a hassle-free experience, even for early morning
              deliveries. We take care of the logistics, allowing you to focus
              on the joy of surprising your loved ones.
            </p>
            <p>
              <span className="font-weight-bold">
                f. Wide variety of choices:{" "}
              </span>
              Choose from our extensive range of flavours, designs, and sizes to
              find the perfect cake for your early morning surprise. From
              classic flavours to unique creations, we have something to suit
              every taste and preference. Even we have a special range of{" "}
              <strong>baby shower cake designs</strong> to pick from. You also
              can customise it as per your requirements.
            </p>
            <h3 className="mt-3 mb-3">
              (FAQs) Frequently Asked Questions: Your Queries Answered
            </h3>
            <p>
              To make your ordering experience seamless, here are some commonly
              asked questions and their answers:
            </p>
            <h5 className="mt-3 mb-3">1: Can I place a last-minute order??</h5>
            <p>
              A: Yes, we offer <strong>same-day and next-day delivery</strong>{" "}
              options for select cakes. However, availability may vary, so we
              recommend placing your order as soon as possible to secure your
              preferred delivery slot. Here, we also like to mention that if you
              are thinking about surprising your loved one at midnight, this
              <strong>online midnight cake delivery in Kolkata</strong> will be
              at your service.
            </p>
            <h5 className="mt-3 mb-3">2: Can I customize my cake?</h5>
            <p>
              Absolutely! We offer various customization options, including
              personalised messages, photo cakes, and themed designs. Simply
              mention your requirements while placing the order, and our team
              will be happy to assist you.
            </p>
            <h5 className="mt-3 mb-3">3: Is it safe to order online?</h5>
            <p>
              A: Yes, we take the security and privacy of our customers very
              seriously. Our website uses advanced encryption technology to
              safeguard your personal and payment information. Rest assured that
              your data is handled securely. You can check our Privacy Policy{" "}
              <Link to={"/privacy-policy"}>
                <strong>here</strong>
              </Link>
              . If you are worrying about the quality of our cakes, let us tell
              you that we are an FSSAI-certified{" "}
              <strong>cake delivery company in Kolkata</strong>.
            </p>
            <h5 className="mt-3 mb-3">
              4: What if I have dietary restrictions?
            </h5>
            <p>
              A: We understand the importance of catering to different dietary
              needs. We already deliver{" "}
              <strong>eggless cakes in Kolkata</strong>, along with sugar-free
              and gluten-free options. You can find these options mentioned in
              the product descriptions. If you have specific dietary concerns,
              feel free to contact our customer support team for assistance.
            </p>
            <h5 className="mt-3 mb-3">
              5: What if I'm not satisfied with my order?
            </h5>
            <p>
              A: Customer satisfaction is our top priority. In the rare event
              that you are not satisfied with your cake, please reach out to our
              customer support team (
              <a href="mailto:support@thecakeinc.com">
                <strong>support@thecakeinc.com</strong>
              </a>
              ) within 24 hours of delivery. We will address your concerns
              promptly and work towards a suitable resolution.
            </p>
            <h5 className="mt-3 mb-3">
              6: Do you offer delivery outside Kolkata?
            </h5>
            <p>
              A: Currently, our delivery services are limited to Kolkata.
              However, we are constantly expanding our reach, so stay tuned for
              updates on new delivery locations.
            </p>
            <h5 className="mt-3 mb-3">7: How can I track my order?</h5>
            <p>
              A: Once your order is confirmed and out for delivery, you will
              receive a tracking link via email or SMS. Click on the link to
              track the progress of your delivery in real time.
            </p>
            <h5 className="mt-3 mb-3">
              8: Do you offer any discounts or promotions?
            </h5>
            <p>
              A: Yes, we frequently run special offers, discounts, and
              promotions. Keep an eye on our website and social media channels
              for updates on the latest deals and savings opportunities. For all
              our first-time customers, you’ll get a 10% discount on your first
              purchase.
            </p>
            <h5 className="mt-3 mb-3">9: Do you offer pure veg cakes? </h5>
            <p>
              A: As we have mentioned earlier, all our options are eggless. So,
              if you are thinking about having a bite of sweet heaven during
              this “Sawan ka mahina” or during your Navratri puja, you can order
              pure veg <strong>cake delivery at your doorstep</strong>.
            </p>
            <h5 className="mt-3 mb-3">
              10: Can I order sugar-free cake options?
            </h5>
            <p>
              A: At <strong>The Cake Inc</strong>. we are determined to serve
              all types of customers with their different requirements. And that
              is why we are providing as many options as we can. At the same
              time, we prefer transparency about everything. To prepare the
              frosting of cakes, every baker needs to use a little sugar, just
              like us. We have fewer sugar options that are completely safe for
              people who are looking for no-sugar options.
            </p>
            {/* cccccc */}
            <h4 className="mt-3 mb-3">
              Order Cakes Online In Kolkata with The Cake Inc
            </h4>
            <p>
              The Cake Inc. is your go-to destination for{" "}
              <strong>online cake delivery in Kolkata</strong>. With our wide
              variety of flavours, stunning designs, and hassle-free ordering
              process, we strive to make your celebrations truly memorable.
            </p>
            <p className="mt-2">
              From the moment you browse our website to the first bite of your
              delicious cake, we guarantee a delightful experience. Join us in
              creating sweet moments of joy and celebration. Place your order
              with <strong>The Cake Inc</strong>. today and let us be a part of
              your special occasions.
            </p>
            <h4 className="mt-3 mb-3">Online Cake Delivery in Kolkata</h4>
            <table className="table table-responsive table-striped">
              <thead className="bg-dark">
                <tr>
                  <th className="text-light">Location</th>
                  <th className="text-light">Pincode</th>
                  <th className="text-light">Location</th>
                  <th className="text-light">Pincode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Council House Street</td>
                  <td>700001</td>
                  <td>Amrita Bazar Patrika</td>
                  <td>700003</td>
                </tr>
                <tr>
                  <td>Beadon Street</td>
                  <td>700006</td>
                  <td>Archana</td>
                  <td>700007</td>
                </tr>
                <tr>
                  <td>Dharmatala</td> <td>700013</td> <td>Asylum Lane</td>
                  <td>700014</td>
                </tr>
                <tr>
                  <td>Elliot Road</td> <td>700016</td> <td>Circus Avenue</td>
                  <td>700017</td>
                </tr>
                <tr>
                  <td>Ballygunge</td>
                  <td>700019</td> <td>Fort William</td>
                  <td>700021</td>
                </tr>
                <tr>
                  <td>Bakery Road</td> <td>700022</td>
                  <td>Garden Reach</td>
                  <td>700024</td>
                </tr>
                <tr>
                  <td>Bhawanipore</td> <td>700025</td> <td>Kalighat</td>
                  <td>700026</td>
                </tr>
                <tr>
                  <td>Alipore</td> <td>700027</td> <td>Dover Lane</td>
                  <td>700029</td>
                </tr>
                <tr>
                  <td>Ashokegarh</td> <td>700030</td> <td>Dhakuria</td>
                  <td>700031</td>
                </tr>
                <tr>
                  <td>Bijoygarh</td> <td>700032</td> <td>Indrani Park</td>
                  <td>700033</td>
                </tr>
                <tr>
                  <td>Behala</td> <td>700034</td> <td>Netaji Nagar</td>
                  <td>700040</td>
                </tr>
                <tr>
                  <td>Bhawanipore</td> <td>700041</td>
                  <td>Kalighat</td>
                  <td>700042</td>
                </tr>
                <tr>
                  <td>Alipore</td>
                  <td>700047</td>
                  <td>Dover Lane</td>
                  <td>700053</td>
                </tr>
                <tr>
                  <td>Ashokegarh</td>
                  <td>700054</td>
                  <td>Dhakuria</td>
                  <td>700068</td>
                </tr>
                <tr>
                  <td>Bijoygarh</td>
                  <td>700069</td>
                  <td>Indrani Park</td>
                  <td>700071</td>
                </tr>
                <tr>
                  <td>Behala</td>
                  <td>700073</td>
                  <td>Netaji Nagar</td>
                  <td>700075</td>
                </tr>
                <tr>
                  <td>Ashokegarh</td>
                  <td>700078</td>
                  <td>Dhakuria</td>
                  <td>700082</td>
                </tr>
                <tr>
                  <td>Bijoygarh</td>
                  <td>700086</td>
                  <td>Indrani Park</td>
                  <td>700087</td>
                </tr>
                <tr>
                  <td>Behala</td>
                  <td>700095</td>
                  <td>Netaji Nagar</td>
                  <td>700099</td>
                </tr>
                <tr>
                  <td>Salt Lake Sector 1</td>
                  <td>700064</td>
                  <td>Salt Lake Sector 2</td>
                  <td>700091</td>
                </tr>
                <tr>
                  <td>Salt Lake Sector 3</td>
                  <td>700106</td>
                  <td>Salt Lake Sector 5</td>
                  <td>700091</td>
                </tr>
                <tr>
                  <td>New Town</td>
                  <td>700156</td>
                  <td>Action Area 1</td>
                  <td>700163</td>
                </tr>
                <tr>
                  <td>Action Area 2</td>
                  <td>700161</td>
                  <td>Action Area 3</td>
                  <td>700160</td>
                </tr>
                <tr>
                  <td>Rajarhat</td>
                  <td>700135</td>
                  <td>Shapurji</td>
                  <td>700135</td>
                </tr>
                <tr>
                  <td>Eco Park</td>
                  <td>700156</td>
                  <td>Eco Space</td>
                  <td>700156</td>
                </tr>
                <tr>
                  <td>Chinar Park</td>
                  <td>700157</td>
                  <td>Baguiati</td>
                  <td>700159</td>
                </tr>
                <tr>
                  <td>Keshtopur</td>
                  <td>700102</td>
                  <td>Lake town</td>
                  <td>700089</td>
                </tr>
                <tr>
                  <td>Bangur</td>
                  <td>700055</td>
                  <td>Kankurgachi</td>
                  <td>700054</td>
                </tr>
                <tr>
                  <td>Maniktala</td>
                  <td>700006</td>
                  <td>Girish park</td>
                  <td>700006 </td>
                </tr>
                <tr>
                  <td>MG Road</td>
                  <td>700009</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            {/* <h4 className="mt-3 mb-3">
              Online Cake Delivery in Central Kolkata
            </h4>
            <table className="table table-responsive ">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Pincode</th>
                  <th>Location</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Metropolitan</td> <td>700105</td> <td>Beck Bagan</td>
                  <td>732101</td>
                </tr>
                <tr>
                  <td>Chingrihata</td> <td>700105</td>
                  <td>Park Street</td> <td>700016</td>
                </tr>
                <tr>
                  <td>Phool Bagan</td> <td>700054</td> <td>Minto Park</td>
                  <td>700017</td>
                </tr>
                <tr>
                  <td>Kankurgachi</td>
                  <td>700054</td>
                  <td>Esplanade</td>
                  <td>700069</td>
                </tr>
                <tr>
                  <td>Bhowanipore</td> <td>700025</td> <td>Sealdah</td>
                  <td>700014</td>
                </tr>
                <tr>
                  <td>CIT Road</td> <td>700014</td> <td>Entally</td>
                  <td>700014</td>
                </tr>
                <tr>
                  <td>Taltala</td> <td>700014</td> <td>Dalhousie</td>
                  <td>700001</td>
                </tr>
              </tbody>
            </table> */}

            {/* <h4 className="mt-3 mb-3">Online Cake Delivery in North Kolkata</h4>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Pincode</th>
                  <th>Location</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Laketown</td> <td>700089</td> <td>Baguiati</td>
                  <td>700159</td>
                </tr>
                <tr>
                  <td>Bangur</td> <td>700055</td> <td>Dumdum Park</td>
                  <td>700055</td>
                </tr>
                <tr>
                  <td>Kestopur</td> <td>700102</td> <td>Kaikhali</td>
                  <td>700136</td>
                </tr>
                <tr>
                  <td>Nager Bazar</td> <td>700028</td> <td>Belgachia</td>
                  <td>700037</td>
                </tr>

                <tr>
                  <td>Sova Bazar</td> <td>700005</td> <td>Shyam Bazar</td>
                  <td>700004</td>
                </tr>

                <tr>
                  <td>Rajarhat</td> <td>700135</td> <td>Baranagar</td>
                  <td>700036</td>
                </tr>

                <tr>
                  <td>DumDum</td> <td>700028</td> <td>Ultadanga</td>
                  <td>700004</td>
                </tr>
              </tbody>
            </table> */}

            {/* <h4 className="mt-3 mb-3">Online Cake Delivery in Salt Lake</h4>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Pincode</th>
                  <th>Location</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Salt Lake Sector I</td> <td>700064</td>
                  <td>Salt Lake Sector III</td> <td>700106</td>
                </tr>
                <tr>
                  <td>Salt Lake Sector II</td> <td>700091</td>
                  <td>Salt Lake Sector IV</td> <td>700098</td>
                </tr>
                <tr>
                  <td>Salt Lake Sector V</td>
                  <td>700091</td>
                </tr>
              </tbody>
            </table> */}

            {/* <h4 className="mt-3 mb-3">Online Cake Delivery in Newtown</h4>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Pincode</th>
                  <th>Location</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Newtown Action Area 1</td> <td>700156</td>
                  <td>Newtown Action Area 2</td> <td>700161</td>
                </tr>
                <tr>
                  <td>Newtown Action Area 3</td> <td>700160</td>
                </tr>
              </tbody>
            </table> */}

            <h4 className="mt-3 mb-3">Find More Products:</h4>
            <h6>Cakes for Popular Occasions:</h6>
            <ul className="Ftrlist mt-3">
              <li>
                <Link to={`/product/oreo-crunchy-kit-kat-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Birthday Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/love-delight-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Marriage Anniversary Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/special-vanilla-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Baby Shower Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/chocolate-cake-red-rose-combo`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Valentine’s Day Cakes
                </Link>
              </li>
            </ul>
            <h6>Cakes for Girls:</h6>
            <ul className="Ftrlist mt-3">
              <li>
                <Link to={`/product/the-barbie-doll-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Barbie Doll Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/pink-butterfly-strawberry-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Butterfly cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/pink-vanilla-birthday-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Pink Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/makeup-box-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Makeup Box Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/little-unicorn-rainbow-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Unicorn Birthday Cakes
                </Link>
              </li>
            </ul>
            <h6>Top Cakes:</h6>
            <ul className="Ftrlist mt-3">
              <li>
                <Link to={`/product/rich-black-forest-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Black Forest Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/special-red-velvet-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Red Velvet Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/deliciousness-butterscotch-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  ButterScotch Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/double-truffle-choco-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Chocolate Truffle Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/kitkat-chocolate-cake-`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Kitkat Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/sunshine-truffle-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Custom Cakes
                </Link>
              </li>
            </ul>
            <h6>Cakes For Boys:</h6>
            <ul className="Ftrlist mt-3">
              <li>
                <Link to={`/product/queen-doll-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Mickey Mouse Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/lion-face-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Lion Face Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/superman-cake-for-brother`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Superman Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/minions-birthday-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Minions Cakes
                </Link>
              </li>
              <li>
                <Link to={`/product/angry-bird-theme-cake`}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  Angry Birds Cakes
                </Link>
              </li>
            </ul>

            {/* <h6>Cake By Delivery:</h6>
            <ul className="Ftrlist mt-3">
              <li>
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
                Midnight Cake Delivery
              </li>
              <li>
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
                Early Morning Cake Delivery
              </li>
              <li>
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
                One Day Delivery
              </li>
            </ul> */}
          </div>
        </section>
      ) : null}

      <section className="section-padding footer-mid">
        <div className="container pt-15 pb-20">
          <div className="row">
            <div className="col">
              <div className="widget-about font-md mb-md-3 mb-lg-3 mb-xl-0">
                <div className="logo mb-30">
                  <Link to="/" className="mb-15">
                    <img
                      className="footer-logo"
                      src="/assets/imgs/theme/logo.png"
                      alt="logo"
                    />
                  </Link>
                  {/* <p className="font-lg text-heading">
                    WE BAKE IT, YOU HAVE IT
                  </p> */}
                </div>
                <ul className="contact-infor">
                  <li>
                    <i className="fa fa-map-marker"></i>
                    <strong>Address: </strong> <span>{contactUs.address}</span>
                  </li>
                  <li>
                    <i className="fa fa-headphones"></i>
                    <strong>Call Us:</strong>
                    <a href={`tel:${contactUs.customerSupportNumber}`}>
                      <span>(+91) {contactUs.customerSupportNumber}</span>
                    </a>
                  </li>
                  <li>
                    <i className="fa fa-paper-plane"></i>
                    <strong>Email:</strong>
                    <span>
                      <a href={`mailto:${contactUs.customerSupportEmail}`}>
                        <span> {contactUs.customerSupportEmail}</span>
                      </a>
                    </span>
                  </li>
                  <li>
                    <i className="fa fa-clock-o"></i>
                    <strong>Hours:</strong>
                    <span> Monday - Sunday 24 Hours </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-link-widget col">
              <h4 className="widget-title">Company</h4>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/about-us">About Us</Link>
                </li>
                <li>
                  <Link to="/delivery-information">Delivery Information</Link>
                </li>
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/payment-and-refund-policy">
                    Payment & Refund Policy
                  </Link>
                </li>
                <li>
                  <a target="_blank" href="/blog">
                    Blog
                  </a>
                </li>
                <li>
                  <Link to="/contact-us">Contact Us</Link>
                </li>
                {/* <li>
                  <Link to="/support-centre">Support Center</Link>
                </li>
                <li>
                  <Link to="/carrers">Careers</Link>
                </li> */}
              </ul>
            </div>
            <div className="footer-link-widget col">
              <h4 className="widget-title">Account</h4>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  {state?.jwtToken ? (
                    <Link onClick={signOutHandler} to="#">
                      Sign Out
                    </Link>
                  ) : (
                    <Link to="/account/login">Sign In</Link>
                  )}
                </li>
                <li>
                  <Link to={"/myCart"}>View Cart</Link>
                </li>
                <li>
                  <Link
                    to={
                      state.jwtToken
                        ? "/account/my-account/wishlists"
                        : "/account/login"
                    }
                  >
                    My Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to={
                      state.jwtToken
                        ? "/account/my-account/orders"
                        : "/account/login"
                    }
                  >
                    Track My Order
                  </Link>
                </li>
                {/* <li>
                  <a href="#">Help Ticket</a>
                </li> */}
                {/* <li>
                  <Link to="/account/my-account/orders">Shipping Details</Link>
                </li> */}
                {/* <li>
                  <a href="#">Compare products</a>
                </li> */}
              </ul>
            </div>

            <div className="footer-link-widget col">
              <h4 className="widget-title">Popular</h4>
              <ul className="footer-list mb-sm-5 mb-md-0">
                {categories.length
                  ? categories.map((cat, i) => {
                      return (
                        <li key={i}>
                          <Link to={`/${cat.slug}`}> {cat.name} </Link>
                        </li>
                      );
                    })
                  : ""}
                <li>
                  <Link to={`/by-occasions`}> By Occasions </Link>
                </li>
                <li>
                  <Link to={`/boutique-collection`}> Boutique Collection </Link>
                </li>
              </ul>
            </div>
            {/* <div className="footer-link-widget widget-install-app col">
                            <h4 className="widget-title">Install App</h4>
                            <p className="wow fadeIn animated">From App Store or Google Play</p>
                            <div className="download-app">
                                <a href="#" className="hover-up mb-sm-2 mb-lg-0"><img className="active" src="/assets/imgs/theme/app-store.jpg" alt="" /></a>
                                <a href="#" className="hover-up mb-sm-2"><img src="/assets/imgs/theme/google-play.jpg" alt="" /></a>
                            </div>
                            <p className="mb-20">Secured Payment Gateways</p>
                            <img className="wow fadeIn animated" src="/assets/imgs/theme/payment-method.png" alt="" />
                        </div>  */}
          </div>
        </div>
      </section>

      <div className="container pb-30">
        <div className="row align-items-center">
          <div className="col-12 mb-30">
            <div className="footer-bottom"></div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <p className="font-sm mb-0">
              &copy; {year},<strong className="text-brand">The Cake Inc</strong>{" "}
              Powered by{" "}
              <strong className="text-brand">Creamy Cloud Pvt. Ltd.</strong>
              {" All rights reserved"}
            </p>
          </div>
          {/* <div className="col-xl-4 col-lg-6 text-center d-none d-xl-block">
            <div className="hotline d-lg-inline-flex mr-30">
              <img
                src="/assets/imgs/theme/icons/phone-call.svg"
                alt="hotline"
              />
              <p>
                <a href={`tel:${contactUs.mobile}`}>{contactUs.mobile}</a>
                <span>Working 8:00 - 22:00</span>
              </p>
            </div>
            <div className="hotline d-lg-inline-flex">
              <img
                src="/assets/imgs/theme/icons/phone-call.svg"
                alt="hotline"
              />
              <p>
                <a href={`tel:${contactUs.customerSupportNumber}`}>
                  {contactUs.customerSupportNumber}
                </a>
                <span>24/7 Support Center</span>
              </p>
            </div>
          </div> */}
          <div className="col-xl-6 col-lg-6 col-md-6 text-right d-none d-md-block">
            <div className="mobile-social-icon">
              <h6>Follow Us</h6>
              <a target={"_blank"} href={`${socialLinks.facebook}`}>
                <img src="/assets/imgs/facebook.png" alt="" />
              </a>
              <a target={"_blank"} href={`${socialLinks.twitter}`}>
                <img src="/assets/imgs/twitter.png" alt="" />
              </a>
              <a target={"_blank"} href={`${socialLinks.linkedin}`}>
                <img src="/assets/imgs/linkedin.png" alt="" />
              </a>
              <a target={"_blank"} href={`${socialLinks.instagram}`}>
                <img src="/assets/imgs/instagram.png" alt="" />
              </a>
              <a target={"_blank"} href={`${socialLinks.pintrest}`}>
                <img src="/assets/imgs/pinterest.png" alt="" />
              </a>
              <a target={"_blank"} href={`${socialLinks.youtube}`}>
                <img src="/assets/imgs/youtube.png" alt="" />
              </a>
            </div>
            {/* <p className="font-sm">{settings.alertMessage}</p> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
