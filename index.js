import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { PORT } from "./config.js";
import cors from "cors";

var info = {
  "mensaje": {},
  "contador": 0,
  "ledState": false,
  "potVal": 0
};


// Initializations
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
   cors: {
     origin: "*",
   },
});
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "../client/build")));

io.on("connection", (socket) => {

  socket.on("init", (data) => {
    socket.broadcast.emit('init', info);
  });
  
  socket.on("mensaje", (data) => {
    info.mensaje = JSON.parse(data);
    socket.broadcast.emit('mensaje', data);
  });

  socket.on("ledStatus", (data) => {
    info.ledState = Boolean(data);
    socket.broadcast.emit('ledStatus', data);
  });

  socket.on("potVal", (data) => {
    info.potVal = Number(data);
    socket.broadcast.emit('potVal', data);
  });

});

server.listen(PORT);
console.log(`server on port ${PORT}`);