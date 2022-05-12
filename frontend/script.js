
const socket = io();

$('#game').hide();
$('#room-id').hide();

var playerList = [];
var playerMap = new Map();
var clientPlayerId = '';
var roomCode = ''; //the room code will be stored whatever if the user joined or create the room
var moves = ''; //store the number of each square that come from the server  

var elementParent = '';
var parentId = '';
var spanNode = '';
var numberOfClickedSquare = '';
var spanParentNode = '';
var spanParentNodeId = ''
var nodesLength = ''
var nodesId = [];
var nodeIdForClients = [];
var numberOfsquares = '';
var sqaures = {
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

//create room button
//passing client to the server
$('#create-room').on('click', ()=>
{
    socket.emit('joinRoom', generatedRoomCode);
    $('#game').show();
    $('#room-id').show();
    clientPlayerId = socket.id;
    socket.emit('player-id', clientPlayerId);
    roomCode = generatedRoomCode;
    $('#join-and-create').hide();
});


//passing room code to the server
$('#join-room').on('click', ()=>
{
    let joinedRoomCode = $('#user-room-id').val();
    roomCode = $('#user-room-id').val();
    socket.emit('joinRoom', joinedRoomCode);
    $('#game').show();
    clientPlayerId = socket.id;
    socket.emit('player-id', clientPlayerId);
    $('#join-and-create').hide();
});

//turn the clicked element to the plyaer color
socket.on('square-clicked', (data)=> 
{
    nodesId = [];
    let len = playerList.length - 1;
    playerMap.set(playerList[len][0], playerList[0][1].slice(-2));
    if(playerMap.get(roomCode)[0] == data.plId)
    {
        $(`#${data.eId}`).css('background-color', 'rgb(252, 79, 79)');
    }    
    else if(playerMap.get(roomCode)[1] == data.plId)
    {
        $(`#${data.eId}`).css('background-color', 'rgb(3, 83, 151)');
    }
    var lastSquareColor = ''; 
    lastSquareColor = ($(`#${data.eId}`).css('background-color'))
    if(data.squareNumber === '1')
    {
        var square = data.nodesId[0].slice(0,1);
        switch(square)
        {
            case 'a': sqaures.squareA = true; break;
            case 'b': sqaures.squareB = true; break;
            case 'c': sqaures.squareC = true; break;
            case 'd': sqaures.squareD = true; break;
            case 'e': sqaures.squareE = true; break;
            case 'f': sqaures.squareF = true; break;
            case 'g': sqaures.squareG = true; break;
            case 'h': sqaures.squareH = true; break;
            case 'i': sqaures.squareI = true; break;
        }
        for(var i= 0; i < data.nodesId.length; i++)
            $(`#${data.nodesId[i]}`).css('background-color', `${lastSquareColor}`);

        var colorWinner = lastSquareColor === 'rgb(3, 83, 151)' ? 'Blue' : 'Red';

        $('#winner').css('text-align', 'center');
        if(sqaures.squareB && sqaures.squareA && sqaures.squareI)
            $('#winner').text(`${colorWinner} is the winner`);

    }
});


//passing the clicked element id to the server
$('.small-square').on('click', (event)=>
{
    //passing element id for small squares
    let elementId = event.target.id;
    elementParent = event.target.parentNode;
    parentId = elementParent.id;
    spanNode = elementParent.childNodes[9];
    spanParentNode = spanNode.parentNode;
    spanParentNodeId = spanParentNode.id;
    spanId = spanNode.id;
    numberOfClickedSquare = spanNode.innerText;
    var squareNumber = $(`#${spanId}`).text();

    socket.emit('click-number', {ncs: numberOfClickedSquare, sId: spanId}); //passing the number 

    nodesLength = spanParentNode.childNodes.length;
    for(var i = 0; i < nodesLength; i++)
        if(spanParentNode.childNodes[i].id != null)
            nodesId.push(spanParentNode.childNodes[i].id);
        
        socket.emit('square-click', {elementId: elementId, squareNumber: squareNumber, nodesId: nodesId.slice(0, 4)});
});


socket.on('sqaure-moves', (data)=> 
{
    $(`#${data.sId}`).text(data.ncs);
    numberOfsquares = $(`#${data.sId}`).text();
});


//storing client id and pass it to server
socket.on('players', (plist)=>
{
    playerList = plist;
});



var generatedRoomCode = codeGenerator(5);

//player room code
$('#room-id').text(`Your room ID: ${generatedRoomCode}`);

//generate room code
function codeGenerator(length)
{
    var result  = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) 
    {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}