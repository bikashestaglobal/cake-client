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
import ProductsCatWise from "../pages/ProductsCatWise";
import PageNoteFound from "../pages/PageNoteFound";
import AddAddress from "../pages/AddAddress";
import EditAddress from "../pages/EditAddress";
import EditBillingAddress from "../pages/EditBillingAddress";
import MyAccount from "../pages/MyAccount";
import Checkout from "../pages/Checkout";
import Header from "./Header";
import Footer from "./Footer";
import ShoppingCart from "../pages/ShoppingCart";
import CancelOrder from "../pages/CancelOrder";
import OrderDetails from "../pages/OrderDetails";
import Listing from "../pages/Listing";
import ThankYou from "../pages/ThankYou";
import ForgotPassword from "../pages/ForgotPassword";
// Create Context
export const CustomerContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);

  useEffect(() => {}, []);

  return (
    <Switch>
      <Route exact path="/account/login" component={Login} />
      <Route exact path="/account/register" component={Register} />
      <Route
        exact
        path="/account/my-account/order/:id?"
        component={OrderDetails}
      />
      <Route exact path="/account/my-account/:tab?" component={MyAccount} />
      <Route exact path="/products/:cat?/:pCat?" component={ProductsCatWise} />

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
      <Route exact path="/checkout" component={Checkout} />
      <Route exact path="/myCart" component={ShoppingCart} />
      <Route exact path="/" component={Home} />
      <Route exact path="/product/:slug" component={ProductDetails} />
      <Route exact path={"/thank-you"} component={ThankYou} />
      <Route exact path={"/forgot-password"} component={ForgotPassword} />
      <Route exact path="/:parCatSlug/:catSlug?" component={Listing} />
      <Route exact path={"*"} component={PageNoteFound} />
    </Switch>
  );
};

const Routes = () => {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  return (
    <div id="main-wrapper">
      <CustomerContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <Header />
          <Routing />
          <Footer />
        </Router>
      </CustomerContext.Provider>
    </div>
  );
};

export default Routes;
