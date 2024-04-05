let flavours = {
  "6418681b32b97463317251d7": "chocolate-cakes",
  "6418683732b97463317251e3": "black-forest-cakes",
  "6418686d32b97463317251f3": "butterscotch-cakes",
  "6418687332b97463317251f7": "strawberry-cakes",
  "6418687932b97463317251fb": "red-velvet-cakes",
  "6418687f32b97463317251ff": "vanilla-cakes",
  "6418688632b9746331725203": "pineapple-cakes",
  "6418688d32b9746331725207": "mango-cakes",
  "641868a432b974633172520b": "fresh-fruit-cakes",
  "64994fc3be8069bced6b3d97": "truffle-cakes",
};

let occasions = {
  "64186f0332b974633172523e": "birthday-cakes",
  "6418700a32b9746331725269": "anniversary-cakes",
  "6418701232b974633172526d": "valentines-day-cakes",
  "6418701c32b9746331725271": "baby-shower-cakes",
  "6418702632b9746331725275": "womens-day-cakes",
  "6418702d32b9746331725279": "new-year-cakes",
  "6418703532b974633172527d": "mothers-day-14th-may",
  "6418703d32b9746331725281": "fathers-day-18th-june",
  "6418707e32b9746331725285": "friendship-day-6th-aug",
  "6418710d32b97463317252b1": "independence-day-15-aug",
  "6418711432b97463317252b5": "raksha-bandhan-30th-aug",
  "6418711c32b97463317252b9": "teachers-day-05th-sept",
  "6418712332b97463317252bd": "happy-diwali-12th-nov",
  "6418713532b97463317252c3": "bhai-dooj-15th-nov",
};

let shapes = {
  "64186c3c32b9746331725227": "round-cakes",
  "64186c4532b974633172522b": "square-cakes",
  "64186c6532b974633172522f": "rectangular-cakes",
  "64186c6e32b9746331725233": "heart-shaped-cakes",
  "64d6a436909a0a9183f21c2d": "custom-shape",
};

let cakeTypes = {
  "641871bf32b97463317252f4": "fresh-cream-cakes",
  "6418720332b97463317252f8": "fondant-cakes",
  "6418724332b974633172532c": "flowers-cakes",
  "64d77c22909a0a9183f21fba": "fresh-cream-and-semi-fondant",
};

export function getRedirect(queryString, attribute) {
  const data = queryString.get(attribute);
  if (attribute === "flavour") {
    if (flavours[data]) {
      queryString.set(attribute, flavours[data]);
      return queryString;
    }
  } else if (attribute === "shape") {
    if (shapes[data]) {
      queryString.set(attribute, shapes[data]);
      return queryString;
    }
  } else if (attribute === "occasion") {
    if (occasions[data]) {
      queryString.set(attribute, occasions[data]);
      return queryString;
    }
  } else if (attribute === "cakeType") {
    if (cakeTypes[data]) {
      queryString.set(attribute, cakeTypes[data]);
      return queryString;
    }
  }

  return null;
}
