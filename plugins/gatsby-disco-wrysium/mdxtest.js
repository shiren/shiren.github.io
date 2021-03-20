"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mdx = _interopRequireDefault(require("@mdx-js/mdx"));

var result = (0, _mdx["default"])("# Hello, MDX").then(function (res) {
  console.log('123', res);
});
console.log(result);