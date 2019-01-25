import "module-alias/register";
import cred from "@bgauth/auth.json";
import serviceAccount from "@bgauth/serviceAccountKey.json";
import bodyParser from "body-parser";
import express from "express";
const fs = require("fs");
const cors = require("cors");
const admin = require("firebase-admin");
import path from "path";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const app = express();
app.use(cors());
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
router.use("/osw", require("./routes/TrackingAPI/API"));
router.use("/ss", require("./routes/ShipstationAPI/API"));
router.use("/fb", require("./routes/FirebaseAPI/API"));

const staticFiles = express.static(path.join(__dirname, "../../client/build"));
app.use(staticFiles);

/*-------------------------------------------------------------------
                            WRITE TO FILE                            
---------------------------------------------------------------------*/

router.post("/writeupc", (req, res) => {
  let rawData = fs.readFileSync("../client/src/config/upc.json");
  let queue = JSON.parse(rawData);
  queue[req.body.individualUpc] = `TEMP-${req.body.individualUpc}`;
  queue[req.body.caseUpc] = `TEMP-${req.body.individualUpc}`;
  let data = JSON.stringify(queue, null, 2);
  fs.writeFile("../client/src/config/upc.json", data, err => {
    if (err) {
      res.json({
        msg: "fail"
      });
    }
    res.json({
      msg: "success"
    });
  });
});

router.post("/writeupcinfo", (req, res) => {
  let rawData = fs.readFileSync("../client/src/config/productinfo.json");
  let queue = JSON.parse(rawData);
  queue[`TEMP-${req.body.individualUpc}`] = {
    brand: `TEMP-${req.body.individualUpc}`,
    stage: "N/A",
    package: req.body.case,
    individual: 1,
    sku: `TEMP-${req.body.individualUpc}`,
    productID: 0
  };
  let data = JSON.stringify(queue, null, 2);
  const htmlEmail = `<h3> New Product Information </h3>    
        <ul>
        <li>Individual UPC: ${req.body.individualUpc}</li>
        <li>Case UPC: ${req.body.caseUpc}</li>
        <li>Package : ${req.body.case}</li>
        <li>Image:</li>
      </ul>
      <img src=${req.body.newFile} style="width: 500px; height: 500px" />`;
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
    subject: "New Product Scanned Alert",
    html: htmlEmail
  };

  transporter.sendMail(mailOptions);
  fs.writeFile("../client/src/config/productinfo.json", data, err => {
    if (err) {
      res.json({
        msg: "fail"
      });
    }
    res.json({
      msg: "success"
    });
  });
});

/*-------------------------------------------------------------------
                            EMAIL BATCH CHECKING                            
---------------------------------------------------------------------*/

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
    } else {
      res.json({ msg: "none" });
    }
  });
});

app.use(router);

// any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

app.set("port", process.env.PORT || 3001);

app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});
