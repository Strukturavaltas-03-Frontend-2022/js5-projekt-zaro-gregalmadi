"use strict";

const inputFields = document.querySelectorAll(".newUser input");

// Name, email and address validation
export const validator = (valid) => {
  valid = false;

  const nameRegExp = /^(?=.{5,30}$)[a-záéíóúöőáüűé\-\s]+$/i;
  const emailRegExp = /\S+@\S+\.\S+/i;
  const addressRegExp = /\w\s\w/i;

  const nameMatch = String(inputFields[0].value)
    .toLowerCase()
    .match(nameRegExp);
  const emailMatch = String(inputFields[1].value)
    .toLowerCase()
    .match(emailRegExp);
  const addressMatch = String(inputFields[2].value)
    .toLowerCase()
    .match(addressRegExp);

  !nameMatch
    ? (inputFields[0].style.border = "2px solid red")
    : (inputFields[0].style.border = "none");
  !emailMatch
    ? (inputFields[1].style.border = "2px solid red")
    : (inputFields[1].style.border = "none");
  !addressMatch
    ? (inputFields[2].style.border = "2px solid red")
    : (inputFields[2].style.border = "none");

  if (nameMatch && emailMatch && addressMatch) {
    valid = true;
  }

  return valid;
};
