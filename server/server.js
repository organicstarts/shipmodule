import bodyParser from "body-parser";
const cors = require("cors");
import express from "express";
import path from "path";
const app = express();
const fs = require("fs");

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();

const staticFiles = express.static(path.join(__dirname, "../../client/build"));
app.use(staticFiles);

router.post("/writetofile", (req, res) => {
  let rawData = fs.readFileSync("./log/batchlog.json");
  let queue = JSON.parse(rawData);
  let saveUser = {
    batch: req.body.batchNumber,
    picker: req.body.picker,
    shipper: req.body.shipper,
    date: req.body.currentTime
  };
  if (queue.length > 500) {
    queue.pop();
  }
  queue.unshift(saveUser);
  let data = JSON.stringify(queue, null, 2);
  fs.writeFile("./log/batchlog.json", data, err => {
    if (err) {
      res.json({
        msg: "fail"
      });
    }
    res.json({
      msg: "success"
    });
  });
});

app.use(router);

// any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});
