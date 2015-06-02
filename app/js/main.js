/* global Life */
var cellColor   = '#b58900';
var graveColor  = '#586e75';
var canvasColor = '#073642';

var game = new Life(600, 450, 5, false);
game.setColor('cellColor', cellColor);
game.setColor('canvasColor', canvasColor);
game.place('glider', 13,  1);
game.place('gosper', 22,  5);
game.place('gosper',  5, 22);
game.place('gosper', 78, 45);
game.place('gosper', 73, 10);
game.place('pulsar', 10, 67);

document.getElementById('life').appendChild(game.canvas);
game.canvas.style.backgroundColor = canvasColor;

document.getElementById('showGraves').onchange = function (e) {
  'use strict';
  game.canvas.style.backgroundColor = this.checked ? graveColor : canvasColor;
};

document.getElementById('startBtn').onclick = function () {
  'use strict';
  if (!game.isRunning()) {
    game.start();
    this.className = 'btn btn-danger';
    this.innerHTML = 'Stop';
  }
  else {
    game.stop();
    this.className = 'btn btn-success';
    this.innerHTML = 'Start';
  }
};
