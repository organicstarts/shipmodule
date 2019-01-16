import "module-alias/register";
const router = require("express").Router();
const fetch = require("node-fetch");
import shopify from "@bgauth/auth.json";
const username = shopify.shopify.user;
const password = shopify.shopify.key;
const header = {
  method: "GET",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};

router.get("/getorder", (req, res) => {
  //build api URL with user order number
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD",
    "Content-Type": "application/json",
    Accept: "application/json"
  });
  const baseUrl = `https://${username}:${password}@organic-start-wholesale.myshopify.com/admin/orders?name=${
    req.query.orderid
  }`;

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(datas => {
      if (
        datas.orders[0].contact_email === req.query.email &&
        datas.orders[0].order_number === parseInt(req.query.orderid)
      ) {
        let info = {
          trackingNum: datas.orders[0].note
            .split("Tracking Number: ")[1]
            .split("\n")[0],
          createdAt: datas.orders[0].created_at,
          updatedAt: datas.orders[0].updated_at,
          lineItems: datas.orders[0].line_items.map(data => {
            if (!isNaN(data.title.charAt(0))) {
              return {
                boxes: data.title.split(" ")[0],
                title: data.title.split("of ")[1],
                quantity: data.quantity,
                grams: data.grams,
                fullfillmentStatus: data.fullfillment_status
              };
            } else {
              return {
                boxes: null,
                title: data.title,
                quantity: data.quantity,
                grams: data.grams,
                fullfillmentStatus: data.fullfillment_status
              };
            }
          }),
          shippingAddress: {
            city: datas.orders[0].shipping_address.city,
            zip: datas.orders[0].shipping_address.province,
            country: datas.orders[0].shipping_address.country_code
          }
        };
        res.send(info);
      } else {
        res.send({});
      }
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
