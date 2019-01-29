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

/*-------------------------------------------------------------------
                            DELETE REQUESTS                            
---------------------------------------------------------------------*/

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
