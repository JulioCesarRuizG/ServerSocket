//serving client.html
const express = require('express')
const webserver = express()
    .use((req, res) =>
        res.sendFile('/index.html', { root: __dirname })
    )
    .listen(3000, () => console.log(`Listening on ${3000}`))


//socket stuff 
const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 443 })
let clients = new Map(); // Map to store all clients
let clientIds=0;

sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')

    let clientId = clientIds++; // this Is most be obtained from a token gotten from auth
    clients.set(clientId, ws);

    ws.on('close', () => console.log('Client has disconnected!'))

    ws.on('message', data => {
        data=JSON.parse(data)
        console.log(`Received message \"${data.inputMessage}\" to client  \"${data.toClient}\" from client \"${clientId}\"`);
        sockserver.clients.forEach(client => {
            console.log(`distributing message: ${data.inputMessage}`)
            client.send(`${data.inputMessage}`)
        })
    })

    ws.on('close', () => {
        console.log(`Disconnected the client ${clientId}`);
        clients.delete(clientId); // Clean up when socket is closed
    });

    ws.onerror = function () {
        console.log('websocket error')
    }
})