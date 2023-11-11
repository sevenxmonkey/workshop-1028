const canvas = document.getElementById('canvas-1')
const context = canvas.getContext('2d');

context.fillStyle = "rgb(200, 0, 0)";
context.fillRect(10, 10, 50, 50);

context.fillStyle = "rgba(0, 0, 200, 0.5)";
context.fillRect(30, 30, 50, 50);

const getPosition = () => Math.random() * 800;
context.beginPath();
context.moveTo(getPosition(), getPosition());
for (let i = 0; i < 100; i++) {
  context.lineTo(getPosition(), getPosition());
}
context.stroke();

canvas.addEventListener('mousedown', (event) => {
  const size = 25;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  context.strokeStyle = 'blue';
  context.strokeRect(x - size / 2, y - size / 2, size, size);
})

