const authRouter = require("./routes");
const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/api/v1/auth", authRouter);
// Socket
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected...");
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});
