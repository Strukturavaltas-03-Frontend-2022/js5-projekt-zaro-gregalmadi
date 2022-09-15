"use strict";

export const languageChanger = (lang) => {
  if (lang === "en") {
    return [
      {
        header: "LÉTREHOZÁS",
        message: "Új felhasználó felvétele sikeres!",
        color: "green",
      },
      {
        header: "MÓDOSÍTÁS",
        message: "Felhasználó módosítása sikeres!",
        color: "green",
      },
      {
        header: "TÖRLÉS",
        message: "Felhasználó törlése sikeres!",
        color: "green",
      },
      {
        header: "HIBA",
        message: "Egy vagy több beviteli érték nem felel meg az elvárásoknak!",
        color: "red",
      },
      {
        text: "A beviteli mező nem teljesíti a feltételeket!",
      },
    ];
  } else if (lang === "hu") {
    return [
      {
        header: "CREATE",
        message: "Adding new user was successful!",
        color: "green",
      },
      {
        header: "EDIT",
        message: "Editing user was successful!",
        color: "green",
      },
      {
        header: "DELETE",
        message: "Deleting user was successful!",
        color: "green",
      },
      {
        header: "ERROR",
        message: "One or more of your inputs do not match criteria!",
        color: "red",
      },
      {
        text: "Input does not match criteria!",
      },
    ];
  }
};
