"use strict";

let userData = [];

export const updateOptions = {
  method: "",
  body: "",
  headers: { "Content-Type": "application/json" },
};

// Fetching user data from the server
export const fetchUserData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();

    for (const key in data) {
      userData.push({
        uniqueKey: key,
        id: data[key].id,
        name: data[key].name,
        emailAddress: data[key].emailAddress,
        address: data[key].address,
      });
    }
  } catch (err) {
    console.error(`Something went wrong fetching your request: ${err}`);
  }

  return userData;
};

// Modifying user data - updating and deleting
export const updateUserData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
  } catch (err) {
    console.error(`Something went wrong fetching your request: ${err}`);
  }
};
