function setup() {
  createCanvas(800, 800);
}

function draw() {
  if (mouseIsPressed) {
    // ellipse(mouseX, mouseY, 80, 80);
    point(mouseX, mouseY);
  }
}