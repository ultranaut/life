
var Life = (function () {
  'use strict';

  var LINEOFFSET = 0;
  var GRID_COLOR = '#ddd';
  var CELL_COLOR = '#900';

  var _width;
  var _height;
  var _scale;
  var _matrix = [];
  var _canvas;
  var _context;
  var _generation = 50;

  function create(w, h, s) {
    _width  = w;
    _height = h;
    _scale  = s;

    var canvas = document.createElement('canvas');
    canvas.width = _width;
    canvas.height = _height;

    _canvas = canvas;
    _context = canvas.getContext('2d');
    _context.fillStyle = CELL_COLOR;

    _drawGrid();
    _initializeMatrix();

    return canvas;
  }

  function _drawGrid() {
    var i;
    _context.strokeStyle = GRID_COLOR;
    for (i = 0; i * _scale <= _height; i++) {
      var y = i * _scale + LINEOFFSET;
      _context.moveTo(0, y);
      _context.lineTo(_width, y);
    }
    for (i = 0; i * _scale <= _width; i++) {
      var x = i * _scale + LINEOFFSET;
      _context.moveTo(x, 0);
      _context.lineTo(x, _height);
    }
    _context.stroke();
  }

  function _initializeMatrix() {
    var n = _height / _scale;
    var m = _width / _scale;
    for (var i = 0; i < n; i++) {
      _matrix[i] = [];
      for (var j = 0; j < m; j++) {
        _matrix[i][j] = 0;
      }
    }
  }

  function attach(el) {
    el.appendChild(_canvas);
  }

  function put(pattern, x, y) {
    var schema = _patterns[pattern];
    var height = schema.length;
    var width = schema[0].length;

    for (var row = 0; row < height; row++) {
      for (var col = 0; col < width; col++) {
        _matrix[row+y][col+x] = schema[row][col];
      }
    }
    _draw();
  }

  function _draw() {
    var x, y;
    var height = _matrix.length;
    var width = _matrix[0].length;
    for (var row = 0; row < height; row++) {
      for (var col = 0; col < width; col++) {
        x = col * _scale;
        y = row * _scale;
        if (_matrix[row][col] === 1) {
          _context.fillRect(x, y, _scale, _scale);
        }
        else {
          _context.clearRect(x, y, _scale, _scale);

        }
      }
    }
  }

  function _clone() {
    var retval = [];
    for (var i = 0; i < _matrix.length; i++) {
      // retval[i] = _matrix[i].slice(0);
      retval[i] = _matrix[i].slice(0);
    }
    return retval;
  }

  function start() {
    setInterval(_generate, _generation);
  }


  function _generate() {
    var row, col, neighbors;
    var height = _matrix.length;
    var width = _matrix[0].length;
    var nextGen = _clone();

    for (row = 0; row < height; row++) {
      for (col = 0; col < width; col++) {
        neighbors = _neighbors(row, col);

        if (_matrix[row][col] === 1) {
          if (neighbors < 2 || neighbors > 3) {
            nextGen[row][col] = 0;
          }
        }
        else if (neighbors === 3) {
          nextGen[row][col] = 1;
        }
      }
    }
    _matrix = nextGen;
    _draw();
  }

  function _neighbors(row, col) {
    // var pop = 0 - _matrix[row][col];
    var pop = 0;
    var i, j;

    for (i = -1; i < 2; i++) {
      for (j = -1; j < 2; j++) {
        if (typeof _matrix[row+i] !== 'undefined' &&
            typeof _matrix[row+i][col+j] !== 'undefined') {
          if (j === 0 && i === 0) {
            continue;
          }
          pop += _matrix[row+i][col+j];
        }
      }
    }
    return pop;
  }

  var _patterns = {
    blinker: [[ 1, 1, 1 ]],

    glider: [[ 0, 1, 0 ],
             [ 0, 0, 1 ],
             [ 1, 1, 1 ]],

    gosper: [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
             [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
             [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
  };

  return {
    create: create,
    attach: attach,
    put: put,
    start: start,

    /* for debugging...
    canvas: _canvas,
    context: _context,
    matrix: _matrix,
    clone: _clone,
    generate: _generate,
    */

  };
}());

