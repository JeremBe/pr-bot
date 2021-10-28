const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);

const { routes } = require("./routes");

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

routes(app);
