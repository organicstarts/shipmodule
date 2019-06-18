import "module-alias/register";
const router = require("express").Router();
const fetch = require("node-fetch");
import bigCommerce from "@bgauth/auth.json";
import pInfo from "@bgauth/productInfo";
const moment = require("moment");
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
    // secureOptions: "constants.SSL_OP_NO_TLSv1_2"
  }
};

/*-------------------------------------------------------------------
                            GET REQUESTS                            
---------------------------------------------------------------------*/

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

router.get("/getallorders", async (req, res) => {
  //build api URL with user all order, if  order# exist set as min

  console.log(req.query.min);

  let resData = [];
  let all = [];

  for (let i = 1; i < 5; i++) {
    resData = await getPageOrders(i);
    all.push(resData);
    console.log(i);
  }
  let merge = [].concat.apply([], all);

  res.send(merge);

  function getPageOrders(page) {
    const baseUrl = `https://organicstart.com/api/v2/orders?limit=250&sort=id:desc${
      req.query.min > 0 ? `&min_id=${req.query.min}` : ""
    }&page=${page}`;
    return fetch(baseUrl, header)
      .then(res => res.json())
      .then(data => data)
      .catch(error => {
        console.log(error);
        return [];
      });
  }
});

router.get("/getshipping", async (req, res) => {
  //build api URL with user orderid to get shipping info
  const baseUrl = `https://organicstart.com/api/v2/orders/${
    req.query.orderid
  }/shippingaddresses`;

  await fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.send(null);
    });
});

router.get("/getordercount", async (req, res) => {
  //build api URL with user customerid to get history on purchase count
  const baseUrl = `https://organicstart.com/api/v2/orders?customer_id=${
    req.query.customerid
  }&limit=5`;

  await fetch(baseUrl, header)
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

router.get("/getcategories", async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });
  let resData = [];
  let all = [];

  for (let i = 1; i < 4; i++) {
    resData = await getAllproducts(i, 250);
    all.push(resData);
  }
  res.send(all);
});

function getAllproducts(page, limit) {
  const baseUrl = `https://organicstart.com/api/v2/products?page=${page}&limit=${limit}`;

  return fetch(baseUrl, header)
    .then(res => res.json())
    .then(datas => {
      const result = [];
      datas.map(data => {
        result.push({
          id: data.id,
          name: data.name,
          calculated_price: data.calculated_price,
          inventory_level: data.inventory_level,
          custom_url: data.custom_url,
          categories: data.categories,
          primary_image: data.primary_image,
          is_visible: data.is_visible,
          sku: data.sku,
          inventory_tracking: data.inventory_tracking
        });
      });
      return result;
    });
}

router.get("/getbrand", (req, res) => {
  //build api URL with user ordernumber to see if order had coupons used
  const baseUrl = req.query.brandUrl;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send("");
    });
});

router.get("/getinventorylevel", (req, res) => {
  //build api URL with user ordernumber to see if order had coupons used
  const baseUrl = `https://organicstart.com/api/v2/products/${
    req.query.productid
  }`;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send("");
    });
});

/*-------------------------------------------------------------------
                            POST REQUESTS                            
---------------------------------------------------------------------*/
router.post("/deductbundletosingle", (req, res) => {
  //build api URL with user ordernumber to see if order had coupons used
  const baseUrl = `https://brainiac.organicstart.com/os/updateinventory`;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });
  Promise.all(
    req.body.line_items.map(async data => {
      await fetch(baseUrl, {
        method: "PUT",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Basic ${encodedString}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          inventory_level: 0 - data.quantity,
          productID: pInfo[data.sku].productID
        })
      });
    })
  ).then(x => res.json({ msg: "success" })).catch(x => res.json({msg: "fail"}))
});

/*-------------------------------------------------------------------
                            PUT REQUESTS                            
---------------------------------------------------------------------*/

router.put("/updateinventory", (req, res) => {
  const baseUrl = `https://organicstart.com/api/v2/products/${
    req.body.productID
  }`;
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });

  if (req.body.noEquation) {
    let total = parseInt(req.body.inventory_level);
    fetch(baseUrl, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Basic ${encodedString}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        inventory_level: total
      })
    })
      .then(e => {
        res.json({ msg: "success" });
      })
      .catch(err => {
        res.json({ msg: "fail" });
      });
  } else {
    fetch(baseUrl, header)
      .then(res => res.json())
      .then(data => {
        let total = parseInt(data.inventory_level + req.body.inventory_level);
        if (total < 0) {
          total = 0;
        }
        fetch(baseUrl, {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Basic ${encodedString}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            inventory_level: total
          })
        })
          .then(e => {
            res.json({ msg: "success" });
          })
          .catch(err => {
            res.json({ msg: "fail" });
          });
      });
  }
});

router.put("/disableproduct", (req, res) => {
  const baseUrl = `https://organicstart.com/api/v2/products/${
    req.body.productID
  }`;

  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD"
  });
  fetch(baseUrl, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Basic ${encodedString}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      inventory_tracking: req.body.tracking,
      inventory_level: req.body.inventory_level
    })
  })
    .then(e => {
      res.json({ msg: "success" });
    })
    .catch(err => {
      res.json({ msg: "fail" });
    });
});

router.put("/cancelorder", (req, res) => {
  const baseUrl = `https://organicstart.com/api/v2/orders/${
    req.body.ordernumber
  }`;

  let date = moment().format("YYYY-MM-DDThh:mm:ssZ");
  let cancelMsg = req.body.message + " - " + date;
  fetch(baseUrl, header)
    .then(res => res.json())
    .then(data => {
      if (req.body.noEmail || data.billing_address.email === req.body.email) {
        fetch(baseUrl, {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Basic ${encodedString}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            status_id: 5,
            customer_message: cancelMsg
          })
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
