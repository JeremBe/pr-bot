const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port);

server.on("listening", () => {
  const addr = server.address();
  console.log(`server listening on port ${addr.port}`);
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

/**
 * ROUTES API
 */
app.get("/api/webhook", (req, res) => {
  console.log("==================================");
  console.log("==================================");
  console.log(req.query);

  res.status(200).json();
});

app.post("/api/webhook", (req, res) => {
  console.log("==================================");
  console.log("==================================");
  console.log(req.body);

  res.status(200).json();
});
