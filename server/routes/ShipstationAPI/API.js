import "module-alias/register";
const router = require("express").Router();
const fetch = require("node-fetch");
import shipstation from "@bgauth/auth.json";
const username = shipstation.shipstation.user;
const password = shipstation.shipstation.key;
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

router.delete("/cancelorder", (req, res) => {
  const baseUrl = `https://ssapi.shipstation.com/orders?orderNumber=${
    req.body.ordernumber
  }`;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(async e => {
      await fetch(
        `https://ssapi.shipstation.com/orders/${e.orders[0].orderId}`,
        {
          method: "DELETE",
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Basic ${encodedString}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        }
      );
    })
    .then(e => {
      res.json({ msg: "success" });
    })
    .catch(err => {
      res.json({ msg: "fail" });
    });
});

module.exports = router;
