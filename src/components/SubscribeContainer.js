import Subscribe from "./Subscribe";
const SubscribeContainer = () => {
  return (
    <section className="newsletter mb-15">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="position-relative newsletter-inner">
              <div className="newsletter-content">
                <h2 className="mb-20">
                  Stay home & get your daily <br />
                  needs from our shop
                </h2>
                <p className="mb-45">
                  Subscribe for latest Updates of
                  <span className="text-brand"> The Cake Inc </span>
                </p>
                <Subscribe />
              </div>
              {/* <img src="//assets/imgs/banner/banner-9.png" alt="newsletter" /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeContainer;
