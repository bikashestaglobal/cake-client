import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import { initialState, customerReducer } from "../reducer/CustomerReducer";
import ProductDetails from "../pages/ProductDetails";
import ProductDetails_ from "../pages/ProductDetails_";
import PageNoteFound from "../pages/PageNoteFound";
import AddAddress from "../pages/AddAddress";
import EditAddress from "../pages/EditAddress";
import EditBillingAddress from "../pages/EditBillingAddress";
import MyAccount from "../pages/MyAccount";
import CheckoutInstamojo from "../pages/CheckoutInstamojo";
import CheckoutPhonepe from "../pages/CheckoutPhonepe";
import Header from "./Header";
import Footer from "./Footer";
import ShoppingCart from "../pages/ShoppingCart";
import CancelOrder from "../pages/CancelOrder";
import OrderDetails from "../pages/OrderDetails";
import Listing from "../pages/Listing_";
import ThankYou from "../pages/ThankYou";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import Contact from "../pages/Contact";
import About from "../pages/About";
import TermsAndConditions from "../pages/TermsAndConditions";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import DeliveryInformation from "../pages/DeliveryInformation";
import CreateNewPassword from "../pages/CreateNewPassword";
import BoutiqueCollection from "../pages/BoutiqueCollection";
import FAQs from "../pages/FAQs";
import Test from "../pages/Test";
import PaymentRedirectBackInstamojo from "../pages/PaymentRedirectBackInstamojo";
import PaymentRedirectBackPhonepe from "../pages/PaymentRedirectBackPhonepe";
import Search from "../pages/Serarch";
import PaymentFailed from "../pages/PaymentFailed";
import ScrollToTopOnNavigation from "../components/ScrollToTopOnNavigation";
import VerifyLoginOTP from "../pages/VerifyLoginOTP";
import VerifyAccount from "../pages/verifyAccount";
import UpdateCustomerName from "../pages/UpdateCustomerName";
import PaymentPending from "../pages/PaymentPending";
import ProductSitemap from "../pages/sitemaps/ProductSitemap";
import PageSitemap from "../pages/sitemaps/PageSitemap";
import CategorySitemap from "../pages/sitemaps/CategorySitemap";

// Create Context
export const CustomerContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);

  useEffect(() => {}, []);

  return (
    <Switch>
      {/* Static Page */}
      <Route exact path="/page-sitemap" component={PageSitemap} />
      <Route exact path="/product-sitemap" component={ProductSitemap} />
      <Route exact path="/category-sitemap" component={CategorySitemap} />
      <Route exact path="/contact-us" component={Contact} />
      <Route exact path="/about-us" component={About} />
      <Route exact path="/search" component={Search} />
      <Route
        exact
        path="/payment-and-refund-policy"
        component={TermsAndConditions}
      />
      <Route exact path="/privacy-policy" component={PrivacyPolicy} />
      <Route exact path="/page-not-found" component={PageNoteFound} />
      <Route exact path="/faq" component={FAQs} />
      <Route exact path="/test" component={Test} />
      {/* <Route exact path="/payment" component={PaymentRedirectBackInstamojo} /> */}
      <Route exact path="/payment" component={PaymentRedirectBackPhonepe} />
      <Route exact path="/payment-failed" component={PaymentFailed} />
      <Route exact path="/payment-pending" component={PaymentPending} />
      <Route exact path="/boutique-collection" component={BoutiqueCollection} />
      <Route
        exact
        path="/delivery-information"
        component={DeliveryInformation}
      />
      <Route exact path="/account/login" component={Login} />
      <Route exact path="/account/verifyLoginOTP" component={VerifyLoginOTP} />
      <Route exact path="/account/register" component={Register} />
      <Route exact path="/account/verifyAccount" component={VerifyAccount} />
      <Route exact path="/account/updateName" component={UpdateCustomerName} />
      <Route
        exact
        path="/account/my-account/order/:id?"
        component={OrderDetails}
      />
      <Route exact path="/account/my-account/:tab?" component={MyAccount} />
      {/* <Route exact path="/products/:cat?/:pCat?" component={ProductsCatWise} /> */}

      <Route exact path="/account/addAddress" component={AddAddress} />
      <Route exact path="/account/editAddress/:id" component={EditAddress} />
      <Route
        exact
        path="/account/cancelOrder/:id/:status?"
        component={CancelOrder}
      />
      <Route
        exact
        path="/account/editBillingAddress"
        component={EditBillingAddress}
      />
      {/* <Route exact path="/checkout" component={CheckoutInstamojo} /> */}
      <Route exact path="/checkout" component={CheckoutPhonepe} />
      <Route exact path="/myCart" component={ShoppingCart} />
      <Route exact path="/" component={Home} />
      <Route exact path="/product/:slug" component={ProductDetails} />
      <Route exact path={"/thank-you"} component={ThankYou} />
      <Route exact path={"/forgot-password"} component={ForgotPassword} />
      <Route exact path={"/verify-otp"} component={VerifyOtp} />
      <Route
        exact
        path={"/create-new-password"}
        component={CreateNewPassword}
      />
      <Route exact path="/:parCatSlug/:catSlug?" component={Listing} />

      <Route exact path={"*"} component={PageNoteFound} />
    </Switch>
  );
};

const Routes = () => {
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const history = useHistory();

  return (
    <div id="main-wrapper">
      <CustomerContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <ScrollToTopOnNavigation />
          {history.location.pathname == "/product-sitemap.xml" ||
          history.location.pathname == "/page-sitemap.xml" ||
          history.location.pathname == "/category-sitemap.xml" ? null : (
            <Header />
          )}
          <Routing />
          {/* <Footer /> */}
        </Router>
      </CustomerContext.Provider>
    </div>
  );
};

export default Routes;
