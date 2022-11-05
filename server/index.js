const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { Console } = require("console");
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
function removeUser(name, room) {
  if (manifest[room] === undefined) return;
  let arr = manifest[room];
  let newArr = arr.filter((item) => item !== name);
  manifest[room] = newArr;
}
function checkReconnect(displayName, roomId, socket, leaveMessage) {
  if (Array.from(socket.rooms).includes(socket.id)) return;
  else {
    if (manifest[roomId] !== undefined) removeUser(displayName, roomId);
    if (manifest[roomId].length > 0) {
      const listConnected = manifest[roomId];
      socket.broadcast
        .to(roomId)
        .emit("user_left", listConnected, leaveMessage);
    } else {
      delete manifest[roomId];
    }
  }
}

io.on("connection", (socket) => {
  socket.on("join", (user, roomId) => {
    socket.join(roomId);
    socket.username = user;
    socket.room = roomId;
    if (manifest[roomId] === undefined) {
      manifest[roomId] = [];
    }
    manifest[roomId].push(user);
    const joinedMessage = {
      user: "server",
      content: `${user} joined the chat`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.broadcast.to(roomId).emit("user_joined", joinedMessage);
    let listConnected = manifest[roomId];
    io.in(roomId).emit("update_connected", listConnected);
  });
  socket.on("rejoin", (displayName, roomId) => {
    socket.join(roomId);
    socket.username = displayName;
    socket.room = roomId;
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
  socket.on("disconnect", (reason) => {
    console.log(reason);
    let displayName = socket.username;
    let roomId = socket.room;
    const leaveMessage = {
      user: "server",
      content: `${displayName} has left the chat`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    setTimeout(() => {
      checkReconnect(displayName, roomId, socket, leaveMessage);
    }, 11000);
  });
});
