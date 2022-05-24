/**
 * todo: some of the variables name need to be changed
 */
const socket = io();


//logo animation
let logo = anime({
    targets: '#s1',
    translateX: [{value: -3, duration: 1000}, {value: 0, duration: 1000}],
    translateY: [{value: -3, duration: 1000}, {value: 0, duration: 1000}],
    loop: true,
    rotate: 360
})

let logo2 = anime({
    targets: '#s2',
    translateX: [{value: 3, duration: 1000}, {value: 0, duration: 1000}],
    translateY: [{value: -3, duration: 1000}, {value: 0, duration: 1000}],
    loop: true,
    rotate: -360
})

let logo3 = anime({
    targets: '#s3',
    translateX: [{value: -3, duration: 1000}, {value: 0, duration: 1000}],
    loop: true,
    rotate: 360
})

let logo4 = anime({
    targets: '#s4',
    translateX: [{value: 3, duration: 1000}, {value: 0, duration: 1000}],
    loop: true,
    rotate: -360
})


//hide "game board, room code, random moves, joined message" from home page.
$('#game').hide();
$('#room-id').hide();
$('#random-moves').hide();
$('#joined-message').hide();

var playerList = [];
var playerMap = new Map(); //sore client ID and the room they joined to set each client different color.
var clientId = ''; //store the client who joined and created the room to, then pass it to the server.
var roomCode = ''; //the room code will be stored whatever if the user joined or create the room.

//all these variables to store the values of the tags when the client clicked on it.
var elementParent = '';
var bigSquareId = '';  //each for squares are inside one big square and here we are storing the Id for it.
var nodeOfSquareNumber = '';
var numberOfClickedSquare = '';
var spanParentNode = '';
var spanParentNodeId = ''
var nodesLength = ''
var smallSquaresId = []; //storing the small square ID to turn all the squares into player color when clicked on the last square.
var nodeIdForClients = [];
var numberOfSquares = '';

//turn to TRUE if the red take the whole square.
var redSquares = {
    squareA: false,
    squareB: false,
    squareC: false,
    squareD: false,
    squareE: false,
    squareF: false,
    squareG: false,
    squareH: false,
    squareI: false 
}

//turn to TRUE if the blue take the whole square.
var blueSquares = {
    squareA: false,
    squareB: false,
    squareC: false,
    squareD: false,
    squareE: false,
    squareF: false,
    squareG: false,
    squareH: false,
    squareI: false
}

//these for the make each player has a turn to play.
var redPlayer = true;
var bluePlayer = false;

var randomNumber = 0;

//passing client to the server
$('#create-room').on('click', ()=>
{
    socket.emit('joined-room', generatedRoomCode);
    $('#game').show();
    $('#room-id').show();
    clientId = socket.id;
    socket.emit('player-id', clientId);
    roomCode = generatedRoomCode;
    $('#join-and-create').hide();
    $('#random-moves').val(randomNumber);
});


//passing room code to the server
$('#join-room').one('click', ()=>
{
    let joinedRoomCode = $('#user-room-id').val();
    socket.emit('joined-room', joinedRoomCode);
    $('#game').show();
    roomCode = $('#user-room-id').val();
    clientId = socket.id;
    socket.emit('player-id', clientId);
    $('#join-and-create').hide();
    $('#random-moves').val(randomNumber);
});


//turn the clicked element to the player color
socket.on('square-clicked', (data)=> 
{
    smallSquaresId = [];
    let numberOfClientInOneRoom = playerList.length - 1;
    playerMap.set(playerList[numberOfClientInOneRoom][0], playerList[0][1].slice(-2));

    if((playerMap.get(roomCode)[0] === data.clientsId))
    {
        let dec = $('#random-moves').val();
        $('#random-moves').val(dec - 1);

        if($('#random-moves').val() == 0)
        {
            let playerTurn = anime({
                targets: '#player-turn',
                translateX: [{value: 300, duration: 2000}],
                easing: 'easeInOutExpo'
            })
            redPlayer = false;
            bluePlayer = true;
            socket.emit('turn-switch', {red: redPlayer, blue: bluePlayer, redId: playerMap.get(roomCode)[0], blueId: playerMap.get(roomCode)[1]});
            var randomNum = Math.floor(Math.random() * 2) + 1;
            socket.emit('moves-number', randomNum);
            socket.on('next-move', (randomNum)=>
            {
                $('#random-moves').val(randomNum);
                $('#random-moves').css('background-color', 'rgb(3, 83, 151)');
            });
        }
        $(`#${data.smallSquareId}`).css('background-color', 'rgb(252, 79, 79)');
    }    
    else if((playerMap.get(roomCode)[1] === data.clientsId))
    {
        let dec = $('#random-moves').val();
        $('#random-moves').val(dec - 1);

        if($('#random-moves').val() == 0)
        {

            let playerTurn = anime({
                targets: '#player-turn',
                translateX: [{value: -300, duration: 2000}],
                easing: 'easeInOutExpo'
            })
            redPlayer = true;
            bluePlayer = false;
            socket.emit('turn-switch', {redId: playerMap.get(roomCode)[0], blueId: playerMap.get(roomCode)[1]});
            var randomNum = Math.floor(Math.random() * 2) + 1;
            socket.emit('moves-number', randomNum);
            socket.on('next-move', (randomNum)=>
            {
                $('#random-moves').val(randomNum);
                $('#random-moves').css('background-color', 'rgb(252, 79, 79)');
            });
        }
        $(`#${data.smallSquareId}`).css('background-color', 'rgb(3, 83, 151)');
    }


    var lastSquareColor = ''; //storing the the color of the player when clicked on the square;
    lastSquareColor = ($(`#${data.smallSquareId}`).css('background-color'))

    if(data.totalOfSquareNumber === '1')
    {
        if(lastSquareColor === 'rgb(3, 83, 151)')
        {
            let square = data.listOfSmallSquaresId[0].slice(0,1);
            switch(square)
            {
                case 'a': blueSquares.squareA = true; break;
                case 'b': blueSquares.squareB = true; break;
                case 'c': blueSquares.squareC = true; break;
                case 'd': blueSquares.squareD = true; break;
                case 'e': blueSquares.squareE = true; break;
                case 'f': blueSquares.squareF = true; break;
                case 'g': blueSquares.squareG = true; break;
                case 'h': blueSquares.squareH = true; break;
                case 'i': blueSquares.squareI = true; break;
            }
        } else if(lastSquareColor === 'rgb(252, 79, 79)')
        {
            let square = data.listOfSmallSquaresId[0].slice(0,1);
            switch(square)
            {
                case 'a': redSquares.squareA = true; break;
                case 'b': redSquares.squareB = true; break;
                case 'c': redSquares.squareC = true; break;
                case 'd': redSquares.squareD = true; break;
                case 'e': redSquares.squareE = true; break;
                case 'f': redSquares.squareF = true; break;
                case 'g': redSquares.squareG = true; break;
                case 'h': redSquares.squareH = true; break;
                case 'i': redSquares.squareI = true; break;
            }
        }

        for(var i= 0; i < data.listOfSmallSquaresId.length; i++)
            $(`#${data.listOfSmallSquaresId[i]}`).css('background-color', `${lastSquareColor}`);

        var colorWinner = lastSquareColor === 'rgb(3, 83, 151)' ? 'Blue' : 'Red';

        if((blueSquares.squareB && blueSquares.squareA && blueSquares.squareI) || 
        (blueSquares.squareC && blueSquares.squareD && blueSquares.squareE) || 
        (blueSquares.squareH && blueSquares.squareG && blueSquares.squareF) ||
        (blueSquares.squareA && blueSquares.squareC && blueSquares.squareF) ||
        (blueSquares.squareB && blueSquares.squareD && blueSquares.squareG) ||
        (blueSquares.squareI && blueSquares.squareE && blueSquares.squareH) ||
        (blueSquares.squareI && blueSquares.squareD && blueSquares.squareF) ||
        (blueSquares.squareA && blueSquares.squareD && blueSquares.squareH))
        {
            $('#winner').text(`${colorWinner} is the winner`);
            $('#winner').css('color', `${lastSquareColor}`);
            $('#random-moves').hide();
            $('#game').css("pointer-events", "none");
            $('.4s-logo').css('background-color', `${lastSquareColor}`);
        }
        
        else if((redSquares.squareB && redSquares.squareA && redSquares.squareI) || 
        (redSquares.squareC && redSquares.squareD && redSquares.squareE) || 
        (redSquares.squareH && redSquares.squareG && redSquares.squareF) ||
        (redSquares.squareA && redSquares.squareC && redSquares.squareF) ||
        (redSquares.squareB && redSquares.squareD && redSquares.squareG) ||
        (redSquares.squareI && redSquares.squareE && redSquares.squareH) ||
        (redSquares.squareI && redSquares.squareD && redSquares.squareF) ||
        (redSquares.squareA && redSquares.squareD && redSquares.squareH))
        {
            $('#winner').text(`${colorWinner} is the winner`);
            $('#winner').css('color', `${lastSquareColor}`);
            $('#random-moves').hide();
            $('#game').css("pointer-events", "none");
            $('.4s-logo').css('background-color', `${lastSquareColor}`);
        }
    }
});

//passing the clicked element id to the server
$('.small-square').one('click', (event)=>
{
    //to switch to the player turn
    socket.on('turn', (data)=>
    {
        if((!redPlayer) && data.clientsId[0] == socket.id)
            $('#game').css("pointer-events", "none");
        else if(redPlayer && data.clientsId[0] == socket.id)
            $('#game').css("pointer-events", "auto");

        if((!bluePlayer) && data.clientsId[1] == socket.id)
            $('#game').css("pointer-events", "none");
        else if(bluePlayer && data.clientsId[1] == socket.id)
            $('#game').css("pointer-events", "auto");    
    });

    //! NAME NEED TO CHANGE
    let smallSquareId = event.target.id;
    elementParent = event.target.parentNode;
    bigSquareId = elementParent.id;
    nodeOfSquareNumber = elementParent.childNodes[9];
    spanParentNode = nodeOfSquareNumber.parentNode;
    spanParentNodeId = spanParentNode.id;
    let numberOfSquaresId = nodeOfSquareNumber.id;
    numberOfClickedSquare = nodeOfSquareNumber.innerText;
    var totalOfSquareNumber = $(`#${numberOfSquaresId}`).text();

    socket.emit('click-number', {ncs: numberOfClickedSquare, sId: numberOfSquaresId}); //passing the number 

    nodesLength = spanParentNode.childNodes.length;
    for(var i = 0; i < nodesLength; i++)
        if(spanParentNode.childNodes[i].id != null)
            smallSquaresId.push(spanParentNode.childNodes[i].id);
    /**
     * 1- we passing the id of the square that the player clicked on it "smallSquareId".
     * 2- and we passing the total number of squares "totalOfSquareNumber", After we pass it to the server. 
     * "totalOfSquareNumber" is the number of small squares remaining in each big square.
     * 3- passing the all four squares when the player clicked on one of the small squares in one big square
     */
    socket.emit('square-click', {smallSquareId: smallSquareId, totalOfSquareNumber: totalOfSquareNumber, listOfSmallSquaresId: smallSquaresId.slice(0, 4)}); 
});

//updating the number of squares in big square if the player clicked on one of the small squares
socket.on('number-of-remaining-squares', (data)=> 
{
    $(`#${data.sId}`).text(data.ncs);
});



//storing client id who joined the same room and pass it to server
socket.on('clients-in-room', (clientsId)=>
{
    playerList = clientsId;
});


socket.on('client-joined', (data)=>
{
    if(data.numberOfClientJoined < 2)
        $('#game').css("pointer-events", "none");
    else
    {
        $('#game').css("pointer-events", "auto");
        $('#random-moves').val(`${data.randomNumber}`);
        $('#random-moves').show();
        $('#joined-message').show();
        $('#joined-message').fadeOut(3000);
        $('#random-moves').css('background-color', 'rgb(252, 79, 79)');
        let playerTurn = anime({
            targets: '#player-turn',
            translateX: [{value: -300, duration: 2000}],
            easing: 'easeInOutExpo'
        })
    }
});

var generatedRoomCode = codeGenerator(5); //generated room code with "five digits"

$('#room-id').text(`Room code: [ ${generatedRoomCode} ]`); //client room code will appear when only the client create the room.

//generate random code that contains number and character
function codeGenerator(length)
{
    var result  = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) 
    {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}