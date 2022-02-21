import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server);
const port = process.env.PORT || 80;

io.on("connection", (socket: Socket) => {
  const room=socket.handshake.query.branch!;
  console.log("conn established, joining branch: "+room);
  socket.join(room);

  socket.on("clientInfo", (data) => {
    socket.broadcast.to(room).emit("clientInfo",data);
    console.log("request client info" + data);
  });

  socket.on("payment", (data) => {
    socket.broadcast.to(room).emit("payment",data);
    console.log("got payment" + data);
  });

  socket.on("createClient", (data) => {
    socket.broadcast.to(room).emit("createClient",data);
    console.log("got create" + data);
  });

  socket.on("paymentConfirmation", (data) => {
    socket.broadcast.to(room).emit("acknowledgment",data);
  });

  socket.on("createConfirmation", (data) => {
    socket.broadcast.to(room).emit("acknowledgment",data);
  });

});

server.listen(81);
