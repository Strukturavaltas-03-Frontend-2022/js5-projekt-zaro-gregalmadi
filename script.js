"use strict";

import { fetchUserData, updateUserData, updateOptions } from "./fetch.js";
import { validator } from "./validation.js";
import { languageChanger } from "./languagePacks.js";

// HTML selectors
const userTable = document.querySelector(".table__user--body");
const addNewUserButton = document.querySelector(".btn--add");
const addNewUserRow = document.querySelector(".newUser");
const inputFields = document.querySelectorAll(".newUser input");
const errorFields = document.querySelectorAll(".error");
const clearButton = document.querySelector(".btn--clear");
const saveButton = document.querySelector(".btn--save");

const modal = document.querySelector(".modal");
const alertBox = document.querySelector(".alertBox");
const alertHeader = document.querySelector(".alert__header");
const alertContent = document.querySelector(".alert__content");

const languageSetting = document.querySelector(".flag");

const sortById = document.querySelector(".header__id");
const sortByName = document.querySelector(".header__name");

const newName = document.querySelector(".newName");
const newEmail = document.querySelector(".newEmail");
const newAddress = document.querySelector(".newAddress");

// Global variables
let deleteButtons;
let editButtons;
let users;

let createDOM;
let userData = [];
let editing = false;
let valid = false;
let en = true;
let languagePack = languageChanger("hu");

let editedUserID;
let editedUserRow;

const url =
  "https://js5-zaroprojekt-default-rtdb.europe-west1.firebasedatabase.app/users";

// Fetching data from the server and rendering DOM based on fetched data
(createDOM = async () => {
  userData = await fetchUserData(`${url}.json`);

  userData.forEach((user, i) => {
    const userRow = document.createElement("tr");
    userRow.classList.add("user");
    userTable.appendChild(userRow);
    userRow.innerHTML = `<td class='user_id'>${user.id}</td> <td class='user_name'>${user.name}</td> <td class='user_email'>${user.emailAddress}</td> <td class='user_address'>${user.address}</td> <td class='buttons'><button class='btn--edit'><i class="fa fa-pencil" aria-hidden="true"></i></button><button class='btn--delete'><i class="fa fa-trash-o" aria-hidden="true"></i></button>
    </td>`;

    users = document.querySelectorAll(".user");
    deleteButtons = document.querySelectorAll(".btn--delete");
    editButtons = document.querySelectorAll(".btn--edit");

    generateEventListeners(i);
  });
})();

// Adding edit and delete logic for each data row
const generateEventListeners = (i) => {
  const deleteButton = deleteButtons[i];
  const editButton = editButtons[i];
  const currentUserRow = users[i];
  const currentUserName = currentUserRow.children[1].innerHTML;

  deleteButton.addEventListener("click", () => {
    // Delete user from the DOM
    currentUserRow.remove();

    // Displaying alert message of successful deletion
    alertMessage(
      languagePack[2].header,
      languagePack[2].message,
      languagePack[2].color
    );

    // Searching for user unique key for database identification
    const userUniqueKey = userData.find(
      (user) => user.name === currentUserName
    ).uniqueKey;

    // Deleting user data from local user object
    userData = userData.filter((user) => !(user.name === currentUserName));

    // Updating fetch options for delete request, and updating backend server
    updateOptions.body = "";
    updateOptions.method = "DELETE";

    updateUserData(`${url}/${userUniqueKey}.json`, updateOptions);
  });

  editButton.addEventListener("click", () => {
    editing = true;
    window.scrollTo({ top: 0, behavior: "smooth" });

    editedUserRow = users[i];
    editedUserID = users[i].children[0].innerHTML;
    const username = users[i].children[1].innerHTML;
    const emailAddress = users[i].children[2].innerHTML;
    const address = users[i].children[3].innerHTML;

    newName.value = username;
    newEmail.value = emailAddress;
    newAddress.value = address;

    enableInputFields();
    toggleAllEditButtons();
    clearButton.classList.remove("disabled");
    saveButton.classList.remove("disabled");
    addNewUserButton.classList.add("disabled");

    realTimeValidationCall();
  });
};

// Adding new user logic
addNewUserButton.addEventListener("click", () => {
  editing = false;
  enableInputFields();
  toggleAllEditButtons();
  addNewUserButton.classList.add("disabled");
  clearButton.classList.remove("disabled");
  saveButton.classList.remove("disabled");

  realTimeValidationCall();
});

// Clearing input fields for editing and adding new users
clearButton.addEventListener("click", () => {
  resetInputFields();
  toggleAllEditButtons();
  clearButton.classList.add("disabled");
  saveButton.classList.add("disabled");
  addNewUserButton.classList.remove("disabled");
});

// Saving input fields for editing and adding new users
saveButton.addEventListener("click", async () => {
  let newID = 0;
  userData.forEach((user) => (user.id > newID ? (newID = user.id) : null));
  const name = newName.value;
  const emailAddress = newEmail.value;
  const address = newAddress.value;

  valid = validator(valid);

  // Validating - input matches criteria
  if (valid) {
    //------------------------------------------------------------------
    // If it's and edit request
    if (editing) {
      toggleAllEditButtons();

      // Finding edited user
      const editedUser = userData.find((user) => user.id == editedUserID);

      // Updating userData
      editedUser.name = name;
      editedUser.emailAddress = emailAddress;
      editedUser.address = address;

      // Updating HTML
      editedUserRow.children[1].innerHTML = name;
      editedUserRow.children[2].innerHTML = emailAddress;
      editedUserRow.children[3].innerHTML = address;

      alertMessage(
        languagePack[1].header,
        languagePack[1].message,
        languagePack[1].color
      );
      // Updating database
      updateOptions.method = "PUT";
      updateOptions.body = JSON.stringify({
        id: editedUser.id,
        name: editedUser.name,
        emailAddress: editedUser.emailAddress,
        address: editedUser.address,
      });
      updateUserData(`${url}/${editedUser.uniqueKey}.json`, updateOptions);
    }
    //------------------------------------------------------------------
    // If it's a new user request
    else {
      // Creating new user row
      const userRow = document.createElement("tr");
      userRow.classList.add("user");
      userTable.appendChild(userRow);
      userRow.innerHTML = `
      <td class='user_id'>${
        newID + 1
      }</td> <td class='user_name'>${name}</td> <td class='user_email'>${emailAddress}</td> <td class='user_address'>${address}</td> <td class='buttons'><button class='btn--edit disabled'><i class="fa fa-pencil" aria-hidden="true"></i></button><button class='btn--delete disabled'><i class="fa fa-trash-o" aria-hidden="true"></i></button></td>
      `;

      // Updating nodelists
      deleteButtons = document.querySelectorAll(".btn--delete");
      editButtons = document.querySelectorAll(".btn--edit");
      users = document.querySelectorAll(".user");

      generateEventListeners(users.length - 1);
      // Success alert for creating new user
      alertMessage(
        languagePack[0].header,
        languagePack[0].message,
        languagePack[0].color
      );
      toggleAllEditButtons();

      // Updating database
      updateOptions.method = "POST";
      updateOptions.body = JSON.stringify({
        id: newID + 1,
        name,
        emailAddress,
        address,
      });

      const newUniqueKey = await updateUserData(`${url}.json`, updateOptions);

      // Updating user array with newly generated uniqueKey
      userData.push({
        uniqueKey: newUniqueKey.name,
        id: newID + 1,
        name,
        emailAddress,
        address,
      });

      // Scroll to the new user row
      window.scrollTo({ top: 100000, behavior: "smooth" });
    }

    resetInputFields();
    clearButton.classList.add("disabled");
    saveButton.classList.add("disabled");
    addNewUserButton.classList.remove("disabled");
  } else {
    // Validating - input does not match criteria
    alertMessage(
      languagePack[3].header,
      languagePack[3].message,
      languagePack[3].color
    );
  }
});

// Enables all input fields for adding new users or editing existing ones
const enableInputFields = () => {
  inputFields.forEach((input) => {
    input.classList.remove("disabled");
  });
};

// Clears and disables all input fields when done editing
const resetInputFields = () => {
  inputFields.forEach((input, i) => {
    input.value = "";
    input.classList.add("disabled");
    input.style.border = "none";
    errorFields[i].style.display = "none";
  });
};

// Disables edit and delete buttons
const toggleAllEditButtons = () => {
  deleteButtons.forEach((btn) => {
    btn.classList.toggle("disabled");
  });

  editButtons.forEach((btn) => {
    btn.classList.toggle("disabled");
  });
};

// Alerting update and error messages
const alertMessage = (header, message, color) => {
  modal.style.display = "flex";
  modal.classList.add("fadeIn");
  alertBox.style.borderColor = color;
  alertHeader.innerHTML = header;
  alertContent.innerHTML = message;

  setTimeout(() => {
    clearTimeout();
    modal.classList.remove("fadeIn");
  }, 1000);

  setTimeout(() => {
    clearTimeout();
    modal.classList.add("fadeOut");
  }, 4000);

  setTimeout(() => {
    clearTimeout();
    modal.classList.remove("fadeOut");
    modal.style.display = "none";
  }, 5000);
};

// Language selector with flag icon - only affects alert messages
languageSetting.addEventListener("click", () => {
  if (en) {
    languageSetting.setAttribute("src", "./assets/en.png");
    languagePack = languageChanger("en");
    en = false;
  } else {
    languageSetting.setAttribute("src", "./assets/hu.png");
    languagePack = languageChanger("hu");
    en = true;
  }
});

// Sort by id, or name
let ascID = true;
let ascName = true;
sortById.addEventListener("click", () => {
  sortByName.innerHTML = "Name";
  if (ascID) {
    userData.sort((a, b) => b.id - a.id);
    ascID = false;
    sortById.innerHTML = "#";
    sortById.insertAdjacentHTML(
      "beforeend",
      '<i class="fa fa-level-down" aria-hidden="true"></i>'
    );
  } else {
    userData.sort((a, b) => a.id - b.id);
    ascID = true;
    sortById.innerHTML = "#";
    sortById.insertAdjacentHTML(
      "beforeend",
      '<i class="fa fa-level-up" aria-hidden="true"></i>'
    );
  }

  regenDOM();
});

sortByName.addEventListener("click", () => {
  sortById.innerHTML = "#";
  if (ascName) {
    userData.sort((a, b) => {
      let x = a.name.split(" ")[0];
      let y = b.name.split(" ")[0];
      return x < y ? -1 : x > y ? 1 : 0;
    });
    ascName = false;
    sortByName.innerHTML = "Name";
    sortByName.insertAdjacentHTML("beforeend", " (A-Z)");
  } else {
    userData.sort((a, b) => {
      let x = a.name.split(" ")[0];
      let y = b.name.split(" ")[0];
      return x > y ? -1 : x < y ? 1 : 0;
    });
    ascName = true;
    sortByName.innerHTML = "Name";
    sortByName.insertAdjacentHTML("beforeend", " (Z-A)");
  }

  regenDOM();
});

// Rerender DOM for sorting
const regenDOM = () => {
  users = document.querySelectorAll(".user");
  users.forEach((user) => {
    user.remove();
  });

  userData.forEach((user, i) => {
    const userRow = document.createElement("tr");
    userRow.classList.add("user");
    userTable.appendChild(userRow);
    userRow.innerHTML = `<td class='user_id'>${user.id}</td> <td class='user_name'>${user.name}</td> <td class='user_email'>${user.emailAddress}</td> <td class='user_address'>${user.address}</td> <td class='buttons'><button class='btn--edit'><i class="fa fa-pencil" aria-hidden="true"></i></button><button class='btn--delete'><i class="fa fa-trash-o" aria-hidden="true"></i></button>
    </td>`;

    users = document.querySelectorAll(".user");
    deleteButtons = document.querySelectorAll(".btn--delete");
    editButtons = document.querySelectorAll(".btn--edit");

    generateEventListeners(i);
  });
};

// Calling real time validation after 500ms of every keystroke
const realTimeValidationCall = () => {
  errorFields.forEach((error) => (error.innerHTML = languagePack[4].text));
  inputFields.forEach((input) => {
    input.addEventListener("keyup", () => {
      setTimeout(() => {
        clearTimeout();
        validator(valid);
      }, 500);
    });
    input.addEventListener("blur", () => {
      validator(valid);
    });
  });
};
