const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join('C:/Users/Moayad/Desktop/projects/four-squares', 'frontend')));

var playersMap = new Map();
var clientsId = [];
io.on('connection', socket=> 
{
    socket.on('joined-room', (roomCode)=>
    {

        socket.join(roomCode);
        socket.on('square-click', (data)=> 
        {
            io.to(roomCode).emit('square-clicked', {smallSquareId: data.smallSquareId, totalOfSquareNumber: data.totalOfSquareNumber,
                listOfSmallSquaresId: data.listOfSmallSquaresId, clientsId: socket.id});
        })

        var numberOfClientJoined = io.sockets.adapter.rooms.get(roomCode).size //number of the client joined the same room.
        var randomNumber = Math.floor(Math.random() * 2) + 1; //generate random number of in the beginning of the game for the red player.
        io.to(roomCode).emit('client-joined', {numberOfClientJoined: numberOfClientJoined, randomNumber: randomNumber});

        socket.on('moves-number', (randomNum)=>
        {
            io.to(roomCode).emit('next-move', randomNum);
        })

        socket.on('reset', (data)=>
        {
            io.to(roomCode).emit('game-reset', data);
        });

    });


    socket.on('joined-room', (roomCode)=>
    {
        socket.on('player-id', (clientId)=> 
        {
            clientsId.push(clientId)
            playersMap.set(roomCode, clientsId);
            io.to(roomCode).emit('clients-in-room', Array.from(playersMap));
        });
        socket.on('click-number', (data)=> 
        {
            data.ncs = data.ncs - 1;
            io.to(roomCode).emit('number-of-remaining-squares', {ncs: data.ncs, sId: data.sId});
        });
        socket.on('turn-switch', (data)=>
        {
            io.to(roomCode).emit('turn', {red: data.red, blue: data.blue,clientsId: clientsId.slice(-2)});
        });
    });

});

const PORT = 3000;
server.listen(PORT, ()=> {console.log(`Server running on port ${PORT}`)});