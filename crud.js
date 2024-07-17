
function numerator() {
    let x = 0;
        return function() {
            x += 1;
            return x;
        }
};

const newId = numerator()

class Persona {
    constructor(username, password) {
        this.id = newId
        this.username = username;
        this.password = password;
        
    };

    static createUser(username, password) {
        return new Persona(username, password);
    }

    static registerUser(username, password) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({username, password, role: 'regular'})
        localStorage.setItem(this.username, JSON.stringify(this));
    }
}

class usuarioRegular extends Persona {
    constructor(username, password) {
        super(username, password)
        this.Role = 'regular'

    }
    register() {
        super.registerUser()
    }

    createReservation(details) {
        let reservations = JSON.parse(localStorage.getItem(`${this.username}_reservations`)) || [];
        reservations.push(details);
        localStorage.setItem(`${this.username}_reservations`, JSON.stringify(reservations));
    }
  
    getReservations() {
        return JSON.parse(localStorage.getItem(`${this.username}_reservations`)) || [];
    }
}

class Administrador extends Persona {
    constructor(username, password,) {
        super(username, password)
        this.Role = 'admin'

    }

    register() {
        super.registerUser()
    }

    createReservationForUser(username, details) {
        let reservations = JSON.parse(localStorage.getItem(`${username}_reservations`)) || [];
        reservations.push(details);
        localStorage.setItem(`${username}_reservations`, JSON.stringify(reservations));
    }
  
    deleteReservation(username, index) {
        let reservations = JSON.parse(localStorage.getItem(`${username}_reservations`)) || [];
        reservations.splice(index, 1);
        localStorage.setItem(`${username}_reservations`, JSON.stringify(reservations));
    }
  
    updateReservation(username, index, details) {
        let reservations = JSON.parse(localStorage.getItem(`${username}_reservations`)) || [];
        reservations[index] = details;
        localStorage.setItem(`${username}_reservations`, JSON.stringify(reservations));
    }
    
}

Administrador.createReservationForUser()

class Auth {
    static login(username, password) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      let user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        return user;
      }
      return null;
    }
  
    static logout() {
      localStorage.removeItem('loggedInUser');
    }
  
    static getLoggedInUser() {
      return JSON.parse(localStorage.getItem('loggedInUser'));
    }
  }
  
  function registerUser() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let role = document.getElementById('role').value;
    console.log(registerUser)
  
    if (role === 'regular') {
      usuarioRegular.registerUsa(username, password);
    } else if (role === 'admin') {
      Administrador.registerUsa(username, password);
    }
  }
  
  function loginUser() {
    let username = document.getElementById('loginUsername').value;
    let password = document.getElementById('loginPassword').value;
    let user = Auth.login(username, password);
    if (user) {
      document.getElementById('login').style.display = 'none';
      document.getElementById('reservation').style.display = 'block';
    }
  }
  
  function createReservation() {
    let user = Auth.getLoggedInUser();
    let details = document.getElementById('details').value;
    if (user.role === 'regular') {
      let userObj = new UsuarioRegular(user.username, user.password);
      userObj.createReservation(details);
    } else if (user.role === 'admin') {
      let userObj = new Administrador(user.username, user.password);
      userObj.createReservationForUser(user.username, details);
    }
  }