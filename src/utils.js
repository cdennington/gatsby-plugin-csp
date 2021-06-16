"use strict";

const crypto = require("crypto");

const defaultDirectives = {
  "base-uri": "'self'",
  "script-src": "'self'",
  "style-src": "'self'",
  "object-src": "'none'",
  "form-action": "'self'",
  "font-src": "'self' data:",
  "img-src": "'self' data:"
};

const defaultJson = {
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "functions": {
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run lint"
      ]
    },
    "headers": [
      {
        "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      },
      {
        "source": "404.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=300"
          }
        ]
      }
    ]
  },
  "emulators": {
    "functions": {
      "port": 5001
    },
    "hosting": {
      "port": 5000
    },
    "pubsub": {
      "port": 8085
    },
    "ui": {
      "enabled": true
    }
  }
};

function computeHash(component) {
  let stringHtml = component.props.dangerouslySetInnerHTML.__html;
  let hash = crypto.createHash("sha256").update(stringHtml).digest("base64");
  return "'sha256-" + hash + "'";
};

function cspString(csp) {
  return Object.keys(csp).reduce((acc, key) => {
    if (csp[key]) {
      return `${acc}${key} ${csp[key]}; `;
    } else {
      return acc;
    }
  }, ``).slice(0, -1); // remove last space
};

function getHashes(components, type) {
  let isType = element => element.type === type;

  let isInline = element => element.props.dangerouslySetInnerHTML && element.props.dangerouslySetInnerHTML.__html.length > 0;

  return components.filter(isType).filter(isInline).map(computeHash);
};

module.exports = {
  computeHash,
  cspString,
  getHashes,
  defaultDirectives,
  defaultJson,
};