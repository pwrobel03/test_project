// klasa Game - działania w 3D, generowanie planszy, pionków

class Game {
  constructor() {
    //console.warn("GAME");
    this.randomNumber = ""
    this.countRandom = 0
    this.randomClicked = false
    this.homeState = []

    // create board
    this.board = [];
    this.fieldSize = 15
    this.redPlayer = "rgb(220, 0, 0)"
    this.bluePlayer = "rgb(0, 0, 220)"
    this.yellowPlayer = "rgb(220, 220, 0)"
    this.greenPlayer = "rgb(0, 220, 0)"

    function createChessboard(board) {
      //console.warn("BOARD");
      for (let i = 0; i < 11; i++) {
        let row = [];
        for (let j = 0; j < 11; j++) {
          row.push("");
        }
        board.push(row);
      }
    }
    createChessboard(this.board);
    // console.table(this.board);

    // tworzenie tablicy pionków
    // this.pawns = [
    //   [0, 1, 0, 1, 0, 1, 0, 1],
    //   [1, 0, 1, 0, 1, 0, 1, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 2, 0, 2, 0, 2, 0, 2],
    //   [2, 0, 2, 0, 2, 0, 2, 0],
    // ];

    this.ludo = [
      [1, 1, "e", "e", 0, 0, 2, "e", "e", 2, 2],
      [1, 1, "e", "e", 0, 2, 0, "e", "e", 2, 2],
      ["e", "e", "e", "e", 0, 2, 0, "e", "e", "e", "e"],
      ["e", "e", "e", "e", 0, 2, 0, "e", "e", "e", "e"],
      [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, "e", 3, 3, 3, 3, 0],
      [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3],
      ["e", "e", "e", "e", 0, 4, 0, "e", "e", "e", "e"],
      ["e", "e", "e", "e", 0, 4, 0, "e", "e", "e", "e"],
      [4, 4, "e", "e", 0, 4, 0, "e", "e", 3, 3],
      [4, 4, "e", "e", 4, 0, 0, "e", "e", 3, 3]
    ]

    // array for pawns (class object)
    // this.graphicPawns = [];

    // scene basic WEBGL property
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);


    // setInterval(async () => {
    //   if (this.randomClicked) {
    //     let res = await net.timerChecker()
    //     console.log(res.seconds);
    //     if (res.seconds == 5) {
    //       console.warn("INFO");
    //       net.updateFetchTable("failed", this.userTest, false, false, false);
    //     }
    //   }
    // }, 1000);

    // setInterval(() => {
    //   console.log(this.homeState);
    // }, 1000);

    // Lights
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(100, 100, 0);
    this.scene.add(this.light);

    // Camera default look from red line
    // this.camera.position.set((this.fieldSize * this.board.length), 150, (this.fieldSize * this.board.length));
    this.camera.position.set(0, 350, -10);
    this.camera.lookAt(0, 0, 0);

    // board generator
    this.positionElement = this.fieldSize * (this.board.length / 2) - (this.fieldSize / 2);
    this.z = this.fieldSize * (this.board.length / 2) - (this.fieldSize / 2);

    this.ludoID = []
    // this.ludoName = []
    // console.table(this.ludo);

    this.board.forEach((row, i) => {
      this.ludoID.push([])
      // this.ludoName.push([])
      row.forEach((element, j) => {
        this.ludoID[i].push("")
        // this.ludoName[i].push("")
        if (this.ludo[i][j] == "e") { return }
        const geometry = new THREE.BoxGeometry(this.fieldSize, 12, this.fieldSize);
        const index = this.ludo[i][j]
        let color, nameColor = ""
        switch (index) {
          case 1:
            color = 0xFF0000
            nameColor = "_red"
            break;
          case 2:
            color = 0x0000FF
            nameColor = "_blue"
            break;
          case 3:
            color = 0x00FF00
            nameColor = "_green"
            break;
          case 4:
            color = 0xFFFF00
            nameColor = "_yellow"
            break;
          default:
            color = 0xffffff
          // code block
        }

        const materials = [];

        materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('img/boardTexture.png') }));
        materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('img/boardTexture.png') }));
        materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: color, map: new THREE.TextureLoader().load('img/texture.png') }));
        materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('img/boardTexture.png') }));
        materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('img/boardTexture.png') }));
        materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('img/boardTexture.png') }));

        //TODO: 
        const cube = new THREE.Mesh(geometry, materials);
        cube.position.x = this.positionElement - (this.fieldSize + 1) * j;
        cube.position.z = this.positionElement - (this.fieldSize + 1) * i;
        cube.name = i + "_" + j + nameColor;

        // wireframe
        var geo = new THREE.EdgesGeometry(cube.geometry);
        var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 20 });
        var wireframe = new THREE.LineSegments(geo, mat);
        wireframe.renderOrder = 2; // make sure wireframes are rendered 2nd
        cube.add(wireframe);



        // this.ludoID[i][j] = (i + "_" + j + nameColor)
        this.ludoID[i][j] = cube
        // this.ludoName[i][j] = cube.name
        // console.log(cube.name);


        this.light.position.set(1, 1, 1);
        this.scene.add(cube);
      })
    })

    console.table(this.ludoID)

    // material under board
    const geometry = new THREE.BoxGeometry((this.fieldSize * (this.board.length + 2)), 6, (this.fieldSize * (this.board.length + 2)));
    const material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("img/whiteTexture.png"),
      color: 0xAAAAAA,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = -1;
    this.light.position.set(1, 1, 1);
    this.scene.add(cube);

    // coordinate system axes
    this.axes = new THREE.AxesHelper(1000);
    this.scene.add(this.axes);
    this.scene.background = new THREE.TextureLoader().load("img/darkGradientTexture.png")

    // html append
    document.querySelector("#container").append(this.renderer.domElement);

    //render
    this.render();

    // console.table(this.ludoID);
    // console.table(this.ludoName);
    // console.log(this.ludoID[1][1].name);
    // console.log(this.ludoID[1][1]);

    // TODO: important
    const path = this.ludoID
    this.redPlayerPath = [
      path[4][0], path[4][1], path[4][2], path[4][3], path[4][4], path[3][4], path[2][4], path[1][4], path[0][4], path[0][5], path[0][6], path[1][6], path[2][6], path[3][6], path[4][6], path[4][7], path[4][8], path[4][9], path[4][10], path[5][10], path[6][10], path[6][9], path[6][8], path[6][7], path[6][6], path[7][6], path[8][6], path[9][6], path[10][6], path[10][5], path[10][4], path[9][4], path[8][4], path[7][4], path[6][4], path[6][3], path[6][2], path[6][1], path[6][0], path[5][0], path[5][1], path[5][2], path[5][3], path[5][4]
    ]
    this.greenPlayerPath = [
      path[6][10], path[6][9], path[6][8], path[6][7], path[6][6], path[7][6], path[8][6], path[9][6], path[10][6], path[10][5], path[10][4], path[9][4], path[8][4], path[7][4], path[6][4], path[6][3], path[6][2], path[6][1], path[6][0], path[5][0], path[4][0], path[4][1], path[4][2], path[4][3], path[4][4], path[3][4], path[2][4], path[1][4], path[0][4], path[0][5], path[0][6], path[1][6], path[2][6], path[3][6], path[4][6], path[4][7], path[4][8], path[4][9], path[4][10], path[5][10], path[5][9], path[5][8], path[5][7], path[5][6]
    ]
    // console.log(this.redPlayerPath.length);
    // this.ludoID[10][1].material.color.set(0xffAAFF)


  }

  randomButton = async () => {
    // console.warn("randomButton");
    // console.log(this.randomClicked)
    let randomNumber = await Math.round(Math.random() * 5) + 1
    // net.tryRandom()
    this.randomClicked = true


    this.randomClicked = true
    if (randomNumber < 6) {
      let condition
      this.playerPawns.forEach(element => {
        if (element.onBoard != "notExist") {
          condition = true
        }
      });

      if (condition) {
        // console.warn("Jest ok");
        document.querySelector("#header2").style.display = "flex"
        document.querySelector("#header2").style.display = "flex"
        document.querySelector("#alerts").innerHTML = "Wyrzuciłeś: " + randomNumber
        this.randomNumber = randomNumber
        document.querySelector("#randomButton").onclick = ""
        return
      }

      if (this.countRandom < 2) {
        this.countRandom++
        document.querySelector("#header2").style.display = "flex"
        document.querySelector("#alerts").innerHTML = `Wyrzuciłeś ` + randomNumber + ` - Rzuć ponownie`
        document.querySelector("#randomButton").onclick = ""
        setTimeout(() => {
          document.querySelector("#header2").style.display = "none"
          document.querySelector("#randomButton").onclick = game.randomButton
        }, 1000)
        return
      }

      this.countRandom = 0
      document.querySelector("#randomButton").onclick = ""
      // let nameBoard = this.test(board)
      document.querySelector("#header2").style.display = "flex"
      // console.warn("Po komunikacie");
      setTimeout(() => {
        ui.userInformation("Nie możesz wykonać żadnego ruchu!")
        net.updateFetchTable("failed", this.userTest, false, false, false);
      }, 1000);
      return
    }
    document.querySelector("#randomButton").onclick = ""
    document.querySelector("#header2").style.display = "flex"
    document.querySelector("#alerts").innerHTML = "Wyrzuciłeś: " + randomNumber
    this.randomNumber = randomNumber
    this.playerPawns.forEach(element => {
      // console.log(element.onBoard)
    })
  }


  render = () => {
    TWEEN.update();
    requestAnimationFrame(this.render);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    //console.log("render leci");
  };

  player = (userId) => {
    this.light.intensity = 1;
    // ui.tableCorner(this.pawns);

    let ludo = this.ludo
    let redPawns = this.redPawns = []
    let bluePawns = this.bluePawns = []
    let greenPawns = this.greenPawns = []
    let yellowPawns = this.yellowPawns = []
    ludo.forEach((row, rowIndex) => {
      row.forEach(async (element, index) => {
        if (rowIndex < 2 && index < 2) {
          let name = rowIndex + "_" + index + "_red_pawn"
          let color = this.redPlayer;
          let positionElement = this.positionElement
          let fieldSize = this.fieldSize
          let pawn = await this.createPawns(name, color, positionElement, fieldSize, rowIndex, index)
          // console.log(pawn);
          redPawns.push(pawn)
          return
        }

        if (rowIndex < 2 && index > 8) {
          let name = rowIndex + "_" + index + "_blue_pawn"
          let color = this.bluePlayer;
          let positionElement = this.positionElement
          let fieldSize = this.fieldSize
          let pawn = await this.createPawns(name, color, positionElement, fieldSize, rowIndex, index)
          bluePawns.push(pawn)
          return
        }

        if (rowIndex > 8 && index < 2) {
          let name = rowIndex + "_" + index + "_yellow_pawn"
          let color = this.yellowPlayer;
          let positionElement = this.positionElement
          let fieldSize = this.fieldSize
          let pawn = await this.createPawns(name, color, positionElement, fieldSize, rowIndex, index)
          yellowPawns.push(pawn)
          return
        }

        if (rowIndex > 8 && index > 8) {
          let name = rowIndex + "_" + index + "_green_pawn"
          let color = this.greenPlayer;
          let positionElement = this.positionElement
          let fieldSize = this.fieldSize
          let pawn = await this.createPawns(name, color, positionElement, fieldSize, rowIndex, index)
          greenPawns.push(pawn)
          return
        }

      })
    })


    //// TODO: first user can interact, timer was turn off (second user)
    // first user start game  (and camera look from blue line)
    if (userId == 1) {
      // this.camera.position.set(0, 500, (this.fieldSize * 12));
      this.camera.lookAt(0, 0, 0);
      this.playerPawns = this.redPawns
      this.userTest = 1
      document.onclick = function (event) {
        game.selectPawn(1, event);
        // game.selectPawn(1, event);
      };
      return
    }

    // second user waiting on start (and have camera on opposite site) 
    if (userId == 2) {
      // this.camera.position.set(0, 500, -(this.fieldSize * 12));
      this.playerPawns = this.greenPawns
      this.userTest = 2
      this.camera.lookAt(0, 0, 0);
      ui.waitingForMove(2);
    }
  }

  // create pawns using class Pawn
  createPawns = async (name, color, positionElement, fieldSize, i, j,) => {
    const pawn = new Pawn(name, color, positionElement, fieldSize, i, j);
    pawn.onBoard = "notExist"
    // pawn.className = "pawn"
    this.scene.add(pawn);
    return pawn
  }

  // Pawn selection
  selectPawn = async (userId, event) => {
    console.warn("Select Pawn");

    // Three.js part
    const raycaster = new THREE.Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
    const mouseVector = new THREE.Vector2(); // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D

    mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

    window.onresize = function () {
      mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    raycaster.setFromCamera(mouseVector, this.camera);
    const intersects = raycaster.intersectObjects(this.scene.children);


    if (intersects.length > 0) {
      // user identification
      let playerPath = this.redPlayerPath
      if (userId == 2) {
        playerPath = this.greenPlayerPath
      }
      let board = this.board

      // First throw dice
      if (!this.randomNumber) {
        document.querySelector("#header2").style.display = "flex"
        document.querySelector("#alerts").innerHTML = "Najpierw rzuć kostką"
        setTimeout(() => {
          document.querySelector("#header2").style.display = "none"
        }, 1000)
        return false
      }

      // This isn't pawn
      const pawn = intersects[0].object
      const pawnParam = pawn.name.split("_");
      // console.log(pawnParam);
      if (pawnParam[3] != "pawn") {
        ui.userInformation("Wybierz pionek!")
        return false
      }

      // pawn Params
      const pawnParams = {
        posX: +pawnParam[0],
        posZ: +pawnParam[1],
        user: pawnParam[2],
      }

      // This isn't your pawn
      if (userId == 1 && pawnParams.user != "red") {
        ui.userInformation("To nie jest twój pionek!")
        return false
      }

      // This isn't your pawn
      if (userId == 2 && pawnParams.user != "green") {
        ui.userInformation("To nie jest twój pionek!")
        return false
      }

      // This pawn isn't on board and random number is lower than 6 
      if (pawn.onBoard == "notExist" && this.randomNumber < 6) {
        ui.userInformation("Wybierz pionek który już jest na planszy")
        return false
      }

      let action
      let temp = 0
      let index = playerPath[temp].name.split("_");
      let firstIndex = index[0]
      let secondIndex = index[1]

      // place pawn on board 
      if (pawn.onBoard == "notExist") {
        const condition = board[firstIndex][secondIndex]
        if (condition != "") {
          // your pawn already is on spawn
          let temp = condition.name.split("_")
          if (temp[2] == pawnParams.user) {
            ui.userInformation("Pole odrodzenia jest zablokowane")
            return false
          }

          //// spawn Strike
          // return opponent pawn to startoa
          let cords = this.ludoID[temp[0]][temp[1]]
          this.vanishingTranslate(condition.name, cords.name)
          condition.onBoard = "notExist"

          // place new pawn on board and in array
          board[firstIndex][secondIndex] = pawn
          this.vanishingTranslate(pawn.name, playerPath[0].name)
          pawn.onBoard = 0

          // change player
          action = "spawnStrike"
          let nameBoard = this.test(board, userId)
          net.updateFetchTable(action, userId, nameBoard, pawn.name, playerPath[0].name, condition.name, cords.name, this.homeState.length);
          return "spawnStrike"
        }
        // clear spawn
        board[firstIndex][secondIndex] = pawn
        pawn.onBoard = 0
        await this.vanishingTranslate(pawn.name, playerPath[0].name)

        // change player
        action = "spawn"
        // console.log(this.board);
        let nameBoard = this.test(board, userId)
        net.updateFetchTable(action, userId, nameBoard, pawn.name, playerPath[0].name, null, null, this.homeState.length);
        return "spawn"
      }
      // field out of range 
      if (!playerPath[+pawn.onBoard + this.randomNumber]) {
        ui.userInformation("Nie możesz wykonać tego ruchu")
        return false
      }

      // action for pawns on board
      temp = +pawn.onBoard + this.randomNumber
      const newPosition = playerPath[temp]
      index = playerPath[temp].name.split("_");
      firstIndex = index[0]
      secondIndex = index[1]

      //// capture
      // start field block
      if (index[2] && this.board[firstIndex][secondIndex] != "") {
        ui.userInformation("Na tym polu zbicie jest niemożliwe")
        return false
      }

      // clear move
      if (board[firstIndex][secondIndex] == "") {
        // clear last location
        const row = board.findIndex(row => row.includes(pawn));
        const col = board[row].indexOf(pawn);
        board[row][col] = ""

        // move to new location
        board[firstIndex][secondIndex] = pawn
        pawn.onBoard = temp
        await this.vanishingTranslate(pawn.name, newPosition.name)


        // change player
        action = "step"
        let nameBoard = this.test(board, userId)
        net.updateFetchTable(action, userId, nameBoard, pawn.name, newPosition.name, null, null, this.homeState.length);
        return "step"
      }

      //// capturing
      // clear last location
      const row = board.findIndex(row => row.includes(pawn));
      const col = board[row].indexOf(pawn);
      board[row][col] = ""

      // return captured pawn to home
      let captured = board[firstIndex][secondIndex]
      captured.onBoard = "notExist"
      let capturedName = captured.name.split("_");
      let cords = this.ludoID[capturedName[0]][capturedName[1]]
      await this.vanishingTranslate(captured.name, cords.name)


      // move to new location
      board[firstIndex][secondIndex] = pawn
      pawn.onBoard = temp
      await this.vanishingTranslate(pawn.name, newPosition.name)

      // change player
      action = "strike"
      let nameBoard = this.test(board, userId)
      net.updateFetchTable(action, userId, nameBoard, pawn.name, newPosition.name, captured.name, cords.name, this.homeState.length);
      return "strike"
    }
  }

  test = (board, userId) => {
    let nameBoard = []
    this.homeState = []
    board.forEach((row, rowIndex) => {
      nameBoard.push([])
      row.forEach((element, index) => {
        if (element != "") {
          nameBoard[rowIndex][index] = element.name

          if (userId == 1 && +rowIndex == 5 && (+index == 1 || +index == 2 || +index == 3 || +index == 4)) {
            this.homeState.push(element.name)
          }

          if (userId == 2 && +rowIndex == 5 && (+index == 6 || +index == 7 || +index == 8 || +index == 9)) {
            this.homeState.push(element.name)
          }

          return
        }
        nameBoard[rowIndex][index] = ""
      })
    })

    if (this.homeState.length == 4) {
      console.warn("Wygrana");
      ui.winGame()
    }

    return nameBoard
  }

  opponentAction = async (userId, response) => {
    this.randomClicked = false
    console.warn("Opponent action");
    console.warn(response);

    // turn click user
    document.querySelector("#randomButton").onclick = game.randomButton
    this.randomClicked = false

    // console.log(response.homeState);


    if (response.action == "failed") {
      console.warn("Przeciwnik nie mógł wykonać ruchu!");
      document.onclick = function (event) {
        game.selectPawn(userId, event);
      };
      return
    }

    // console.table(response.board);
    this.board = response.board
    this.board.forEach((row, rowIndex) => {
      row.forEach((element, index) => {
        if (element != "") {
          const res = this.scene.getObjectByName(this.board[rowIndex][index])
          this.board[rowIndex][index] = res
        }
      })
    })

    if (response.action == "spawn" || response.action == "step") {
      await this.vanishingTranslate(response.newPawn, response.newPawnLocation)
    }

    if (response.action == "spawnStrike" || response.action == "strike") {
      await this.vanishingTranslate(response.newPawn, response.newPawnLocation)
      await this.vanishingTranslate(response.captured, response.coords)
      this.scene.getObjectByName(response.captured).onBoard = "notExist"
    }

    document.onclick = function (event) {
      game.selectPawn(userId, event);
    };

    if (response.homeState) {
      setTimeout(function () {
        // stop time flies | hide time for your move
        ui.stopTimer();
        document.querySelector("#timeLeft").style.opacity = "0"
        document.onclick = ""

        // display dialog message ---> LOSE (no pawns)
        const dialog = document.querySelector(".dialog")
        dialog.setAttribute("id", "userMonit")
        dialog.showModal()
        dialog.style.display = "flex"
        dialog.innerHTML = `
          <div style="display:block">
            <div>Przegrałeś</div>
            <div style="font-size: 0.5em;">Przeciwnik ukończył rozgrywkę</div>
          </div>`

      }, 1000);
    }
  }

  vanishingTranslate = (newPawn, newPawnLocation) => {
    let pawnMove = this.scene.getObjectByName(newPawn);

    pawnMove.material.transparent = true;
    var tweenoff = new TWEEN.Tween(pawnMove.material).to({
      opacity: 0
    }, 800).
      onComplete(function () {
        pawnMove.visible = false;
      });
    tweenoff.start();

    setTimeout(() => {
      pawnMove.position.x = this.scene.getObjectByName(newPawnLocation).position.x
      pawnMove.position.z = this.scene.getObjectByName(newPawnLocation).position.z
      pawnMove.visible = true;
      var tweenon = new TWEEN.Tween(pawnMove.material).to({
        opacity: 1
      }, 800).
        onComplete(function () {
          pawnMove.material.transparent = false;
        });
      tweenon.start();

    }, 900);
  }
}
