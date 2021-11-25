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

/***/ "./src/controller.ts":
/*!***************************!*\
  !*** ./src/controller.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Controller": () => (/* binding */ Controller)
/* harmony export */ });
class Controller {
    constructor(model) {
        this.model = model;
    }
    generateLabyrinth() {
        this.model.generateLabyrinth();
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
    constructor(x, y) {
        this.hasBeenVisited = false;
        this.neighbouringCells = [];
        this._connectedNeighbouringCells = [];
        this.xCoordinate = x;
        this.yCoordinate = y;
    }
    get neighbours() {
        return this.neighbouringCells;
    }
    get unvisitedNeighbours() {
        return this.neighbouringCells.filter(cell => !cell.visited);
    }
    get hasNoUnvisitedNeighbours() {
        return this.unvisitedNeighbours.length == 0;
    }
    get randomUnvisitedNeighbour() {
        const randomIndex = Math.floor(Math.random() * this.unvisitedNeighbours.length);
        return this.unvisitedNeighbours[randomIndex];
    }
    addNeighbour(cell) {
        this.neighbouringCells.push(cell);
    }
    get visited() {
        return this.hasBeenVisited;
    }
    set visited(visited) {
        this.hasBeenVisited = visited;
    }
    get connectedNeighbouringCells() {
        return this._connectedNeighbouringCells;
    }
    removeEstablishedConnections() {
        this._connectedNeighbouringCells = [];
    }
    addConnection(toCell) {
        this._connectedNeighbouringCells.push(toCell);
    }
    removeConnection(toCell) {
        const index = this._connectedNeighbouringCells.indexOf(toCell);
        if (index > -1) {
            this._connectedNeighbouringCells.splice(index, 1);
        }
    }
    interconnectToCell(cell) {
        this.addConnection(cell);
        cell.addConnection(this);
    }
    removeInterConnectionsToCell() {
        const interConnectedCells = [...this.connectedNeighbouringCells];
        interConnectedCells.forEach(otherCell => {
            this.removeConnection(otherCell);
            otherCell.removeConnection(this);
        });
    }
    get x() {
        return this.xCoordinate;
    }
    get y() {
        return this.yCoordinate;
    }
    get centerCoordinate() {
        return { x: this.xCoordinate, y: this.yCoordinate };
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
class Grid {
    constructor(_numberOfColumns, _numberOfRows, _cellWidth) {
        this._numberOfColumns = _numberOfColumns;
        this._numberOfRows = _numberOfRows;
        this._cellWidth = _cellWidth;
        //
    }
    get numberOfColumns() {
        return this._numberOfColumns;
    }
    get numberOfRows() {
        return this._numberOfRows;
    }
    get cellWidth() {
        return this._cellWidth;
    }
    get startCell() {
        return this._startCell;
    }
    set startCell(cell) {
        this._startCell = cell;
    }
    get endCell() {
        return this._endCell;
    }
    set endCell(cell) {
        this._endCell = cell;
    }
    get cellMatrix() {
        return this._cellMatrix;
    }
    set cellMatrix(cellMatrix) {
        this._cellMatrix = cellMatrix;
    }
    get totalNumberOfCells() {
        return this._numberOfColumns * this._numberOfRows;
    }
    resetVisitedStatusOnCells() {
        this._cellMatrix.flat().forEach(cell => cell.visited = false);
        this.startCell.visited = true;
    }
    removeEstablishedConnectionsInCells() {
        this._cellMatrix.flat().forEach(cell => cell.removeEstablishedConnections());
    }
    get numberOfVisitedCells() {
        return this._cellMatrix.flat().filter(cell => cell.visited).length;
    }
}


/***/ }),

/***/ "./src/model/hexagonalgrid.ts":
/*!************************************!*\
  !*** ./src/model/hexagonalgrid.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HexagonalGrid": () => (/* binding */ HexagonalGrid)
/* harmony export */ });
/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cell */ "./src/model/cell.ts");
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid */ "./src/model/grid.ts");


class HexagonalGrid extends _grid__WEBPACK_IMPORTED_MODULE_1__.Grid {
    constructor(numberOfColumns, numberOfRows, cellWidth) {
        super(numberOfColumns, numberOfRows, cellWidth);
        this.cellMatrix = this.createMatrixOfInterconnectedHexagonalCells();
        this.startCell = this.cellMatrix[0][0];
        this.startCell.visited = true;
        this.endCell = this.cellMatrix[this.numberOfColumns - 1][this.numberOfRows - 1];
    }
    get heightDistancing() {
        return this.cellWidth * 3 / (2 * Math.sqrt(3));
    }
    get widthDistancing() {
        return this.cellWidth;
    }
    get rowOffset() {
        return this.cellWidth / 2;
    }
    createMatrixOfInterconnectedHexagonalCells() {
        const grid = [];
        for (let columnIndex = 0; columnIndex < this.numberOfColumns; columnIndex++) {
            const rowOfCells = [];
            for (let rowIndex = 0; rowIndex < this.numberOfRows; rowIndex++) {
                let xCoordinate = this.widthDistancing + columnIndex * this.widthDistancing;
                if (rowIndex % 2 == 1) {
                    xCoordinate += this.rowOffset;
                }
                const yCoordinate = this.heightDistancing + rowIndex * this.heightDistancing;
                rowOfCells.push(new _cell__WEBPACK_IMPORTED_MODULE_0__.Cell(xCoordinate, yCoordinate));
            }
            grid.push(rowOfCells);
        }
        this.interconnectGrid(grid);
        return grid;
    }
    interconnectGrid(grid) {
        this.connectNeighboursToTheSouth(grid);
        this.connectNeighboursToTheNorth(grid);
        this.connectNeighboursToTheWest(grid);
        this.connectNeighboursToTheEast(grid);
    }
    connectNeighboursToTheSouth(grid) {
        const transposedGrid = this.transposeArrayOfArrays(grid);
        for (let rowIndex = 0; rowIndex < transposedGrid.length - 1; rowIndex++) {
            for (let columnIndex = 0; columnIndex < transposedGrid[rowIndex].length; columnIndex++) {
                const currentCell = transposedGrid[rowIndex][columnIndex];
                const highestAcceptedDistance = this.widthDistancing * 0.55;
                transposedGrid[rowIndex + 1]
                    .filter(cell => (highestAcceptedDistance > Math.abs(currentCell.x - cell.x)))
                    .forEach(cell => currentCell.addNeighbour(cell));
            }
        }
    }
    connectNeighboursToTheNorth(grid) {
        const transposedGrid = this.transposeArrayOfArrays(grid);
        for (let rowIndex = 1; rowIndex < transposedGrid.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < transposedGrid[rowIndex].length; columnIndex++) {
                const currentCell = transposedGrid[rowIndex][columnIndex];
                const highestAcceptedDistance = this.widthDistancing * 0.55;
                transposedGrid[rowIndex - 1]
                    .filter(cell => (highestAcceptedDistance > Math.abs(currentCell.x - cell.x)))
                    .forEach(cell => { currentCell.addNeighbour(cell); });
            }
        }
    }
    transposeArrayOfArrays(inputArrayOfArrays) {
        const newArrayOfArrays = [];
        for (let column = 0; column < inputArrayOfArrays[0].length; column++) {
            const newRow = [];
            for (let row = 0; row < inputArrayOfArrays.length; row++) {
                newRow.push(inputArrayOfArrays[row][column]);
            }
            newArrayOfArrays.push(newRow);
        }
        return newArrayOfArrays;
    }
    connectNeighboursToTheWest(grid) {
        for (let columnIndex = 1; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex - 1][rowIndex]);
            }
        }
    }
    connectNeighboursToTheEast(grid) {
        for (let columnIndex = 0; columnIndex < grid.length - 1; columnIndex++) {
            for (let rowIndex = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex + 1][rowIndex]);
            }
        }
    }
}


/***/ }),

/***/ "./src/model/model.ts":
/*!****************************!*\
  !*** ./src/model/model.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Model": () => (/* binding */ Model)
/* harmony export */ });
class Model {
    constructor() {
        this._sequenceOfVisitedCells = [];
        this._solutionSequence = [];
    }
    set grid(grid) {
        this._grid = grid;
    }
    set view(view) {
        this._view = view;
    }
    get visitedStackIsNotEmpty() {
        return this._sequenceOfVisitedCells.length != 0;
    }
    get currentCell() {
        return this._sequenceOfVisitedCells[this._sequenceOfVisitedCells.length - 1];
    }
    initialize() {
        this._view.clearTheCanvas();
        this._grid.resetVisitedStatusOnCells();
        this._grid.removeEstablishedConnectionsInCells();
        this._sequenceOfVisitedCells = [this._grid.startCell];
        this._solutionSequence = [];
    }
    generateLabyrinth() {
        this.initialize();
        let numberOfVisitedCells = this._grid.numberOfVisitedCells;
        while (this._grid.totalNumberOfCells > numberOfVisitedCells) {
            while (this.currentCell.hasNoUnvisitedNeighbours && this.visitedStackIsNotEmpty) {
                this.stepBackwards();
            }
            this.stepToUnvisitedNeighbour();
            numberOfVisitedCells++;
        }
    }
    stepToUnvisitedNeighbour() {
        const nextCell = this.currentCell.randomUnvisitedNeighbour;
        nextCell.visited = true;
        this.currentCell.interconnectToCell(nextCell);
        this._view.drawConnection(this.currentCell.centerCoordinate, nextCell.centerCoordinate);
        this._sequenceOfVisitedCells.push(nextCell);
        if (nextCell === this._grid.endCell) {
            this._solutionSequence = [...this._sequenceOfVisitedCells];
        }
    }
    stepBackwards() {
        this._sequenceOfVisitedCells.pop();
    }
    showSolution() {
        for (let index = 0; index < this._solutionSequence.length - 1; index++) {
            const currentCell = this._solutionSequence[index];
            const nextCell = this._solutionSequence[index + 1];
            this._view.drawTrail(currentCell.centerCoordinate, nextCell.centerCoordinate);
        }
    }
    hideSolution() {
        for (let index = 0; index < this._solutionSequence.length - 1; index++) {
            const currentCell = this._solutionSequence[index];
            const nextCell = this._solutionSequence[index + 1];
            this._view.concealTrail(currentCell.centerCoordinate, nextCell.centerCoordinate);
        }
    }
    reduceSomeComplexity() {
        if (!this._grid) {
            return;
        }
        this._grid.cellMatrix.flat()
            .filter(cell => cell.connectedNeighbouringCells.length == 1)
            .filter(cell => cell != this._grid.startCell)
            .filter(cell => cell != this._grid.endCell)
            .forEach(cell => {
            cell.removeInterConnectionsToCell();
            this._view.fillCell(cell.centerCoordinate);
        });
    }
}


/***/ }),

/***/ "./src/model/rectangulargrid.ts":
/*!**************************************!*\
  !*** ./src/model/rectangulargrid.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RectangularGrid": () => (/* binding */ RectangularGrid)
/* harmony export */ });
/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cell */ "./src/model/cell.ts");
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid */ "./src/model/grid.ts");


class RectangularGrid extends _grid__WEBPACK_IMPORTED_MODULE_1__.Grid {
    constructor(numberOfColumns, numberOfRows, cellWidth) {
        super(numberOfColumns, numberOfRows, cellWidth);
        this.cellMatrix = this.createMatrixOfInterconnectedSquareCells();
        this.startCell = this.cellMatrix[0][0];
        this.startCell.visited = true;
        this.endCell = this.cellMatrix[this.numberOfColumns - 1][this.numberOfRows - 1];
    }
    createMatrixOfInterconnectedSquareCells() {
        const grid = [];
        for (let columnIndex = 0; columnIndex < this.numberOfColumns; columnIndex++) {
            const rowOfCells = [];
            for (let rowIndex = 0; rowIndex < this.numberOfRows; rowIndex++) {
                const xCoordinate = this.cellWidth + columnIndex * this.cellWidth;
                const yCoordinate = this.cellWidth + rowIndex * this.cellWidth;
                rowOfCells.push(new _cell__WEBPACK_IMPORTED_MODULE_0__.Cell(xCoordinate, yCoordinate));
            }
            grid.push(rowOfCells);
        }
        this.interconnectGrid(grid);
        return grid;
    }
    interconnectGrid(grid) {
        this.connectNeighboursToTheSouth(grid);
        this.connectNeighboursToTheNorth(grid);
        this.connectNeighboursToTheWest(grid);
        this.connectNeighboursToTheEast(grid);
    }
    connectNeighboursToTheSouth(grid) {
        for (let columnIndex = 0; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex = 0; rowIndex < grid[columnIndex].length - 1; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex][rowIndex + 1]);
            }
        }
    }
    connectNeighboursToTheNorth(grid) {
        for (let columnIndex = 0; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex = 1; rowIndex < grid[columnIndex].length; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex][rowIndex - 1]);
            }
        }
    }
    connectNeighboursToTheWest(grid) {
        for (let columnIndex = 1; columnIndex < grid.length; columnIndex++) {
            for (let rowIndex = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex - 1][rowIndex]);
            }
        }
    }
    connectNeighboursToTheEast(grid) {
        for (let columnIndex = 0; columnIndex < grid.length - 1; columnIndex++) {
            for (let rowIndex = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
                grid[columnIndex][rowIndex].addNeighbour(grid[columnIndex + 1][rowIndex]);
            }
        }
    }
}


/***/ }),

/***/ "./src/view/boxedview.ts":
/*!*******************************!*\
  !*** ./src/view/boxedview.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoxedView": () => (/* binding */ BoxedView)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ "./src/view/view.ts");

class BoxedView extends _view__WEBPACK_IMPORTED_MODULE_0__.View {
    constructor(width) {
        super();
        this.width = width;
    }
    drawConnection(startPoint, endPoint) {
        this.canvasCtx.strokeStyle = 'rgba(255,255,255,1)';
        this.canvasCtx.lineWidth = this.width;
        this.canvasCtx.lineCap = 'square';
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(startPoint.x, startPoint.y);
        this.canvasCtx.lineTo(endPoint.x, endPoint.y);
        this.canvasCtx.stroke();
    }
    fillCell(center) {
        this.canvasCtx.fillStyle = 'rgba(0,0,0,1)';
        const squareWidth = this.width + 1;
        this.canvasCtx.rect(center.x - squareWidth / 2, center.y - squareWidth / 2, squareWidth, squareWidth);
        this.canvasCtx.fill();
    }
}


/***/ }),

/***/ "./src/view/honeycombview.ts":
/*!***********************************!*\
  !*** ./src/view/honeycombview.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HoneycombView": () => (/* binding */ HoneycombView)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ "./src/view/view.ts");

class HoneycombView extends _view__WEBPACK_IMPORTED_MODULE_0__.View {
    constructor(width) {
        super();
        this.width = width;
    }
    drawConnection(startPoint, endPoint) {
        this.drawFilledHexagon(startPoint, this.width, this.mazeColor);
        this.drawFilledHexagon(endPoint, this.width, this.mazeColor);
        const quarterHeight = this.width / Math.sqrt(3) / 2;
        this.drawLine(startPoint, endPoint, quarterHeight * 2, this.mazeColor);
    }
    drawFilledHexagon(center, width, color) {
        const halfWidth = width / 2;
        const quarterHeight = width / Math.sqrt(3) / 2;
        this.canvasCtx.fillStyle = color;
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(center.x + halfWidth, center.y + quarterHeight);
        this.canvasCtx.lineTo(center.x, center.y + 2 * quarterHeight);
        this.canvasCtx.lineTo(center.x - halfWidth, center.y + quarterHeight);
        this.canvasCtx.lineTo(center.x - halfWidth, center.y - quarterHeight);
        this.canvasCtx.lineTo(center.x, center.y - 2 * quarterHeight);
        this.canvasCtx.lineTo(center.x + halfWidth, center.y - quarterHeight);
        this.canvasCtx.closePath();
        this.canvasCtx.fill();
    }
    fillCell(center) {
        this.drawFilledHexagon(center, this.width + 3, 'rgba(0,0,0,1)');
    }
}


/***/ }),

/***/ "./src/view/roundedview.ts":
/*!*********************************!*\
  !*** ./src/view/roundedview.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoundedView": () => (/* binding */ RoundedView)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ "./src/view/view.ts");

class RoundedView extends _view__WEBPACK_IMPORTED_MODULE_0__.View {
    constructor(width) {
        super();
        this.width = width;
    }
    drawConnection(startPoint, endPoint) {
        this.drawLine(startPoint, endPoint, this.width, this.mazeColor);
    }
    fillCell(center) {
        this.canvasCtx.fillStyle = 'rgba(0,0,0,1)';
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(center.x, center.y, (this.width + 3) / 2, 0, 2 * Math.PI);
        this.canvasCtx.fill();
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
class View {
    constructor() {
        this.canvasElement = document.getElementById('myCanvas');
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.mazeColor = 'rgba(255,255,255,1)';
        this.trailColor = 'rgba(0,0,255,1)';
    }
    clearTheCanvas() {
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
    paintCellCenter(centerPoint) {
        this.canvasCtx.fillStyle = this.mazeColor;
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(centerPoint.x, centerPoint.y, 3, 0, 2 * Math.PI);
        this.canvasCtx.fill();
    }
    drawTrail(startPoint, endPoint) {
        this.canvasCtx.strokeStyle = this.trailColor;
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.lineCap = 'round';
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(startPoint.x, startPoint.y);
        this.canvasCtx.lineTo(endPoint.x, endPoint.y);
        this.canvasCtx.stroke();
    }
    concealTrail(startPoint, endPoint) {
        this.canvasCtx.strokeStyle = this.mazeColor;
        this.canvasCtx.lineWidth = 4;
        this.canvasCtx.lineCap = 'round';
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(startPoint.x, startPoint.y);
        this.canvasCtx.lineTo(endPoint.x, endPoint.y);
        this.canvasCtx.stroke();
    }
    drawLine(fromPoint, toPoint, width, color) {
        this.canvasCtx.strokeStyle = color;
        this.canvasCtx.lineWidth = width;
        this.canvasCtx.lineCap = 'round';
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(fromPoint.x, fromPoint.y);
        this.canvasCtx.lineTo(toPoint.x, toPoint.y);
        this.canvasCtx.stroke();
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
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controller */ "./src/controller.ts");
/* harmony import */ var _model_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model/model */ "./src/model/model.ts");
/* harmony import */ var _model_rectangulargrid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model/rectangulargrid */ "./src/model/rectangulargrid.ts");
/* harmony import */ var _model_hexagonalgrid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/hexagonalgrid */ "./src/model/hexagonalgrid.ts");
/* harmony import */ var _view_roundedview__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./view/roundedview */ "./src/view/roundedview.ts");
/* harmony import */ var _view_boxedview__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./view/boxedview */ "./src/view/boxedview.ts");
/* harmony import */ var _view_honeycombview__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./view/honeycombview */ "./src/view/honeycombview.ts");








const model = new _model_model__WEBPACK_IMPORTED_MODULE_2__.Model();
const controller = new _controller__WEBPACK_IMPORTED_MODULE_1__.Controller(model);
document.getElementById('squareMazeButton').addEventListener('click', () => createSquareMaze());
document.getElementById('roundedMazeButton').addEventListener('click', () => createRoundedMaze());
document.getElementById('hexagonalMazeButton').addEventListener('click', () => createHexagonalMaze());
document.getElementById('simplifyButton').addEventListener('click', () => model.reduceSomeComplexity());
document.getElementById('showTrailButton').addEventListener('click', () => model.showSolution());
document.getElementById('hideTrailButton').addEventListener('click', () => model.hideSolution());
function createSquareMaze() {
    model.grid = new _model_rectangulargrid__WEBPACK_IMPORTED_MODULE_3__.RectangularGrid(69, 43, 15);
    model.view = new _view_boxedview__WEBPACK_IMPORTED_MODULE_6__.BoxedView(14);
    controller.generateLabyrinth();
}
function createRoundedMaze() {
    model.grid = new _model_hexagonalgrid__WEBPACK_IMPORTED_MODULE_4__.HexagonalGrid(51, 37, 20);
    model.view = new _view_roundedview__WEBPACK_IMPORTED_MODULE_5__.RoundedView(16);
    controller.generateLabyrinth();
}
function createHexagonalMaze() {
    model.grid = new _model_hexagonalgrid__WEBPACK_IMPORTED_MODULE_4__.HexagonalGrid(51, 37, 20);
    model.view = new _view_honeycombview__WEBPACK_IMPORTED_MODULE_7__.HoneycombView(18);
    controller.generateLabyrinth();
}

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map