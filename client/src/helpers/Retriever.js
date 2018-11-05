// 
// Retriever Helper is designed to utilize the Fetch API in 
// clean and easy to understand functions.
//
// The Fetch API is a simple interface for fetching resources. 
// Fetch makes it easier to make web requests and handle responses 
// than with the older XMLHttpRequest, which often requires additional 
// logic (for example, for handling redirects).
//

import * as config from '../config/auth';
import * as log from './Log';

function validate(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function readJSON(response) {
    return response.json();
}

function switchURL(destination) {
    switch (destination) {
        default:
            return log.error('Invalid API definition supplied to switchURL.');
        case "ss":
            return "https://ssapi.shipstation.com/"
        case "os":
            return "https://organicstart.com/api/v2/"
        case "osw":
            return "https://organic-start-wholesale.myshopify.com/"
        case "tfc":
            return "https://the-formula-club.myshopify.com/"
    }
}

function switchConfig(destination) {
    switch (destination) {
        default:
            return log.error('Invalid API definition supplied to Helpers / Retirever / switchConfig.');
        case "ss":
            return `${config.shipstation.user}:${config.shipstation.key}`
        case "os":
            return `${config.shipstation.user}:${config.shipstation.key}`
        case "osw":
            return `${config.shipstation.user}:${config.shipstation.key}`
        case "tfc":
            return `${config.shipstation.user}:${config.shipstation.key}`
    }
}

function authHeader(destination) {

    const encodedString = new Buffer(switchConfig(destination)).toString('base64');

    return {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Basic ${encodedString}`
        }
    };
}

export function fetchJSON(destination, path) {
    if (5 > destination > 0) {
        fetch(switchURL(destination) + path, authHeader(destination))
            .then(validate)
            .then(readJSON)
            .then(log.result)
            .catch(log.error);
    } else {
        log.error('Invalid API definition supplied to fetchJSON.');
    }
}