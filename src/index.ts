import {Request, Response} from "express";
import express from "express";
import http from "http";
import {Server} from "socket.io";


const app = express()

const server = http.createServer(app);

const io = new Server(server);

const port = process.env.PORT || 5000

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

app.get('/', (req, res) => {
    res.send("Hello socket.io!")
});

io.on('connection', (socket: any) => {
    console.log('a user connected');
});

const startApp = async () => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp();