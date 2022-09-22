import React from "react";

const ProductSkeletonLoader = () => {
  return (
    <div className="skeleton">
      <div className="s-img"></div>
      <div className="s-line first"></div>
      <div className="s-line second"></div>
      <div className="s-line second"></div>
      <div className="s-line second"></div>
    </div>
  );
};

export default ProductSkeletonLoader;
