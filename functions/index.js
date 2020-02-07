// require('dotenv').config();

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
// const basicAuth = require('express-basic-auth');
const fetch = require("node-fetch");

function send(res, code, data) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(code).json(data);
}

function error(res, e) {
    console.error(e);
    send(res, 500, {
        error: `Internal Server Error. Please try again and contact support@organicstart.com if the error persists.`,
    });
}

const wholesale = express();
wholesale.use(cors({ origin: true }));
// wholesale.use(basicAuth({
//     users: { 
//         'elena': 'supersecret' 
//     }
// }));

function bpost(tracking) {
    const baseUrl = `http://www.bpost2.be/bpostinternational/track_trace/find.php?search=s&lng=en&trackcode=${tracking}`;
    const parser = require('fast-xml-parser');
    const he = require('he');
    const options = {
        attributeNamePrefix : "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName : "#text",
        ignoreAttributes : true,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"]
    };
    return fetch(baseUrl)
    .then(res => res.text())
    .then(data => {
        var jsonObj = parser.validate(data) === true && parser.parse(data, options);
        var tObj = parser.getTraversalObj(data, options);
        jsonObj = parser.convertToJson(tObj, options);
        return (jsonObj && jsonObj.parcels) && jsonObj.parcels.parcel;
    });
}

wholesale.get('/bpost', async (req, res) => {
    bpost(req.query.tracking)
    .then(data => send(res, 200, data))
    .catch(e => error(res, e));
});

function eaUpdate() {
    const Shopify = require('shopify-api-node');
    const shopify = new Shopify({
        shopName:   'organic-start-wholesale',
        apiKey:     functions.config().shopify.key,
        password:   functions.config().shopify.pass
    });

    return shopify.order
    .list({ limit: 100 })
    .then(orders => orders.map(order => (order.fulfillments && order.fulfillments.length) ? order : false))
    .then(orders => orders.filter((x) => x !== false))
    .then(orders => {
        var i = 0;
        const promises = [];
        orders && orders.map(order => {
            order.fulfillments.map(fulfillment => {
                if(fulfillment.tracking_number && fulfillment.tracking_number.length > 20) {
                    promises[i] = new Promise((resolve, reject) => {
                        bpost(fulfillment.tracking_number)
                        .then(bpost => {
                            if(bpost && bpost.relabelBarcode) {
                                shopify
                                .order.update(order.id, {
                                    note: `Carrier: Other\nTracking Number: ${fulfillment.tracking_number}\n`
                                })
                                .then(data => {
                                    var config = {
                                        notify_customer: true,
                                        tracking_number: bpost.relabelBarcode
                                    };
                                    if(data.shipping_address.country === 'United States') {
                                        config = { 
                                            ...config, 
                                            tracking_company: 'USPS' 
                                        };
                                    } else if(data.shipping_address.country === 'Canada') {
                                        config = { 
                                            ...config, 
                                            tracking_company: 'Canada Post' 
                                        };
                                    } else {
                                        config = { 
                                            ...config, 
                                            tracking_company: 'Use your local carrier',
                                            tracking_url: `https://t.17track.net/en#nums=${bpost.relabelBarcode}`
                                        };
                                    }
                
                                    shopify
                                    .fulfillment.update(order.id, fulfillment.id, config)
                                    .then(data => {
                                        resolve(data.name);
                                    })
                                    .catch(e => reject(e));
                                })
                                .catch(e => reject(e));
                            }
                        })
                        .catch(e => reject(e));
                    });
                    i++;
                }
            });
        });
        return promises
    }).then(async promises => {
        return await Promise.all(promises)
    });
}

wholesale.post('/eaupdate', async (req, res) => {
    await eaUpdate().then(orders => send(res, 200, orders)).catch(e => error(res, e));
});

exports.wholesale = functions.https.onRequest(wholesale);

exports.eaupdate = functions.pubsub.schedule('every 6 hours').onRun(async (context) => {
    await eaUpdate().then(orders => console.log(orders)).catch(e => console.error(e));
});