function createSudokuGrid(){
    const gridContainer = document.getElementById('sudoku-grid');

    gridContainer.style.display='grid';
    gridContainer.style.gridTemplateColumns = 'repeat(9, 1fr)';
    gridContainer.style.gap = '2px';
    gridContainer.style.maxWidth = '450px';
    gridContainer.style.margin='auto'

    for(let row = 0; row<9; row++){
        for(let col = 0; col<9; col++){
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.style.width = '50px';
            cell.style.height = '50px';
            cell.style.border = '1px solid black';
            cell.style.textAlign = 'center';
            cell.style.fontSize = '50px';
            cell.id = `cell-${row}-${col}`;

            const square = Math.floor(row/3) * 3 + Math.floor(col/3);

            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            cell.setAttribute('data-square', square);

            if (col % 3 === 2 && col !== 8){
                cell.style.borderRight = '3px solid black';
            }

            if (row % 3 === 2 && row !==8){
                cell.style.borderBottom = '3px solid black';
            }

            cell.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/[^1-9]/g, '');
            });
            cell.addEventListener('keydown', handleArrowKeyNavigation);

            gridContainer.appendChild(cell);
        }
    }
}

window.onload = function(){
    createSudokuGrid();
    newGrid();
};
document.getElementById('new-grid-button').addEventListener('click', () => {
    newGrid();
})

function handleArrowKeyNavigation(e){
    const activeElement = document.activeElement;

    if(!activeElement.id.startsWith('cell-')) return;

    const [_, currentRow, currentCol] = activeElement.id.split('-').map(Number);

    let newRow = currentRow,
        newCol = currentCol;

    switch(e.key){
        case 'ArrowLeft':
        case 'A':
        case 'a':
            newCol = Math.max(currentCol -1, 0);
            break;    
        case 'ArrowRight':
        case 'D':
        case 'd':
            newCol = Math.min(currentCol +1, 8);
            break;
        case 'ArrowUp':
        case 'W':
        case 'w':
            newRow = Math.max(currentRow -1, 0);
            break;
        case 'ArrowDown':
        case 'S':
        case 's':
            newRow = Math.min(currentRow +1, 8);
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

function setCaretPosition(elem, caretPos){
    if(elem != null){
        if(elem.createTextRange) {
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


function newGrid(){
    // Step 1: fill the new grid with a valid sudoku set:
        // Fill the grid 1-9 in each row
        // Use backTracking: 
            // fill the grid with a value --> try another value:

    const gridcontainer = document.getElementById('sudoku-grid');

    for(let row=0; row<9; row++){
        for(let col=0; col<9; col++){
            const cellId = `cell-${row}-${col}`;
            const cell =document.getElementById(cellId);

            const relatedValues = getRelativeCellValues(cell);
            if(cell){
                // update cell.value with a random value 1-9
                    // if the random value is in row, cell or square already
                        // do the random value again
                    // otherwise move on to the next cell

                    // Updated to 1-9: 0-1 exclusive is how math.random works
                let checks = false;
                let attempts = 0;

                while(!checks){
                    const number = Math.floor(Math.random()*9) +1;
                    if(!relatedValues.rowValues.includes(number) &&
                    !relatedValues.colValues.includes(number) && 
                    !relatedValues.squareValues.includes(number)){
                        checks = true;
                        cell.value = number;
                    }
                    if(attempts >- 100){
                        return newGrid();
                    }
                }
            }
        }
    }
}


function getRelativeCellValues(cell){
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
        if(otherCell !== cell){
            if(otherCell.getAttribute('data-row') === row){
                relatedValues.rowValues.push(otherCell.value);
            } if(otherCell.getAttribute('data-col') === col){
                relatedValues.colValues.push(otherCell.value);
            } if(otherCell.getAttribute('data-square') === square){
                relatedValues.squareValues.push(otherCell.value);
            }
        }
    });
    return relatedValues;
}
