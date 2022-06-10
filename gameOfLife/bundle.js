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
    constructor(width, height) {
        this._grid = this.generateColumnOfRowOfCells(width, height);
        this.connectCellsWithNeighbours();
    }
    get width() {
        return this._grid[0].length;
    }
    get height() {
        return this._grid.length;
    }
    cellAt(x, y) {
        return this._grid[y][x];
    }
    allCells() {
        return this._grid.flat();
    }
    //TODO: fundera över att använda en getter istället
    allLiveCells() {
        return this.allCells().filter(cell => cell.isAlive);
    }
    get clusters() {
        const clusterArray = [];
        const alreadyChecked = new Set();
        for (const livingCell of this.allLiveCells()) {
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
        this.allCells().forEach(currentCell => {
            this.allCells()
                .filter(cell => cell !== currentCell)
                .filter(cell => Math.abs(currentCell.columnIndex - cell.columnIndex) <= 1)
                .filter(cell => Math.abs(currentCell.rowIndex - cell.rowIndex) <= 1)
                .forEach(cell => currentCell.addNeighbour(cell));
        });
    }
    evolve() {
        this.allCells().forEach(cell => cell.planFate());
        this.allCells().forEach(cell => cell.executeFate());
    }
    killAll() {
        this.allCells().forEach(cell => cell.die());
    }
}


/***/ }),

/***/ "./src/view/cellpainters/canvaspainter.ts":
/*!************************************************!*\
  !*** ./src/view/cellpainters/canvaspainter.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CanvasPainter": () => (/* binding */ CanvasPainter)
/* harmony export */ });
/* harmony import */ var _coordinate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../coordinate */ "./src/view/coordinate.ts");

class CanvasPainter {
    constructor() {
        this.white = 'rgba(255,255,255,1)';
        this.black = 'rgba(0,0,0,1)';
        this.green = 'rgba(0,255,0,1)';
        this.gray = 'rgba(128,128,128,1)';
        this.canvasElement = document.getElementById('myCanvas');
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.gridCellWidth = 20;
    }
    clearTheCanvas() {
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
    paintWideLineBetweenCells(cell1, cell2) {
        this.paintLineBetweenCells(cell1, cell2, this.gridCellWidth, this.black, false);
    }
    paintMediumGreenLineBetweenCells(cell1, cell2) {
        this.paintLineBetweenCells(cell1, cell2, this.gridCellWidth * 0.6, this.green, false);
    }
    paintMediumShadowLineBetweenCells(cell1, cell2) {
        this.paintLineBetweenCells(cell1, cell2, this.gridCellWidth * 0.6, this.gray, true);
    }
    paintThinLineBetweenCells(cell1, cell2) {
        this.paintLineBetweenCells(cell1, cell2, 2.5, this.black, false);
    }
    paintLineBetweenCells(cell1, cell2, width, color, offset) {
        let shadowOffset = 0;
        if (offset) {
            shadowOffset = this.gridCellWidth * 0.1;
        }
        this.canvasCtx.strokeStyle = color;
        const centerOfCell1 = this.centerOfCell(cell1);
        const centerOfCell2 = this.centerOfCell(cell2);
        this.canvasCtx.lineWidth = width;
        this.canvasCtx.lineCap = 'round';
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(centerOfCell1.x + shadowOffset, centerOfCell1.y + shadowOffset);
        this.canvasCtx.lineTo(centerOfCell2.x + shadowOffset, centerOfCell2.y + shadowOffset);
        this.canvasCtx.stroke();
    }
    paintCellsAsHollowDots(cells, outerColor, innerColor) {
        this.paintCircles(cells, outerColor, this.gridCellWidth * 0.32, false);
        this.paintCircles(cells, innerColor, this.gridCellWidth * 0.2, false);
    }
    paintCellsAsSmallHollowDots(cells, outerColor, innerColor) {
        this.paintCircles(cells, outerColor, this.gridCellWidth * 0.25, false);
        this.paintCircles(cells, innerColor, this.gridCellWidth * 0.05, false);
    }
    paintWhiteCircle(cell) { this.paintWhiteCircles([cell]); }
    paintBlackCircle(cell) { this.paintBlackCircles([cell]); }
    paintWhiteCircles(cells) {
        this.paintCircles(cells, this.white, this.gridCellWidth * 0.5, false);
    }
    paintBlackCircles(cells) {
        this.paintCircles(cells, this.black, this.gridCellWidth * 0.5, false);
    }
    paintCircles(cells, color, width, offset) {
        let shadowOffset = 0;
        if (offset) {
            shadowOffset = this.gridCellWidth * 0.1;
        }
        const radius = width;
        this.canvasCtx.fillStyle = color;
        cells.forEach(cell => {
            const center = this.centerOfCell(cell);
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(center.x + shadowOffset, center.y + shadowOffset, radius, 0, 2 * Math.PI);
            this.canvasCtx.fill();
        });
    }
    paintSquares(cells, color) {
        const padding = 1;
        this.canvasCtx.fillStyle = color;
        this.canvasCtx.beginPath(); //varför måste jag ha med detta för att färgändring ska slå igenom
        this.canvasCtx.stroke(); // dito
        const squareWidth = this.gridCellWidth - 2 * padding;
        cells.forEach(cell => {
            const corner = this.upperLeftCornerOfCell(cell);
            this.canvasCtx.rect(corner.x + padding, corner.y + padding, squareWidth, squareWidth);
            this.canvasCtx.fill();
        });
    }
    upperLeftCornerOfCell(cell) {
        const xPart = cell.columnIndex * this.gridCellWidth;
        const yPart = cell.rowIndex * this.gridCellWidth;
        return new _coordinate__WEBPACK_IMPORTED_MODULE_0__.Coordinate(xPart, yPart);
    }
    centerOfCell(cell) {
        const xPart = cell.columnIndex * this.gridCellWidth + this.gridCellWidth / 2;
        const yPart = cell.rowIndex * this.gridCellWidth + this.gridCellWidth / 2;
        return new _coordinate__WEBPACK_IMPORTED_MODULE_0__.Coordinate(xPart, yPart);
    }
}


/***/ }),

/***/ "./src/view/cellpainters/cellagepainter.ts":
/*!*************************************************!*\
  !*** ./src/view/cellpainters/cellagepainter.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CellAgePainter": () => (/* binding */ CellAgePainter)
/* harmony export */ });
/* harmony import */ var _canvaspainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvaspainter */ "./src/view/cellpainters/canvaspainter.ts");

class CellAgePainter extends _canvaspainter__WEBPACK_IMPORTED_MODULE_0__.CanvasPainter {
    plotCells(grid) {
        grid.allLiveCells().forEach(cell => {
            this.paintSquares([cell], this.colorGivenTheAgeOfCell(cell));
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

/***/ "./src/view/cellpainters/cellpainterprovider.ts":
/*!******************************************************!*\
  !*** ./src/view/cellpainters/cellpainterprovider.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CellPainterProvider": () => (/* binding */ CellPainterProvider)
/* harmony export */ });
/* harmony import */ var _cellagepainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellagepainter */ "./src/view/cellpainters/cellagepainter.ts");
/* harmony import */ var _circularcellpainter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./circularcellpainter */ "./src/view/cellpainters/circularcellpainter.ts");
/* harmony import */ var _classiccellpainter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classiccellpainter */ "./src/view/cellpainters/classiccellpainter.ts");
/* harmony import */ var _trusspainter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./trusspainter */ "./src/view/cellpainters/trusspainter.ts");
/* harmony import */ var _moleculepainter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./moleculepainter */ "./src/view/cellpainters/moleculepainter.ts");
/* harmony import */ var _ribbonpainter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ribbonpainter */ "./src/view/cellpainters/ribbonpainter.ts");
/* harmony import */ var _neighbourcountpainter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./neighbourcountpainter */ "./src/view/cellpainters/neighbourcountpainter.ts");
/* harmony import */ var _smoothpainter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./smoothpainter */ "./src/view/cellpainters/smoothpainter.ts");








//TODO: döpa om till factory?
class CellPainterProvider {
    static getCellPainter(painterType) {
        switch (painterType) {
            case 'circular': return new _circularcellpainter__WEBPACK_IMPORTED_MODULE_1__.CircularCellPainter();
            case 'smooth': return new _smoothpainter__WEBPACK_IMPORTED_MODULE_7__.SmoothCellPainter();
            case 'age': return new _cellagepainter__WEBPACK_IMPORTED_MODULE_0__.CellAgePainter();
            case 'neighbours': return new _neighbourcountpainter__WEBPACK_IMPORTED_MODULE_6__.NeighboursCountPainter();
            case 'truss': return new _trusspainter__WEBPACK_IMPORTED_MODULE_3__.TrussPainter();
            case 'ribbon': return new _ribbonpainter__WEBPACK_IMPORTED_MODULE_5__.RibbonPainter();
            case 'molecule': return new _moleculepainter__WEBPACK_IMPORTED_MODULE_4__.MoleculePainter();
            default: return new _classiccellpainter__WEBPACK_IMPORTED_MODULE_2__.ClassicCellPainter();
        }
    }
}


/***/ }),

/***/ "./src/view/cellpainters/circularcellpainter.ts":
/*!******************************************************!*\
  !*** ./src/view/cellpainters/circularcellpainter.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CircularCellPainter": () => (/* binding */ CircularCellPainter)
/* harmony export */ });
/* harmony import */ var _canvaspainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvaspainter */ "./src/view/cellpainters/canvaspainter.ts");

class CircularCellPainter extends _canvaspainter__WEBPACK_IMPORTED_MODULE_0__.CanvasPainter {
    plotCells(grid) {
        this.paintBlackCircles(grid.allLiveCells());
    }
}


/***/ }),

/***/ "./src/view/cellpainters/classiccellpainter.ts":
/*!*****************************************************!*\
  !*** ./src/view/cellpainters/classiccellpainter.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClassicCellPainter": () => (/* binding */ ClassicCellPainter)
/* harmony export */ });
/* harmony import */ var _canvaspainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvaspainter */ "./src/view/cellpainters/canvaspainter.ts");

class ClassicCellPainter extends _canvaspainter__WEBPACK_IMPORTED_MODULE_0__.CanvasPainter {
    plotCells(grid) {
        this.paintSquares(grid.allLiveCells(), 'rgba(0,0,0,1)');
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
/* harmony import */ var _canvaspainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvaspainter */ "./src/view/cellpainters/canvaspainter.ts");

class MoleculePainter extends _canvaspainter__WEBPACK_IMPORTED_MODULE_0__.CanvasPainter {
    plotCells(grid) {
        const livingCells = grid.allLiveCells();
        //orthogonal connections
        livingCells
            .forEach(cell => {
            cell.livingOrthogonalNeighbours
                .forEach(neighbour => {
                this.paintThinLineBetweenCells(cell, neighbour);
            });
        });
        this.cellsWithNoLivingOrthogonalNeihbours(livingCells)
            .forEach(cell => {
            cell.livingDiagonalNeighbours
                .forEach(neighbour => {
                this.paintThinLineBetweenCells(cell, neighbour);
            });
        });
        this.cellsWithOneLivingOrthogonalNeihbours(livingCells).forEach(cell => {
            this.cellsWithOneLivingOrthogonalNeihbours(cell.diagonalNeighbours.filter(neighbour => neighbour.isAlive))
                .forEach(neighbour => this.paintThinLineBetweenCells(cell, neighbour));
        });
        this.paintCellsAsHollowDots(livingCells, 'rgba(0,0,0,1)', 'rgba(128,128,0,1)');
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
/* harmony import */ var _canvaspainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvaspainter */ "./src/view/cellpainters/canvaspainter.ts");

class NeighboursCountPainter extends _canvaspainter__WEBPACK_IMPORTED_MODULE_0__.CanvasPainter {
    plotCells(grid) {
        grid.allLiveCells().forEach(cell => {
            this.paintSquares([cell], this.colorGivenNumberOfNeighboursToOfCell(cell));
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
/* harmony import */ var _canvaspainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvaspainter */ "./src/view/cellpainters/canvaspainter.ts");

class RibbonPainter extends _canvaspainter__WEBPACK_IMPORTED_MODULE_0__.CanvasPainter {
    plotCells(grid) {
        grid.clusters.forEach(cluster => {
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
                this.paintMediumShadowLineBetweenCells(currentCell(), randomNeighbour);
                this.paintMediumGreenLineBetweenCells(currentCell(), randomNeighbour);
                connectCell(randomNeighbour);
            }
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
        });
        const lonleyCells = grid.allLiveCells().filter(cell => cell.livingNeighbours.length == 0);
        this.paintCircles(lonleyCells, 'rgba(128,128,128,1)', 7, true);
        this.paintCircles(lonleyCells, 'rgba(0,255,0,1)', 7, false);
        //this.paintCellsAsSmallHollowDots(grid.allLiveCells(), 'rgba(0,255,0,1)', 'rgba(0,0,0,1)');
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
/* harmony import */ var _canvaspainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvaspainter */ "./src/view/cellpainters/canvaspainter.ts");

class SmoothCellPainter extends _canvaspainter__WEBPACK_IMPORTED_MODULE_0__.CanvasPainter {
    plotCells(grid) {
        const livingCells = grid.allLiveCells();
        livingCells.forEach(livingCell => {
            livingCell.livingNeighbours
                .forEach(livingNeighbourCell => {
                this.paintWideLineBetweenCells(livingCell, livingNeighbourCell);
            });
        });
        livingCells.forEach(livingCell => {
            livingCell.deadNeighbours
                .filter(deadCell => deadCell.livingOrthogonalNeighbours.length >= 3)
                .forEach(deadCell => {
                this.paintWhiteCircle(deadCell);
            });
        });
        this.paintBlackCircles(livingCells);
    }
}


/***/ }),

/***/ "./src/view/cellpainters/trusspainter.ts":
/*!***********************************************!*\
  !*** ./src/view/cellpainters/trusspainter.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TrussPainter": () => (/* binding */ TrussPainter)
/* harmony export */ });
/* harmony import */ var _canvaspainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvaspainter */ "./src/view/cellpainters/canvaspainter.ts");

class TrussPainter extends _canvaspainter__WEBPACK_IMPORTED_MODULE_0__.CanvasPainter {
    plotCells(grid) {
        //draw all connections
        grid.allLiveCells().forEach(livingCell => {
            livingCell.livingNeighbours
                .forEach(livingNeighbourCell => {
                this.paintThinLineBetweenCells(livingCell, livingNeighbourCell);
            });
        });
        this.paintCellsAsHollowDots(grid.allLiveCells(), 'rgba(0,0,0,1)', 'rgba(128,255,255,1)');
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
/* harmony import */ var _cellpainters_smoothpainter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellpainters/smoothpainter */ "./src/view/cellpainters/smoothpainter.ts");

class View {
    constructor() {
        this._cellPainter = new _cellpainters_smoothpainter__WEBPACK_IMPORTED_MODULE_0__.SmoothCellPainter();
    }
    set cellPainter(cellPainter) {
        this._cellPainter = cellPainter;
    }
    redrawGrid(grid) {
        this._cellPainter.clearTheCanvas();
        this._cellPainter.plotCells(grid);
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
/* harmony import */ var _view_cellpainters_cellpainterprovider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view/cellpainters/cellpainterprovider */ "./src/view/cellpainters/cellpainterprovider.ts");
/* harmony import */ var _view_coordinate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./view/coordinate */ "./src/view/coordinate.ts");





const grid = new _model_grid__WEBPACK_IMPORTED_MODULE_1__.Grid(60, 55);
const view = new _view_view__WEBPACK_IMPORTED_MODULE_2__.View();
view.redrawGrid(grid);
//Glider
grid.cellAt(15, 1).live();
grid.cellAt(15, 2).live();
grid.cellAt(15, 3).live();
grid.cellAt(16, 3).live();
grid.cellAt(17, 2).live();
//Toad
grid.cellAt(4, 3).live();
grid.cellAt(5, 3).live();
grid.cellAt(6, 3).live();
grid.cellAt(5, 4).live();
grid.cellAt(6, 4).live();
grid.cellAt(7, 4).live();
//corner
grid.cellAt(0, 0).live();
grid.cellAt(59, 54).live();
//xxx
grid.cellAt(30, 27).live();
grid.cellAt(30, 28).live();
grid.cellAt(30, 29).live();
grid.cellAt(31, 26).live();
grid.cellAt(32, 26).live();
grid.cellAt(33, 27).live();
grid.cellAt(32, 28).live();
function evolveAndPaint() {
    grid.evolve();
    view.redrawGrid(grid);
}
function changeCellPainter(cellPaintertype) {
    view.cellPainter = _view_cellpainters_cellpainterprovider__WEBPACK_IMPORTED_MODULE_3__.CellPainterProvider.getCellPainter(cellPaintertype);
    view.redrawGrid(grid);
}
function canvasLeftClicked(event, canvasId) {
    const coordinate = getMouseCoordinate(event, canvasId);
    grid.cellAt(Math.floor(coordinate.x / 20), Math.floor(coordinate.y / 20)).toggleLifeDeath();
    view.redrawGrid(grid);
}
function getMouseCoordinate(event, elementId) {
    const rect = document.getElementById(elementId).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return new _view_coordinate__WEBPACK_IMPORTED_MODULE_4__.Coordinate(x, y);
}
function killAll() {
    grid.killAll();
    view.redrawGrid(grid);
}
function keyPressed(event) {
    switch (event.key) {
        case 'e':
            evolveAndPaint();
            break;
        case 'r':
            changeCellPainter('ribbon');
            break;
        case 't':
            changeCellPainter('truss');
            break;
        case 'a':
            changeCellPainter('age');
            break;
        case 's':
            changeCellPainter('smooth');
            break;
        case 'd':
            changeCellPainter('circular');
            break;
        case 'f':
            changeCellPainter('molecule');
            break;
        case 'x':
            killAll();
            break;
        case 'c':
            changeCellPainter('classic');
            break;
        case 'v':
            changeCellPainter('neighbours');
            break;
    }
}
document.getElementById('evolveButton').addEventListener('click', () => evolveAndPaint());
document.getElementById('classicButton').addEventListener('click', () => changeCellPainter('classic'));
document.getElementById('circularButton').addEventListener('click', () => changeCellPainter('circular'));
document.getElementById('smoothButton').addEventListener('click', () => changeCellPainter('smooth'));
document.getElementById('cellAgeButton').addEventListener('click', () => changeCellPainter('age'));
document.getElementById('neigbourcountButton').addEventListener('click', () => changeCellPainter('neighbours'));
document.getElementById('trussButton').addEventListener('click', () => changeCellPainter('truss'));
document.getElementById('ribbonButton').addEventListener('click', () => changeCellPainter('ribbon'));
document.getElementById('moleculeButton').addEventListener('click', () => changeCellPainter('molecule'));
document.getElementById('killAllButton').addEventListener('click', () => killAll());
document.getElementById('myCanvas')
    .addEventListener('click', (event) => canvasLeftClicked(event, event.target.id));
document.addEventListener('keydown', (event) => keyPressed(event));

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map