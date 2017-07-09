//http://www.conwaylife.com/wiki/Category:Patterns

var PATTERNS = {
  GLIDER: {
    pattern:
      '.O\n' +
      '..O\n' +
      'OOO\n'
  },
  BEE: {
    //delay: 300,
    //fill: 'blue',
    startX: 4,
    startY: 3,
    pattern:
      '...O\n' +
      '..O.O\n' +
      '.O...O\n' +
      '..OOO\n' +
      'OO...OO\n'
  },
  GOOSE: {
    delay: 300,
    pattern:
      'O.........OO\n' +
      '.O......OOO.O\n' +
      '...OO..OO\n' +
      '....O\n' +
      '........O\n' +
      '....OO...O\n' +
      '...O.O.OO\n' +
      '...O.O..O.OO\n' +
      '..O....OO\n' +
      '..OO\n' +
      '..OO\n' +
      '};\n'
  }
}

var STROKE_COLOR = '#000000';
var DEFAULT_FILL = '#F2CF0C';
var DEFAULT_DELAY = 200;

/*
var ROWS = 20;
var COLUMNS = 20;
var CELL_SIZE = 30;
var GRID_WIDTH = COLUMNS * CELL_SIZE;
var GRID_HEIGHT = ROWS * CELL_SIZE;
*/

var GRID_WIDTH = 1200;
var GRID_HEIGHT = 700;
var CELL_SIZE = 80;
var ROWS = Math.floor(GRID_HEIGHT / CELL_SIZE);
var COLUMNS = Math.floor(GRID_WIDTH / CELL_SIZE);

var canvasElement = document.getElementById('game');
var canvas = canvasElement.getContext('2d');
var cells = [];

console.log(ROWS * COLUMNS);

canvasElement.setAttribute('width', GRID_WIDTH);
canvasElement.setAttribute('height', GRID_HEIGHT);

canvas.strokeStyle = STROKE_COLOR;

init(PATTERNS.GLIDER);

function mod(n, m) {
    return ((n % m) + m) % m;
}

/**
 * Initialize game.
 *
 * Will place a Gosper glider gun in the world and start simulation.
 */
function init(config) {
    canvas.fillStyle = config.fill || DEFAULT_FILL;

    for (var i = 0; i < COLUMNS; i++) {
        cells[i] = [];
        for (var j = 0; j < ROWS; j++) {
            cells[i][j] = 0;
        }
    }

    var initialCells = [];
    var patternRows = config.pattern.split('\n');
    for (var r = 0; r < patternRows.length; r++) {
      var patternRow = patternRows[r];

      for (var c = 0; c < patternRow.length; c++) {
        var symbol = patternRow[c];

        if (symbol === 'O') {
          initialCells.push([(config.startX || 0) + c, (config.startY || 0) + r]);
        }
      }
    }


    initialCells.forEach(function(point) {
        cells[point[0]][point[1]] = 1;
    });

    update(config.delay || DEFAULT_DELAY);
}

/**
 * Check which cells are still alive.
 */
function update(delay) {
    var result = [];

    cells.forEach(function(row, x) {
        result[x] = [];
        row.forEach(function(cell, y) {
            var alive = 0;
            var count = _countNeighbours(x, y);

            if (cell > 0) {
                alive = count === 2 || count === 3 ? 1 : 0;
            } else {
                alive = count === 3 ? 1 : 0;
            }

            result[x][y] = alive;
        });
    });

    cells = result;

    draw(delay);
}

/**
 * Return amount of alive neighbours for a cell
 */
function _countNeighbours(x, y) {
    var amount = 0;

    if (_isFilled(x-1, y-1)) amount++;
    if (_isFilled(x,   y-1)) amount++;
    if (_isFilled(x+1, y-1)) amount++;
    if (_isFilled(x-1, y  )) amount++;
    if (_isFilled(x+1, y  )) amount++;
    if (_isFilled(x-1, y+1)) amount++;
    if (_isFilled(x,   y+1)) amount++;
    if (_isFilled(x+1, y+1)) amount++;

    return amount;
}

/**
 * Check if the given coordinates are filled
 */
function _isFilled(x, y) {
    //return cells[x] && cells[x][y];
    return cells[mod(x, COLUMNS)][mod(y, ROWS)];
}


/**
 * Draw cells on canvas
 */
function draw(delay) {
    canvas.clearRect(0, 0, GRID_WIDTH, GRID_HEIGHT);

    cells.forEach(function(row, x) {
        row.forEach(function(cell, y) {
            canvas.beginPath();
            canvas.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            if (cell) {
                canvas.fill();
            }
            canvas.stroke();
        });
    });
    setTimeout(function() {update(delay);}, delay);
}
