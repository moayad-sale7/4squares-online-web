const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join('C:/Users/slv4d/OneDrive/Desktop/four-squares', 'frontend')));

io.on('connection', socket=> 
{
    socket.on('joinRoom', (userRoomId)=>
    {
        socket.join(userRoomId);
        socket.to(userRoomId).emit(console.log("Joining the room .."));
        socket.on('square-click', (elementId)=> 
        {
            io.to(userRoomId).emit('square-clicked', elementId)
        })
    });

});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> {console.log(`Server running on port ${PORT}`)});