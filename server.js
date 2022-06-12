// base variables
var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000
app.use(express.static("static")); // serwuje stronę index.html
app.use(express.json());

app.listen(PORT, () => {
  console.log("start serwera na porcie " + PORT);
});

// users login module
let loginTable = [];
app.post("/login", async (req, res) => {
  let selectAnswer = (login) => {
    let data
    if (loginTable.length == 0) {
      loginTable.push(login);
      data = { userId: 1, text: "Grasz jako " + login };
      return data
    }

    if (loginTable.length == 1 && loginTable[0] == login) {
      data = { userId: 0, text: "Taki login jest zajęty" };
      return data
    }

    if (loginTable.length == 1 && loginTable[0] !== login) {
      loginTable.push(login);
      data = { userId: 2, text: "Grasz jako " + login };
      return data
    }

    data = { userID: 0, text: "Za dużo graczy" };
    return data
  }

  let login = req.body.username;
  let answer = await selectAnswer(login)
  res.send(answer);
  console.log(loginTable);
});

// checking the number of users (start game with two users)
app.post("/waiting", (req, res) => {
  if (loginTable.length == 2) {
    res.send({ passed: true });
  } else {
    res.send({ passed: false });
  }
});


// start table (updated with the players move)
let serverTab = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];
let currentTab = serverTab;
let action = ""
let newPawn = ""
let newPawnLocation = ""
let board
let captured
let coords
let homeState
let random

app.post("/tableUpdate", (req, res) => {
  // currentTab = req.body.newTable
  action = req.body.action
  newPawn = req.body.newPawn
  newPawnLocation = req.body.newPawnLocation
  board = req.body.board
  coords = req.body.coords
  captured = req.body.captured
  homeState = req.body.homeState
  res.send({ status: 'passed' })
})

// compare tables and check for update
app.post("/compareTables", (req, res) => {
  if (action != "") {
    res.send({
      action: action,
      newPawn: newPawn,
      board: board,
      newPawnLocation: newPawnLocation,
      captured: captured,
      coords: coords,
      homeState: homeState,
      newTableStatus: true
    });
    action = ""
  } else {
    res.send({ newTableStatus: false });
  }
});

app.post("/tryRandom", (req, res) => {
  random = true
});

app.post("/resetLogin", (req, res) => {
  console.log(loginTable);
  loginTable = []
  console.log(loginTable);
});

// time settings
let time = 30;
app.post("/timer", (req, res) => {
  if (req.body.status == "start") {
    time = 30;
  } else if (req.body.status == "expired") {
    time--;
  }
  res.send({ seconds: time });
});

// check time
app.post("/timeCheck", (req, res) => {
  res.send({ seconds: time });
})

// number of pawns on board (check for win)
let firstPawns = 8
let secondPawns = 8
app.post("/pawnsCheck", (req, res) => {
  data = {
    firstPawns: firstPawns,
    secondPawns: secondPawns
  }
  res.send(data);
})

// which pawn was captured (player identification)
app.post("/pawnsChange", (req, res) => {
  if (req.body.removed == "firstPawns") {
    firstPawns--
  } else if (req.body.removed == "secondPawns") {
    secondPawns--
  }

  data = {
    firstPawns: firstPawns,
    secondPawns: secondPawns
  }
  res.send(data);
})
