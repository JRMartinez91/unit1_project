console.log("Hello World")

//setup the 8x8 data structure
const spaceGrid = [ [],[],[],[],[],[],[],[]]
const tileGrid = [ [],[],[],[],[],[],[],[]]

//keep track of each player's score
let whiteScore = 0;
let blackScore = 0;

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

$(()=>{

    //crucial jquery variables
    $gameboard=$('#gameboard')
    $whiteScoreDisplay = $('#white-score')
    $blackScoreDisplay = $('#black-score')

    //other global variables
    turnSwitch = true;
    //true = white's turn
    //false = black's turn

    //and heeeere weeee.......    go



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

               
            } else{
                //place black tile
                $(event.currentTarget).append($('<div>').addClass('black-tile'))

            }
            //mark this space as already clicked
            $(event.currentTarget).addClass('clicked')
           
            captureCheck($(event.currentTarget));
    
            //change turns
            turnSwitch = !turnSwitch;

            //update score
            keepScore();

        }


    })

    //const findGridLocation=($space)=>{}

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

        //determine the space on the spaceGrid that the clicked tile occupies
        console.log($space);
        const myRow = spaceGrid.filter(function(e){
            //console.log("e",e)
            for(thing of e){
               // console.log("thing",thing)
               // console.log("thing[0]",thing[0])
                if(thing[0]==$space[0]){
                    return true;
                }
            }
        })
        //console.log("myRow",myRow)
        console.log(myRow[0])

        row = spaceGrid.indexOf(myRow[0])
        //column = spaceGrid[row].indexOf($space)
        for(let i = 0; i<8; i++){
            if(spaceGrid[row][i][0] == $space[0]){
                column = i;
                break;
            }
        }
        
        console.log(">>>>>>>>A NEW CAPTURE CHECK IS STARTING<<<<<<<")
        console.log("starting from row",row,"column",column)

        //send a ping out in every direction to see if there's an opportunity
        //to capture
        for(dir of eightDirections){
            ping(row,column,dir.deltax,dir.deltay);
        }

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
        let friend
        let enemy
        //because addClass takes a class name WITHOUT the initial ".",
        //the variable used to assign a class to the newly created tiles
        //is different
        let newFriends

        if(turnSwitch){
            friend = '.white-tile'
            enemy = '.black-tile'
            newFriends = 'white-tile'
        } else {
            friend = '.black-tile'
            enemy = '.white-tile'
            newFriends = 'black-tile'
        }
        //console.log("friend",friend)

        //will we capture?
        let capture = false;

        //enemy pieces encountered along the ping's path
        let targets = []

        console.log("pinging at direction", deltaX, deltaY)

        while(continuePing){

            //define the next space in the path of the ping
            Y += deltaY
            X += deltaX

            
            //if we've reached the edge of the board, end the process and DO NOT capture
            if( X > 7 || Y > 7 || X < 0 || Y < 0){
                continuePing = false;
            }
            else {
                //otherwise, continue as normal
                //console.log(`checking locaton ${X},${Y}`)
                $currentSpace = spaceGrid[Y][X];
                
                //if it's an enemy space, record that space and continue
                if( $currentSpace.children(enemy).length > 0){
                    targets.push({x: X, y: Y})
                    console.log("ENEMY STAND!", enemy)
                }
                //if it's a frindly space, end the process and capture
                else if ( $currentSpace.children(friend).length > 0){
                    continuePing = false;
                    capture = true;
                    console.log("friendly tile", friend)
                }
                //if it's an empty space, end the process and DO NOT capture
                else if ( $currentSpace.children().length == 0){
                    continuePing = false;
                    console.log("empty")
                }
            }
        } // end while

        if(targets.length>0){
            console.log("targets",targets)
        }

        //if the conditions for a capture have been met...
        if(capture){
            for(victim of targets){
                //find the jquery ID of the space in question
                $victimSpace = spaceGrid[victim.y][victim.x];
                //get rid of the (presumably enemy) tile currently on it
                $victimSpace.children().remove();
                //add a tile of friendly color
                $newTile = $('<div>').addClass(newFriends)
                $victimSpace.append($newTile);
            }
        } // end capture

    }

    const keepScore=()=>{
        console.log("updating score")

        let whiteCounter= 0;
        let blackCounter= 0;
        
        // search through the space grid for every tile
        // that has children of the specified class
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(spaceGrid[i][j].children('.white-tile').length>0){
                    whiteCounter++;
                } else if(spaceGrid[i][j].children('.black-tile').length>0){
                    blackCounter++;
                }
            }
        }

        console.log("white score:", whiteCounter, "| black score:", blackCounter)
        whiteScore = whiteCounter;
        blackScore = blackCounter;
        $whiteScoreDisplay.text(whiteScore);
        $blackScoreDisplay.text(blackScore);

    }


})