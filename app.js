console.log("Hello World")

$(()=>{

    //crucial jquery variables
    $gameboard=$('#gameboard')
    $whiteScore = $('#white-score')
    $blackScore = $('#black-score')

    //and heeeere weeee.......    go

    //setup the 8x8 data structure
    const grid = [ [],[],[],[],[],[],[],[]]

    //on page load, spawn 8x8 grid in game board
    //this will take the form of 8 row-divs which each contain 8 space-divs
    for(let i=0;i<8;i++){
        $row = $('<div>').addClass("row");
        for(let j=0; j<8; j++){
            $space = $('<div>').addClass("space")
            $row.append($space)
            grid[i][j]= $space;
        }
        $gameboard.append($row)
    }

    console.log(grid);
    //store the 8x8 grid in an array.



})