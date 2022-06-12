// klasa Ui - obsługa interfejsu 2D aplikacji (pola txt, przycisk logowania)

class Ui {
  constructor() {
    document.querySelector(".accept").onclick = this.login;
    document.querySelector(".clear").onclick = this.reset;

    const dialog = document.querySelector(".dialog")
    dialog.showModal()
    dialog.style.display = "flex"
  }

  // forward nick to server (can new user  play?)
  login = () => {
    //console.warn("login");
    let data = document.querySelector("#login").value;
    net.loginFetch(data);
  };

  // reset input value
  reset = () => {
    //console.warn("reset");
    document.querySelector("#login").value = "";
    net.resetLogin()
  };

  // first user passed
  loggedFirstUser = (text) => {
    //console.warn("loggedFirstUser");
    document.querySelector("#userName").innerHTML = text;
    const dialog = document.querySelector(".dialog")
    dialog.removeAttribute('id')
    dialog.close()

    ui.waitingPlayer()
  };

  // waiting for a second player
  waitingPlayer = () => {
    //console.warn("waitingPlayer");
    net.waitingFetch()
    ui.waitingWheel();
  };


  // waiting wheel initialization
  waitingWheel = () => {
    const waiting = document.querySelector(".dialog")
    waiting.setAttribute("id", "waiting")
    waiting.innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`
    waiting.showModal()
    waiting.style.display = "flex"
  };

  // second user passed
  loggedSecondUser = (text) => {
    //console.warn("loggedSecondUser");
    document.querySelector("#userName").innerHTML = text;
    const dialog = document.querySelector(".dialog")
    dialog.removeAttribute('id')
    dialog.close()

    game.player(2)
  };

  // user with same nick already logged
  loginFailed = (text) => {
    //console.warn("loginFailed");
    document.querySelector("#userName").innerText = text;
    this.reset()
  };

  // waiting for move initialization
  pawnMove = (pawnID) => {
    console.warn("pawnMove");
    ui.stopTimer();
    document.body.onclick = ""
    document.querySelector("#timeLeft").style.display = "none";
    setTimeout(ui.waitingForMove, 1000, pawnID);
  };

  // waiting for second player to make a move
  waitingForMove = async (userId) => {
    // restart server time
    await net.timerChecker()

    // waiting time display
    const dialog = document.querySelector(".dialog")
    dialog.setAttribute("id", "userMonit")
    dialog.showModal()
    dialog.style.display = "flex"
    dialog.innerHTML = "Ruch przeciwnika<br>30s";

    // opponent time is running out
    let interval = setInterval(async () => {
      let stoper = await net.timerFlies();
      dialog.innerHTML = "Ruch przeciwnika<br>" + stoper.seconds + "s";

      // when time is running. Have the opponent make a move?
      if (stoper.seconds > -1) {
        let response = await net.compareFetchTables(userId, interval);
        if (response.newTableStatus) {
          // console.warn("Opponent make move");
          // stop interval 
          clearInterval(interval)

          // remove display waiting time
          const userMonit = document.querySelector(".dialog")
          userMonit.close()
          userMonit.style.display = "none"
          userMonit.removeAttribute('id')

          // this is animation of your opponent move
          game.opponentAction(userId, response);

          // start count time for your move
          ui.timeForMove(response.whitePawns, response.redPawns);
        }
        return
      }

      // when times gone
      clearInterval(interval)
      dialog.innerHTML = `
        <div style="display:block">
          <div>Wygrałeś</div>
          <div style="font-size: 0.5em;">Twój przeciwnik nie wykonał ruchu</div>
        </div>
      `
    }, 1000);
  };

  // timer for player which actual make a move
  timeForMove = async (whitePawns, redPawns) => {
    await net.timerStart();

    // one user lose the game (no pawns)
    if (whitePawns == 0 || redPawns == 0) {
      // turn off click
      this.turnOffClick()

      setTimeout(function () {
        // stop time flies | hide time for your move
        ui.stopTimer();
        document.querySelector("#timeLeft").remove()

        // display dialog message ---> LOSE (no pawns)
        const dialog = document.querySelector(".dialog")
        dialog.setAttribute("id", "userMonit")
        dialog.showModal()
        dialog.style.display = "flex"
        dialog.innerHTML = `
          <div style="display:block">
            <div>Przegrałeś</div>
            <div style="font-size: 0.5em;">Przeciwnik zbił wszystkie twoje pionki</div>
          </div>`

      }, 1000);
    } else {
      this.timeInterval = setInterval(async () => {
        // time left for make move
        let currentTime = await net.timerChecker()
        document.querySelector("#timeLeft").style.display = "flex";
        document.querySelector("#timeLeft").innerHTML = "Czas na wykonanie ruchu: " + currentTime.seconds + "s";

        if (game.randomClicked) {
          if (currentTime.seconds == 1) {
            ui.stopTimer();

            console.warn("INFO");
            net.updateFetchTable("failed", this.userTest, false, false, false);
            return
          }
        }

        if (currentTime.seconds == 0) {
          // stop time flies
          ui.stopTimer();

          // hide time for your move
          document.querySelector("#timeLeft").remove()

          // display dialog message ---> LOSE (time lease)
          const dialog = document.querySelector(".dialog")
          dialog.setAttribute("id", "userMonit")
          dialog.showModal()
          dialog.style.display = "flex"
          dialog.innerHTML = `
          <div style="display:block">
            <div>Przegrałeś</div>
            <div style="font-size: 0.5em;">Nie wykonałeś ruchu</div>
          </div>`

          // turn off click
          this.turnOffClick()
        }
      }, 200);
    }
  };

  // stop timer (player which make move)
  stopTimer = async () => {
    clearInterval(this.timeInterval);
  };

  // turn off click when dialog is display
  turnOffClick = () => {
    // turn off click
    document.body.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  // win game (game.js start it when the last pawn of opponent get captured)
  winGame = async () => {
    document.querySelector("#timeLeft").innerHTML = "";
    document.querySelector("#timeLeft").style.opacity = "0"

    // display dialog message ---> WIN (captured all pawns)
    const dialog = document.querySelector(".dialog")
    dialog.setAttribute("id", "userMonit")
    dialog.showModal()
    dialog.style.display = "flex"
    dialog.innerHTML = `
          <div style="display:block">
            <div>Wygrałeś</div>
            <div style="font-size: 0.5em;">Ukończyłeś grę jako pierwszy</div>
          </div>`

    // turn off click
    this.turnOffClick()
  };


  userInformation = (info) => {
    document.querySelector("#header2").style.display = "flex"
    const text = document.querySelector("#alerts").innerHTML
    document.querySelector("#alerts").innerHTML = info
    setTimeout(() => {
      document.querySelector("#alerts").innerHTML = text
    }, 1000, text)
  }
}

