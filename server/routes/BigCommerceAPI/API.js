import "module-alias/register";
const router = require("express").Router();
const fetch = require("node-fetch");
import bigCommerce from "@bgauth/auth.json";
const username = bigCommerce.bigcommerce.user;
const password = bigCommerce.bigcommerce.key;
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
  //build api URL with user order number
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
  //build api URL with user all order, if  order# exist set as min
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
  //build api URL with user orderid to get shipping info
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
  //build api URL with user customerid to get history on purchase count
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
  //build api URL with user ordernumber to see if order had coupons used
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
