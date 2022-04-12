$(document).ready(function() {
    console.log("document ready");
    $('#board-container').html(boardTemplate());
    drawCheckers();
    $('.turn-indicator').click(stopForcedJump);
});

// global variables
var selectedChecker = null;
var turn = 'red';

let checkers = [
    {row: 1, col: 2, alive: true, king: false, color: 'red'},
    {row: 1, col: 4, alive: true, king: false, color: 'red'},
    {row: 1, col: 6, alive: true, king: false, color: 'red'},
    {row: 1, col: 8, alive: true, king: false, color: 'red'},
    {row: 2, col: 1, alive: true, king: false, color: 'red'},
    {row: 2, col: 3, alive: true, king: false, color: 'red'},
    {row: 2, col: 5, alive: true, king: false, color: 'red'},
    {row: 2, col: 7, alive: true, king: false, color: 'red'},
    {row: 3, col: 2, alive: true, king: false, color: 'red'},
    {row: 3, col: 4, alive: true, king: false, color: 'red'},
    {row: 3, col: 6, alive: true, king: false, color: 'red'},
    {row: 3, col: 8, alive: true, king: false, color: 'red'},

    {row: 6, col: 1, alive: true, king: false, color: 'black'},
    {row: 6, col: 3, alive: true, king: false, color: 'black'},
    {row: 6, col: 5, alive: true, king: false, color: 'black'},
    {row: 6, col: 7, alive: true, king: false, color: 'black'},
    {row: 7, col: 2, alive: true, king: false, color: 'black'},
    {row: 7, col: 4, alive: true, king: false, color: 'black'},
    {row: 7, col: 6, alive: true, king: false, color: 'black'},
    {row: 7, col: 8, alive: true, king: false, color: 'black'},
    {row: 8, col: 1, alive: true, king: false, color: 'black'},
    {row: 8, col: 3, alive: true, king: false, color: 'black'},
    {row: 8, col: 5, alive: true, king: false, color: 'black'},
    {row: 8, col: 7, alive: true, king: false, color: 'black'}
];

let markers = [];
let forceJumpMode = false;

function check_cell(row, col) {
    if (row < 1 || row > 8 || col < 1 || col > 8) {
        return 'off-board';
    }
    return $(`#cell-${row}-${col}`).attr('contains')
}

function findLegalMoves(sc) {

    var legal_squares = [];
    if (sc.color == 'black') {
        
        // check if we can move forwards
        if (check_cell(sc.row-1, sc.col-1) == 'nothing') {
            legal_squares.push({row: sc.row-1, col: sc.col-1});
        }
        if (check_cell(sc.row-1, sc.col+1) == 'nothing') {
            legal_squares.push({row: sc.row-1, col: sc.col+1});
        }

        // check if we can jump forwards
        if (check_cell(sc.row-1, sc.col-1) == 'red' && check_cell(sc.row-2, sc.col-2) == 'nothing') {
            legal_squares.push({row: sc.row-2, col: sc.col-2, remove: {row: sc.row-1, col: sc.col-1}});
        }
        if (check_cell(sc.row-1, sc.col+1) == 'red' && check_cell(sc.row-2, sc.col+2) == 'nothing') {
            legal_squares.push({row: sc.row-2, col: sc.col+2, remove: {row: sc.row-1, col: sc.col+1}});
        }

        if (sc.king) {
            // check if we can move backwards
            if (check_cell(sc.row+1, sc.col-1) == 'nothing') {
                legal_squares.push({row: sc.row+1, col: sc.col-1});
            }
            if (check_cell(sc.row+1, sc.col+1) == 'nothing') {
                legal_squares.push({row: sc.row+1, col: sc.col+1});
            }

            // check if we can jump backwards
            if (check_cell(sc.row+1, sc.col-1) == 'red' && check_cell(sc.row+2, sc.col-2) == 'nothing') {
                legal_squares.push({row: sc.row+2, col: sc.col-2, remove: {row: sc.row+1, col: sc.col-1} });
            }
            if (check_cell(sc.row+1, sc.col+1) == 'red' && check_cell(sc.row+2, sc.col+2) == 'nothing') {
                legal_squares.push({row: sc.row+2, col: sc.col+2, remove: {row: sc.row+1, col: sc.col+1}});
            }
        }

    }
    else if (sc.color == 'red') {
        
        // check if we can move forwards
        if (check_cell(sc.row+1, sc.col-1) == 'nothing') {
            legal_squares.push({row: sc.row+1, col: sc.col-1});
        }
        if (check_cell(sc.row+1, sc.col+1) == 'nothing') {
            legal_squares.push({row: sc.row+1, col: sc.col+1});
        }

        // check if we can jump forwards
        if (check_cell(sc.row+1, sc.col-1) == 'black' && check_cell(sc.row+2, sc.col-2) == 'nothing') {
            legal_squares.push({row: sc.row+2, col: sc.col-2, remove: {row: sc.row+1, col: sc.col-1} });
        }
        if (check_cell(sc.row+1, sc.col+1) == 'black' && check_cell(sc.row+2, sc.col+2) == 'nothing') {
            legal_squares.push({row: sc.row+2, col: sc.col+2, remove: {row: sc.row+1, col: sc.col+1}});
        }

        if (sc.king) {
            // check if we can move backwards
            if (check_cell(sc.row-1, sc.col-1) == 'nothing') {
                legal_squares.push({row: sc.row-1, col: sc.col-1});
            }
            if (check_cell(sc.row-1, sc.col+1) == 'nothing') {
                legal_squares.push({row: sc.row-1, col: sc.col+1});
            }

            // check if we can jump backwards
            if (check_cell(sc.row-1, sc.col-1) == 'black' && check_cell(sc.row-2, sc.col-2) == 'nothing') {
                legal_squares.push({row: sc.row-2, col: sc.col-2, remove: {row: sc.row-1, col: sc.col-1}});
            }
            if (check_cell(sc.row-1, sc.col+1) == 'black' && check_cell(sc.row-2, sc.col+2) == 'nothing') {
                legal_squares.push({row: sc.row-2, col: sc.col+2, remove: {row: sc.row-1, col: sc.col+1}});
            }
        }
    }
    return legal_squares;
}

function findLegalJumpMoves(sc) {
    var legal_squares = [];
    if (sc.color == 'black') {
        // check if we can jump forwards
        if (check_cell(sc.row-1, sc.col-1) == 'red' && check_cell(sc.row-2, sc.col-2) == 'nothing') {
            legal_squares.push({row: sc.row-2, col: sc.col-2, remove: {row: sc.row-1, col: sc.col-1}});
        }
        if (check_cell(sc.row-1, sc.col+1) == 'red' && check_cell(sc.row-2, sc.col+2) == 'nothing') {
            legal_squares.push({row: sc.row-2, col: sc.col+2, remove: {row: sc.row-1, col: sc.col+1}});
        }

        if (sc.king) {
            // check if we can jump backwards
            if (check_cell(sc.row+1, sc.col-1) == 'red' && check_cell(sc.row+2, sc.col-2) == 'nothing') {
                legal_squares.push({row: sc.row+2, col: sc.col-2, remove: {row: sc.row+1, col: sc.col-1} });
            }
            if (check_cell(sc.row+1, sc.col+1) == 'red' && check_cell(sc.row+2, sc.col+2) == 'nothing') {
                legal_squares.push({row: sc.row+2, col: sc.col+2, remove: {row: sc.row+1, col: sc.col+1}});
            }
        }

    }
    else if (sc.color == 'red') {
        // check if we can jump forwards
        if (check_cell(sc.row+1, sc.col-1) == 'black' && check_cell(sc.row+2, sc.col-2) == 'nothing') {
            legal_squares.push({row: sc.row+2, col: sc.col-2, remove: {row: sc.row+1, col: sc.col-1} });
        }
        if (check_cell(sc.row+1, sc.col+1) == 'black' && check_cell(sc.row+2, sc.col+2) == 'nothing') {
            legal_squares.push({row: sc.row+2, col: sc.col+2, remove: {row: sc.row+1, col: sc.col+1}});
        }

        if (sc.king) {
            // check if we can jump backwards
            if (check_cell(sc.row-1, sc.col-1) == 'black' && check_cell(sc.row-2, sc.col-2) == 'nothing') {
                legal_squares.push({row: sc.row-2, col: sc.col-2, remove: {row: sc.row-1, col: sc.col-1}});
            }
            if (check_cell(sc.row-1, sc.col+1) == 'black' && check_cell(sc.row-2, sc.col+2) == 'nothing') {
                legal_squares.push({row: sc.row-2, col: sc.col+2, remove: {row: sc.row-1, col: sc.col+1}});
            }
        }
    }
    return legal_squares;
}

function stopForcedJump() {
    if (!forceJumpMode) {
        return;
    }
    forceJumpMode = false;
    if (turn == 'red') {
        $('#red-turn').attr('myturn', 'false')
        $('#black-turn').attr('myturn', 'true');
        turn = 'black';
    }   
    else {
        $('#black-turn').attr('myturn', 'false');
        $('#red-turn').attr('myturn', 'true');
        turn = 'red';
    }
    $('.selected').removeClass('selected');
    markers = [];
    drawMarkers();
    drawCheckers();
}

function selectChecker() {
    console.log('selectChecker()');
    console.log(this)
    var checkerDiv = $(this);
    markers = [];
    

    var id = parseInt(checkerDiv.attr('id').split('-')[1]);
    if (checkers[id].color !== turn) {
        return;
    }

    selectedChecker = checkers[id];
    let sc = selectedChecker;

    $('.selected').removeClass('selected');
    checkerDiv.parent().addClass('selected');
    
    // unselect all other checker-wrappers,
    // then highlight our checker-wrapper
    

    // remove the "remove" attribute from all cells
    $('.black-cell').removeAttr('remove');

    // add the legal moves to the board
    if (forceJumpMode) {
        markers = findLegalJumpMoves(sc);
    }
    else {
        markers = findLegalMoves(sc);
    }

    drawMarkers();
    if (!markers.length) {
        $('.selected').removeClass('selected');
    }
    
}

function moveSelectedCheckerHere() {
    if (!selectedChecker) {
        return;
    }
    console.log('moveSelectedCheckerHere()');

    // update the selected checker's position
    var splitID = $(this).attr('id').split('-');
    selectedChecker.row = parseInt(splitID[1]);
    selectedChecker.col = parseInt(splitID[2]);

    // remove the jumped checker (if applicable)
    var checkerWasJustJumped = false;
    if ($(this).attr('remove')) {
        var removeCheckerFrom = $(this).attr('remove');
        var checkerID = parseInt($(`#${removeCheckerFrom}`).children().attr('id').split('-')[1]);
        checkers[checkerID].alive = false;
        // remove the "remove" attribute from all cells
        $('.black-cell').removeAttr('remove');
        checkerWasJustJumped = true;
    }

    // check if the checker should be kinged
    var checkerWasJustKinged = false;
    if (selectedChecker.color == 'red' && selectedChecker.row == 8) {
        selectedChecker.king = true;
        checkerWasJustKinged = true;
    }
    else if (selectedChecker.color == 'black' && selectedChecker.row == 1) {
        selectedChecker.king = true;
        checkerWasJustKinged = true;
    }

    // redraw the board, reset the click handlers
    $('.selected').removeClass('selected');
    drawCheckers();

    // if the checker just jumped, did not promote, and has additional moves
    if (checkerWasJustJumped && !checkerWasJustKinged && findLegalJumpMoves(selectedChecker).length > 0) {
        forceJumpMode = true;
        $('.checker').off('click'); // forceJumpMode!!
        selectChecker.call($(this).children());
    }
    else {
        // change the turn
        forceJumpMode = false;
        if (turn == 'red') {
            $('#red-turn').attr('myturn', 'false')
            $('#black-turn').attr('myturn', 'true');
            turn = 'black';
        }   
        else {
            $('#black-turn').attr('myturn', 'false');
            $('#red-turn').attr('myturn', 'true');
            turn = 'red';
        }
    }

    if (blackwins() || redwins()) {
        location.reload();
    }
}

function blackwins() {
    for(var i = 0; i < 12; i++) {
        if (checkers[i].alive) {
            return false;
        }
    }
    return true;
}

function redwins() {
    for(var i = 12; i < 24; i++) {
        if (checkers[i].alive) {
            return false;
        }
    }
    return true;
}

function drawCheckers() {
    console.log('drawCheckers()');
    
    // remove all checkers
    $('.black-cell').empty();
    $('.black-cell').attr('contains', 'nothing');
    $('.black-cell').off('click');
    $('.legal').removeClass('legal');

    // draw the checkers
    for (var i = 0; i < checkers.length; i++) {
        var c = checkers[i];
        if (c.alive == true) {
            var king = c.king ? 'king' : '';
            $(`#cell-${c.row}-${c.col}`).html(`<div id="checker-${i}" class="checker ${c.color}-checker ${king}"></div>`);
            $(`#cell-${c.row}-${c.col}`).attr('contains', c.color);
        }
    }

    $('.checker').click(selectChecker);
}

function drawMarkers() {
    console.log('drawMarkers()')

    // clear the markers
    $('.legal').empty();
    $('.legal').off('click');
    $('.legal').removeClass('legal');


    for (var i = 0; i < markers.length; i++) {
        var c = markers[i];
        $(`#cell-${c.row}-${c.col}`).html(`<div id="marker-${i}" class="marker"></div>`);
        $(`#cell-${c.row}-${c.col}`).addClass('legal');
        $(`#cell-${c.row}-${c.col}`).click(moveSelectedCheckerHere);
        if (c.remove) {
            $(`#cell-${c.row}-${c.col}`).attr('remove', `cell-${c.remove.row}-${c.remove.col}`);
        }
    }
}