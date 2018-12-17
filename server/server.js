import "module-alias/register";
import cred from "@bgauth/auth.json";
import serviceAccount from "@bgauth/serviceAccountKey.json";
import bodyParser from "body-parser";
import express from "express";
const admin = require("firebase-admin");
import path from "path";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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

router.post("/writeinventorytofile", (req, res) => {
  let dataRef = admin.database().ref("/inventory");

  dataRef
    .once("value", snap => {
      let logInventory = {
        trackingNumber: req.body.trackingNumber,
        brand: req.body.brand,
        stage: req.body.stage,
        quantity: req.body.quantity,
        broken: req.body.broken,
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

router.post("/batchcheckemail", (req, res) => {
  let dataRef = admin.database().ref("/action/log");
  dataRef.once("value", snapshot => {
    const payload = snapshot.val();
    const result = Object.keys(payload)
      .map(key => payload[key])
      .reverse();
    let i = 0;
    let batchToCheck = [];

    result.map(data => {
      if (i > 3) return batchToCheck;
      if (
        data.batch !== req.body.batchNumber &&
        data.action === "Generate Batch"
      ) {
        data.check = false;
        batchToCheck.push(data);
        i++;
      }
    });
    for (let i in batchToCheck) {
      for (let j in result) {
        if (
          batchToCheck[i].batch === result[j].batch &&
          result[j].action === "Print"
        ) {
          batchToCheck[i].check = true;
        }
      }
    }
    let sendEmail = batchToCheck.filter(x => x.check === false);
    if (sendEmail.length > 0) {
      const htmlEmail = sendEmail.reduce((a, send) => {
        return (
          a +
          `<h3> Batch Information </h3>    
            <ul>
            <li>Batch: ${send.batch}</li>
            <li>Date: ${send.date}</li>
            <li>User: ${send.user}</li>
            <li>Picker: ${send.picker}</li>
            <li>Shipper: ${send.shipper}</li>
          </ul>`
        );
      }, "");

      let transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          host: "smtp.gmail.email",
          auth: {
            user: cred.emailcred.user,
            pass: cred.emailcred.key
          }
        })
      );

      let mailOptions = {
        from: "yvan@organicstart.com",
        to: "yvan@organicstart.com",
        subject: "Print Alert",
        html: htmlEmail
      };

      transporter.sendMail(mailOptions, err => {
        if (err) {
          res.json({
            msg: "fail"
          });
        } else {
          res.json({
            msg: "success"
          });
        }
      });
    }
  });
});

/*
update boolean -> checked [true/false] in firebase  when the user ticks the checkbox in FraudDetails 
*/
router.put("/fraud/updatefraudtofile", (req, res) => {
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
          shippingInfo: req.body.saved[i].shippingInfo
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

app.use(router);

// any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});
