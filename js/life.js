/**
 * Conway's Game of Life
 *
 * Just for fun and to play around with stuff that I haven't made
 * much use of.
 */

/**
 * @namespace
 */
var Life = (function () {
  'use strict';

  /**
   * @const {string} CELL_COLOR - The color of a "live" cell.
   */
  var CELL_COLOR = '#b58900';

  var _width;
  var _height;
  var _cell;
  var _matrix = [];
  var _canvas;
  var _context;
  var _generation = 50;

  /**
   * Create a canvas object.
   *
   * @param {number} width - The width of the canvas.
   * @param {number} height - The height of the canvas.
   * @param {number} cell - The size of a cell.
   * @returns {object}
   */
  function create(width, height, cell) {
    _width  = width;
    _height = height;
    _cell  = cell;

    var canvas = document.createElement('canvas');
    canvas.width = _width;
    canvas.height = _height;

    _canvas = canvas;
    _context = canvas.getContext('2d');
    _context.fillStyle = CELL_COLOR;

    _initializeMatrix();

    return canvas;
  }

  function _initializeMatrix() {
    var n = _height / _cell;
    var m = _width / _cell;
    for (var i = 0; i < n; i++) {
      _matrix[i] = [];
      for (var j = 0; j < m; j++) {
        _matrix[i][j] = 0;
      }
    }
  }

  /**
   * Place an object on the grid
   *
   * @param {string} pattern - Key of pattern to use.
   * @param {number} x - The x-coordinate of the placement.
   * @param {number} y - The y-coordinate of the placement.
   */
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
        x = col * _cell;
        y = row * _cell;
        if (_matrix[row][col] === 1) {
          _context.fillRect(x, y, _cell, _cell);
        }
        else {
          _context.clearRect(x, y, _cell, _cell);

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

  /**
   * Start iterating generations.
   */
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
    put: put,
    start: start,
  };
}());

