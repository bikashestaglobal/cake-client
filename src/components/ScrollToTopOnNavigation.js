import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

function ScrollToTopOnNavigation() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    const handlePopstate = () => {
      const currentPath = history.location.pathname;
      const homePath = "/"; // Replace with your homepage path

      if (currentPath === homePath) {
        window.location = "/";
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [history]);

  return null;
}

export default ScrollToTopOnNavigation;

// import React, { useEffect } from "react";
// import { useHistory } from "react-router-dom";

// function ScrollToTopOnNavigation() {
//   const history = useHistory();

//   useEffect(() => {
//     const handlePopstate = () => {
//       const currentPath = history.location.pathname;
//       const homePath = "/"; // Replace with your homepage path

//       if (currentPath === homePath) {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       } else {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       }
//     };

//     window.addEventListener("popstate", handlePopstate);

//     return () => {
//       window.removeEventListener("popstate", handlePopstate);
//     };
//   }, [history]);

//   return null;
// }

// export default ScrollToTopOnNavigation;
