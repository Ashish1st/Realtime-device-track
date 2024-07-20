const express = require('express');
require('dotenv').config()
const app = express();
const path = require("path");
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function (socket) {
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data })
    })
    socket.on("disconnect", () => {
        io.emit("User-disconnected");
    })
})
app.get('/', (req, res) => {
    res.render("index");
})

server.listen(process.env.PORT)