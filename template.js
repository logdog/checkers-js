function cell(rowNum, colNum) {
    var color = (rowNum + colNum) % 2 == 0 ? 'red' : 'black';
    return `<div id="cell-${rowNum}-${colNum}" class="cell ${color}-cell" ></div>`
}

function row(rowNum) {
    var rowString = `<div id="row-${rowNum}" class="row">`;
    for (var colNum=1; colNum<=8; colNum++) {
        rowString += cell(rowNum,colNum);
    }
    rowString += `</div>`
    return rowString;
}

function boardTemplate() {
    var boardString = '';
    for (var rowNum=1; rowNum<=8; rowNum++) {
        boardString += row(rowNum);
    }
    return boardString;
}
