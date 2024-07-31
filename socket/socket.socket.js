const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  
  console.log(`new socket member connected ${socket.id}`);

  io.emit("test", "socket server on");

  socket.on("disconnect", () => {
    console.log(`socket disconnected ${socket.id}`);
  });

});

module.exports = { httpServer, io, app };
