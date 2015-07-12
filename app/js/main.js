
var cellColor   = '#b58900';
var canvasColor = '#073642';

var game = new Console(600, 450, 5);   // 120 x 90
game.setColor(cellColor);


document.getElementById('life').appendChild(game.canvas);
game.canvas.style.backgroundColor = canvasColor;

document.getElementById('startBtn').onclick = function () {
  'use strict';
  this.innerHTML = life.isRunning() ? (life.stop(),  'Start')
                                    : (life.start(), 'Stop');
};


var life = new Life(120, 90, true);
life.on('refresh', function (data) {
  'use strict';
  game.refresh(data);
});
life.place('glider', 13,  1);
life.place('gosper', 22,  5);
life.place('gosper',  5, 22);
life.place('gosper', 78, 45);
life.place('gosper', 73, 10);
life.place('pulsar', 10, 67);

document.getElementById('startBtn').onclick = function () {
  'use strict';
  this.innerHTML = life.isRunning() ? (life.stop(),  'Start')
                                    : (life.start(), 'Stop');
};
// var foo = setInterval(function () {
//   'use strict';
//   life.step();
// }, 50);



