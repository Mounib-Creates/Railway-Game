// main.js

// Page elements

const menuScreen = document.querySelector('#menu-screen');
const gameScreen = document.querySelector('#game-screen');
const rulesModal = document.querySelector('#rules-modal');
const timerDisplay = document.querySelector("#timer");

// Buttons
const startGameBtn = document.querySelector('#start-game-btn');
const rulesBtn = document.querySelector('#rules-btn');
const backToMenuBtn = document.querySelector('#back-to-menu');
const easyButton = document.querySelector('#easy-btn');
const hardButton = document.querySelector('#hard-btn');


// Modal elements
const modalCloseBtn = document.querySelector('.close');
const endGameModal = document.querySelector('#end-game-modal');

// Input and Player Name
const playerNameInput = document.querySelector('#player-name');
const playerDisplay = document.querySelector('#player-name-display');

// Start Game when name and difficulty are selected
startGameBtn.addEventListener('click', () => {
    if (playerNameInput.value) {
        playerDisplay.textContent = `Player : ${playerNameInput.value}`;

        if (MAP)
        {

            stopTimer(); // Stop the current timer
            elapsedSeconds = 0;
            updateTimerDisplay();
            grid = structuredClone(sourceGrid);
            renderGrid(grid);
            switchToGame();
            startTimer();
        }
        
    } 
});

document.querySelector('#close-modal-btn').addEventListener('click', () => {
    document.querySelector('#end-game-modal').style.display = 'none';
});



// Switch to game screen
function switchToGame() {
    menuScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    
}
let timerInterval; // For tracking the interval
let elapsedSeconds = 0; // To track elapsed time in seconds


// Function to start the timer
function startTimer() {
    elapsedSeconds = 0; // Reset the timer
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimerDisplay();
    }, 1000); // Update every second
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Function to update the timer display
function updateTimerDisplay() {
    const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const seconds = String(elapsedSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}


// Switch back to menu screen
backToMenuBtn.addEventListener('click', () => {
    
    MAP = null;
    easyButton.classList.remove('chosen');
    hardButton.classList.remove('chosen');
    gameScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
    
});

// Show modal with rules
rulesBtn.addEventListener('click', () => {
    rulesModal.style.display = 'block';
});

// Close the rules modal
modalCloseBtn.addEventListener('click', () => {
    rulesModal.style.display = 'none';
});

// Close modal by clicking outside of it
window.onclick = function(event) {
    if (event.target == rulesModal) {
        rulesModal.style.display = 'none';
    }
};

// Enable Start Game button when player enters a name

playerNameInput.addEventListener('input', () => {
    if ((playerNameInput.value.trim() !== '') ) {
        startGameBtn.disabled = false;
    } else {
        startGameBtn.disabled = true;
    }
});



if (playerNameInput && startGameBtn) {
    playerNameInput.addEventListener('input', () => {
        startGameBtn.disabled = playerNameInput.value.trim() === "";
    });
}
easyButton.addEventListener('click', () => 
    {
    
        
        selectDifficulty(5);
        renderGrid(grid);
        
    });
hardButton.addEventListener('click', () => {
    
    
    selectDifficulty(7);
    renderGrid(grid);
    

});


    
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GAME Logic : The grid will be represented in a matrix of cells (Declarative approach)

// DATA

let grid = [[]];
let sourceGrid = [[]];
let MAP;


//Rendndering

function renderGrid(grid) {
    const gridContainer = document.querySelector("#game-grid");
    gridContainer.innerHTML = "";

    let imageName = "";
    grid.forEach((row, rowInd) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        row.forEach((cell, colInd) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell"); // Base cell class

            cellDiv.dataset.row = rowInd;
            cellDiv.dataset.col = colInd;
            // Assign an image or background based on the cell type
            switch (cell.type) {
                case 0:
                    cellDiv.style.backgroundImage= "url('./pics/tiles/lake.png')";
                    break;
                case 1:
                    imageName = `empty${cell.used === 1 ? "_used" : ""}.png`;
                    if (corner(cell)) {
                        cellDiv.style.backgroundImage = "url('./pics/tiles/curve.png')"
                        cellDiv.style.transform = `rotate(${getDegree(cell)})`;
                    }
                    else {
                        cellDiv.style.backgroundImage = `url('./pics/tiles/${imageName}')`;
                        cellDiv.style.transform = `rotate(${getDegree(cell)})`;
                        }
                    break;
                case 2:
                    imageName = `bridge${cell.used === 1 ? "_used" : ""}.png`;    
                    if (cell.top === 1) {cellDiv.style.backgroundImage = `url('./pics/tiles/${imageName}')`;}
                    else {cellDiv.style.backgroundImage = `url('./pics/tiles/${imageName}')`;
                            
                            cellDiv.style.transform = "rotate(90deg)";
                        }
                    
                    break;
                case 3:
                    imageName = `mountain${cell.used === 1 ? "_used" : ""}.png`;    
                    cellDiv.style.backgroundImage = `url('./pics/tiles/${imageName}')`;
                    cellDiv.style.transform = `rotate(${getDegree(cell)})`;
                    
                    break;
                default:
                    break;
            }

            
            cellDiv.style.backgroundSize = "cover";
            cellDiv.style.margin = 0;
            cellDiv.style.border = 0;
            cellDiv.style.padding = 0;
            cellDiv.style.boxSizing = "border-box";


            // Add the cell div to the row
            rowDiv.appendChild(cellDiv);
        });

        // Add the row to the grid container
        gridContainer.appendChild(rowDiv);
    });
    if (game_end(grid))
    {
        stopTimer();
        showEndGameEffect();
        setTimeout(() => {
            const elapsedTime = timerDisplay.textContent; 
            document.querySelector('#end-game-modal').querySelector("p").textContent = `Congratulations, You completed the puzzle in: ${elapsedTime}`;
           
            endGameModal.style.display = 'block'; 
            endGameModal.classList.add('active'); 
           
        }, 1000);

        
       
        


    }
}




// Select the game grid container and add event listener at the container level
document.querySelector('#game-grid').addEventListener('click', (event) => {
    if (event.target.classList.contains('cell')) {
        const row = event.target.dataset.row; 
        const col = event.target.dataset.col; 
        let tile = grid[row][col];
        let click = tile.click || 1;

        switch (tile.type) {
            case 0:
                break;
            case 1:
                console.log(`Type 1 cell clicked - Current state: ${click}`);
                if (click === 1) {
                    console.log(getCellValues(tile));
                    tile.top = 1;
                    tile.right = 0;
                    tile.bottom = 1;
                    tile.left = 0;
                    tile.used = 1;
                    tile.click = 2; // Move to the second state for the next click
                    tile.rotationAngle = 0;
                } else if (click === 2) {

                    console.log(getCellValues(tile));
                    tile.top = 0;
                    tile.right = 1;
                    tile.bottom = 1;
                    tile.left = 0;
                    tile.used = 1;
                    tile.click = 3;
                    tile.rotationAngle = 0; // Move to the third state for the next click
                } else {
                    // Third click configuration
                    console.log(getCellValues(tile));
                    tile.top = 0;
                    tile.right = 0;
                    tile.bottom = 0;
                    tile.left = 0;
                    tile.used = 0;
                    tile.click = 1; // Reset back to the first state for the next click
                }
                break;
            case 2:
                tile.used = 1;
                break;
            case 3:
                tile.used = 1;
                break;
            default:
                break;
        }

        renderGrid(grid);
    }
});


//Utilities / Helper functions
function selectDifficulty(level) {
    if (level === 5) {
        MAP = 5;
        grid = getRandomGrid(grids5x5);
        sourceGrid = structuredClone(grid);
        easyButton.classList.add('chosen');
        hardButton.classList.remove('chosen');
        
    } else if (level === 7) {
        MAP = 7;
        grid = getRandomGrid(grids7x7);
        sourceGrid = structuredClone(grid);
        hardButton.classList.add('chosen');
        easyButton.classList.remove('chosen');
        
    }
}

function start_point(grid)
{
    
    for (let i = 0; i < MAP; i++) {
        for (let j = 0; j < MAP; j++) {
            if (grid[i][j].type != 0) {
                return [i,j]; 
            }
        }
    }
}

function free_cells(grid)
{
    let count = 0;
    
    for (let i = 0; i < MAP; i++) {
        for (let j = 0; j < MAP; j++) {
            if (grid[i][j].type != 0) {
                count = count + 1;
            }
        }
    }
    return count;
}                                                                                                                                                                

function next_cell(grid , i,j,direction)
{
    let cell = grid[i][j];
    if (direction === 'right') 
    {
        if (cell.top === 1) {return [i-1,j, 'bottom'];}
        else if (cell.left === 1) {return [i,j-1, 'right'];}
        else if (cell.bottom === 1) {return [i+1,j, 'top'];}
    }
    if (direction === 'top') 
        {
            if (cell.right === 1) {return [i,j+1, 'left'];}
            else if (cell.left === 1) {return [i,j-1, 'right'];}
            else if (cell.bottom === 1) {return [i+1,j, 'top'];}
        }
    if (direction === 'bottom') 
            {
                if (cell.right === 1) {return [i,j+1, 'left'];}
                else if (cell.left === 1) {return [i,j-1, 'right'];}
                else {return [i-1,j, 'bottom'];}
            }
    if (direction === 'left') 
            {
                    if (cell.top === 1) {return [i-1,j, 'bottom'];}
                    else if (cell.right === 1)  {return [i,j+1, 'left'];}
                    else {return [i+1,j, 'top'];}
                } 
}

function check_cell_condition(grid, x, y) {
    if (x < 0 || y < 0 || grid[x] === undefined || grid[x][y] === undefined) {
        return false;
    }
    let cell = grid[x][y];
    return cell.top === (grid[x - 1] && grid[x - 1][y] !== undefined ? grid[x - 1][y].bottom : 0)
        && cell.right === (grid[x] && grid[x][y + 1] !== undefined ? grid[x][y + 1].left : 0)
        && cell.bottom === (grid[x + 1] && grid[x + 1][y] !== undefined ? grid[x + 1][y].top : 0)
        && cell.left === (grid[x] && grid[x][y - 1] !== undefined ? grid[x][y - 1].right : 0)
        && cell.used === 1;
}

function game_end(grid)
{
    const [x0, y0] = start_point(grid);
    let i,j,direction;
    if (grid[x0][y0].top === 1 )
    {
        direction = 'top';
    }
    else if (grid[x0][y0].right === 1) {
        direction = 'right';
    }
    else {direction = 'left';}
    [i,j,direction] = next_cell(grid,x0,y0,direction);
    let max = free_cells(grid);
    console.log(max);
    let count = 1;
    while (!(i === x0 && j === y0) && count+1 <= max )
    {
        if (!check_cell_condition(grid, i ,j))
        {
            return false;
        }
        else 
        {

            [i,j,direction] = next_cell(grid,i,j,direction);
            console.log(count);
            count = count + 1;
        }

    }

        return (count+1 > max); // Return true if all elements meet the condition
    
}
function Cell(top = 0, right = 0, bottom = 0, left = 0, used = 0, type = 0) {
    this.top = top;      
    this.right = right;  
    this.bottom = bottom; 
    this.left = left; 
    this.used = used;
    this.type = type;
    

}
function corner(cell)
{
    const list = [[1,1,0,0,1,1], [1,0,0,1,1,1], [0,1,1,0,1,1], [0,0,1,1,1,1]];
    let target = getCellValues(cell);
    const exists = list.some(
        subList => subList.length === target.length && subList.every((val, index) => val === target[index])
    );
    return exists;
}

function getCellValues(cell) {
    return [cell.top, cell.right, cell.bottom, cell.left, cell.used, cell.type];    
}
function rotateCell(cell) {
        const oldTop = cell.top;
        cell.top = cell.right;
        cell.right = cell.bottom;
        cell.bottom = cell.left;
        cell.left = oldTop;
    
}


document.querySelector('#game-grid').addEventListener('contextmenu', (event) => {
    event.preventDefault(); 

    
    if (event.target.classList.contains('cell')) {
        const row = event.target.dataset.row; 
        const col = event.target.dataset.col; 
        const tile = grid[row][col];

        // Only rotate if the cell type is 1
        if (tile.type === 1 && tile.used === 1) {
            tile.rotationAngle = ((tile.rotationAngle || 0) + 90);  
            rotateCell(tile);   
            console.log(`Row: ${row}, Col: ${col}, Rotation Angle: ${tile.rotationAngle}`);
            console.log(getCellValues(tile));
            console.log(getCellValues(grid[row][col]));
            
        }
        renderGrid(grid);  
    }
    
});



function getDegree(cell)
{
    
        if (cell.right === 1 && cell.bottom === 1)
        {
            return "0deg";
        }
        else if (cell.left === 1 && cell.bottom === 1)
        {

            return "90deg";
        }
        else if (cell.left === 1 && cell.top === 1)
        {
    
            return "180deg";
        }
        else if (cell.right === 1 && cell.top === 1)
        {
        
            return "270deg";
        }
        else if (cell.right ===1 && cell.left ===1)
        {
            return "90deg";
        }

}


// Game wining effect 
function showEndGameEffect() {
    // Create flash overlay
    const flashOverlay = document.createElement('div');
    flashOverlay.classList.add('flash-overlay');
    document.body.appendChild(flashOverlay);

    // Remove flash overlay after animation ends (0.5 seconds)
    flashOverlay.addEventListener('animationend', () => {
        flashOverlay.remove();
        
        // After the flash effect, show the end-game modal
        showEndGameModal();
    });
}

// Function to display the end-game modal
function showEndGameModal() {
    const endGameModal = document.querySelector('#end-game-modal');
    endGameModal.style.display = 'block';
}







//Grids

const grid7_1 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 1, 0, 0, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 1, 0), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 1, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 1, 0, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ]
];

const grid7_2 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 1, 1, 0, 3), new Cell(0, 0, 0, 0, 1, 0) , new Cell(0, 0, 0, 0, 1, 0), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 1, 0, 0, 2) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(1, 1, 0, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(1, 1, 0, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 1, 1, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 1, 0, 1, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ]
];
const grid7_3 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 1, 0, 0, 2) ],
    [new Cell(0, 0, 0, 0, 1, 0), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 1, 0, 0, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0), new Cell(1, 1, 0, 0, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 1, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0) , new Cell(1, 1, 0, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ]
];
const grid7_4 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 1, 0, 0, 2) ],
    [new Cell(0, 1, 1, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 1, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 1, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ]
];
const grid7_5 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 1, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2), new Cell(0, 1, 0, 1, 0, 2) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 1, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 1, 0, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 0), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1) , new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ]
];
const grid5_1 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 1, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 1, 0) ],
    [new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 1, 0), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 1, 0, 0, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ]
];
const grid5_2 = [
    [new Cell(0, 0, 0, 0, 1, 0), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(1, 0, 0, 1, 0, 3) ],
    [new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 1, 0), new Cell(1, 1, 0, 0, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 1, 0) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ]
];

const grid5_3 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(1, 0, 1, 0, 0, 2) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3), new Cell(1, 0, 1, 0, 0, 2) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3) ]
];
const grid5_4 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 1, 0, 1, 0, 2) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 1, 1, 0, 3) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 1, 1, 0, 3) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 1, 0) , new Cell(1, 1, 0, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1) ]
];
const grid5_5 = [
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 0, 1, 0, 2) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 1, 1, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(1, 0, 1, 0, 0, 2), new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) , new Cell(1, 1, 0, 0, 0, 3), new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 1, 0, 0, 2) , new Cell(0, 0, 0, 0, 1, 0) , new Cell(0, 0, 0, 0, 0, 1) ],
    [new Cell(0, 0, 0, 0, 0, 1), new Cell(1, 0, 0, 1, 0, 3), new Cell(0, 0, 0, 0, 0, 1) , new Cell(0, 0, 0, 0, 0, 1), new Cell(0, 0, 0, 0, 0, 1) ]
];

const grids5x5 = [grid5_1, grid5_2, grid5_3, grid5_4, grid5_5];
const grids7x7 = [grid7_1, grid7_2, grid7_3, grid7_4, grid7_5];

// Function to return a random grid from the specified list
function getRandomGrid(gridList) {
    const randomIndex = Math.floor(Math.random() * gridList.length);
    return gridList[randomIndex];
}




