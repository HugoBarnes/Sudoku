function createSudokuGrid() {
    const gridContainer = document.getElementById('sudoku-grid');

    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(9, 1fr)';
    gridContainer.style.gap = '2px';
    gridContainer.style.maxWidth = '450px';
    gridContainer.style.margin = 'auto'

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.style.width = '50px';
            cell.style.height = '50px';
            cell.style.border = '1px solid black';
            cell.style.textAlign = 'center';
            cell.style.fontSize = '50px';
            cell.id = `cell-${row}-${col}`;

            const square = Math.floor(row / 3) * 3 + Math.floor(col / 3);

            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            cell.setAttribute('data-square', square);

            if (col % 3 === 2 && col !== 8) {
                cell.style.borderRight = '3px solid black';
            }

            if (row % 3 === 2 && row !== 8) {
                cell.style.borderBottom = '3px solid black';
            }

            cell.addEventListener('input', function (e) {
                e.target.value = e.target.value.replace(/[^1-9]/g, '');
            });
            cell.addEventListener('keydown', handleArrowKeyNavigation);

            gridContainer.appendChild(cell);
        }
    }
}

window.onload = function () {
    createSudokuGrid();
    newGrid();
};
document.getElementById('new-grid-button').addEventListener('click', () => {
    clearGrid();
    newGrid();
})

function handleArrowKeyNavigation(e) {
    const activeElement = document.activeElement;

    if (!activeElement.id.startsWith('cell-')) return;

    const [_, currentRow, currentCol] = activeElement.id.split('-').map(Number);

    let newRow = currentRow,
        newCol = currentCol;

    switch (e.key) {
        case 'ArrowLeft':
        case 'A':
        case 'a':
            newCol = Math.max(currentCol - 1, 0);
            break;
        case 'ArrowRight':
        case 'D':
        case 'd':
            newCol = Math.min(currentCol + 1, 8);
            break;
        case 'ArrowUp':
        case 'W':
        case 'w':
            newRow = Math.max(currentRow - 1, 0);
            break;
        case 'ArrowDown':
        case 'S':
        case 's':
            newRow = Math.min(currentRow + 1, 8);
            break;
        default:
            return; // ignore other keys
    }

    e.preventDefault();

    const newElement = document.getElementById(`cell-${newRow}-${newCol}`).focus();
    newElement.focus();

    setTimeout(() => {
        setCaretPosition(newElement, newElement.value.length);
    }, 0);
}

function setCaretPosition(elem, caretPos) {
    if (elem != null) {
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else if (elem.selectionStart !== undefined) {
            elem.focus();
            elem.setSelectionRange(caretPos, caretPos);
        } else
            elem.focus();
    }
}

// Back tracking approach -- random loop takes too long at the later numbers.
// the main idea is to try out a number, if it works move on, if it doesn't try a different number
function newGrid() {
    // for each of the cells in the grid:
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            // make a list of valid numbers to chose from for that cell:
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);
            // makes a singular list of the valid numbers 
            const validList = getValid(getRelativeCellValues(cell));

            // pick a number from the singular list and add it to the cell
            // board is valid returns true if board is valid
            let i = 0;
            while (!boardIsValid() && i < 9) {
                cell.value = validList[i];
            }
            // go back and change the value before the one we are currently at: this cell has no values

        }
    }
}

function getValid(relatives) {
    let validNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < relatives.rowValues.length; i++) {
        const num = parseInt(relatives.rowValues[i]);
        if (validNums.includes(num)) {
            validNums = validNums.filter(item => item != num);
        }
    }
    for (let j = 0; j < relatives.colValues.length; j++) {
        const num = parseInt(relatives.colValues[j]);
        if (validNums.includes(num)) {
            validNums = validNums.filter(item => item != num);
        }
    }
    for (let k = 0; k < relatives.squareValues.length; k++) {
        const num = parseInt(relatives.squareValues[k]);
        if (validNums.includes(num)) {
            validNums = validNums.filter(item => item != num);
        }
    }
    return validNums;
}

// loop through every row: look for 1-9
// loop through every col: look for 1-9
// loop through every square: look for 1-9

// Checking for contradictions!
function boardIsValid() {
    if (rowsValid() && colsValid() && squaresValid()) {
        return true;
    }
    return false;
}

function rowsValid() {
    for (let row = 0; row < 9; row++) {
        let rowValues = [];
        for (let col = 0; col < 9; col++) {
            const cellId = `cellId-${row}-${col}`;
            const cell = document.getElementById(cellId);
            curVal = cell.value;
            if (curVal !== '' && rowValues.includes(curVal)) {
                return false;
            } else if (curVal !== '') {
                rowValues.push(curVal);
            }
        }
    }
    return true;
}
function colsValid() {
    for (let col = 0; col < 9; col++) {
        let colValues = [];
        for (let row = 0; row < 9; row++) {
            const cellId = `cellId-${row}-${col}`;
            const cell = document.getElementById(cellId);
            curVal = cell.value;
            if (curVal !== '' && colValues.includes(curVal)) {
                return false;
            } else if (curVal !== '') {
                colValues.push(curVal);
            }
        }
    }
    return true;
}
function squaresValid() {
    for (let i = 0; i < 9; i++) {
        let squareValues =[];
        let startRow = Math.floor(i/3) * 3;
        let startCol = (i%3) *3;

        for(let row = startRow; row<startRow+3; row++){
            for(let col = startCol; col<startCol+3; col++){
                const cellId = `cellId-${row}-${col}`;
                const cell = document.getElementById(cellId);
                curVal = cell.value;

                if(curVal !== '' && squareValues.includes(curVal)){
                    return false;
                } else if(curVal !== ''){
                    squareValues.push(curVal);
                }
            }
        }
    }
    return true;
}

function clearGrid() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                cell.value = '';
            }
        }
    }
}

function getRelativeCellValues(cell) {
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');
    const square = cell.getAttribute('data-square');

    const relatedValues = {
        rowValues: [],
        colValues: [],
        squareValues: []
    };

    const allCells = document.querySelectorAll('#sudoku-grid input');

    allCells.forEach(otherCell => {
        if (otherCell !== cell) {
            if (otherCell.getAttribute('data-row') === row) {
                relatedValues.rowValues.push(otherCell.value);
            } if (otherCell.getAttribute('data-col') === col) {
                relatedValues.colValues.push(otherCell.value);
            } if (otherCell.getAttribute('data-square') === square) {
                relatedValues.squareValues.push(otherCell.value);
            }
        }
    });
    return relatedValues;
}

