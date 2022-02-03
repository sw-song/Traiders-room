import express from "express";
import WebSocket from "ws";
import http from "http";
import { handle } from "express/lib/application";
import { SocketAddress } from "net";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));


app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('listening on http://localhost:3000');

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", socket => {
    socket.on("enter_room", (roomName, showRoom) => {
        socket.join(roomName);
        showRoom();
        socket.to(roomName).emit("joined");
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("out"));
    })
    socket.on("new_message", (msg, roomName, myMessage) => {
        socket.to(roomName).emit("new_message", msg);
        myMessage();
    })
})

/*
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "anonymous";
    console.log("Connected to Browser ^^");
    socket.on("close", () => {
        console.log("Disconnected from the Browser -.-");
    });
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket['nickname'] = message.payload;
                break;
        }
    });
})
*/

server.listen(3000, handleListen);