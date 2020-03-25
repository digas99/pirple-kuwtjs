const boardWrapper = document.getElementById("board-wrapper");
const listLIs = boardWrapper.querySelectorAll("li");
const body = document.getElementsByTagName("BODY")[0];

let squares = new Array(9).fill("");
let player = 0;
const colors = ["f75454", "424242"];
const symbols = ['X', 'O'];
let currentSymbol = symbols[player];
let currentColor = colors[player];
const docTitle = document.title;
let result = [0, 0];
let movesCount = 0;

const setup = () => {
    let count=1;
    for(const li of listLIs) {
        // fix squares height
        li.style.height = (boardWrapper.offsetHeight/3) + "px";
        if (count % 3 != 0) {
            li.classList.add("bordBottom");
        }
        li.classList.add("bordRight");
    }

    // setup title
    document.title = "("+currentSymbol+") "+docTitle;
}

const squareHighlight = (e) => {
    const target = e.target;
    currentColor = colors[player];

    clearSquareHighlight();

    if (!target.classList.contains("active")) {
        target.classList.add("square-hover");
        target.style.backgroundColor = "#" + currentColor;
    }
}

const clearSquareHighlight = (e) => {
    const selected = boardWrapper.querySelector(".square-hover");
    if (selected) {
        selected.classList.remove("square-hover");
        if (!selected.classList.contains("active"))
            selected.style.backgroundColor = null;
    }
}

const turn = document.getElementById("player");
const infoBottom = document.getElementById("info-bottom");
const playerXRes = document.getElementById("playerX-res");
const playerORes = document.getElementById("playerO-res");

const reset = () => {
    for (let li of listLIs) {
        li.style.backgroundColor = null;

        if (li.classList.contains("active"))
            li.classList.remove("active");

        if (li.hasChildNodes())
            li.removeChild(li.firstElementChild);

        squares = ["", "", "", "", "", "", "", "", ""];
        player = 0;
        currentSymbol = symbols[player];
        currentColor = colors[player];
        matchInterface(currentColor, currentSymbol);
        playerXRes.innerText = result[0];
        playerORes.innerText = result[1];
        body.style.pointerEvents = "inherit";
        movesCount = 0;
    }
}

const winPattern = (type, board) => {
    switch(type) {
        case "vertical":
            let innerCounter = counter = 0;
            let auxArr = new Array();
            do {
                auxArr.push(board[counter]);
                if (innerCounter === 2) {
                    innerCounter = 0;
                    if (auxArr[0] !== "" && auxArr[0] === auxArr[1] && auxArr[1] === auxArr[2])
                        return true;
                    auxArr = new Array();
                }
                else
                    innerCounter++;

                counter++;
            } while (counter < board.length);
            break;
        case "horizontal":
            // assign board to newBoard by value, not reference
            let newBoard = board.slice();

            const swap = (arr, a, b) => {
                let tmp = arr[a];
                arr[a] = arr[b];
                arr[b] = tmp;
            }            

            // invert board
            swap(newBoard, 1, 3);
            swap(newBoard, 2, 6);
            swap(newBoard, 5, 7);

            // check for vertical pattern
            return winPattern("vertical", newBoard);
        case "diagonal":
            if (board[0] !== "" && board[0] === board[4] && board[4] === board[8])
                return true;
            else if (board[2] !== "" && board[2] === board[4] && board[4] === board[6])
                return true;
            break;
    }
    return false;
}

const win = () => {
    if (winPattern("vertical", squares) || winPattern("horizontal", squares) || winPattern("diagonal", squares))
        return true;
    return false;
}

const squaresAllFilled = () => {
    for (let sqr of squares) {
        if (sqr === "")
            return false;
    }
    return true;
}

const makeMove = (currentPlayer, index) => {
    const i = parseInt(index);
    console.log(i);
    squares[i] = currentPlayer ? "o" : "x";
    movesCount++; 
    if (movesCount > 4) {
        if (win()) {
            body.style.pointerEvents = "none";
            setTimeout( () => {
                result[currentPlayer]++;
                alert(squares[i].toUpperCase() + " has won!");
                reset();
            }, 200);
        }
        else if (movesCount === 9) {
            if (squaresAllFilled()) {
                body.style.pointerEvents = "none";
                setTimeout( () => {
                    alert("Cats game!");
                    reset();
                }, 200);
            }
        }
    } 
}

const play = (e) => {
    const target = e.target;
    // don't allow to play on squares already active
    if (!target.classList.contains("active")) {
        const moveWrapper = document.createElement("div");
        moveWrapper.style.position = "relative";
        moveWrapper.style.textAlign = "center";

        const move = document.createElement("span");
        move.style.color = player ? "white" : "black";
        move.innerText = currentSymbol;
        move.style.pointerEvents = "none";
        moveWrapper.style.pointerEvents = "none"
        move.classList.add("move");
        move.classList.add("middle");

        moveWrapper.appendChild(move);
        target.appendChild(moveWrapper);
        target.classList.add("active");

        // register the move
        makeMove(player, target.id.split("-")[1]);

        player = player ? 0 : 1;

        currentSymbol = symbols[player];
        currentColor = colors[player];

        matchInterface(currentColor, currentSymbol);
    }
}

function matchInterface(color, symbol) {
    document.title = "("+symbol+") "+docTitle;
    turn.innerText = symbol;
    turn.style.color = "#" + color;
    infoBottom.style.borderColor = "#" + color;
}

// EVENTS
boardWrapper.addEventListener("click", play);
boardWrapper.addEventListener("mouseover", squareHighlight);
boardWrapper.addEventListener("mouseout", clearSquareHighlight);
