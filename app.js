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

    //the eight directions for the ping function
    const eightDirections =[
        {deltax:1,deltay:0},    //Left
        {deltax:1,deltay:1},    //Lower Left
        {deltax:0,deltay:1},    //Down
        {deltax:-1,deltay:1},   //Lower Right
        {deltax:-1,deltay:0},   //Right
        {deltax:-1,deltay:-1},  //Upper Right
        {deltax:0,deltay:-1},   //Up
        {deltax:1,deltay: -1},  //Upper Left
    ]


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

        captureCheck();

    })

    const findGridLocation=($space)=>{
        
    }

    const validMove=($space)=>{
        let result = true;

        //check if space has already been clicked
        if($space.hasClass('clicked')){
            result = false;
        }
        return result;
    }

    const captureCheck=($space)=>{

        let row
        let column

        const myRow = spaceGrid.filter((e)=>{e.includes($space)})

        row = spaceGrid.indexOf(myRow)
        column = spaceGrid[row].indexOf($space)

    }

    //this right here is the heart of the system
    //row and column define the starting point on the spaceGrid
    //deltaX and deltaY define the direction the ping will go
    // (1,0) Left
    // (1,1) Lower Left
    // (0,1) Down
    // (-1,1) Lower Right
    // (-1,0) Right
    // (-1,-1) Upper Right
    // (0,-1) Up
    // (1,-1) Upper Left
    const ping=(row,column,deltaX,deltaY)=>{

        //this variable will turn false when the ping hits a dead end
        continuePing = true;

        //define the space we're starting from
        Y = row
        X = column

        //define friend and enemy
        const friend
        const enemy

        if(turnSwitch){
            friend = '.white-tile'
            enemy = '.black-tile'
        } else {
            friend = '.black-tile'
            enemy = '.white-tile'
        }

        //will we capture?
        let capture = false;

        //enemy pieces encountered along the ping's path
        let targets = []

        while(continuePing){

            //define the next space in the path of the ping
            Y += deltaY
            X += deltaX

            $currentSpace = spaceGrid[Y][X];
            //if we've reached the edge of the board, end the process and DO NOT capture
            if( X > 7 || Y > 7 || X < 0 || Y < 0){
                continuePing = false;
            }
            //if it's an enemy space, record that space and continue
            else if( $currentSpace.children($(enemy)).length > 0){
                targets.push({x: X, y: Y})
            }
            //if it's a frindly space, end the process and capture
            else if ( $currentSpace.children($(friend)).length > 0){
                continuePing = false;
                capture = true;
            }
            //if it's an empty space, end the process and DO NOT capture
            else if ( $currentSpace.children().length == 0){
                continuePing = false;
            }
        }

        console.log("targets",targets)

        //if the conditions for a capture have been met...
        if(capture){
            for(victim of targets){
                $victimSpace = spaceGrid[victim.y][victim.x];
                $victimSpace.children().remove();
                $victimSpace.append($('<div>').addClass(friend))
            }
        }

    }


})