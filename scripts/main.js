let game_area = document.getElementById('game-container');
let reset_button = document.getElementById('reset');
reset_button.addEventListener('click', reset);

let game_board;
let game_loop;

let game_over = false;
let last_render = false;

window.onload = () => {
    game_board = new Board();
    game_board.create_board();

    graphics = new Graphics(game_board);

    game_area.addEventListener('click', event => {
        console.log(event)
    })

    game_loop = setInterval(loop, 1000/30);
}

function loop() {
    if (!game_over ) {
        if (game_board.is_win() ) {
            game_over = true;
            last_render = true;
        } else {
            graphics.render();
        }
    } else {
        if (last_render) {
            graphics.render() 
            last_render = false; 
        }
        display_win_text();
    }
}

function reset() {
    game_over = false;
    game_board = new Board();
    game_board.create_board();
    graphics = new Graphics(game_board);
    uncovered = [];
    flags = [];
    checked = [];
    remove_text();
}

function remove_text() {
    while (click_box.firstChild) {
        click_box.removeChild(click_box.lastChild);
    }
}
