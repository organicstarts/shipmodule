import "module-alias/register";
const admin = require("firebase-admin");
const router = require("express").Router();

/*-------------------------------------------------------------------
                            POST REQUESTS                            
---------------------------------------------------------------------*/
/*
save inbound products to inventory log
 */
router.post("/writeinventorytofile", (req, res) => {
  let dataRef = admin.database().ref("/inventory");

  dataRef
    .once("value", snap => {
      let logInventory = {
        trackingNumber: req.body.trackingNumber,
        carrier: req.body.carrier,
        productID: req.body.productID,
        sku: req.body.sku,
        isChecked: false,
        brand: req.body.brand,
        stage: req.body.stage,
        quantity: req.body.quantity,
        broken: req.body.broken,
        invoiceNum: req.body.invoiceNum,
        total: req.body.total,
        scanner: req.body.scanner,
        warehouseLocation: req.body.warehouseLocation,
        timeStamp: req.body.timeStamp
      };
      dataRef.child("log").push(logInventory);
    })
    .then(x => {
      res.json({
        msg: "success"
      });
    })
    .catch(e => {
      res.json({
        msg: "fail"
      });
    });
});

/*
save inbound products to inventory archive
 */
router.post("/archiveinventory", async (req, res) => {
  let dataRef = admin.database().ref("/inventory");

  dataRef
    .once("value", snap => {
      let logInventory = {
        trackingNumber: req.body.trackingNumber,
        carrier: req.body.carrier,
        productID: req.body.productID,
        sku: req.body.sku,
        isChecked: req.body.isChecked,
        brand: req.body.brand,
        stage: req.body.stage,
        quantity: req.body.quantity,
        broken: req.body.broken,
        invoiceNum: req.body.invoiceNum,
        total: req.body.total,
        scanner: req.body.scanner,
        warehouseLocation: req.body.warehouseLocation,
        timeStamp: req.body.timeStamp
      };
      dataRef.child("archive").push(logInventory);
    })
    .then(x => {
      res.json({
        msg: "success"
      });
    })
    .catch(e => {
      res.json({
        msg: "fail"
      });
    });
});

/*
log all the actions user does in the app (clicking, printing, completing fraud status)
*/
router.post("/writetofile", (req, res) => {
  let dataRef = admin.database().ref(`/action`);

  dataRef
    .once("value", snap => {
      let logUser = {
        action: req.body.action,
        order: req.body.orderNumber ? req.body.orderNumber : "N/A",
        batch: req.body.batchNumber ? req.body.batchNumber : "N/A",
        user: req.body.user ? req.body.user : "N/A",
        picker: req.body.picker ? req.body.picker : "N/A",
        shipper: req.body.shipper ? req.body.shipper : "N/A",
        date: req.body.currentTime
      };
      dataRef.child("log").push(logUser);
    })
    .then(x => {
      res.json({
        msg: "success"
      });
    })
    .catch(e => {
      res.json({
        msg: "fail"
      });
    });
});

/*
save proccesssed BigCommerce API request of orders that are possibly fraudulent
*/
router.post("/writefraudtofile", (req, res) => {
  let saveUser = {};
  let dataRef = admin.database().ref(`/fraud`);

  dataRef
    .once("value", snap => {
      for (let i in req.body.saved) {
        saveUser = {
          id: req.body.saved[i].id,
          checked: req.body.saved[i].checked
            ? req.body.saved[i].checked
            : false,
          status: req.body.saved[i].status,
          orderCount: req.body.saved[i].orderCount,
          billing_address: {
            email: req.body.saved[i].billing_address.email,
            first_name: req.body.saved[i].billing_address.first_name,
            last_name: req.body.saved[i].billing_address.last_name,
            street_1: req.body.saved[i].billing_address.street_1,
            street_2: req.body.saved[i].billing_address.street_2,
            city: req.body.saved[i].billing_address.city,
            state: req.body.saved[i].billing_address.state,
            zip: req.body.saved[i].billing_address.zip,
            company: req.body.saved[i].billing_address.company,
            country: req.body.saved[i].billing_address.country,
            phone: req.body.saved[i].billing_address.phone
          },
          shippingInfo: req.body.saved[i].shippingInfo,
          timeStamp: req.body.saved[i].timeStamp,
          createdAt: req.body.saved[i].date_created
        };
        dataRef.push(saveUser);
      }
    })
    .then(x => {
      res.json({
        msg: "success"
      });
    })
    .catch(e => {
      res.json({
        msg: "fail"
      });
    });
});

router.post("/batchinfo", (req, res) => {
  let dataRef = admin.database().ref("/batchinfo");
  let payload = [{ batch: req.body.batch, products: req.body.products }];
  dataRef
    .once("value", snap => {
      if (snap.numChildren() > 2) {
        const val = snap.val();
        const result = Object.keys(val)
          .map(key => val[key])
          .reverse();
        payload = payload.concat(result);
        dataRef.remove();
      }
    })
    .then(x => {
      if (payload.length <= 1) {
        dataRef.push(payload).then(x => {
          res.status(200).send({ msg: "success" });
        });
      } else {
        for (let i = 0; i < 2; i++) {
          dataRef.push(payload[i]);
        }
        res.status(200).send({ msg: "success" });
      }
    })
    .catch(e => {
      res.status(400).send({ msg: "fail" });
    });
});

/*-------------------------------------------------------------------
                            PUT REQUESTS                            
---------------------------------------------------------------------*/

/*
update boolean -> checked [true/false] in firebase  when the user ticks the checkbox in FraudDetails 
*/
router.put("/updatefraudtofile", (req, res) => {
  let dataRef = admin.database().ref("/fraud");
  dataRef
    .orderByKey()
    .once("value", snap => {
      const payload = snap.val();

      Object.keys(payload).map(key => {
        if (req.body.orderNumber === payload[key].id) {
          dataRef.child(key).update({ checked: req.body.checked });
        }
      });
    })
    .then(x => {
      res.json({
        msg: "success"
      });
    })
    .catch(e => {
      res.json({
        msg: "fail"
      });
    });
});

/*
update firebase eastcoast/westcoast inventory
*/
router.put("/updateinventory", (req, res) => {
  let dataRef = admin.database().ref(`/inventory/${req.body.dbname}`);
  dataRef
    .once("value", snap => snap.val())
    .then(async x => {
      if (
        (req.body.dbname === "eastcoastOB" ||
          req.body.dbname === "westcoastOB") &&
        req.body.noEquation
      ) {
        await dataRef.child(req.body.sku).update({ total: req.body.total });
      } else if (
        (req.body.dbname === "eastcoastOB" ||
          req.body.dbname === "westcoastOB") &&
        !req.body.noEquation
      ) {
        let tempTotal = x.val()[req.body.sku].total + req.body.quantity;
        if (tempTotal < 0) {
          tempTotal = 0;
        }
        await dataRef.child(req.body.sku).update({ total: tempTotal });
      } else if (
        (req.body.dbname === "eastcoast" || req.body.dbname === "westcoast") &&
        req.body.noEquation
      ) {
        await dataRef.child(req.body.sku).update({ total: req.body.total });
      } else if (
        (req.body.dbname === "eastcoast" || req.body.dbname === "westcoast") &&
        !req.body.noEquation
      ) {
        if (req.body.broken !== 0 && req.body.obsku) {
          let tempTotal = x.val()[req.body.obsku].total + req.body.broken;
          if (tempTotal < 0) {
            tempTotal = 0;
          }
          await dataRef.child(req.body.obsku).update({ total: tempTotal });
        }
        let tempTotal = x.val()[req.body.sku].total + req.body.quantity;
        if (tempTotal < 0) {
          tempTotal = 0;
        }
        await dataRef.child(req.body.sku).update({ total: tempTotal });
      } else if (
        req.body.dbname === "eastcoastReport" ||
        req.body.dbname === "westcoastReport"
      ) {
        await dataRef.child(req.body.sku).update({
          total: req.body.total,
          brand: req.body.brand,
          stage: req.body.stage ? req.body.stage : "",
          user: req.body.user,
          date: req.body.date
        });
      }
    })
    .catch(error => {
      res.json(error);
    });
  res.json({
    msg: "success"
  });
});

/*-------------------------------------------------------------------
                            DELETE REQUESTS                            
---------------------------------------------------------------------*/
router.delete("/deleteinventory", (req, res) => {
  let dataRef = admin
    .database()
    .ref(`/inventory/${req.body.db}/${req.body.id}`);

  dataRef
    .remove()
    .then(() => {
      res.json({
        msg: "success"
      });
    })
    .catch(error => {
      console.log("Remove failed: " + error.message);
      res.json({ msg: "failed" });
    });
});

module.exports = router;
