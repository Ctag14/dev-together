const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const manifest = {};
io.on("connection", (socket) => {
  socket.on("join", (user, roomId) => {
    const userSocketID = socket.id;
    if (!(roomId in manifest)) {
      manifest[roomId] = [];
    }
    manifest[roomId].push({
      displayName: user,
      position: {},
      id: userSocketID,
    });

    socket.join(roomId);
    const joinedMessage = {
      user: "server",
      content: `${user} joined the chat`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.broadcast.to(roomId).emit("user_joined", joinedMessage);

    function connectedUsers(room) {
      var arr = [];
      for (let user of room) {
        arr.push(user.displayName);
      }
      return arr;
    }
    const listConnected = connectedUsers(manifest[roomId]);
    io.in(roomId).emit("update_connected", listConnected);
  });
  socket.on("send_message", (sentMessage, roomId) => {
    socket.broadcast.to(roomId).emit("recieve_message", sentMessage);
  });
  socket.on("send_code", (value, roomId) => {
    // function updateManifest(room) {
    //   const name = userPos.user;
    //   for (let user of room) {
    //     if (user.displayName === name) {
    //       user.position = userPos.position;
    //     }
    //   }
    // }
    // updateManifest(manifest[roomId]);
    // const listPositions = manifest[roomId];
    // console.log(listPositions);
    // socket.broadcast.to(roomId).emit("update_positions", listPositions);
    socket.broadcast.to(roomId).emit("broadcast_code", value);
  });
  socket.on("change_language", (lang, roomId) => {
    socket.broadcast.to(roomId).emit("language_change", lang);
  });
  socket.on("disconnect", () => {
    const targetId = socket.id;
    let user = "";
    let roomId = "";
    for (let room in manifest) {
      for (let i = 0; i < room.length; i++) {
        const curUser = manifest[room][i];
        if (manifest[room].length === 0) {
          delete manifest.room;
          break;
        }
        if (curUser.id === targetId) {
          user = curUser.displayName;
          roomId = room;
          manifest[room].splice(i, 1);
          break;
        }
      }
    }

    function connectedUsers(room) {
      var arr = [];
      for (let user of room) {
        arr.push(user.displayName);
      }
      return arr;
    }
    const leaveMessage = {
      user: "server",
      content: `${user} has left the chat`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    const listConnected = connectedUsers(manifest[roomId]);
    socket.broadcast.to(roomId).emit("user_left", listConnected, leaveMessage);
  });
});
