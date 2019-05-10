import "module-alias/register";
const router = require("express").Router();
const fetch = require("node-fetch");
import shipstation from "@bgauth/auth.json";
const username = shipstation.shipstation.user;
const password = shipstation.shipstation.key;
const usernameInsight = shipstation.shipstation.iUser;
const passwordInsight = shipstation.shipstation.iPass;
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
router.get("/getbatch", async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  let resData = [];
  let all = [];

  for (let i = 1; i < 4; i++) {
    resData = await getPageOrders(i);
    all.push(resData);
  }
  let merge = [].concat.apply([], all);
  res.send(merge);

  function getPageOrders(page) {
    const baseUrl = `https://ssapi.shipstation.com/shipments?sortDir=DESC&page=${page}&pageSize=500&includeShipmentItems=true`;
    return fetch(baseUrl, header)
      .then(res => res.json())
      .then(datas => {
        return datas.shipments.filter(data => {
          return data.batchNumber === req.query.batchNumber;
        });
      })
      .catch(error => {
        res.json({ msg: error });
      });
  }
});

router.get("/getsingleorder", (req, res) => {
  const baseUrl = `https://ssapi.shipstation.com/orders/${req.query.orderId}`;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      let couponFilter = data.items.filter(item =>
        item.lineItemKey.includes("discount")
      );

      if (couponFilter[0]) {
        couponFilter[0].discount = Math.abs(couponFilter[0].unitPrice);
        couponFilter[0].code = couponFilter[0].name;
      }

      let sendRes = {
        coupon: couponFilter[0] ? couponFilter : [],
        shippingAmount: data.shippingAmount ? data.shippingAmount : 0
      };
      res.send(sendRes);
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

router.post("/getshipmentmetrics", (req, res) => {
  const baseUrl = `https://ss5.shipstation.com/api/charts/shipmentmetrics?startDate=${
    req.body.startDate
  }&endDate=${req.body.endDate}`;

  fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization-Token": req.body.token
    }
  })
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.json({ msg: error });
    });
});

router.post("/getordermetrics", (req, res) => {
  const baseUrl = `https://ss5.shipstation.com/api/charts/ordermetrics?startDate=${
    req.body.startDate
  }&endDate=${req.body.endDate}`;

  fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization-Token": req.body.token
    }
  })
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.json({ msg: error });
    });
});

router.post("/getcustomermetrics", (req, res) => {
  const baseUrl = `https://ss5.shipstation.com/api/charts/customermetrics?startDate=${
    req.body.startDate
  }&endDate=${req.body.endDate}`;

  fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization-Token": req.body.token
    }
  })
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.json({ msg: error });
    });
});

router.post("/getproductmetrics", (req, res) => {
  const baseUrl = `https://ss5.shipstation.com/api/charts/productmetrics?startDate=${
    req.body.startDate
  }&endDate=${req.body.endDate}`;

  fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization-Token": req.body.token
    }
  })
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.json({ msg: error });
    });
});

router.post("/gettoken", (req, res) => {
  const baseUrl = "https://ss5.shipstation.com/api/auth/GetToken";

  fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: usernameInsight,
      password: passwordInsight
    })
  })
    .then(res => res.json())
    .then(data => {
      res.send(data.token);
    })
    .catch(error => {
      res.json({ msg: error });
    });
});

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
      if (req.body.noEmail || e.orders[0].customerEmail === req.body.email) {
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
        });
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
