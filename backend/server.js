const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { addListener } = require('process');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join('C:/Users/Moayad/Desktop/projects/four-squares', 'frontend')));

var playersMap = new Map();
var clientsId = [];

io.on('connection', socket=> 
{
    socket.on('joinRoom', (roomCode)=>
    {
        socket.join(roomCode);
        socket.on('square-click', (data)=> 
        {
            io.to(roomCode).emit('square-clicked', {eId: data.elementId, squareNumber: data.squareNumber, nodesId: data.nodesId, plId: socket.id});
        })
    });
    socket.on('joinRoom', (roomCode)=>
    {
        socket.on('player-id', (clientId)=> 
        {
            clientsId.push(clientId)
            playersMap.set(roomCode, clientsId);
            io.to(roomCode).emit('players', Array.from(playersMap));
        });
        socket.on('click-number', (data)=> 
        {
            data.ncs = data.ncs - 1;
            io.to(roomCode).emit('sqaure-moves', {ncs: data.ncs, sId: data.sId});
        });
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> {console.log(`Server running on port ${PORT}`)});