import {Request, Response} from "express";
import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";

const port = process.env.PORT || 5000

const app = express()

const server = http.createServer(app);

const messages: Array<any> = [{
    message: "hello123",
    id: "2314124fs",
    user: {
        name: "R1",
        id: "2314124fsd",
    }

},
    {
        message: "hello23",
        id: "2314124fsr32",
        user: {
            name: "R2",
            id: "2314124fs32r",
        }

    }]

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

const startApp = async () => {
    server.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp();

app.get('/', (req, res) => {
    res.send("Hello socket.io!")
});

const users = new Map();

io.on('connection', (socket: any) => {

    users.set(socket, {
            name: "anonym",
            id: `${new Date().getTime()}`,
    })

    socket.on("client-name-sent", (name: string) => {
        if (typeof name !== "string") {
            return
        }
        const user = users.get(socket)
        user.name = name;
    })

    socket.on('client-message-sent', (message: string, successFn: any) => {
        if (typeof message !== "string" || message.length > 20) {
            successFn("Message length should be less than 20 chars")
            return
        }

        const user = users.get(socket)

        let item = {
            message: message,
            id: `${new Date().getTime()}`,
            user: {
                name: user.name,
                id: user.id,
            }
        };
        messages.push(item)
        io.emit('new-message-sent', item)
        successFn(null)
    });

    socket.on("client-typed", () => {
        socket.broadcast.emit('user-typing', users.get(socket))
    });

    socket.emit('initMessages-published', messages);

    console.log('a user connected');
    socket.on('disconnect', () => {
        users.delete(socket)
        console.log('user disconnected');
    });
});
