// start całości projektu, inicjalizacja obiektów powyższych klas

let game;
let net;
let ui;
window.onload = function () {
  game = new Game();
  ui = new Ui();
  net = new Net();
};
