"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const messages = [{
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
    }];
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000'
}));
app.use(express_1.default.json());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    server.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
app.get('/', (req, res) => {
    res.send("Hello socket.io!");
});
const users = new Map();
io.on('connection', (socket) => {
    users.set(socket, {
        name: "anonym",
        id: `${new Date().getTime()}`,
    });
    socket.on("client-name-sent", (name) => {
        if (typeof name !== "string") {
            return;
        }
        const user = users.get(socket);
        user.name = name;
    });
    socket.on('client-message-sent', (message, successFn) => {
        if (typeof message !== "string" || message.length > 20) {
            successFn("Message length should be less than 20 chars");
            return;
        }
        const user = users.get(socket);
        let item = {
            message: message,
            id: `${new Date().getTime()}`,
            user: {
                name: user.name,
                id: user.id,
            }
        };
        messages.push(item);
        io.emit('new-message-sent', item);
        successFn(null);
    });
    socket.on("client-typed", () => {
        socket.broadcast.emit('user-typing', users.get(socket));
    });
    socket.emit('initMessages-published', messages);
    console.log('a user connected');
    socket.on('disconnect', () => {
        users.delete(socket);
        console.log('user disconnected');
    });
});
