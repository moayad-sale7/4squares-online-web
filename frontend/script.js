const socket = io();

$('.small-square').on('click', (event)=>
{
    //event.target.style.backgroundColor = 'red';
    let elementId = event.target.id;
    socket.emit('square-click', elementId);
});

socket.on('square-clicked', (elementId)=> 
{
    $(`#${elementId}`).css('background-color', 'red');
});

var roomId = makeid(5);

$('button').on('click', ()=>
{
    let userRoomId = $('#user-room-id').val();
    //console.log(userRoomId);
    socket.emit('joinRoom', userRoomId);
    $('#game').css({ "background-color" : "transparent" });
});

//span 
$('#room-id').text(`Your room ID: ${roomId}`);

function makeid(length)
 {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) 
    {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}



