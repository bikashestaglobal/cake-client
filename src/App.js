import Home from "./components/web/pages/Home";
import { Switch, Route, Link, HashRouter } from "react-router-dom";
import ProductDetails from "./components/web/pages/ProductDetails";
import Login from "./components/web/pages/Login";
import Register from "./components/web/pages/Register";
import Routes from "./components/web/Routes";

function App() {
  return (
    // <HashRouter>
    <Routes />
    // </HashRouter>
    // <Switch>
    //   <Route exact path={"/p/:slug"} component={ProductDetails} />
    //   <Route exact path={"/login"} component={Login} />
    //   <Route exact path={"/register"} component={Register} />
    //   <Route exact path={"/"} component={Home} />
    // </Switch>
  );
}

export default App;
