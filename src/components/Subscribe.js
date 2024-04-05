import React, { useState } from "react";
import Config from "../config/Config";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useFormik } from "formik";
import { newsletterSchema } from "../yupSchemas";

const Subscribe = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [loding, setLoding] = useState(false);

  const initialValues = { email: "" };

  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    setErrors,
  } = useFormik({
    initialValues,

    onSubmit: (values, helpers) => {
      setLoding(true);

      fetch(Config.SERVER_URL + "/newsletters", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setLoding(false);
            if (result.status == 200) {
              toast.success(result.message);
            } else {
              helpers.setErrors(result.error);
            }
          },
          (error) => {
            setLoding(false);
          }
        );
    },
    validationSchema: newsletterSchema,
  });

  return (
    <div className="">
      <form className="form-subcriber d-flex" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="email"
          name="email"
          value={values.email}
          placeholder="Your email address"
          onBlur={handleBlur}
        />
        <button className="btn" type="submit" disabled={loding}>
          {loding ? (
            <span className="d-flex justify-content-center align-items-center">
              Loading <Spinner />
            </span>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      <p
        className="text-danger mt-1"
        style={{ fontSize: "15px", marginLeft: "10px" }}
      >
        {touched.email && errors.email ? errors.email : ""}
      </p>
    </div>
  );
};

export default Subscribe;
