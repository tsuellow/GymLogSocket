"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var app = express_1.default();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server);
var port = process.env.PORT || 80;
io.on("connection", function (socket) {
    var room = socket.handshake.query.branch;
    console.log("conn established, joining branch: " + room);
    socket.join(room);
    socket.on("clientInfo", function (data) {
        socket.broadcast.to(room).emit("clientInfo", data);
        console.log("request client info" + data);
    });
    socket.on("payment", function (data) {
        socket.broadcast.to(room).emit("payment", data);
        console.log("got payment" + data);
    });
    socket.on("createClient", function (data) {
        socket.broadcast.to(room).emit("createClient", data);
        console.log("got create" + data);
    });
    socket.on("paymentConfirmation", function (data) {
        socket.broadcast.to(room).emit("acknowledgment", data);
    });
    socket.on("createConfirmation", function (data) {
        socket.broadcast.to(room).emit("acknowledgment", data);
    });
});
server.listen(81);
