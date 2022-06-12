// klasa Net - komunikacja z serwerem - fetch
class Net {
  constructor() { }

  // main fetch (suits all request)
  fetchPostAsync = async (request, data) => {
    const options = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: data,
    };
    //console.log(options);

    let response = await fetch(request, options)
    if (!response.ok)
      return response.status
    else
      return await response.json() // response.json

  }

  // login checker
  loginFetch = async (username) => {
    //console.warn("loginFetch");
    const request = "/login"
    if (!username) {
      ui.loginFailed("Podaj nick");
      return
    }
    const data = JSON.stringify({
      username: username
    })

    let response = await this.fetchPostAsync(request, data)
    //console.log(response)

    // user cannot be logged
    if (response.userId == 0) {
      ui.loginFailed(response.text);
      return
    }

    // first user logged
    if (response.userId == 1) {
      ui.loggedFirstUser(response.text);
      return
    }

    // second user logged
    if (response.userId == 2) {
      ui.loggedSecondUser(response.text);
      return
    }
  }

  // waiting for second player (circle)
  waitingFetch = async () => {
    //console.warn("waitingFetch");
    const request = "/waiting"
    const data = ""

    let interval = setInterval(async () => {
      let response = await this.fetchPostAsync(request, data)

      // break interval
      if (response.passed) {
        ui.timeForMove();
        clearInterval(interval);

        // remove waiting circle
        const dialog = document.querySelector(".dialog")
        dialog.close()
        dialog.removeAttribute('id')
        dialog.style.display = "none"

        // first player start a game (params define user id);
        game.player(1);
      }
    }, 200, request, data);
    return
  }

  // count pawns on board
  pawnsCheck = async () => {
    //console.warn("pawnsCheck");
    const request = "/pawnsCheck"
    const data = ""

    let response = await this.fetchPostAsync(request, data)
    //console.warn(response);
    return response
  }

  // pawn captured ----> update table (of pawns location) on server
  pawnsChange = async (define) => {
    //console.warn("pawnsChange");
    const request = "/pawnsChange"
    let data
    if (define == "firstPawns") {
      data = JSON.stringify({
        removed: "firstPawns"
      })
    }

    if (define == "secondPawns") {
      data = JSON.stringify({
        removed: "secondPawns"
      })
    }

    let response = await this.fetchPostAsync(request, data)
    //console.warn(response);
    return response
  }

  // looking for a new table of pawn  on server
  updateFetchTable = async (action, pawnId, board, newPawn, newPawnLocation, captured, coords, homeState) => {
    console.warn("updateFetchTable");
    game.randomNumber = ""
    document.querySelector("#header2").style.display = "none"
    document.onclick = ""

    if (homeState < 4) {
      setTimeout(ui.waitingForMove, 3000, pawnId);
      homeState = false
    } else {
      homeState = true
    }

    const request = "tableUpdate"
    const data = JSON.stringify({
      action: action,
      board: board,
      newPawn: newPawn,
      newPawnLocation: newPawnLocation,
      captured: captured,
      coords: coords,
      homeState: homeState
    })

    let response = await this.fetchPostAsync(request, data)
  };


  // compare local and server arrays
  compareFetchTables = async (userId, interval) => {
    const request = "/compareTables"
    const data = ""

    let response = await this.fetchPostAsync(request, data)
    return response
  };

  // start timer (from 30s)
  timerStart = async () => {
    //console.warn("timerStart");
    const request = "/timer"
    const data = JSON.stringify({
      status: "start"
    })

    let response = await this.fetchPostAsync(request, data)
    //console.log(response);
    return response;
  }

  // time is running (every call reduce time)
  timerFlies = async () => {
    //console.warn("timerFlies");
    const request = "/timer"
    const data = JSON.stringify({
      status: "expired"
    })

    let response = await this.fetchPostAsync(request, data)
    return response;
  }

  // get time from server
  timerChecker = async () => {
    const request = "/timeCheck"
    const data = ""

    let response = await this.fetchPostAsync(request, data)
    return response;
  }

  // get time from server
  resetLogin = async () => {
    const request = "/resetLogin"
    const data = ""

    let response = await this.fetchPostAsync(request, data)
    return response;
  }

  tryRandom = async () => {
    const request = "/tryRandom"
    const data = ""

    let response = await this.fetchPostAsync(request, data)
    return response;
  }
}
