console.log("Hello World")

$(()=>{

    //crucial jquery variables
    $gameboard=$('#gameboard')
    $whiteScore = $('#white-score')
    $blackScore = $('#black-score')

    //other global variables
    turnSwitch = true;
    //true = white's turn
    //false = black's turn

    //and heeeere weeee.......    go

    //setup the 8x8 data structure
    const spaceGrid = [ [],[],[],[],[],[],[],[]]
    const tileGrid = [ [],[],[],[],[],[],[],[]]


    //on page load, spawn 8x8 grid in game board
    //this will take the form of 8 row-divs which each contain 8 space-divs
    for(let i=0;i<8;i++){
        $row = $('<div>').addClass("row");
        for(let j=0; j<8; j++){
            $space = $('<div>').addClass("space")
            $row.append($space)
            //add each space to the data structure
            spaceGrid[i][j]= $space;
        }
        $gameboard.append($row)
    }

    console.log(spaceGrid);
    //store the 8x8 grid in an array.

    //placing a tile
    $('.space').on('click',(event)=>{

        //check various condtions for this being a valid move
        if(validMove($(event.currentTarget))){

            if(turnSwitch){
                //place white tile
                $(event.currentTarget).append($('<div>').addClass('white-tile'))

                //change turns
                turnSwitch = !turnSwitch;
            } else{
                //place black tile
                $(event.currentTarget).append($('<div>').addClass('black-tile'))

                //change turns
                turnSwitch = !turnSwitch
            }
            //mark this space as already clicked
            $(event.currentTarget).addClass('clicked')
        }

    })

    const validMove=($space)=>{
        let result = true;

        //check if space has already been clicked
        if($space.hasClass('clicked')){
            result = false;
        }
        return result;
    }



})