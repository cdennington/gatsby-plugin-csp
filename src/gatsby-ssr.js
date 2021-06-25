"use strict";

const flatten = require('lodash.flatten');
const fs = require('file-system');
const _require = require('gatsby-plugin-csp/utils');

const cspString = _require.cspString;
const getHashes = _require.getHashes;
const defaultJson = _require.defaultJson;
const defaultDirectives = _require.defaultDirectives;
let headerLength = defaultJson['hosting']['headers'].length;
const arrScript = [];
const arrStyle = [];
let idx = 0;

exports.onPreRenderHTML = ({
  getHeadComponents,
  getPreBodyComponents,
  getPostBodyComponents
}, userPluginOptions) => {
  const _userPluginOptions$di = userPluginOptions.disableOnDev;
  const disableOnDev = _userPluginOptions$di === void 0 ? true : _userPluginOptions$di;
  const _userPluginOptions$me = userPluginOptions.mergeScriptHashes;
  const mergeScriptHashes = _userPluginOptions$me === void 0 ? true : _userPluginOptions$me;
  const _userPluginOptions$me2 = userPluginOptions.mergeStyleHashes;
  const mergeStyleHashes = _userPluginOptions$me2 === void 0 ? true : _userPluginOptions$me2;
  const _userPluginOptions$me1 = userPluginOptions.nonce;
  const nonce = _userPluginOptions$me1 === void 0 ? true : _userPluginOptions$me1;
  const _userPluginOptions$me3 = userPluginOptions.mergeDefaultDirectives;
  const mergeDefaultDirectives = _userPluginOptions$me3 === void 0 ? true : _userPluginOptions$me3;
  const userDirectives = userPluginOptions.directives; // early return if plugin is disabled on dev env

  const _hosting$me = userPluginOptions.hosting;
  const defaultfirebase = _hosting$me === void 0 ? defaultJson : _hosting$me;

  if (idx === 0) {
    headerLength = defaultfirebase['hosting']['headers'].length;
  }

  if (process.env.NODE_ENV === "development" && disableOnDev) {
    return;
  }

  let components = [...flatten(getHeadComponents()), ...flatten(getPostBodyComponents()), ...flatten(getPreBodyComponents())];
  let directives = Object.assign({}, mergeDefaultDirectives && defaultDirectives, userDirectives);
  const scripthashes = getHashes(components, nonce);
  const stylehashes = getHashes(components, nonce);
  scripthashes.forEach(item => {
    if (arrScript.indexOf(item) === -1) {
      arrScript.push(item);
    }
  });
  stylehashes.forEach(item => {
    if (arrStyle.indexOf(item) === -1) {
      arrStyle.push(item);
    }
  });
  let csp = Object.assign({}, directives, mergeScriptHashes && {
    "script-src": `${directives["script-src"] || ""} ${arrScript.join(" ")}`
  }, mergeStyleHashes && {
    "style-src": `${directives["style-src"] || ""} ${arrStyle.join(" ")}`
  });
  defaultfirebase['hosting']['headers'][headerLength] = {
    "source": "**",
    "headers": [{
      "key": "Content-Security-Policy",
      "value": cspString(csp)
    }]
  };
  let data = JSON.stringify(defaultfirebase);
  fs.writeFileSync('firebase.json', data);
  idx += 1;
};