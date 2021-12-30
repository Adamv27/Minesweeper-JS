let flags = [];

class Board {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));

        this.bomb = 'X';
        this.bomb_count = 10;
        click_box.addEventListener('contextmenu', e => e.preventDefault())
        click_box.addEventListener('mousedown', this.place_flag);
    }

    print_board() {
        this.board.forEach(row => console.log(row));
        console.log(' ');
    }

    reset_board() {
        //All default (blank) tiles are represented with a 0
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.flags = [];
    }

    create_board() {
        this.reset_board();
        this.add_bombs();
        this.get_adjacent_bomb_count();
        this.print_board();
    }

    is_win() {
        let bombs = this.get_bomb_locations();
        let win = true;

        bombs.forEach(location => {
            // If a bomb location does not have a flag on it
            // then it can not be a win
            if (!in_array(flags, location)) {
                win = false;
            }
        });
        return win;
        
    }

    add_bombs() {
        let board_copy = [...this.board];
        // 10 bombs must be on the board
        Array(this.bomb_count).fill(0).map((_, i) => {
            let bomb_placed = false
            while (!bomb_placed) {
                let random_row = Math.floor(Math.random() * this.board.length);
                let random_column = Math.floor(Math.random() * this.board.length);

                //Random spot for bomb must be empty
                if (board_copy[random_row][random_column] != 'X') {
                    board_copy[random_row][random_column] = 'X';
                    bomb_placed = true;
                }
            }
        });
        this.board = board_copy;
    }
    get_adjacent_bomb_count() {
        // Neighboring tiles by adding value to current row and column
        let adjacent_tiles = [[0,1], [1,0], [1,1], [0, -1], [-1,0], [-1, -1], [-1, 1], [1, -1]];
        let board_copy = [...this.board];

        this.get_bomb_locations().forEach(location => {
            let [row, column] = location;
            adjacent_tiles.forEach(adj => {
                let [x, y] = adj;
                // Surrounding tile must be within the board constraints
                if (row + y <= 8 && row + y >= 0 && column + x <= 8 && column + x >= 0) {
                    if (board_copy[row + y][column + x] != 'X') {
                        // Increase count of position which represents
                        // How many bombs are touching that position
                        board_copy[row + y][column + x]++;
                    }
                }
            })
            
        });
        this.board = board_copy;
    }
    get_bomb_locations() {
        //Get the [x, y] position of all bombs on the board
        let bombs = [];
        for (let row = 0; row < this.board.length; row++) {
            for (let column = 0; column < this.board.length; column++) {
                if (this.board[row][column] === 'X') {
                    bombs.push([row, column]);
                }
            }
        }
        return bombs;
    }

    place_flag(event) {
        // Right click to place flag
        if (event.button === 2) {
            let coords = get_click_coords(event);
            // Flag can not be placed ontop of flag or uncovered space
            if (!in_array(flags, coords) && !in_array(uncovered, coords)) {
                flags.push(coords);
            // If second click on flag remove it
            } else if (in_array(flags, coords)) {
                flags = flags.filter(space => { return !array_equals(space, coords)});
            }
        } 
    }
}

function get_click_coords(event) {
    const target = event.target;
    const rect = target.getBoundingClientRect();

    // x, y position relative to game board
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    //Find the row and column of click
    // Every 54 pixels is a new row and column
    let x_offset = (x / 54) * 2;
    let y_offset = (y / 54) * 2;
    x -= x_offset;
    y -= y_offset;
    y = Math.floor(y / 54);
    x = Math.floor(x / 54);

    return [y, x];
}

function display_win_text() {
    if (click_box.childElementCount < 1) {
        let text = document.createElement('p');
        text.classList.add('game-over-text');
        text.innerHTML = 'You Win!';
        text.style.color = 'green';
        click_box.appendChild(text);
    }
}
