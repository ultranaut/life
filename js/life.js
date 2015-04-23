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

  var _width;             // width and height of grid in cells
  var _height;
  var _cell;              // size of cells in pixels
  var _matrix = [];       // matrix of cell states
  var _canvas;            // HTML canvas object
  var _context;           // context of canvas object
  var _cellColor;         // color of living cell
  var _canvasColor;       // color of blank canvas
  var _generation = 50;   // lifetime of  a generation in milliseconds
  var _patterns = {};     // a library of patterns
  var _intervalId = null; // interval id of generate function

  /**
   * Create a canvas object.
   *
   * @param {number} width  - The width of the canvas in pixels.
   * @param {number} height - The height of the canvas in pixels.
   * @param {number} cell   - The size of a cell in pixels.
   * @param {string} color  - Color to use for living cells.
   * @returns {Node} An HTML canvas node
   */
  function create(width, height, cell, cellColor, canvasColor) {
    // set namespace variables
    _width  = width / cell;
    _height = height / cell;
    _cell  = cell;
    _cellColor = (typeof cellColor === 'undefined') ? '#000' : cellColor;
    _canvasColor = (typeof canvasColor === 'undefined') ? '#fff' : canvasColor;

    // create an HTML canvas element; note we're using the args
    //   values here still since they're in pixels.
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    _canvas = canvas;
    _context = canvas.getContext('2d');
    _context.fillStyle = _canvasColor;
    _context.fillRect(0, 0, 600, 450);
    _context.fillStyle = _cellColor;

    _initializeMatrix();
    return _canvas;
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

  /**
   * Start iterating generations.
   */
  function start() {
    _intervalId = setInterval(_generate, _generation);
  }

  /**
   * Stop iterating generations.
   */
  function stop() {
    clearInterval(_intervalId);
    _intervalId = null;
  }

  /**
   * @returns {boolean}
   */
  function isRunning() {
    return _intervalId !== null;
  }

  /*
   * Create the cell matrix.
   *
   * Sets _matrix to an n x m array with all values initialized to 0
   */
  function _initializeMatrix() {
    var i;
    // create a row of _width 0's
    var row = [];
    for (i = 0; i < _width; i++) {
      row[i] = 0;
    }
    // insert _height number of rows into _matrix
    for (i = 0; i < _height; i++) {
      _matrix[i] = row.slice(0);
    }
  }

  /*
   * Translate _matrix onto the _canvas.
   */
  function _draw() {
    var x, y, currentValue;
    for (var row = 0; row < _height; row++) {
      for (var col = 0; col < _width; col++) {
        x = col * _cell;
        y = row * _cell;
        currentValue = _matrix[row][col];
        if (currentValue === 1) {
          _context.fillRect(x, y, _cell, _cell);
        }
        // if we're turning off a cell that's alive, then clear that
        //   cell's rectangle, and set the cell's value to 0
        else if (currentValue === -1) {
          _context.clearRect(x, y, _cell, _cell);
          _matrix[row][col] = 0;
        }
      }
    }
  }

  /*
   * Compute the next generation.
   */
  function _generate() {
    var row, col, neighbors;
    var nextGen = _cloneMatrix();

    for (row = 0; row < _height; row++) {
      for (col = 0; col < _width; col++) {
        neighbors = _countNeighbors(row, col);

        if (_matrix[row][col] === 1) {
          // if it's a living cell that's going to die, then mark it
          //   to be cleared for _draw
          if (neighbors < 2 || neighbors > 3) {
            nextGen[row][col] = -1;
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

  /*
   * Produce a clone of the _matrix.
   */
  function _cloneMatrix() {
    var retval = [];
    for (var i = 0; i < _matrix.length; i++) {
      retval[i] = _matrix[i].slice(0);
    }
    return retval;
  }

  /*
   * Count the number of neighbors;
   */
  function _countNeighbors(row, col) {
    // Don't want to count the current cell itself.
    var pop = 0 - _matrix[row][col];
    var i, j;

    for (i = -1; i < 2; i++) {
      for (j = -1; j < 2; j++) {
        if (typeof _matrix[row+i] !== 'undefined' &&
            typeof _matrix[row+i][col+j] !== 'undefined') {
          pop += _matrix[row+i][col+j];
        }
      }
    }
    return pop;
  }

  /*
   * Some standard patterns.
   * TODO add more
   */
  _patterns.blinker = [[ 1, 1, 1 ]];
  _patterns.pulsar = [
      [ 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1 ],
      [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1 ],
      [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1 ],
      [ 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0 ],
      [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1 ],
      [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1 ],
      [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0 ],
  ];
  _patterns.glider = [
      [ 0, 1, 0 ],
      [ 0, 0, 1 ],
      [ 1, 1, 1 ]
  ];
  _patterns.gosper = [
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  /*
   * Expose the public API.
   */
  return {
    create: create,
    put: put,
    start: start,
    stop: stop,
    isRunning: isRunning
  };
}());

