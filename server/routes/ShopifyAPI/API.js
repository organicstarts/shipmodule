import "module-alias/register";
const router = require("express").Router();
const fetch = require("node-fetch");
import shopify from "@bgauth/auth.json";
const username = shopify.shopify.user;
const password = shopify.shopify.key;
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
    const baseUrl = `https://organic-start-wholesale.myshopify.com/orders/${req.query.orderid}`;
    
    fetch(baseUrl, header)
      .then(res => res.json())
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err);
      });
  });
