import bodyParser from "body-parser";
import express from "express";
const admin = require("firebase-admin");
import path from "path";
const fs = require("fs");
const app = express();

let rawData = fs.readFileSync("./serviceAccountKey.json");
let serviceAccount = JSON.parse(rawData);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shipmodule.firebaseio.com"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();

router.use("/os", require("./routes/BigCommerceAPI/API"));

const staticFiles = express.static(path.join(__dirname, "../../client/build"));
app.use(staticFiles);

/*
update boolean -> checked [true/false] in firebase  when the user ticks the checkbox in FraudDetails 
*/
router.put("/fraud/updatefraudtofile", (req, res) => {
  let dataRef = admin.database().ref("/fraud/log/0");
  dataRef
    .once("value", snap => {
      snap.forEach(childSnap => {
        if (req.body.orderNumber === childSnap.val().id) {
          childSnap.ref.update({ checked: req.body.checked });
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
router.post("/fraud/writefraudtofile", (req, res) => {
  let queue = [];
  let saveUser = {};
  for (let i in req.body.saved) {
    saveUser = {
      id: req.body.saved[i].id,
      checked: req.body.saved[i].checked ? req.body.saved[i].checked : false,
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
      shippingInfo: req.body.saved[i].shippingInfo
    };
    if (queue.length > 500) {
      queue.pop();
    }
    queue.push(saveUser);
  }

  let datas = [];
  let dataRef = admin.database().ref(`/fraud`);

  dataRef
    .once("value", snap => {
      datas.push(queue);
      dataRef.child("log").set(datas);
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

app.use(router);

// any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});
