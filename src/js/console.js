/* eslint no-use-before-define: 0 */
(function () {
  'use strict';

  var root = this;

  /**
   * Creates a Console object.
   * @class
   * @param {number} width    - The width of the canvas in pixels.
   * @param {number} height   - The height of the canvas in pixels.
   * @param {number} cellSize - The size of a cell in pixels.
   * @returns {Node} An HTML canvas node
   */
  function Console(width, height, cellSize) {
    // set instance properties
    this.width = width / cellSize; // width and height of grid in cells
    this.height = height / cellSize;
    this.cell = cellSize; // size of cells in pixels

    this.matrix = []; // matrix of cell states

    this.cellColor = '#000';

    // create an HTML canvas element; note we're using the args
    //   values here still since they're in pixels.
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');

    _initializeMatrix.call(this);
  }

  Console.prototype.setColor = function (color) {
    this.cellColor = color;
  };

  Console.prototype.refresh = function (data) {
    _draw.call(this, data);
    this.matrix = data;
  };

  /* ********************* Private methods ************************ */

  /*
   * Create the cell matrix.
   *
   * Sets _matrix to an n x m array with all values initialized to 0
   */
  var _initializeMatrix = function () {
    var starterRow = Array.apply(null, new Array(this.width)).map(function () {
      return 0;
    });
    this.matrix = Array.apply(null, new Array(this.height)).map(function () {
      return starterRow.slice(0);
    });
  };

  /*
   * Translate matrix onto the canvas.
   */
  var _draw = function (data) {
    var m, n, x, y, currentValue, newValue;
    var cell = this.cell;
    var matrix = this.matrix;
    var context = this.context;

    for (n = 0; n < this.height; n++) {
      for (m = 0; m < this.width; m++) {
        x = m * cell;
        y = n * cell;
        currentValue = matrix[n][m];
        newValue = data[n][m];
        if (newValue !== currentValue) {
          if (newValue === 1) {
            context.fillStyle = this.cellColor;
            context.fillRect(x, y, cell, cell);
          } else {
            context.clearRect(x, y, cell, cell);
          }
        }
      }
    }
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Console;
    }
    exports.Console = Console;
  } else {
    root.Console = Console;
  }
}.call(this));
