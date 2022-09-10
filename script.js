"use strict";

// HTML selectors
const userTable = document.querySelector(".table__user");
const addNewUserButton = document.querySelector(".btn--add");
const addNewUserRow = document.querySelector(".newUser");
const inputFields = document.querySelectorAll(".newUser input");
const clearButton = document.querySelector(".btn--clear");
const saveButton = document.querySelector(".btn--save");

const newName = document.querySelector(".newName");
const newEmail = document.querySelector(".newEmail");
const newAddress = document.querySelector(".newAddress");

// Global variables
let deleteButtons;
let editButtons;
let users;
let userData = [];
let updateData = {};
let editing = false;
let allGood = false;

let editedUserID;
let editedUserRow;

const url =
  "https://js5-zaroprojekt-default-rtdb.europe-west1.firebasedatabase.app/users.json";

// Fetching data from the server
const fetchUserData = async (url) => {
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

  createDOM();
};

fetchUserData(url);

// Sending POST requests to the server
const updateUserData = async (url, uploadData) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(uploadData),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(`Something went wrong fetching your request: ${err}`);
  }
};

const deleteUserData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(`Something went wrong fetching your request: ${err}`);
  }
};

// Adding edit and delete logic for each data row
const generateEventListeners = (i) => {
  const deleteButton = deleteButtons[i];
  const editButton = editButtons[i];
  const currentUserRow = users[i];
  const currentUserName = currentUserRow.children[1].innerHTML;

  deleteButton.addEventListener("click", () => {
    currentUserRow.remove();

    alert(`Deleting user ${currentUserName} was successful.`);

    const userUniqueKey = userData.find(
      (user) => user.name === currentUserName
    ).uniqueKey;

    deleteUserData(
      `https://js5-zaroprojekt-default-rtdb.europe-west1.firebasedatabase.app/users/${userUniqueKey}.json`
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

// Rendering DOM based on fetched data
const createDOM = () => {
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

  validator(name, emailAddress, address);

  // Validating - input matches criteria
  if (allGood) {
    // If it's and edit request
    if (editing) {
      console.log("This is an editing request");
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

      // Updating backend server
      userData.forEach((user) => {
        updateData[user.uniqueKey] = {
          id: user.id,
          name: user.name,
          emailAddress: user.emailAddress,
          address: user.address,
        };
      });

      updateUserData(url, updateData);
    }
    // If it's a new user request
    else {
      console.log("This is a new user request");

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
      const index = users.length - 1;

      /*generateEventListeners(index);*/
      alert("Adding new user was successful!");

      userData.forEach((user) => {
        updateData[user.uniqueKey] = {
          id: user.id,
          name: user.name,
          emailAddress: user.emailAddress,
          address: user.address,
        };
      });

      updateUserData(url, updateData);
    }
  } else {
    throw new Error("One or more of your inputs do not match criteria!");
  }

  resetInputFields();
  clearButton.classList.add("disabled");
  saveButton.classList.add("disabled");
  addNewUserButton.classList.remove("disabled");
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

// Name, email and address validation
const validator = (name, email, address) => {
  allGood = false;

  const nameRegExp = /^(?=.{5,30}$)[a-záéíóúöőáüűé\-\s]+$/i;
  const emailRegExp = /\S+@\S+\.\S+/i;
  const addressRegExp = /\w\s\w/i;

  const nameMatch = String(name).toLowerCase().match(nameRegExp);
  const emailMatch = String(email).toLowerCase().match(emailRegExp);
  const addressMatch = String(address).toLowerCase().match(addressRegExp);

  if (!nameMatch || !emailMatch || !addressMatch) {
    alert("Input fields do not match criteria!");
  } else {
    alert("ready to go");
    allGood = true;
  }

  return allGood;
};
