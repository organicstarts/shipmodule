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

/*-------------------------------------------------------------------
                            GET REQUESTS                            
---------------------------------------------------------------------*/
router.get("/getbatch", (req, res) => {
  const baseUrl = `https://ssapi.shipstation.com/shipments?sortDir=DESC&page=1&pageSize=500&includeShipmentItems=true`;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(datas => {
      return datas.shipments.filter(data => {
        return data.batchNumber === req.query.batchNumber;
      });
    })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.json({ msg: error });
    });
});

router.get("/getshipmentorder", (req, res) => {
  const baseUrl = `https://ssapi.shipstation.com/shipments?orderNumber=${
    req.query.orderNumber
  }&includeShipmentItems=true`;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      res.send(data.shipments);
    })
    .catch(error => {
      res.json({ msg: error });
    });
});

/*-------------------------------------------------------------------
                            POST REQUESTS                            
---------------------------------------------------------------------*/
// router.post("/signin", (req, res) => {
//   baseUrl = "https://ss5.shipstation.com/api/auth/GetToken";

//   fetch(baseUrl, header).then( res => { })
// });

router.post("/cancelorder", (req, res) => {
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
      if (e.orders[0].customerEmail === req.body.email) {
        console.log(e.orders[0].orderId);
        await fetch(`https://ssapi.shipstation.com/orders/createorder`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${encodedString}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            advancedOptions: { storeId: 135943 },
            orderNumber: e.orders[0].orderNumber,
            orderKey: e.orders[0].orderKey,
            orderDate: e.orders[0].orderDate,
            orderStatus: "cancelled",
            billTo: e.orders[0].billTo,
            shipTo: e.orders[0].shipTo
          })
        })
          .then(e => e.json())
          .then(x => console.log(x));
      }
    })
    .then(e => {
      res.json({ msg: "success" });
    })
    .catch(err => {
      res.json({ msg: "fail" });
    });
});

module.exports = router;
