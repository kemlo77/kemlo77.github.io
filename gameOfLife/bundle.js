/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/model/animator.service.ts":
/*!***************************************!*\
  !*** ./src/model/animator.service.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnimatorService": () => (/* binding */ AnimatorService)
/* harmony export */ });
/* harmony import */ var _patterns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./patterns */ "./src/model/patterns.ts");

class AnimatorService {
    constructor(grid) {
        this._grid = grid;
    }
    animatePattern(pattern, posX, posY) {
        pattern.forEach((row, rowIndex) => {
            row.forEach((shouldLive, columnIndex) => {
                if (shouldLive) {
                    this._grid.cellAt(posX + columnIndex, posY + rowIndex).live();
                }
            });
        });
    }
    createPattern(name, posX, posY) {
        this.animatePattern(_patterns__WEBPACK_IMPORTED_MODULE_0__.patternsMap.get(name), posX, posY);
    }
    createCorners() {
        this._grid.cellAt(0, 0).live();
        this._grid.cellAt(this._grid.numberOfColumns - 1, this._grid.numberOfRows - 1).live();
    }
    createMidpoints() {
        this._grid.cellAt(this._grid.numberOfColumns / 2, this._grid.numberOfRows / 2).live();
    }
}


/***/ }),

/***/ "./src/model/cell.ts":
/*!***************************!*\
  !*** ./src/model/cell.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cell": () => (/* binding */ Cell)
/* harmony export */ });
class Cell {
    constructor(columnIndex, rowIndex) {
        this._neighbours = [];
        this._age = 0;
        this._columnIndex = 0;
        this._rowIndex = 0;
        this._killMe = () => this.die();
        this._doNothing = () => { return; };
        this._reviveMe = () => this.live();
        this._continueLiving = () => this.live();
        this._plannedFate = this._doNothing;
        this._columnIndex = columnIndex;
        this._rowIndex = rowIndex;
    }
    get age() { return this._age; }
    get columnIndex() { return this._columnIndex; }
    get rowIndex() { return this._rowIndex; }
    addNeighbour(cell) { this._neighbours.push(cell); }
    get neigbours() {
        return this._neighbours;
    }
    get numberOfNeighbours() { return this._neighbours.length; }
    get numberOfLivingNeighbours() { return this.livingNeighbours.length; }
    get deadNeighbours() { return this._neighbours.filter(cell => cell.isDead); }
    get livingNeighbours() { return this._neighbours.filter(cell => cell.isAlive); }
    get orthogonalNeighbours() {
        return this._neighbours.filter(neigbour => {
            return this._columnIndex == neigbour.columnIndex || this._rowIndex == neigbour.rowIndex;
        });
    }
    get livingOrthogonalNeighbours() {
        return this.orthogonalNeighbours.filter(neighbour => neighbour.isAlive);
    }
    get diagonalNeighbours() {
        return this._neighbours.filter(neigbour => {
            return this._columnIndex !== neigbour.columnIndex && this._rowIndex !== neigbour.rowIndex;
        });
    }
    get livingDiagonalNeighbours() {
        return this.diagonalNeighbours.filter(neighbour => neighbour.isAlive);
    }
    get isAlive() { return this._age > 0; }
    get isDead() { return this._age == 0; }
    live() { this._age += 1; }
    die() { this._age = 0; }
    toggleLifeDeath() {
        if (this.isAlive) {
            this.die();
        }
        else {
            this.live();
        }
    }
    planFate() {
        if (this.isAlive) {
            if (this.numberOfLivingNeighbours == 2 || this.numberOfLivingNeighbours == 3) {
                this._plannedFate = this._continueLiving;
                return;
            }
            else {
                this._plannedFate = this._killMe;
                return;
            }
        }
        if (this.isDead && this.numberOfLivingNeighbours == 3) {
            this._plannedFate = this._reviveMe;
            return;
        }
    }
    executeFate() {
        this._plannedFate();
        this._plannedFate = this._doNothing;
    }
}


/***/ }),

/***/ "./src/model/cellconnection.ts":
/*!*************************************!*\
  !*** ./src/model/cellconnection.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CellConnection": () => (/* binding */ CellConnection)
/* harmony export */ });
class CellConnection {
    constructor(cell1, cell2) {
        this._cell1 = cell1;
        this._cell2 = cell2;
    }
    get cell1() {
        return this._cell1;
    }
    get cell2() {
        return this._cell2;
    }
}


/***/ }),

/***/ "./src/model/grid.ts":
/*!***************************!*\
  !*** ./src/model/grid.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Grid": () => (/* binding */ Grid)
/* harmony export */ });
/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cell */ "./src/model/cell.ts");

class Grid {
    constructor(columns, rows) {
        this._grid = this.generateColumnOfRowOfCells(columns, rows);
        this.connectCellsWithNeighbours();
    }
    generateColumnOfRowOfCells(width, height) {
        const columnOfRows = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push(new _cell__WEBPACK_IMPORTED_MODULE_0__.Cell(x, y));
            }
            columnOfRows.push(row);
        }
        return columnOfRows;
    }
    connectCellsWithNeighbours() {
        this.allCells.forEach(currentCell => {
            this.allCells
                .filter(cell => cell !== currentCell)
                .filter(cell => Math.abs(currentCell.columnIndex - cell.columnIndex) <= 1)
                .filter(cell => Math.abs(currentCell.rowIndex - cell.rowIndex) <= 1)
                .forEach(cell => currentCell.addNeighbour(cell));
        });
    }
    get numberOfColumns() {
        return this._grid[0].length;
    }
    get numberOfRows() {
        return this._grid.length;
    }
    cellAt(x, y) {
        return this._grid[y][x];
    }
    get allCells() {
        return this._grid.flat();
    }
    get allLiveCells() {
        return this.allCells.filter(cell => cell.isAlive);
    }
    get clustersOfLiveCells() {
        const clusterArray = [];
        const alreadyChecked = new Set();
        for (const livingCell of this.allLiveCells) {
            if (alreadyChecked.has(livingCell)) {
                continue;
            }
            const cluster = [];
            const candidates = [livingCell];
            while (candidates.length > 0) {
                const candidate = candidates.pop();
                alreadyChecked.add(livingCell);
                cluster.push(candidate);
                candidate.livingNeighbours.forEach(neigbour => {
                    if (!alreadyChecked.has(neigbour)) {
                        alreadyChecked.add(neigbour);
                        candidates.push(neigbour);
                    }
                });
            }
            clusterArray.push(cluster);
        }
        return clusterArray;
    }
}


/***/ }),

/***/ "./src/model/patterns.ts":
/*!*******************************!*\
  !*** ./src/model/patterns.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "glider": () => (/* binding */ glider),
/* harmony export */   "lightweightSpaceship": () => (/* binding */ lightweightSpaceship),
/* harmony export */   "oscillatingPulsar": () => (/* binding */ oscillatingPulsar),
/* harmony export */   "patternsMap": () => (/* binding */ patternsMap),
/* harmony export */   "pentaDecathlon": () => (/* binding */ pentaDecathlon),
/* harmony export */   "ship": () => (/* binding */ ship),
/* harmony export */   "toad": () => (/* binding */ toad),
/* harmony export */   "zHexomino": () => (/* binding */ zHexomino)
/* harmony export */ });
const pentaDecathlon = [
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0]
];
const zHexomino = [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
];
const ship = [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1]
];
const toad = [
    [1, 1, 1, 0],
    [0, 1, 1, 1]
];
const lightweightSpaceship = [
    [1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1]
];
const glider = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
];
const oscillatingPulsar = [
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
];
const patternsMap = new Map();
patternsMap.set('pentaDecathlon', pentaDecathlon);
patternsMap.set('zHexomino', zHexomino);
patternsMap.set('ship', ship);
patternsMap.set('toad', toad);
patternsMap.set('lightweightSpaceship', lightweightSpaceship);
patternsMap.set('glider', glider);
patternsMap.set('oscillatingPulsar', oscillatingPulsar);


/***/ }),

/***/ "./src/view/canvas/canvas.ts":
/*!***********************************!*\
  !*** ./src/view/canvas/canvas.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Canvas": () => (/* binding */ Canvas)
/* harmony export */ });
/* harmony import */ var _model_cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../model/cell */ "./src/model/cell.ts");
/* harmony import */ var _coordinate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../coordinate */ "./src/view/coordinate.ts");


class Canvas {
    constructor(canvasId, grid) {
        this._cellWidth = 20;
        this._xOffset = 0;
        this._yOffset = 0;
        this.black = 'rgba(0,0,0,1)';
        this._canvasElement = document.getElementById(canvasId);
        this._canvasCtx = this._canvasElement.getContext('2d');
        this._grid = grid;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get cellWidth() {
        return this._cellWidth;
    }
    get thinLineWidth() {
        return this.cellWidth * 0.1;
    }
    get mediumLineWidth() {
        return this.cellWidth * 0.5;
    }
    get wideLineWidth() {
        return this.cellWidth;
    }
    clearTheCanvas() {
        this._canvasCtx.clearRect(0, 0, this._width, this._height);
    }
    updateCanvasWhenWindowChanges() {
        this._width = window.innerWidth - 32;
        this._height = window.innerHeight - 16;
        this._canvasElement.width = this._width;
        this._canvasElement.height = this._height;
        if (this._width > this._height) {
            this._cellWidth = this._width / this._grid.numberOfColumns;
            this._yOffset = (this._grid.numberOfRows * this._cellWidth - this._height) / 2;
            this._xOffset = 0;
        }
        else {
            this._cellWidth = this._height / this._grid.numberOfRows;
            this._yOffset = 0;
            this._xOffset = (this._grid.numberOfColumns * this._cellWidth - this._width) / 2;
        }
    }
    getCellAttCoordinate(coordinate) {
        const xOutsideCanvas = 0 > coordinate.x || coordinate.x >= this._width;
        const yOutsideCanvas = 0 > coordinate.y || coordinate.y >= this._height;
        if (xOutsideCanvas || yOutsideCanvas) {
            return new _model_cell__WEBPACK_IMPORTED_MODULE_0__.Cell(0, 0);
        }
        const columnIndex = Math.floor((coordinate.x + this._xOffset) / this.cellWidth);
        const rowIndex = Math.floor((coordinate.y + this._yOffset) / this.cellWidth);
        return this._grid.cellAt(columnIndex, rowIndex);
    }
    paintLineBetweenCells(cell1, cell2, width = this.thinLineWidth, color = this.black, offset = false) {
        let shadowOffset = 0;
        if (offset) {
            shadowOffset = this.cellWidth * 0.1;
        }
        this._canvasCtx.strokeStyle = color;
        const centerOfCell1 = this.centerOfCell(cell1);
        const centerOfCell2 = this.centerOfCell(cell2);
        this._canvasCtx.lineWidth = width;
        this._canvasCtx.lineCap = 'round';
        this._canvasCtx.beginPath();
        this._canvasCtx.moveTo(centerOfCell1.x + shadowOffset, centerOfCell1.y + shadowOffset);
        this._canvasCtx.lineTo(centerOfCell2.x + shadowOffset, centerOfCell2.y + shadowOffset);
        this._canvasCtx.stroke();
    }
    paintCellsAsHollowDots(cells, innerColor) {
        this.paintCircles(cells, this.black, this.cellWidth * 0.64, false);
        this.paintCircles(cells, innerColor, this.cellWidth * 0.4, false);
    }
    paintCircles(cells, color, diameter = this.cellWidth, offset = false) {
        let shadowOffset = 0;
        if (offset) {
            shadowOffset = this.cellWidth * 0.1;
        }
        const radius = diameter / 2;
        this._canvasCtx.fillStyle = color;
        cells.forEach(cell => {
            const center = this.centerOfCell(cell);
            this._canvasCtx.beginPath();
            this._canvasCtx.arc(center.x + shadowOffset, center.y + shadowOffset, radius, 0, 2 * Math.PI);
            this._canvasCtx.fill();
        });
    }
    paintSquares(cells, color) {
        const padding = 1;
        this._canvasCtx.fillStyle = color;
        this._canvasCtx.beginPath(); //varför måste jag ha med detta för att färgändring ska slå igenom
        this._canvasCtx.stroke(); // dito
        const squareWidth = this.cellWidth - 2 * padding;
        cells.forEach(cell => {
            const corner = this.upperLeftCornerOfCell(cell);
            this._canvasCtx.rect(corner.x + padding, corner.y + padding, squareWidth, squareWidth);
            this._canvasCtx.fill();
        });
    }
    clearSquare(cell) {
        const position = this.upperLeftCornerOfCell(cell);
        this._canvasCtx.clearRect(position.x, position.y, this.cellWidth, this.cellWidth);
    }
    upperLeftCornerOfCell(cell) {
        const xPart = cell.columnIndex * this.cellWidth - this._xOffset;
        const yPart = cell.rowIndex * this.cellWidth - this._yOffset;
        return new _coordinate__WEBPACK_IMPORTED_MODULE_1__.Coordinate(xPart, yPart);
    }
    centerOfCell(cell) {
        const xPart = (cell.columnIndex * this.cellWidth + this.cellWidth / 2) - this._xOffset;
        const yPart = (cell.rowIndex * this.cellWidth + this.cellWidth / 2) - this._yOffset;
        return new _coordinate__WEBPACK_IMPORTED_MODULE_1__.Coordinate(xPart, yPart);
    }
}


/***/ }),

/***/ "./src/view/cellpainters/agepainter.ts":
/*!*********************************************!*\
  !*** ./src/view/cellpainters/agepainter.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AgePainter": () => (/* binding */ AgePainter)
/* harmony export */ });
/* harmony import */ var _cellpainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellpainter */ "./src/view/cellpainters/cellpainter.ts");

class AgePainter extends _cellpainter__WEBPACK_IMPORTED_MODULE_0__.CellPainter {
    plotCells(grid) {
        grid.allLiveCells.forEach(cell => {
            this.canvas.paintSquares([cell], this.colorGivenTheAgeOfCell(cell));
        });
    }
    colorGivenTheAgeOfCell(cell) {
        switch (cell.age) {
            case 1: return 'rgba(170,190,170,1)';
            case 2: return 'rgba(150,170,150,1)';
            case 3: return 'rgba(120,130,120,1)';
            case 4: return 'rgba(90,110,90,1)';
            case 5: return 'rgba(70,90,70,1)';
            case 6: return 'rgba(50,70,50,1)';
            case 7: return 'rgba(30,50,30,1)';
            case 8: return 'rgba(10,30,10,1)';
            default: return 'rgba(0,0,0,1)';
        }
    }
}


/***/ }),

/***/ "./src/view/cellpainters/cellpainter.ts":
/*!**********************************************!*\
  !*** ./src/view/cellpainters/cellpainter.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CellPainter": () => (/* binding */ CellPainter)
/* harmony export */ });
class CellPainter {
    constructor(canvas) {
        this.white = 'rgba(255,255,255,1)';
        this.black = 'rgba(0,0,0,1)';
        this.green = 'rgba(0,255,0,1)';
        this.gray = 'rgba(128,128,128,1)';
        this.orange = 'rgba(255,127,0,1)';
        this.yellow = 'rgba(255,255,0,1)';
        this.lightBlue = 'rgba(100,100,255,1)';
        this.canvas = canvas;
    }
    clearTheCanvas() {
        this.canvas.clearTheCanvas();
    }
}


/***/ }),

/***/ "./src/view/cellpainters/cellpainterfactory.ts":
/*!*****************************************************!*\
  !*** ./src/view/cellpainters/cellpainterfactory.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CellPainterFactory": () => (/* binding */ CellPainterFactory)
/* harmony export */ });
/* harmony import */ var _agepainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./agepainter */ "./src/view/cellpainters/agepainter.ts");
/* harmony import */ var _circularpainter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./circularpainter */ "./src/view/cellpainters/circularpainter.ts");
/* harmony import */ var _classicpainter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classicpainter */ "./src/view/cellpainters/classicpainter.ts");
/* harmony import */ var _moleculepainter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./moleculepainter */ "./src/view/cellpainters/moleculepainter.ts");
/* harmony import */ var _ribbonpainter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ribbonpainter */ "./src/view/cellpainters/ribbonpainter.ts");
/* harmony import */ var _neighbourcountpainter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./neighbourcountpainter */ "./src/view/cellpainters/neighbourcountpainter.ts");
/* harmony import */ var _smoothpainter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./smoothpainter */ "./src/view/cellpainters/smoothpainter.ts");







class CellPainterFactory {
    static getCellPainter(painterType, canvas) {
        switch (painterType) {
            case 'circular': return new _circularpainter__WEBPACK_IMPORTED_MODULE_1__.CircularPainter(canvas);
            case 'smooth': return new _smoothpainter__WEBPACK_IMPORTED_MODULE_6__.SmoothCellPainter(canvas);
            case 'age': return new _agepainter__WEBPACK_IMPORTED_MODULE_0__.AgePainter(canvas);
            case 'neighbours': return new _neighbourcountpainter__WEBPACK_IMPORTED_MODULE_5__.NeighboursCountPainter(canvas);
            case 'ribbon': return new _ribbonpainter__WEBPACK_IMPORTED_MODULE_4__.RibbonPainter(canvas);
            case 'molecule': return new _moleculepainter__WEBPACK_IMPORTED_MODULE_3__.MoleculePainter(canvas);
            default: return new _classicpainter__WEBPACK_IMPORTED_MODULE_2__.ClassicPainter(canvas);
        }
    }
}


/***/ }),

/***/ "./src/view/cellpainters/circularpainter.ts":
/*!**************************************************!*\
  !*** ./src/view/cellpainters/circularpainter.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CircularPainter": () => (/* binding */ CircularPainter)
/* harmony export */ });
/* harmony import */ var _cellpainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellpainter */ "./src/view/cellpainters/cellpainter.ts");

class CircularPainter extends _cellpainter__WEBPACK_IMPORTED_MODULE_0__.CellPainter {
    constructor(canvas) {
        super(canvas);
    }
    plotCells(grid) {
        this.canvas.paintCircles(grid.allLiveCells, this.black);
    }
}


/***/ }),

/***/ "./src/view/cellpainters/classicpainter.ts":
/*!*************************************************!*\
  !*** ./src/view/cellpainters/classicpainter.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClassicPainter": () => (/* binding */ ClassicPainter)
/* harmony export */ });
/* harmony import */ var _cellpainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellpainter */ "./src/view/cellpainters/cellpainter.ts");

class ClassicPainter extends _cellpainter__WEBPACK_IMPORTED_MODULE_0__.CellPainter {
    constructor(canvas) {
        super(canvas);
    }
    plotCells(grid) {
        this.canvas.paintSquares(grid.allLiveCells, this.black);
    }
}


/***/ }),

/***/ "./src/view/cellpainters/moleculepainter.ts":
/*!**************************************************!*\
  !*** ./src/view/cellpainters/moleculepainter.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MoleculePainter": () => (/* binding */ MoleculePainter)
/* harmony export */ });
/* harmony import */ var _cellpainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellpainter */ "./src/view/cellpainters/cellpainter.ts");

class MoleculePainter extends _cellpainter__WEBPACK_IMPORTED_MODULE_0__.CellPainter {
    constructor(canvas) {
        super(canvas);
    }
    plotCells(grid) {
        const livingCells = grid.allLiveCells;
        //orthogonal connections
        livingCells
            .forEach(cell => {
            cell.livingOrthogonalNeighbours
                .forEach(neighbour => {
                this.canvas.paintLineBetweenCells(cell, neighbour);
            });
        });
        this.cellsWithNoLivingOrthogonalNeihbours(livingCells)
            .forEach(cell => {
            cell.livingDiagonalNeighbours
                .forEach(neighbour => {
                this.canvas.paintLineBetweenCells(cell, neighbour);
            });
        });
        this.cellsWithOneLivingOrthogonalNeihbours(livingCells).forEach(cell => {
            cell.livingDiagonalNeighbours
                .forEach(neighbour => {
                if (this.cellsHaveNoCommonLivingOrthogonalNeighbours(cell, neighbour)) {
                    this.canvas.paintLineBetweenCells(cell, neighbour);
                }
            });
        });
        this.canvas.paintCellsAsHollowDots(livingCells, this.gray);
        this.canvas.paintCellsAsHollowDots(this.cellsWithNoLivingNeighbours(livingCells), this.yellow);
        this.canvas.paintCellsAsHollowDots(this.cellsWithOneLivingOrthogonalNeighbour(livingCells), this.green);
        this.cellsWithOneLivingOrthogonalNeihbours(livingCells).forEach(cell => {
            cell.livingDiagonalNeighbours
                .forEach(neighbour => {
                if (this.cellsHaveNoCommonLivingOrthogonalNeighbours(cell, neighbour)) {
                    this.canvas.paintCellsAsHollowDots([cell, neighbour], this.gray);
                }
            });
        });
        this.canvas.paintCellsAsHollowDots(this.cellsWithOneLivingDiagonalNeighbour(livingCells), this.lightBlue);
        this.canvas.paintCellsAsHollowDots(this.cellsWithTwoDiagonalNeighboursNotOnALine(livingCells), this.orange);
        this.canvas.paintCellsAsHollowDots(this.cellsWithTwoOrthogonalNeighbousNotOnALine(livingCells), this.orange);
    }
    cellsWithTwoOrthogonalNeighbousNotOnALine(cells) {
        return cells
            .filter(cell => cell.livingNeighbours.length == 2)
            .filter(cell => cell.livingOrthogonalNeighbours.length == 2)
            .filter(cell => {
            const neighbours = cell.livingOrthogonalNeighbours;
            const n1 = neighbours[0];
            const n2 = neighbours[1];
            return n1.columnIndex !== n2.columnIndex && n1.rowIndex !== n2.rowIndex;
        });
    }
    cellsWithTwoDiagonalNeighboursNotOnALine(cells) {
        return cells
            .filter(cell => cell.livingNeighbours.length == 2)
            .filter(cell => cell.livingDiagonalNeighbours.length == 2)
            .filter(cell => {
            const neighbours = cell.livingDiagonalNeighbours;
            const n1 = neighbours[0];
            const n2 = neighbours[1];
            return n1.columnIndex == n2.columnIndex || n1.rowIndex == n2.rowIndex;
        });
    }
    cellsWithNoLivingNeighbours(cells) {
        return cells.filter(cell => cell.livingNeighbours.length == 0);
    }
    cellsWithOneLivingOrthogonalNeighbour(cells) {
        return cells
            //.filter(cell => cell.livingNeighbours.length == 1)
            .filter(cell => cell.livingOrthogonalNeighbours.length == 1);
    }
    cellsWithOneLivingDiagonalNeighbour(cells) {
        return cells
            .filter(cell => cell.livingNeighbours.length == 1)
            .filter(cell => cell.livingDiagonalNeighbours.length == 1);
    }
    cellsHaveNoCommonLivingOrthogonalNeighbours(cell1, cell2) {
        const commonLivingOrthogonalCells = cell1.livingOrthogonalNeighbours
            .filter(c1 => cell2.livingOrthogonalNeighbours.some(c2 => c1 == c2));
        return commonLivingOrthogonalCells.length == 0;
    }
    cellsWithNoLivingOrthogonalNeihbours(cells) {
        return cells
            .filter(cell => cell.livingOrthogonalNeighbours.length == 0);
    }
    cellsWithOneLivingOrthogonalNeihbours(cells) {
        return cells
            .filter(cell => cell.livingOrthogonalNeighbours.length == 1);
    }
}


/***/ }),

/***/ "./src/view/cellpainters/neighbourcountpainter.ts":
/*!********************************************************!*\
  !*** ./src/view/cellpainters/neighbourcountpainter.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NeighboursCountPainter": () => (/* binding */ NeighboursCountPainter)
/* harmony export */ });
/* harmony import */ var _cellpainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellpainter */ "./src/view/cellpainters/cellpainter.ts");

class NeighboursCountPainter extends _cellpainter__WEBPACK_IMPORTED_MODULE_0__.CellPainter {
    plotCells(grid) {
        grid.allLiveCells.forEach(cell => {
            this.canvas.paintSquares([cell], this.colorGivenNumberOfNeighboursToOfCell(cell));
        });
    }
    colorGivenNumberOfNeighboursToOfCell(cell) {
        switch (cell.livingNeighbours.length) {
            case 0: return 'rgba(170,190,170,1)';
            case 1: return 'rgba(150,170,150,1)';
            case 2: return 'rgba(120,130,120,1)';
            case 3: return 'rgba(90,110,90,1)';
            case 4: return 'rgba(70,90,70,1)';
            case 5: return 'rgba(50,70,50,1)';
            case 6: return 'rgba(30,50,30,1)';
            case 7: return 'rgba(10,30,10,1)';
            default: return 'rgba(0,0,0,1)';
        }
    }
}


/***/ }),

/***/ "./src/view/cellpainters/ribbonpainter.ts":
/*!************************************************!*\
  !*** ./src/view/cellpainters/ribbonpainter.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RibbonPainter": () => (/* binding */ RibbonPainter)
/* harmony export */ });
/* harmony import */ var _model_cellconnection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../model/cellconnection */ "./src/model/cellconnection.ts");
/* harmony import */ var _cellpainter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cellpainter */ "./src/view/cellpainters/cellpainter.ts");


class RibbonPainter extends _cellpainter__WEBPACK_IMPORTED_MODULE_1__.CellPainter {
    plotCells(grid) {
        grid.clustersOfLiveCells.forEach(cluster => {
            const randomConnections = this.generateMazelikeRandomCellConnections(cluster);
            randomConnections.forEach(connection => {
                this.canvas.paintLineBetweenCells(connection.cell1, connection.cell2, this.canvas.mediumLineWidth, this.gray, true);
                this.canvas.paintLineBetweenCells(connection.cell1, connection.cell2, this.canvas.mediumLineWidth, this.green);
            });
        });
        const lonleyCells = grid.allLiveCells.filter(cell => cell.livingNeighbours.length == 0);
        this.canvas.paintCircles(lonleyCells, this.gray, this.canvas.mediumLineWidth, true);
        this.canvas.paintCircles(lonleyCells, this.green, this.canvas.mediumLineWidth, false);
    }
    generateMazelikeRandomCellConnections(cluster) {
        const cellConnections = [];
        const cellsToConnect = cluster.length;
        const connectedCells = new Set();
        const connectionTrail = [];
        const startCell = radomCellInArray(cluster);
        connectCell(startCell);
        while (cellsToConnect > connectedCells.size) {
            while (cellHasNoUnconnectedNeigbours(currentCell()) && connectedTrailNotEmpty()) {
                stepBackwards();
            }
            const randomNeighbour = randomUnconnectedNeighbour(currentCell());
            cellConnections.push(new _model_cellconnection__WEBPACK_IMPORTED_MODULE_0__.CellConnection(currentCell(), randomNeighbour));
            connectCell(randomNeighbour);
        }
        return cellConnections;
        function currentCell() {
            const currentCell = connectionTrail[connectionTrail.length - 1];
            return currentCell;
        }
        function connectedTrailNotEmpty() {
            return connectionTrail.length != 0;
        }
        function cellHasNoUnconnectedNeigbours(cell) {
            return cell.livingNeighbours.every(neigbour => connectedCells.has(neigbour));
        }
        function stepBackwards() {
            connectionTrail.pop();
        }
        function randomUnconnectedNeighbour(cell) {
            const unvisitedNeighbours = cell.livingNeighbours
                .filter(neighbour => !connectedCells.has(neighbour));
            return radomCellInArray(unvisitedNeighbours);
        }
        function connectCell(cell) {
            connectedCells.add(cell);
            connectionTrail.push(cell);
        }
        function radomCellInArray(cells) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }
}


/***/ }),

/***/ "./src/view/cellpainters/smoothpainter.ts":
/*!************************************************!*\
  !*** ./src/view/cellpainters/smoothpainter.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SmoothCellPainter": () => (/* binding */ SmoothCellPainter)
/* harmony export */ });
/* harmony import */ var _cellpainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellpainter */ "./src/view/cellpainters/cellpainter.ts");

class SmoothCellPainter extends _cellpainter__WEBPACK_IMPORTED_MODULE_0__.CellPainter {
    plotCells(grid) {
        const livingCells = grid.allLiveCells;
        livingCells.forEach(livingCell => {
            livingCell.livingNeighbours
                .forEach(livingNeighbourCell => {
                this.canvas.paintLineBetweenCells(livingCell, livingNeighbourCell, this.canvas.wideLineWidth);
            });
        });
        livingCells.forEach(livingCell => {
            livingCell.deadNeighbours
                .filter(deadCell => deadCell.livingOrthogonalNeighbours.length >= 3)
                .forEach(deadCell => {
                this.canvas.paintCircles([deadCell], this.white);
            });
        });
        this.canvas.paintCircles(livingCells, this.black);
    }
}


/***/ }),

/***/ "./src/view/cellpainters/squarecursorpainter.ts":
/*!******************************************************!*\
  !*** ./src/view/cellpainters/squarecursorpainter.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SquareCursorPainter": () => (/* binding */ SquareCursorPainter)
/* harmony export */ });
/* harmony import */ var _model_cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../model/cell */ "./src/model/cell.ts");

class SquareCursorPainter {
    constructor(canvas) {
        this.transparentGreen = 'rgba(255,127,0,0.6)';
        this.previousCell = new _model_cell__WEBPACK_IMPORTED_MODULE_0__.Cell(0, 0);
        this.canvas = canvas;
    }
    clearThePreviousCellOnCanvas() {
        this.canvas.clearSquare(this.previousCell);
    }
    colorCellOnMousePosition(cell) {
        this.canvas.paintSquares([cell], this.transparentGreen);
        this.previousCell = cell;
    }
}


/***/ }),

/***/ "./src/view/coordinate.ts":
/*!********************************!*\
  !*** ./src/view/coordinate.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Coordinate": () => (/* binding */ Coordinate)
/* harmony export */ });
class Coordinate {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
}


/***/ }),

/***/ "./src/view/view.ts":
/*!**************************!*\
  !*** ./src/view/view.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "View": () => (/* binding */ View)
/* harmony export */ });
/* harmony import */ var _cellpainters_squarecursorpainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellpainters/squarecursorpainter */ "./src/view/cellpainters/squarecursorpainter.ts");
/* harmony import */ var _cellpainters_cellpainterfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cellpainters/cellpainterfactory */ "./src/view/cellpainters/cellpainterfactory.ts");
/* harmony import */ var _canvas_canvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canvas/canvas */ "./src/view/canvas/canvas.ts");



class View {
    constructor(grid) {
        this.delayedAdjustCanvas = this.debounce(() => this.adjustCanvas(), 500);
        this.grid = grid;
        this.backgroundCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_2__.Canvas('gridLayer', grid);
        this.cellPainter = _cellpainters_cellpainterfactory__WEBPACK_IMPORTED_MODULE_1__.CellPainterFactory.getCellPainter('smooth', this.backgroundCanvas);
        this.foregroundCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_2__.Canvas('foreground', grid);
        this.foregroundPainter = new _cellpainters_squarecursorpainter__WEBPACK_IMPORTED_MODULE_0__.SquareCursorPainter(this.foregroundCanvas);
    }
    changePainter(cellPaintertype) {
        this.cellPainter = _cellpainters_cellpainterfactory__WEBPACK_IMPORTED_MODULE_1__.CellPainterFactory.getCellPainter(cellPaintertype, this.backgroundCanvas);
    }
    redrawGrid() {
        this.cellPainter.clearTheCanvas();
        this.cellPainter.plotCells(this.grid);
    }
    drawMouseCellPosition(position) {
        const cellAtMousePosition = this.getCellAtCoordinate(position);
        this.foregroundPainter.colorCellOnMousePosition(cellAtMousePosition);
    }
    removePreviousMouseCellPosition() {
        this.foregroundPainter.clearThePreviousCellOnCanvas();
    }
    getCellAtCoordinate(coordinate) {
        return this.foregroundCanvas.getCellAttCoordinate(coordinate);
    }
    adjustCanvas() {
        this.backgroundCanvas.updateCanvasWhenWindowChanges();
        this.foregroundCanvas.updateCanvasWhenWindowChanges();
        this.setTheHeightOfTheDiv(this.foregroundCanvas.height);
        this.redrawGrid();
    }
    setTheHeightOfTheDiv(newHeight) {
        const theDivThatHoldsCanvases = document.querySelector('div#viewport');
        theDivThatHoldsCanvases.style.height = newHeight + 'px';
    }
    debounce(func, wait) {
        let timeoutID;
        return function (...args) {
            clearTimeout(timeoutID);
            const context = this;
            timeoutID = window.setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _model_grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model/grid */ "./src/model/grid.ts");
/* harmony import */ var _view_view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view/view */ "./src/view/view.ts");
/* harmony import */ var _view_coordinate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view/coordinate */ "./src/view/coordinate.ts");
/* harmony import */ var _model_animator_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/animator.service */ "./src/model/animator.service.ts");





const grid = new _model_grid__WEBPACK_IMPORTED_MODULE_1__.Grid(60, 60);
const view = new _view_view__WEBPACK_IMPORTED_MODULE_2__.View(grid);
const animator = new _model_animator_service__WEBPACK_IMPORTED_MODULE_4__.AnimatorService(grid);
let running = false;
let handle;
animator.createPattern('glider', 35, 14);
animator.createPattern('zHexomino', 12, 27);
animator.createPattern('lightweightSpaceship', 12, 42);
animator.createPattern('pentaDecathlon', 13, 16);
animator.createPattern('toad', 45, 17);
animator.createCorners();
animator.createPattern('ship', 43, 35);
animator.createPattern('oscillatingPulsar', 23, 23);
function toggleRunning() {
    if (running) {
        running = false;
        clearInterval(handle);
    }
    else {
        running = true;
        handle = setInterval(() => takeAStep(), 500);
    }
}
function takeAStep() {
    evolveAllCellsInGrid();
    view.redrawGrid();
}
function evolveAllCellsInGrid() {
    grid.allCells.forEach(cell => cell.planFate());
    grid.allCells.forEach(cell => cell.executeFate());
}
function changePainter(cellPaintertype) {
    view.changePainter(cellPaintertype);
    view.redrawGrid();
}
function canvasLeftClicked(event, canvasId) {
    const coordinate = getMouseCoordinate(event, canvasId);
    view.getCellAtCoordinate(coordinate).toggleLifeDeath();
    view.redrawGrid();
}
function getMouseCoordinate(event, elementId) {
    const rect = document.getElementById(elementId).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return new _view_coordinate__WEBPACK_IMPORTED_MODULE_3__.Coordinate(x, y);
}
function canvasMouseMovement(event, canvasId) {
    const mousePosition = getMouseCoordinate(event, canvasId);
    view.removePreviousMouseCellPosition();
    view.drawMouseCellPosition(mousePosition);
}
function canvasMouseOut() {
    view.removePreviousMouseCellPosition();
}
function killAll() {
    const reallyKillAll = confirm('Do you want to kill every cell?');
    if (reallyKillAll) {
        killAllCellsInGrid();
        view.redrawGrid();
    }
}
function killAllCellsInGrid() {
    grid.allCells.forEach(cell => cell.die());
}
function keyPressed(event) {
    switch (event.key.toLowerCase()) {
        case 'w':
            toggleRunning();
            break;
        case 'e':
            takeAStep();
            break;
        case 'r':
            changePainter('ribbon');
            break;
        case 'a':
            changePainter('age');
            break;
        case 's':
            changePainter('smooth');
            break;
        case 'd':
            changePainter('circular');
            break;
        case 'f':
            changePainter('molecule');
            break;
        case 'x':
            killAll();
            break;
        case 'c':
            changePainter('classic');
            break;
        case 'v':
            changePainter('neighbours');
            break;
    }
}
document.getElementById('stepButton').addEventListener('click', () => takeAStep());
document.getElementById('classicButton').addEventListener('click', () => changePainter('classic'));
document.getElementById('circularButton').addEventListener('click', () => changePainter('circular'));
document.getElementById('smoothButton').addEventListener('click', () => changePainter('smooth'));
document.getElementById('cellAgeButton').addEventListener('click', () => changePainter('age'));
document.getElementById('neigbourcountButton').addEventListener('click', () => changePainter('neighbours'));
document.getElementById('ribbonButton').addEventListener('click', () => changePainter('ribbon'));
document.getElementById('moleculeButton').addEventListener('click', () => changePainter('molecule'));
document.getElementById('startStopButton').addEventListener('click', () => toggleRunning());
document.getElementById('killAllButton').addEventListener('click', () => killAll());
const foreground = document.getElementById('foreground');
foreground.addEventListener('click', (event) => canvasLeftClicked(event, event.target.id));
foreground.addEventListener('mousemove', (event) => canvasMouseMovement(event, event.target.id));
foreground.addEventListener('mouseout', () => canvasMouseOut());
document.addEventListener('keydown', (event) => keyPressed(event));
addEventListener('load', () => view.adjustCanvas());
addEventListener('resize', () => view.delayedAdjustCanvas());

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map