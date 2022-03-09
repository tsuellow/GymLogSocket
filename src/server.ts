import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 3005;

io.on("connection", (socket: Socket) => {
  // room on the client is gymid_branch. eg: "uf_ESTELI"
  const room = socket.handshake.query.room!;
  console.log("conn established, joining room: " + room);
  socket.join(room);

  // request client info to the
  socket.on("clientInfo", (data) => {
    socket.broadcast.to(room).emit("clientInfo", data);
    console.log("request/response client info", data);
  });

  socket.on("payment", (data) => {
    socket.broadcast.to(room).emit("payment", data);
    console.log("create/response payment", data);
  });

  socket.on("createClient", (data) => {
    socket.broadcast.to(room).emit("createClient", data);
    console.log("create/response createClient", data);
  });
});

console.log(`listening on http://localhost:${port}`);
server.listen(port);
