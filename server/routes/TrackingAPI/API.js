import "module-alias/register";
const router = require("express").Router();
const fetch = require("node-fetch");
import tracking from "@bgauth/auth.json";
const username = tracking.shopify.user;
const password = tracking.shopify.key;
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
//Take canada tracking number and send res result from canada post
router.get("/canadapost", (req, res) => {
  const baseUrl = `https://soa-gw.canadapost.ca/vis/track/pin/${
    req.query.tracking
  }/detail`;
  let encodedString = Buffer.from(
    tracking.canadaPost.user + ":" + tracking.canadaPost.key
  ).toString("base64");

  fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "application/vnd.cpc.track+xml",
      Authorization: `Basic ${encodedString}`,
      "Accept-language": "en-CA"
    }
  })
    .then(res => res.text())
    .then(data => res.send(data))
    .catch(err => {
      console.log(err);
    });
});

//Take USPS EA number and send res tracking results
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

//Take Bpost 300.... tracking and res tracking result
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

//Get all orders based on max data + limit 250 orders per search from shopify wholesale. res tracking num, shipping, order item, fulfillment status
router.get("/getallorders", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD",
    "Content-Type": "application/json",
    Accept: "application/json"
  });
  const baseUrl = `https://${username}:${password}@organic-start-wholesale.myshopify.com/admin/orders.json?limit=250&created_at_max=${
    req.query.endTime
  }`;

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      let retrieveData = [];
      data.orders.map(data => {
        // let trackingObj = {};
        // console.log(data.fulfillment_status)
        if (
          (data.fulfillment_status === "partial" ||
            data.fulfillment_status === "fulfilled") &&
          data.shipping_lines[0]
        ) {
          let trackingData = data.fulfillments.filter(
            data => data.tracking_number.charAt(0) === "3"
          );

          // if (data.note && data.financial_status === "paid") {
          //   let carrier = data.note
          //     .split("\n")
          //     .filter(carrier => carrier.includes("Carrier"));
          //   let trackingNum = data.note
          //     .split("\n")
          //     .filter(tracking => tracking.includes("Tracking Number"));

          //   carrier.map((carrier, i) => {
          //     carrier = carrier.split(": ")[1];
          //     trackingNum[i] = trackingNum[i].split(": ")[1];
          //     trackingObj[carrier] = trackingNum[i];
          //   });
          // } else {
          //   trackingObj = null;
          // }
          if (trackingData.length > 0) {
            retrieveData.push({
              created_at: data.created_at,
              orderNum: data.name,
              fulfillmentId: trackingData[0].id,
              tracking: trackingData[0].tracking_number,
              id: data.id,
              lineItems: data.line_items,
              shippingMethod: data.shipping_lines[0].code,
              countryCode: data.shipping_address.country_code,
              note: data.note ? data.note : null
            });
          }
        }
      });
      return retrieveData;
    })
    .then(parsedData => {
      res.send(parsedData);
    })
    .catch(err => {
      console.log(err);
    });
});

//Get single order from shopify from shopify wholesale. res tracking num, shipping, order item, fulfillment status
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
      let isAuth;
      if (req.query.inHouse) {
        isAuth = true;
      } else {
        isAuth =
          datas.orders[0].contact_email === req.query.email ? true : false;
      }
      if (
        datas.orders[0] &&
        isAuth &&
        datas.orders[0].order_number === parseInt(req.query.orderid)
      ) {
        let trackingObj = {};
        if (datas.orders[0].note) {
          let carrier = datas.orders[0].note
            .split("\n")
            .filter(carrier => carrier.includes("Carrier"));
          let trackingNum = datas.orders[0].note
            .split("\n")
            .filter(tracking => tracking.includes("Tracking Number"));

          carrier.map((carrier, i) => {
            carrier = carrier.split(": ")[1];
            trackingNum[i] = trackingNum[i].split(": ")[1];
            trackingObj[carrier] = trackingNum[i];
          });
        } else {
          trackingObj = null;
        }
        return {
          tracking:
            // datas.orders[0].note
            //   ? datas.orders[0].note.split("Tracking Number: ")[1].split("\n")[0]
            //   : datas.orders[0].note,
            trackingObj,
          id: datas.orders[0].id,
          createdAt: datas.orders[0].created_at,
          updatedAt: datas.orders[0].updated_at,
          lineItems: datas.orders[0].line_items.map(data => {
            return {
              id: data.id,
              boxes: !isNaN(data.title.charAt(0))
                ? data.title.split(" ")[0]
                : null,
              title: !isNaN(data.title.charAt(0))
                ? data.title.split("of ")[1]
                : data.title,
              quantity: data.quantity,
              grams: data.grams,
              fulfillmentStatus: data.fulfillment_status,
              fulfillmentService: data.fulfillment_service
            };
          }),
          address: {
            city: datas.orders[0].shipping_address.city,
            zip: datas.orders[0].shipping_address.zip,
            state: datas.orders[0].shipping_address.province,
            stateCode: datas.orders[0].shipping_address.province_code,
            country: datas.orders[0].shipping_address.country,
            latitude: datas.orders[0].shipping_address.latitude,
            longitude: datas.orders[0].shipping_address.longitude
          },
          shippingMethod: datas.orders[0].shipping_lines[0].code
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

/*-------------------------------------------------------------------
                            PUT REQUESTS                            
---------------------------------------------------------------------*/
//Save bpost fulfilled tracking num to NOTES in customer order detail. for use in track-your-order page
router.put("/savenote", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD",
    "Content-Type": "application/json",
    Accept: "application/json"
  });
  const baseUrl = `https://${username}:${password}@organic-start-wholesale.myshopify.com/admin/orders/${
    req.body.orderId
  }.json`;

  fetch(baseUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      order: {
        id: req.body.orderId,
        note: `Carrier: Other\nTracking Number: ${req.body.bpostTracking}\n`
      }
    })
  })
    .then(result => result.json())
    .then(resjson => res.send(resjson))
    .catch(err => {
      console.log(err);
    });
});

//fulfill orders. if EA number exists. replace bpost number with EA number and notify customer
router.put("/fulfillment", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD",
    "Content-Type": "application/json",
    Accept: "application/json"
  });
  const baseUrl = `https://${username}:${password}@organic-start-wholesale.myshopify.com/admin/orders/${
    req.body.orderId
  }/fulfillments/${req.body.fulfillmentId}.json`;

  fetch(baseUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      fulfillment: {
        id: req.body.fulfillmentId,
        location_id: req.body.locationId,
        tracking_number: req.body.tracking,
        tracking_url: `https://track24.net/?code=${req.body.tracking}`,
        tracking_company: 'Check with Your Local Carrier', //req.body.trackingCompany,
        line_items: [
          {
            id: req.body.lineItemId
          }
        ],
        notify_customer: req.body.notifyCustomer
      }
    })
  })
    .then(result => result.json())
    .then(resjson => res.send(resjson))
    .catch(err => {
      console.log(err);
    });
});

//cancel OSW order
router.post("/cancelosworder", (req, res) => {
  const baseUrl = `https://${username}:${password}@organic-start-wholesale.myshopify.com/admin/orders/${
    req.body.ordernumber
  }/cancel.json`;
  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      if (req.body.noEmail || data.billing_address.email === req.body.email) {
        fetch(baseUrl, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Basic ${encodedString}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          }
          // ,
          // body: JSON.stringify({
          //   status_id: 5,
          //   customer_message: req.body.message
          // })
        })
          .then(e => {
            res.json({ msg: "success" });
          })
          .catch(err => {
            res.json({ msg: "fail" });
          });
      } else {
        res.json({ msg: "invalid" });
      }
    });
});

module.exports = router;
