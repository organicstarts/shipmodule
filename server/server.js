import bodyParser from "body-parser";
const fetch = require("node-fetch");
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
  fs.writeFile("../client/src/config/fraudlog.json", data, err => {
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

router.get("/getallorders", (req, res) => {
  console.log("hi", req.query.min);
  //build api URL with user zip
  const baseUrl = `https://organicstart.com/api/v2/orders?limit=200&sort=id:desc${
    req.query.min > 0 ? `&min_id=${req.query.min}` : ""
  }`;
  const username = "shipstation";
  const password = "be248d994ffb27a4a39584ea9a1d27b882f7f662";

  let encodedString = Buffer.from(username + ":" + password).toString("base64");
  fetch(baseUrl, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Basic ${encodedString}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/getshipping", (req, res) => {
  //build api URL with user zip
  const baseUrl = `https://organicstart.com/api/v2/orders/${req.query.orderid}/shippingaddresses`;
  const username = "shipstation";
  const password = "be248d994ffb27a4a39584ea9a1d27b882f7f662";

  let encodedString = Buffer.from(username + ":" + password).toString("base64");
  fetch(baseUrl, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Basic ${encodedString}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/getordercount", (req, res) => {
  //build api URL with user zip
  const baseUrl = `https://organicstart.com/api/v2/orders?customer_id=${req.query.customerid}&limit=5`;
  const username = "shipstation";
  const password = "be248d994ffb27a4a39584ea9a1d27b882f7f662";

  let encodedString = Buffer.from(username + ":" + password).toString("base64");
  fetch(baseUrl, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Basic ${encodedString}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.use(router);

// any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});
