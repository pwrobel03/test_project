class Pawn extends THREE.Mesh {
  constructor(name, color, positionElement, fieldSize, i, j) {
    super(); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
    this.size = fieldSize / 2 - 1
    this.geometry = new THREE.CylinderGeometry(this.size, this.size, this.size, 64);
    // this.material = new THREE.MeshPhongMaterial({ color: color });
    this.material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("img/gradientTexture.png"),
      color: color
    });
    this.pawn = new THREE.Mesh(this.geometry, this.material);
    this.pawn.position.z = positionElement - (fieldSize + 1) * i;
    this.pawn.position.x = positionElement - (fieldSize + 1) * j;
    this.pawn.position.y = this.size;
    this.pawn.name = name;
    return this.pawn;
  }
}
