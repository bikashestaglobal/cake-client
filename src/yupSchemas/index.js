import * as Yup from "yup";
export const loginSchema = Yup.object({
  mobile: Yup.string()
    .required("'Mobile' is a required field")
    .matches(/^[6-9]\d{9}$/, {
      message: "Please enter valid 'Mobile Number'",
      excludeEmptyString: false,
    }),
  password: Yup.string()
    .required("'Password' is a required field")
    .min(6, "'Password' must be at least 6 characters"),
});

export const loginWIthOTPSchema = Yup.object({
  mobile: Yup.string()
    .required("'Mobile' is a required field")
    .matches(/^[6-9]\d{9}$/, {
      message: "Please enter valid 'Mobile Number'",
      excludeEmptyString: false,
    }),
});

export const otpSchema = Yup.object({
  otp: Yup.string()
    .required("'OTP' is a required field")
    .min(4, "OTP length must be 4 digits")
    .max(4, "OTP length must be 4 digits"),
});

export const updateName = Yup.object({
  name: Yup.string()
    .required("'Name' is a required field")
    .min(2, "'Name' length must be 2 character length"),
});

export const reviewSchema = Yup.object({
  name: Yup.string()
    .required("'Name' is a required field")
    .min(2, "'Name' length must be 2 character length"),
  message: Yup.string().optional(),
});

export const registrationSchema = Yup.object({
  // name: Yup.string()
  //   .required("'Name' is a required field")
  //   .trim()
  //   .min(2, "'Name' must be at least 2 characters")
  //   .matches(/^[A-Za-z\s]*$/, {
  //     message: "Name should be text only",
  //     excludeEmptyString: true,
  //   }),
  mobile: Yup.string()
    .required("'Mobile' is a required field")
    .matches(/^[6-9]\d{9}$/, {
      message: "Please enter valid 'Mobile Number'",
      excludeEmptyString: false,
    }),
  privacyPolicy: Yup.boolean().required("'Privacy Policy' must be checked"),
});

export const newsletterSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid 'Email'")
    .required("'Email' is a required field"),
});

export const addressSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("'Name' is a required field")
    .min(2, "'Name' should be at least 2 characters"),
  mobile: Yup.string()
    .required("'Mobile' is a required field")
    .matches(/^[6-9]\d{9}$/, {
      message: "Please enter valid 'Mobile Number'",
      excludeEmptyString: false,
    }),
  alternateMobile: Yup.string().matches(/^[6-9]\d{9}$/, {
    message: "Please enter valid 'Mobile Number'",
    excludeEmptyString: false,
  }),
  address: Yup.string()
    .trim()
    .required("'Address' is a required field")
    .min(2, "'Address' should be at least 2 characters"),
  landmark: Yup.string()
    .trim()
    .required("'Landmark' is a required field")
    .min(2, "'Landmark' should be at least 2 characters"),
  city: Yup.string()
    .trim()
    .required("'City' is a required field")
    .min(2, "'City' should be at least 2 characters"),
  pincode: Yup.string()
    .trim()
    .required("'City' is a required field")
    .min(6, "'Pincode' should be at least 6 digits")
    .max(6, "'Pincode' should be maximum 6 digits"),
  addressType: Yup.string().required("'Address Type' is a required field"),
});
