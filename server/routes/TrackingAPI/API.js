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

/*-------------------------------------------------------------------
                            GET REQUESTS                            
---------------------------------------------------------------------*/

router.get("/usps", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD",
    "Content-Type": "application/json",
    Accept: "application/json"
  });
  const baseUrl = `http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=%3C?xml%20version=%221.0%22%20encoding=%22UTF-8%22%20?%3E%20%3CTrackRequest%20USERID=%22024ORGAN4286%22%3E%20%3CTrackID%20ID=%22${
    req.query.tracking
  }%22%3E%3C/TrackID%3E%20%3C/TrackRequest%3E`;
  fetch(baseUrl, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/text",
      Accept: "application/text"
    }
  })
    .then(res => res.text())
    .then(datas => {
      res.send(datas);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/bpost", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD",
    "Content-Type": "application/json",
    Accept: "application/json"
  });

  const baseUrl = `http://www.bpost2.be/bpostinternational/track_trace/find.php?search=s&lng=en&trackcode=${
    req.query.tracking
  }`;
  fetch(baseUrl, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/text",
      Accept: "application/text"
    }
  })
    .then(res => res.text())
    .then(datas => {
      res.send(datas);
    })
    .catch(err => {
      console.log(err);
    });
});

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
    .then(async datas => {
      if (
        datas.orders[0] &&
        datas.orders[0].contact_email === req.query.email &&
        datas.orders[0].order_number === parseInt(req.query.orderid)
      ) {
        return {
          tracking: datas.orders[0].note
            ? datas.orders[0].note.split("Tracking Number: ")[1].split("\n")[0]
            : datas.orders[0].note,
          createdAt: datas.orders[0].created_at,
          updatedAt: datas.orders[0].updated_at,
          lineItems: datas.orders[0].line_items.map(data => {
            return {
              boxes: !isNaN(data.title.charAt(0))
                ? data.title.split(" ")[0]
                : null,
              title: !isNaN(data.title.charAt(0))
                ? data.title.split("of ")[1]
                : data.title,
              quantity: data.quantity,
              grams: data.grams,
              fullfillmentStatus: data.fullfillment_status
            };
          }),
          address: {
            city: datas.orders[0].shipping_address.city,
            zip: datas.orders[0].shipping_address.zip,
            country: datas.orders[0].shipping_address.country,
            latitude: datas.orders[0].shipping_address.latitude,
            longitude: datas.orders[0].shipping_address.longitude
          }
        };
      } else {
        res.send({});
      }
    })
    .then(info => {
      res.send(info);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
