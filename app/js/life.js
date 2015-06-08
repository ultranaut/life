/* eslint no-use-before-define: 0 */
(function () {
  'use strict';

  var root = this;

  /**
   * Creates a Game of Life object.
   * @class
   * @param {number} width  - The number of columns.
   * @param {number} height - The number of rows.
   * @param {boolean} [wrap=true]  - Wrap the  canvas.
   */
  function Life(width, height, wrap) {
    // set instance properties
    this.width = width;   // width and height of grid in cells
    this.height = height;
    this.wrap = typeof wrap === 'undefined' ? true : !!wrap;

    this.initializeMatrix();   // matrix of cell states
    this.generation = 50;        // lifetime of a generation in milliseconds
    this.intervalId = null;      // interval id of _tick function

    // _initializeMatrix.call(this);
  }

  /*
   * Create or reset the cell matrix.
   *
   * Sets _matrix to an n x m array with all values initialized to 0
   */
  Life.prototype.initializeMatrix = function () {
    var starterRow = Array.apply(null, new Array(this.width))
                          .map(function () { return 0; });
    this.matrix = Array.apply(null, new Array(this.height))
                       .map(function () { return starterRow.slice(0); });
  };

  /**
   * Place an object into the grid
   *
   * @param {string} pattern - Key of pattern to use.
   * @param {number} x - The x-coordinate of the placement.
   * @param {number} y - The y-coordinate of the placement.
   */
  Life.prototype.place = function (pattern, x, y) {
    var schema = this.patterns[pattern];

    for (var n = 0; n < schema.length; n++) {
      for (var m = 0; m < schema[0].length; m++) {
        this.matrix[n + y][m + x] = schema[n][m];
      }
    }
  };

  /*
   * Generate the next, uhh, generation.
   */
  Life.prototype.step = function () {
    var n, m, neighbors;
    var nextGen = _cloneMatrix.call(this);

    for (n = 0; n < this.height; n++) {
      for (m = 0; m < this.width; m++) {
        neighbors = _countNeighbors.call(this, n, m);
        if (neighbors < 2 || neighbors > 3) {
          nextGen[n][m] = 0;
        }
        else if (neighbors === 3) {
          nextGen[n][m] = 1;
        }
      }
    }
    this.matrix = nextGen;
  };

  /**
   * Start iterating generations.
   */
  Life.prototype.start = function () {
    this.intervalId = setInterval(this.step.bind(this), this.generation);
  };

  /**
   * Stop iterating generations.
   */
  Life.prototype.stop = function () {
    clearInterval(this.intervalId);
    this.intervalId = null;
  };

  /**
   * @returns {boolean}
   */
  Life.prototype.isRunning = function () {
    return this.intervalId !== null;
  };


  /* ********************* Private methods ************************ */


  /*
   * Produce a clone of the _matrix.
   */
  var _cloneMatrix = function () {
    var retval = [];
    for (var i = 0; i < this.matrix.length; i++) {
      retval[i] = this.matrix[i].slice(0);
    }
    return retval;
  };

  /*
   * Count the number of neighbors;
   */
  var _countNeighbors = function (row, col) {
    // Don't want to count the current cell itself.
    var pop = 0 - this.matrix[row][col];
    var i, j;

    for (i = -1; i < 2; i++) {
      for (j = -1; j < 2; j++) {
        if (this.wrap === true) {
          pop += this.matrix[(this.height + row + i) % this.height][(this.width + col + j) % this.width];
        }
        else if (typeof this.matrix[row + i] !== 'undefined' &&
                 typeof this.matrix[row + i][col + j] !== 'undefined') {
          pop += this.matrix[row + i][col + j];
        }
      }
    }
    return pop;
  };

  /*
   * Some standard patterns.
   * TODO break out into separate file
   */
  Life.prototype.patterns = {
    blinker: [[ 1, 1, 1 ]],
    pulsar: [
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
      [ 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0 ] ],
    glider: [
      [ 0, 1, 0 ],
      [ 0, 0, 1 ],
      [ 1, 1, 1 ] ],
    gosper: [
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ]
  };

  /*
   * Export as Node module if we're in that environment, otherwise add
   * it as a global object
   */
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = Life;
  }
  else {
    root.Life = Life;
  }

}).call(this);
