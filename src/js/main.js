import Console from './console.js';
import Life from './life.js';

const cellColor = '#b58900';
const canvasColor = '#073642';

const game = new Console(600, 450, 5); // 120 x 90
game.setColor(cellColor);

document.getElementById('life').appendChild(game.canvas);
game.canvas.style.backgroundColor = canvasColor;

const life = new Life(120, 90, true);
life.on('refresh', function (data) {
  game.refresh(data);
});
// life.place('glider', 13,  1);
// life.place('gosper', 22,  5);
// life.place('gosper',  5, 22);
// life.place('gosper', 78, 45);
// life.place('gosper', 73, 10);
// life.place('pulsar', 10, 67);
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 7; j++) {
    const x = 15 + j * 13;
    const y = 15 + i * 7;

    life.place('alien', x, y);
  }
}
game.refresh(life.matrix);

document.getElementsByTagName('startBtn').onclick = function () {
  this.innerHTML = life.isRunning()
    ? (life.stop(), 'Start')
    : (life.start(), 'Stop');
};

document.getElementsByTagName('html')[0].onclick = function () {
  life.isRunning() ? (life.stop(), 'Start') : (life.start(), 'Stop');
};

// document.getElementById('startBtn').innerHTML = (life.start(), 'Stop');
