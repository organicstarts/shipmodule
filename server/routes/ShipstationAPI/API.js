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
//Get batched orders from shipistation **add more num in for loop if need to look for older batches
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

//used to get data for single orders in shipsations for packing slips
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

//get single order for osw in shipsation * note storeID
router.get("/getsingleosworder", (req, res) => {
  const baseUrl = `https://ssapi.shipstation.com/orders?orderNumber=${
    req.query.orderNumber
  }&storeId=195529`;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      let filterItems = data.orders.filter(
        x => x.orderNumber === req.query.orderNumber
      );
      return {
        orderNumber: filterItems[0].orderNumber,
        quantity: filterItems[0].items[0].quantity,
        title: filterItems[0].items[0].name,
        pcs: filterItems[0].items[0].name.split(
          /(.Pieces|.Boxes|.Tins|.pieces|.boxes|.tins)/
        )[0]
      };
    })
    .then(info => {
      res.send(info);
    })
    .catch(error => {
      res.json({ msg: error });
    });
});

//get lineitems for order
router.get("/getshipmentorder", (req, res) => {
  const baseUrl = `https://ssapi.shipstation.com/shipments?orderNumber=${
    req.query.orderNumber
  }&includeShipmentItems=true&storeId=${req.query.storeId}`;
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
// all metrics route are used to take insight data from shipstation (not provided in current API)
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

//used to bypass shipsation to get access to insight datas for analytics. **change cookie if analytics stop working in braniac
router.post("/gettoken", (req, res) => {
  const baseUrl = "https://ss5.shipstation.com/api/auth/GetToken";

  fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      cookie:
        "_ga=GA1.2.1918095190.1541453017; __zlcmid=pEhloUrzHbHan8; SSVersion=ss5.shipstation.com; .LL=1; ajs_group_id=298993; __lc.visitor_id.2820662=S1541539220.6ce100aa97; _vwo_uuid_v2=D47DBB4BED49583A719D64B2FCDEE6F14|5ed4475233db228d4d2c23287fb333d6; _vwo_uuid=D47DBB4BED49583A719D64B2FCDEE6F14; __qca=P0-1082168995-1541603312437; hubspotutk=40f9bbc7eff9ee8b975f3ae13ded26ad; lc_sso2820662=1543606728002; home_country=US; _delighted_fst=1553188257591:{}; __utma=155387769.1918095190.1541453017.1554993475.1556029396.9; __utmz=155387769.1556029396.9.9.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _gcl_au=1.1.1891736993.1557757460; referrer=https%3A%2F%2Fwww.google.com%2F; __zlcprivacy=1; _delighted_lst=1560356237000:{%22token%22:%22yVnWlBcsKjo2XtOQFiimUQL2%22}; ajs_user_id=%2266cb2a81-e6fa-4288-a2c0-eae297165e74%22; ajs_anonymous_id=%22a6227d05-b0ae-4864-8574-3afbd9651ae8%22; _gid=GA1.2.2032070966.1562596368; _vis_opt_s=10%7C; _vis_opt_test_cookie=1; __hssrc=1; connect.sess=s%3Aj%3A%7B%7D.%2BYbyNtZWCOz85yePRiqV2GT0nMu7POfmW1bp7vtSLJ4; uct=yvan=v6FD%2brF%2bNJqqZRne6deR8RODc0%2bhjtM92%2fm80oS0B4x7IlVzZXJuYW1lIjoieXZhbiIsIkNyZWF0ZWRBdFV0Y1VuaXgiOjE1NjI2ODQ5OTh9; initial%3Alogin=true; SSHome=ss5.shipstation.com; ssNPS=true; _vwo_sn=1636428%3A1; _vwo_ds=3%3Aa_0%2Ct_0%3A0%241561051343%3A80.12364843%3A%3A13_0%2C12_0%2C11_0%2C10_0%3A6_0%2C5_0%3A0; _gat_UA-25912405-1=1; __hstc=13459048.40f9bbc7eff9ee8b975f3ae13ded26ad.1561051346004.1562684990575.1562687773659.14; __hssc=13459048.1.1562687773659; no-mobile-prompt=1"
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
