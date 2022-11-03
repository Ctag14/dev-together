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
function connectedUsers(room) {
  var arr = [];
  for (let user of room) {
    arr.push(user.displayName);
  }
  return arr;
}
function findUser(targetId) {
  return manifest[targetId];
}

io.on("connection", (socket) => {
  socket.on("join", (user, roomId) => {
    const userSocketID = socket.id;
    manifest[userSocketID] = {
      displayName: user,
      room: roomId,
    };
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
    let targetRoom = io.sockets.adapter.rooms(roomId).sockets;
    const listConnected = connectedUsers(targetRoom);
    io.in(roomId).emit("update_connected", listConnected);
  });
  socket.on("send_message", (sentMessage, roomId) => {
    socket.broadcast.to(roomId).emit("recieve_message", sentMessage);
  });
  socket.on("send_code", (value, roomId) => {
    socket.broadcast.to(roomId).emit("broadcast_code", value);
  });
  socket.on("change_language", (lang, roomId) => {
    socket.broadcast.to(roomId).emit("language_change", lang);
  });

  socket.on("disconnect", () => {
    const targetId = socket.id;
    let userInfo = findUser(targetId);
    if (userInfo !== undefined) {
      const leaveMessage = {
        user: "server",
        content: `${userInfo["displayName"]} has left the chat`,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      let targetRoom = io.sockets.adapter.rooms[roomId].sockets;
      const listConnected = connectedUsers(targetRoom);
      socket.broadcast
        .to(userInfo["room"])
        .emit("user_left", listConnected, leaveMessage);
    }
  });
});
