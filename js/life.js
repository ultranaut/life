var Life = (function () {
  /**
   * Creates a Game of Life object.
   * @class
   * @param {number} width  - The width of the canvas in pixels.
   * @param {number} height - The height of the canvas in pixels.
   * @param {number} cell   - The size of a cell in pixels.
   * @returns {Node} An HTML canvas node
   */
  function Life(width, height, cell) {
    var self = this;
    // set instance properties
    this.width = width / cell;   // width and height of grid in cells
    this.height = height / cell;
    this.cell = cell;            // size of cells in pixels
    this.matrix = [];            // matrix of cell states
    this.generation = 50;        // lifetime of  a generation in milliseconds
    this.intervalId = null;      // interval id of _tick function

    this.cellColor = '#000';
    this.canvasColor = '#fff';

    // create an HTML canvas element; note we're using the args
    //   values here still since they're in pixels.
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');


    _fillCanvas.call(this);
    _initializeMatrix.call(this);
  }

  /* ********************** Public methods ************************* */

  /**
   * Place an object on the grid
   *
   * @param {string} pattern - Key of pattern to use.
   * @param {number} x - The x-coordinate of the placement.
   * @param {number} y - The y-coordinate of the placement.
   */
  Life.prototype.place = function (pattern, x, y) {
    var schema = this.patterns[pattern];

    for (var n = 0; n < schema.length; n++) {
      for (var m = 0; m < schema[0].length; m++) {
        this.matrix[n+y][m+x] = schema[n][m];
      }
    }
    _draw.call(this);
  };

  Life.prototype.setColor = function (el, color) {
    this[el] =  color;
    if (el === 'canvasColor') {
      _fillCanvas.call(this);
    }
  };

  /**
   * Start _ticking generations.
   */
  Life.prototype.start = function () {
    this.intervalId = setInterval(_tick.bind(this), this.generation);
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
   * Create the cell matrix.
   *
   * Sets _matrix to an n x m array with all values initialized to 0
   */
  var _initializeMatrix = function () {
    var i;
    // create a row of _width 0's
    var row = [];
    for (i = 0; i < this.width; i++) {
      row[i] = 0;
    }
    // insert _height number of rows into _matrix
    for (i = 0; i < this.height; i++) {
      this.matrix[i] = row.slice(0);
    }
  };

  /*
   * Translate matrix onto the canvas.
   */
  var _draw = function () {
    var m, n, x, y, currentValue;
    var cell = this.cell;
    var matrix = this.matrix;
    var context = this.context;

    for (n = 0; n < this.height; n++) {
      for (m = 0; m < this.width; m++) {
        x = m * cell;
        y = n * cell;
        currentValue = matrix[n][m];
        if (currentValue === 1) {
          context.fillStyle = this.cellColor;
          context.fillRect(x, y, cell, cell);
        }
        // if we're turning off a cell that's alive, then clear that
        //   cell's rectangle, and set the cell's value to 0
        else if (currentValue === -1) {
          context.clearRect(x, y, cell, cell);
          matrix[n][m] = 0;
        }
      }
    }
  };

  /*
   * Compute the next generation.
   */
  var _tick = function () {
    var n, m, neighbors;
    var nextGen = _cloneMatrix.call(this);

    for (n = 0; n < this.height; n++) {
      for (m = 0; m < this.width; m++) {
        neighbors = _countNeighbors.call(this, n, m);

        if (this.matrix[n][m] === 1) {
          // if it's a living cell that's going to die, then mark it
          //   to be cleared for _draw()
          if (neighbors < 2 || neighbors > 3) {
            nextGen[n][m] = -1;
          }
        }
        else if (neighbors === 3) {
          nextGen[n][m] = 1;
        }
      }
    }
    this.matrix = nextGen;
    _draw.call(this);
  };

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
        if (typeof this.matrix[row+i] !== 'undefined' &&
            typeof this.matrix[row+i][col+j] !== 'undefined') {
          pop += this.matrix[row+i][col+j];
        }
      }
    }
    return pop;
  };

  var _fillCanvas = function () {
    this.context.fillStyle = this.canvasColor;
    this.context.fillRect(0, 0, 600, 450);
  };

  /*
   * Some standard patterns.
   * TODO add more
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


  return Life;

}());
