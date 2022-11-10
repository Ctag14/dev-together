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
// const PORT = 3001;

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const manifest = {};
function findUser(displayName, roomId) {
  if (manifest[roomId] === undefined) return;
  for (let i = 0; i < manifest[roomId].length; i++) {
    let user = manifest[roomId][i];
    if (user.displayName === displayName) {
      return i;
    }
  }
}
function checkReconnect(displayName, roomId, socket, index) {
  if (manifest[roomId] === undefined || index === undefined) return;
  if (manifest[roomId][index].disconnected === false) return;

  manifest[roomId].splice(index, 1);
  displayName + " removed form " + roomId;
  if (manifest[roomId].length > 0) {
    const listConnected = manifest[roomId];
    const leaveMessage = {
      user: "server",
      content: `${displayName} has left the chat`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.broadcast.to(roomId).emit("user_left", listConnected, leaveMessage);
  } else {
    delete manifest[roomId];
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
    manifest[roomId].push({
      displayName: user,
      disconnected: false,
    });
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
    if (roomId === "" || displayName === "") return;
    console.log(displayName + " rejoining " + roomId);

    socket.join(roomId);
    socket.username = displayName;
    socket.room = roomId;
    console.log(displayName + " rejoined");
    let index = findUser(displayName, roomId);
    manifest[roomId][index].disconnected = false;
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
    let displayName = socket.username;
    let roomId = socket.room;
    let index = findUser(displayName, roomId);
    if (index !== undefined) {
      manifest[roomId][index].disconnected = true;
      console.log(displayName + " disconnected");
      setTimeout(() => {
        checkReconnect(displayName, roomId, socket, index);
      }, 11000);
    }
  });
});
