"use strict";

// Name, email and address validation
export const validator = (name, email, address, valid) => {
  valid = false;

  const nameRegExp = /^(?=.{5,30}$)[a-záéíóúöőáüűé\-\s]+$/i;
  const emailRegExp = /\S+@\S+\.\S+/i;
  const addressRegExp = /\w\s\w/i;

  const nameMatch = String(name).toLowerCase().match(nameRegExp);
  const emailMatch = String(email).toLowerCase().match(emailRegExp);
  const addressMatch = String(address).toLowerCase().match(addressRegExp);

  nameMatch && emailMatch && addressMatch ? (valid = true) : null;

  return valid;
};
