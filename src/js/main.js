'use strict';

var cellColor = '#b58900';
var canvasColor = '#073642';

var game = new Console(600, 450, 5); // 120 x 90
game.setColor(cellColor);

document.getElementById('life').appendChild(game.canvas);
game.canvas.style.backgroundColor = canvasColor;

var life = new Life(120, 90, true);
life.on('refresh', function (data) {
  game.refresh(data);
});
// life.place('glider', 13,  1);
// life.place('gosper', 22,  5);
// life.place('gosper',  5, 22);
// life.place('gosper', 78, 45);
// life.place('gosper', 73, 10);
// life.place('pulsar', 10, 67);
for (var i = 0; i < 7; i++) {
  for (var j = 0; j < 7; j++) {
    var x = 15 + j * 13;
    var y = 15 + i * 7;

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
