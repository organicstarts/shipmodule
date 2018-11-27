
import bodyParser from "body-parser";

const cors = require("cors");
import express from "express";
import path from "path";
const app = express();
const fs = require("fs");

// app.use(cors());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();

router.use('/os', require('./routes/BigCommerceAPI/API'));

const staticFiles = express.static(path.join(__dirname, "../../client/build"));
app.use(staticFiles);







router.post("/writetofile", (req, res) => {
  let rawData = fs.readFileSync("../client/src/config/batchlog.json");
  let queue = JSON.parse(rawData);
  console.log(queue)
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
  fs.writeFile("../client/src/config/batchlog.json", data, "utf8", err => {
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

router.post("/fraud/writefraudtofile", (req, res) => {
  let queue = [];
  let saveUser = {};
  for (let i in req.body.saved) {
    saveUser = {
      id: req.body.saved[i].id,
      orderCount: req.body.saved[i].orderCount,
      billing_address: {
        email: req.body.saved[i].billing_address.email,
        first_name: req.body.saved[i].billing_address.first_name,
        last_name: req.body.saved[i].billing_address.last_name,
        street_1: req.body.saved[i].billing_address.street_1,
        street_2: req.body.saved[i].billing_address.street_2,
        city: req.body.saved[i].billing_address.city,
        state: req.body.saved[i].billing_address.state,
        zip: req.body.saved[i].billing_address.zip,
        company: req.body.saved[i].billing_address.company,
        country: req.body.saved[i].billing_address.country,
        phone: req.body.saved[i].billing_address.phone
      },
      shippingInfo: [
        {
          first_name: req.body.saved[i].shippingInfo[0].first_name,
          last_name: req.body.saved[i].shippingInfo[0].last_name,
          street_1: req.body.saved[i].shippingInfo[0].street_1,
          street_2: req.body.saved[i].shippingInfo[0].street_2,
          city: req.body.saved[i].shippingInfo[0].city,
          state: req.body.saved[i].shippingInfo[0].state,
          zip: req.body.saved[i].shippingInfo[0].zip,
          company: req.body.saved[i].shippingInfo[0].company,
          country: req.body.saved[i].shippingInfo[0].country,
          phone: req.body.saved[i].shippingInfo[0].phone
        }
      ]
    };
    if (queue.length > 500) {
      queue.pop();
    }
    queue.push(saveUser);
  }

  let data = JSON.stringify(queue, null, 2);
  fs.writeFile("../client/src/config/fraudlog.json", data, "utf8", err => {
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
