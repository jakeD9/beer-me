
// initialize firebase auth
var config = {
  apiKey: "AIzaSyCWat2b43WXa7yr8dZ4_aZ0WnyGPH-4dos",
  authDomain: "mybeer-8d95e.firebaseapp.com",
  databaseURL: "https://mybeer-8d95e.firebaseio.com",
  projectId: "mybeer-8d95e",
  storageBucket: "mybeer-8d95e.appspot.com",
  messagingSenderId: "222789239888"
};
firebase.initializeApp(config);

// get page elements from login page
const emailTxt = $("#name");
const passTxt = $("#password");
const loginBtn = $("#log-in");
const createAct = $("#new-account");
const beerBtn = $("#beer-btn");


// The API object contains methods for each kind of request we'll make
var API = {
  newUser: function(user) {
    return $.ajax({
      type: "POST",
      url: "api/users",
      data: {'email': user}
    });
  },
  newBeer: function(beer_name, brewery, abv, user) {
    return $.ajax({
      type: "POST",
      url: "api/beerlist",
      data: {
        'beer_name': beer_name,
        'brewery': brewery,
        'abv': abv,
        'user': user
      }
    });
  }
};



// authenticate users that are registered in firebase and copy the user ID to session storage
loginBtn.on("click", (event) => {
  const email = emailTxt.val().trim();
  const pass = passTxt.val().trim();
  console.log(email);
  console.log(pass);
  const auth = firebase.auth();
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.then((res) => {
    // console.log(res)
    console.log("Logged in as: " + res.user.email)
    sessionStorage.setItem("user", res.user.email);
    // console.log(sessionStorage.getItem("user"));
    // API.newUser(sessionStorage.getItem("user"));
    window.location.replace("http://localhost:3000/mybeers");;
  });
  promise.catch((error) => {
    console.log(error);
  });
});

// writes a new user to firebase
createAct.on("click", (event) => {
  const email = emailTxt.val().trim();
  const pass = passTxt.val().trim();
  // console.log(email);
  // console.log(pass);
  const auth = firebase.auth();
  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.then((res) => {
    console.log("New account created, please log in as: " + res.user.email)
    sessionStorage.setItem("user", res.user.email)
    API.newUser(sessionStorage.getItem("user"));
  });
  promise.catch((error) => console.log(error));
});

beerBtn.on("click", (event) => {
  const beer_name = $("#inputBeer").val().trim();
  const brewery = $("#inputBrewery").val().trim();
  const abv = $("#inputAbv").val().trim();
  const user = sessionStorage.getItem("user");
  console.log(beer_name.toString(), brewery, abv, user.toString());
  API.newBeer(beer_name, brewery, abv, user);
});
