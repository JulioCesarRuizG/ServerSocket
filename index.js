//serving client.html
const express = require('express')
const webserver = express()
    .use((req, res) =>
        res.sendFile('/index.html', { root: __dirname })
    )
    .listen(3000, () => console.log(`Listening on ${3000}`))


//socket stuff 
const SocketIO = require('socket.io')

const io = SocketIO();
io.listen(443);

let clients = new Map(); // Map to store all clients
let clientIds = 0;

io.on('connection', socket => {
    console.log('New client connected!');
    socket.send('connection established');

    let clientId = clientIds++; // this Is most be obtained from a token gotten from auth
    clients.set(clientId, socket);

    socket.on('close', () => console.log('Client has disconnected!'));

    socket.on('message', data => {
        data = JSON.parse(data);
        console.log(`Received message \"${data.inputMessage}\" to client \"${data.toClient}\" from client \"${clientId}\"`);
        io.emit('message', data);
    });

    socket.on('close', () => {
        console.log(`Disconnected the client ${clientId}`);
        clients.delete(clientId); // Clean up when socket is closed
    });
});

io.on('error', (error) => {
    console.log('websocket error', error);
});