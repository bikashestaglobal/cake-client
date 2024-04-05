import Home from "./pages/Home";
import { Switch, Route, Link, HashRouter } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Routes from "./layouts/Routes";

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
