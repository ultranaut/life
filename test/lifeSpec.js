/* eslint-env node, mocha */

const expect = require('chai').expect;
const Life = require('../src/js/life');

describe('Life', function () {
  const rows = 6;
  const cols = 6;
  const life = new Life(cols, rows);
  const matrix = life.matrix;
  const lastRow = matrix[rows - 1];
  // it('should return a Life object', function () {
  //   expect(life).to.be.an.instanceOf(Life);
  // });

  it('initializeMatrix', function () {
    expect(matrix).to.be.an.instanceOf(Array);
    expect(lastRow).to.be.an.instanceOf(Array);
    expect(matrix[rows]).to.equal(undefined);

    // test that it'll do a reset also
    life.place('glider', 2, 2);
    life.initializeMatrix();
    expect(life.matrix).to.deep.equal([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it('place', function () {
    life.place('glider', 2, 2);
    expect(life.matrix).to.deep.equal([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
    life.place('blinker', 1, 3);
    expect(life.matrix).to.deep.equal([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it('step', function () {
    /* eslint-disable no-multi-spaces */

    life.initializeMatrix();
    life.place('blinker', 2, 2);
    life.step();
    expect(life.matrix).to.deep.equal([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
    life.step();
    expect(life.matrix).to.deep.equal([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    life.initializeMatrix();
    life.place('glider', 1, 1);
    life.step();
    life.step();
    life.step();
    expect(life.matrix).to.deep.equal([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
    life.step();
    expect(life.matrix).to.deep.equal([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    /* eslint-enable */
  });
});
