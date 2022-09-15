"use strict";

const inputFields = document.querySelectorAll(".newUser input");
const errorFields = document.querySelectorAll(".error");

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

  const displayError = (id) => {
    inputFields[id].style.border = "2px solid red";
    errorFields[id].style.display = "block";
  };
  const hideError = (id) => {
    inputFields[id].style.border = "none";
    errorFields[id].style.display = "none";
  };

  !nameMatch ? displayError(0) : hideError(0);
  !emailMatch ? displayError(1) : hideError(1);
  !addressMatch ? displayError(2) : hideError(2);

  nameMatch && emailMatch && addressMatch ? (valid = true) : null;

  return valid;
};
