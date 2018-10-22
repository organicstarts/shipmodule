const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get('/ping', (req, res) => {
  console.log('pong');
})


app.listen(process.env.PORT || 3001 ,() => {
  console.log("server is running");
  
});