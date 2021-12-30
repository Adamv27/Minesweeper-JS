let click_box = document.getElementById('click-box');

let uncovered = [];
let checked = [];


class Graphics {
    constructor(board) {
        this.board = board.board;
        this.images = {0: 'images/blank.png', 1: 'images/1.png', 2: 'images/2.png', 3: 'images/3.png', 4: 'images/4.png', 5: 'images/5.png', 6: 'images/6.png', 7: 'images/7.png', 8: 'images/8.png', 'X': 'images/bomb.png', 'F': 'images/flag.png'};
        click_box.addEventListener('click', this.uncover);
        click_box.board = this.board;
    }
    
    render() {
        this.reset();
        for (let row = 0; row < this.board.length; row++) {
            for (let column = 0; column < this.board.length; column++) {
                let image = document.createElement('img');
                image.classList.add('cell');
                if (in_array(uncovered, [row, column])) {
                    // The space has been uncovered and the image
                    // is what is currently in the board array
                    let space = this.board[row][column];
                    image.src = this.images[space];
                } else if (in_array(flags, [row, column])) {
                    image.src = "images/flag.png";
                } else {
                    // Covered space is the default tile
                    image.src = "images/tile.png";
                }
                
                image.width ='54px';
                image.height= '54px';
                game_area.appendChild(image);
            }
        }
    }
    reset() {
        // Remove all child elements (tiles) from game_area
        while (game_area.firstChild) {
            game_area.removeChild(game_area.lastChild)
        }
    }

    uncover(event) {
        const board = event.currentTarget.board;
        // Get the target
        let coords = get_click_coords(event);
        let [row, column] = coords;
        if (!in_array(uncovered, coords) && !in_array(flags, coords)) {
            uncovered.push(coords);
            
            // If click is on an empty space all
            // adjacent empty spaces get uncovered
            if (board[row][column] === 0) {
                find_adj_empty_spaces(coords);
            } else if (board[row][column] === 'X') {
                uncover_all();
                display_game_over_text();
                last_render = true;
                game_over = true;
            }
        }
    } 
}

function find_adj_empty_spaces(pos) {
    let [row, column] = pos;

    // Spaces to the top bottom left and right of current space
    let adjacent_tiles = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    adjacent_tiles.forEach(space => {
        let [adj_x, adj_y] = space;
        let new_pos = [row + adj_y, column + adj_x];
        // Move to new position if it is inside the board 
        // and check if it is an empty space
        if (new_pos[0] <= 8 && new_pos[0] >= 0 && new_pos[1] <= 8 && new_pos[1] >= 0) {
            if (!in_array(checked, new_pos)) {
                if (game_board.board[new_pos[0]][new_pos[1]] === 0) {
                    uncovered.push(new_pos);
                    checked.push(new_pos);
                    // Repeat from new position
                    this.find_adj_empty_spaces(new_pos);
                } else {
                    // If the new potition isnt empty then it must be
                    // a number so it will be revealed but 
                    checked.push(new_pos);
                    uncovered.push(new_pos);
                }
            }
        } 
    });
}

function uncover_all() {
    //  Add each space in the board to uncovered
    for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
            if (!in_array(uncovered, [row, column])) {
                uncovered.push([row, column]);
            }
        }
    }
}

function in_array(arr, testing_space) {
    let result = false;
    if (arr.length < 1) {
        return result;
    } else {
        // Iterate through 2d array to check if subarray 
        // is equal to testing_space
        arr.forEach(space => {
            if (array_equals(testing_space, space)) {
                result = true;
            }
        });
    }
    return result;
}

function array_equals(a, b) {
    //Every item in the array is the same and in the same position
    return Array.isArray(a) && Array.isArray(b)
    && a.every((val, index) => val === b[index]);
}

function display_game_over_text() {
    let text = document.createElement('p');
    text.classList.add('game-over-text');
    text.innerHTML = 'Game Over!';
    text.style.color = 'red';
    click_box.appendChild(text);
}