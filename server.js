const { signup, login } = require("./controller");
const authRouter = require("./routes");
const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

/* 
  Middlewares
*/
app.use(express.json());

app.use(express.static(__dirname + "/public"));

/* 
  Route moumting
*/
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/auth", (req, res) => {
  res.sendFile(__dirname + "/auth.html");
});

app.post("/signup", signup);
app.post("/login", login);

// Socket
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected...");
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});
