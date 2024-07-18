class Utilities {
  static numerator() {
    let x = 0;
    return function () {
      x += 1;
      return x;
    };
  }
}

const newId = Utilities.numerator();

class Persona {
  constructor(username, password) {
    this.id = newId();
    this.username = username;
    this.password = password;
  }

  //   static createUser(username, password) {
  //     const newUser = new Persona(username, password);
  //     return newUser;
  //   }

  static registerUser(user) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }
}

class usuarioRegular extends Persona {
  constructor(username, password) {
    super(username, password);
    this.Role = "regular";
  }
  static register(user) {
    super.registerUser(user);
  }

  createReservation(details) {
    let reservations =
      JSON.parse(localStorage.getItem(`${this.username}_reservations`)) || [];
    reservations.push(details);
    localStorage.setItem(
      `${this.username}_reservations`,
      JSON.stringify(reservations)
    );
  }

  getReservations() {
    return (
      JSON.parse(localStorage.getItem(`${this.username}_reservations`)) || []
    );
  }
}

class Administrador extends Persona {
  constructor(username, password) {
    super(username, password);
    this.Role = "admin";
  }

  static register(user) {
    super.registerUser(user);
  }
  static createReservationForUser(username, details) {
    let reservations =
      JSON.parse(localStorage.getItem(`${username}_reservations`)) || [];
    reservations.push(details);
    localStorage.setItem(
      `${username}_reservations`,
      JSON.stringify(reservations)
    );
  }
  deleteReservation(username, index) {
    let reservations =
      JSON.parse(localStorage.getItem(`${username}_reservations`)) || [];
    reservations.splice(index, 1);
    localStorage.setItem(
      `${username}_reservations`,
      JSON.stringify(reservations)
    );
  }

  updateReservation(username, index, details) {
    let reservations =
      JSON.parse(localStorage.getItem(`${username}_reservations`)) || [];
    reservations[index] = details;
    localStorage.setItem(
      `${username}_reservations`,
      JSON.stringify(reservations)
    );
  }
}

Administrador.createReservationForUser();

class Auth {
  static login(username, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      return user;
    }
    return null;
  }

  static logout() {
    localStorage.removeItem("loggedInUser");
  }

  static getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  if (JSON.parse(localStorage.getItem("loggedInUser"))) {
    document.getElementById("login").style.display = "none";
    document.getElementById("reservation").style.display = "block";
  } else {
    document.getElementById("login").style.display = "block";
    document.getElementById("reservation").style.display = "none";
  }
});

function registerUser() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let role = document.getElementById("role").value;
  console.log(role);
  console.log(username);
  console.log(password);

  if (role === "regular") {
    const user = new usuarioRegular(username, password);
    usuarioRegular.register(user);

    alert("created successfully");
  } else if (role === "admin") {
    const user = new Administrador(username, password);
    Administrador.register(user);
    alert("created successfully");
  } else {
    console.log("apparently non-existent");
  }
}

function loginUser() {
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;
  let user = Auth.login(username, password);
  if (user) {
    document.getElementById("login").style.display = "none";
    document.getElementById("reservation").style.display = "block";
  }
}

function createReservation() {
  let user = Auth.getLoggedInUser();
  let details = document.getElementById("details").value;
  if (user.Role === "regular") {
    let userObj = new usuarioRegular(user.username, user.password);
    userObj.createReservation(details);
    document.getElementById("details").value = "";
  } else if (user.Role === "admin") {
    let userObj = new Administrador(user.username, user.password);
    userObj.createReservationForUser(user.username, details);

    document.getElementById("details").value = "";
  }
}
