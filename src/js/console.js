/**
 * Creates a Console object.
 * @class
 * @param {number} width    - The width of the canvas in pixels.
 * @param {number} height   - The height of the canvas in pixels.
 * @param {number} cellSize - The size of a cell in pixels.
 * @returns {Node} An HTML canvas node
 */
class Console {
  constructor(width, height, cellSize) {
    // width and height of grid in cells
    this.width = width / cellSize;
    this.height = height / cellSize;
    // size of cells in pixels
    this.resolution = cellSize;

    this.matrix = []; // matrix of cell states
    this.cellColor = '#000';

    this.createCanvas();
    this._initializeMatrix();
  }

  // create an HTML canvas elemen
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width * this.resolution;
    this.canvas.height = this.height * this.resolution;
    this.context = this.canvas.getContext('2d');
  }

  setColor(color) {
    this.cellColor = color;
  }

  refresh(data) {
    this._draw(data);
    this.matrix = data;
  }

  /* ********************* Private methods ************************ */

  /*
   * Create the cell matrix.
   *
   * Sets _matrix to an n x m array with all values initialized to 0
   */
  _initializeMatrix() {
    const row = Array(this.width).fill(0);
    this.matrix = Array(this.height).fill(row.slice(0));
  }

  /*
   * Translate matrix onto the canvas.
   */
  _draw(data) {
    let m, n, x, y, currentValue, newValue;
    const resolution = this.resolution;
    const matrix = this.matrix;
    const context = this.context;

    for (n = 0; n < this.height; n++) {
      for (m = 0; m < this.width; m++) {
        x = m * resolution;
        y = n * resolution;
        currentValue = matrix[n][m];
        newValue = data[n][m];
        if (newValue !== currentValue) {
          if (newValue === 1) {
            context.fillStyle = this.cellColor;
            context.fillRect(x, y, resolution, resolution);
          } else {
            context.clearRect(x, y, resolution, resolution);
          }
        }
      }
    }
  }
}

export default Console;
