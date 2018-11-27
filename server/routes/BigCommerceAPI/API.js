const router = require("express").Router();
const fetch = require("node-fetch");

const username = "shipstation";
const password = "be248d994ffb27a4a39584ea9a1d27b882f7f662";
let encodedString = Buffer.from(username + ":" + password).toString("base64");
const header = {
  method: "GET",
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Basic ${encodedString}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};

router.get("/getorder", (req, res) => {
  //build api URL with user zip
  const baseUrl = `https://organicstart.com/api/v2/orders/${req.query.orderid}`;

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/getallorders", (req, res) => {
  //build api URL with user zip
  const baseUrl = `https://organicstart.com/api/v2/orders?limit=200&sort=id:desc${
    req.query.min > 0 ? `&min_id=${req.query.min}` : ""
  }`;

  fetch(baseUrl, header)
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
  const baseUrl = `https://organicstart.com/api/v2/orders/${
    req.query.orderid
  }/shippingaddresses`;

  fetch(baseUrl, header)
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
  const baseUrl = `https://organicstart.com/api/v2/orders?customer_id=${
    req.query.customerid
  }&limit=5`;

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/getordercoupon", (req, res) => {
  //build api URL with user zip
  const baseUrl = `https://organicstart.com/api/v2/orders/${
    req.query.orderid
  }/coupons`;

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send("");
    });
});

module.exports = router;
