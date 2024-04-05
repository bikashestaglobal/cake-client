export const validateNumber = (event) => {
  // Get the current value of the input
  let inputValue = event.target.value;

  // Create a regular expression pattern to allow only numbers
  const regexPattern = /^[0-9]*$/;

  if (!regexPattern.test(inputValue)) {
    // If it doesn't match, remove the invalid characters
    inputValue = inputValue.replace(/[^0-9]/g, "");
  }

  if (inputValue.length > 10) {
    inputValue = inputValue.slice(0, 10);
  }

  event.target.value = inputValue;
  return event;
};

export const validateNumberNew = (value) => {
  // Get the current value of the input
  let inputValue = value;

  // Create a regular expression pattern to allow only numbers
  const regexPattern = /^[0-9]*$/;

  if (!regexPattern.test(inputValue)) {
    // If it doesn't match, remove the invalid characters
    inputValue = inputValue.replace(/[^0-9]/g, "");
  }

  if (inputValue.length > 10) {
    inputValue = inputValue.slice(0, 10);
  }

  return inputValue;
};

export const validateOTP = (event) => {
  // Get the current value of the input
  let inputValue = event.target.value;

  // Create a regular expression pattern to allow only numbers
  const regexPattern = /^[0-9]*$/;

  if (!regexPattern.test(inputValue)) {
    // If it doesn't match, remove the invalid characters
    inputValue = inputValue.replace(/[^0-9]/g, "");
  }

  if (inputValue.length > 4) {
    inputValue = inputValue.slice(0, 4);
  }

  event.target.value = inputValue;
  return event;
};

export const validatePincode = (event) => {
  // Get the current value of the input
  let inputValue = event.target.value;

  // Create a regular expression pattern to allow only numbers
  const regexPattern = /^[0-9]*$/;

  if (!regexPattern.test(inputValue)) {
    // If it doesn't match, remove the invalid characters
    inputValue = inputValue.replace(/[^0-9]/g, "");
  }

  if (inputValue.length > 6) {
    inputValue = inputValue.slice(0, 6);
  }

  event.target.value = inputValue;
  return event;
};

export const validateText = (event) => {
  // Get the current value of the input
  let inputValue = event.target.value;

  // Create a regular expression pattern to allow only numbers
  const regexPattern = /^[A-Za-z\s]*$/;

  if (!regexPattern.test(inputValue)) {
    // If it doesn't match, remove the invalid characters
    inputValue = inputValue.replace(/[^A-Za-z\s]/g, "");
  }

  event.target.value = inputValue;
  return event;
};

export const validateTextNew = (value) => {
  let inputValue = value;
  // Create a regular expression pattern to allow only numbers
  const regexPattern = /^[A-Za-z\s]*$/;

  if (!regexPattern.test(inputValue)) {
    // If it doesn't match, remove the invalid characters
    inputValue = inputValue.replace(/[^A-Za-z\s]/g, "");
  }

  return inputValue;
};
