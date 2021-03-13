"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createPages = exports.onPostBuild = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function testTs(tt) {
  return tt + " hello";
}

var onPostBuild = function onPostBuild(_ref) {
  var reporter = _ref.reporter;
  reporter.info("Your Gatsby site has been built222");
};

exports.onPostBuild = onPostBuild;

var createPages = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(testTs('12222222222222222222222222222222222222212312312312'));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createPages() {
    return _ref2.apply(this, arguments);
  };
}();

exports.createPages = createPages;