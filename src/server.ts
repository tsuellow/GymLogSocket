import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { ConnectedGym } from "./models/ConnectedGym";
import { Receptionist } from "./models/Receptionist";

const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 3005;

const connectedGyms: ConnectedGym[] = [];

io.on("connection", (socket: Socket) => {
  const gymId = socket.handshake.query.gymId?.toString();
  const branch = socket.handshake.query.branch?.toString();
  // room on the client is gymId_branch. eg: "uf_ESTELI"
  let room = gymId && branch ? `${gymId}_${branch}` : socket.id;
  const receptionists = socket.handshake.headers.receptionists;

  if (receptionists) {
    const gym = {
      id: socket.id,
      room,
      gymId,
      branch,
      receptionists: JSON.parse(receptionists.toString()),
    };
    connectedGyms.push(gym);
    console.log("gym connected", gym);

    io.emit("roomConnected", room);

    console.log("conn established, joining room: " + room);
    socket.join(room);
  }

  // request client info to the
  socket.on("clientInfo", (data) => {
    socket.broadcast.to(room).emit("clientInfo", data);
    console.log("request/response client info", data, room);
  });

  socket.on("payment", (data) => {
    socket.broadcast.to(room).emit("payment", data);
    console.log("create/response payment", data);
  });

  socket.on("createClient", (data) => {
    socket.broadcast.to(room).emit("createClient", data);
    console.log("create/response createClient", data);
  });

  socket.on("joinRoom", (data: Receptionist) => {
    console.log("joinRoom", data);
    const found = connectedGyms.find((c) =>
      c.receptionists.find(
        (r) => r.username === data.username && r.password === data.password
      )
    );
    console.log("found room", found?.room);
    const r = found?.room;
    if (r) {
      room = r;
      socket.join(room);
      socket.emit("joinRoom", {
        status: "OK",
        room,
        branch: found.branch,
        gymId: found.gymId,
      });
    } else {
      socket.emit("joinRoom", { status: "NOK" });
    }
  });

  socket.on("disconnect", (_reason) => {
    const gymIndex = connectedGyms.findIndex((c) => c.id === socket.id);
    if (gymIndex >= 0) {
      console.log("gym disconnected", connectedGyms[gymIndex]);
      io.emit("roomDisconnected", connectedGyms[gymIndex].room);
      connectedGyms.splice(gymIndex, 1);
    }
  });
});

console.log(`listening on http://localhost:${port}`);
server.listen(port);
