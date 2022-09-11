"use strict";

import { fetchUserData, updateUserData, updateOptions } from "./fetch.js";
import { validator } from "./validation.js";

// HTML selectors
const userTable = document.querySelector(".table__user");
const addNewUserButton = document.querySelector(".btn--add");
const addNewUserRow = document.querySelector(".newUser");
const inputFields = document.querySelectorAll(".newUser input");
const clearButton = document.querySelector(".btn--clear");
const saveButton = document.querySelector(".btn--save");

const modal = document.querySelector(".modal");
const alertBox = document.querySelector(".alertBox");
const alertHeader = document.querySelector(".alert__header");
const alertContent = document.querySelector(".alert__content");

const newName = document.querySelector(".newName");
const newEmail = document.querySelector(".newEmail");
const newAddress = document.querySelector(".newAddress");

// Global variables
let deleteButtons;
let editButtons;
let users;

let createDOM;
let userData = [];
let updateData = {};
let editing = false;
let valid = false;

let editedUserID;
let editedUserRow;

const url =
  "https://js5-zaroprojekt-default-rtdb.europe-west1.firebasedatabase.app/users.json";

// Fetching data from the server and rendering DOM based on fetched data
(createDOM = async () => {
  userData = await fetchUserData(url);

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
    currentUserRow.remove();

    alertMessage(
      "DELETE",
      `Deleting user ${currentUserName} was successful!`,
      "green"
    );

    const userUniqueKey = userData.find(
      (user) => user.name === currentUserName
    ).uniqueKey;

    updateOptions.body = "";
    updateOptions.method = "DELETE";

    updateUserData(
      `https://js5-zaroprojekt-default-rtdb.europe-west1.firebasedatabase.app/users/${userUniqueKey}.json`,
      updateOptions
    );
  });

  editButton.addEventListener("click", () => {
    editing = true;

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
  });
};

// Adding new user logic
addNewUserButton.addEventListener("click", () => {
  enableInputFields();
  toggleAllEditButtons();
  addNewUserButton.classList.add("disabled");
  clearButton.classList.remove("disabled");
  saveButton.classList.remove("disabled");
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
saveButton.addEventListener("click", () => {
  const id = userData[userData.length - 1].id + 1;
  const name = newName.value;
  const emailAddress = newEmail.value;
  const address = newAddress.value;

  valid = validator(name, emailAddress, address, valid);

  // Validating - input matches criteria
  if (valid) {
    // If it's and edit request
    if (editing) {
      toggleAllEditButtons();

      const editedUser = userData.find((user) => user.id == editedUserID);

      // Updating userData
      editedUser.name = name;
      editedUser.emailAddress = emailAddress;
      editedUser.address = address;

      // Updating HTML
      editedUserRow.children[1].innerHTML = name;
      editedUserRow.children[2].innerHTML = emailAddress;
      editedUserRow.children[3].innerHTML = address;

      alertMessage("EDIT", "Editing user was successful!", "green");
      // Updating backend server
      updateServerData(userData);
    }
    // If it's a new user request
    else {
      const generateUniqueKey = `-ZBCe6ZZ${Math.trunc(
        Math.random() * 1000000000000
      )}`;

      userData.push({
        uniqueKey: generateUniqueKey,
        id,
        name,
        emailAddress,
        address,
      });

      const userRow = document.createElement("tr");
      userRow.classList.add("user");
      userTable.appendChild(userRow);
      userRow.innerHTML = `<td class='user_id'>${id}</td> <td class='user_name'>${name}</td> <td class='user_email'>${emailAddress}</td> <td class='user_address'>${address}</td> <td class='buttons'><button class='btn--edit'><i class="fa fa-pencil" aria-hidden="true"></i></button><button class='btn--delete'><i class="fa fa-trash-o" aria-hidden="true"></i></button>
    </td>`;

      users = document.querySelectorAll(".user");

      /*generateEventListeners(index);*/
      alertMessage("CREATE", "Adding new user was successful!", "green");

      updateServerData(userData);
    }

    resetInputFields();
    clearButton.classList.add("disabled");
    saveButton.classList.add("disabled");
    addNewUserButton.classList.remove("disabled");
  } else {
    alertMessage(
      "ERROR",
      "One or more of your inputs do not match criteria!",
      "red"
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
  inputFields.forEach((input) => {
    input.value = "";
    input.classList.add("disabled");
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

// Updating package and uploading to server
const updateServerData = (userData) => {
  userData.forEach((user) => {
    updateData[user.uniqueKey] = {
      id: user.id,
      name: user.name,
      emailAddress: user.emailAddress,
      address: user.address,
    };
  });

  updateOptions.method = "PUT";
  updateOptions.body = JSON.stringify(updateData);
  updateUserData(url, updateOptions);
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
