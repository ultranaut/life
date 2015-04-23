/* global Life */
var cellColor = '#b58900';
var graveColor = '#586e75';
var canvasColor = '#073642';

var life = Life.create(600, 450, 5, cellColor, canvasColor);
life.style.backgroundColor = '#073642';
document.getElementById('life').appendChild(life);
Life.put('glider', 13, 1);
Life.put('gosper', 22, 5);
Life.put('gosper', 5, 22);
Life.put('gosper', 78, 45);
Life.put('gosper', 73, 10);
Life.put('pulsar', 10, 67);

document.getElementById('showGraves').onchange = function (e) {
  life.style.backgroundColor = this.checked ? graveColor : canvasColor;
};
document.getElementById('startBtn').onclick = function () {
  if (!Life.isRunning()) {
    Life.start();
    this.className = 'btn btn-danger';
    this.innerHTML = 'Stop';
  }
  else {
    Life.stop();
    this.className = 'btn btn-success';
    this.innerHTML = 'Start';
  }
};

