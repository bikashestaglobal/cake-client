import React from "react";

const PageNoteFound = () => {
  return (
    <main className="main pages">
      <div
        className="page-content section-padding FoundSec"
        style={{
          background:
            "url('/assets/imgs/bg-404.jpg') 0 0 no-repeat; background-size:cover;",
        }}
      >
        <div className="">
          <div className="col-xl-8 col-lg-10 col-md-12 m-auto text-center">
            <div className="FoundSec">
              <h2>404</h2>
              <h4>Oops! That page can't be found</h4>
              <p>Sorry, but the page you are looking for does not existing</p>
              <a href="#" className="foundBtn">
                Go To Home Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageNoteFound;
