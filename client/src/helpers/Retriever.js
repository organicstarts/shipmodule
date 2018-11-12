//
// Retriever Helper is designed to utilize the Fetch API in
// clean and easy to understand functions.
//
// The Fetch API is a simple interface for fetching resources.
// Fetch makes it easier to make web requests and handle responses
// than with the older XMLHttpRequest, which often requires additional
// logic (for example, for handling redirects).
//
import axios from "axios";
import * as config from "../config/auth";
import * as log from "./Log";

function switchURL(destination) {
  switch (destination) {
    default:
      return log.error("Invalid API definition supplied to switchURL.");
    case "ss":
      return "https://ssapi.shipstation.com/";
    case "os":
      return "https://organicstart.com/api/v2/";
    case "osw":
      return "https://organic-start-wholesale.myshopify.com/";
    case "tfc":
      return "https://the-formula-club.myshopify.com/";
  }
}

function switchConfig(destination) {
  switch (destination) {
    default:
      return log.error(
        "Invalid API definition supplied to Helpers / Retirever / switchConfig."
      );
    case "ss":
      return `${config.shipstation.user}:${config.shipstation.key}`;
    case "os":
      return `${config.bigcommerce.user}:${config.bigcommerce.key}`;
    case "osw":
      return `${config.shipstation.user}:${config.shipstation.key}`;
    case "tfc":
      return `${config.shipstation.user}:${config.shipstation.key}`;
  }
}

function authHeader(destination) {
  const encodedString = new Buffer(switchConfig(destination)).toString(
    "base64"
  );

  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Basic ${encodedString}`
    }
  };
}

export const fetchJSON = async (destination, path) => {
  return await axios
    .get(switchURL(destination) + path, authHeader(destination))
    .catch(log.error);
};
