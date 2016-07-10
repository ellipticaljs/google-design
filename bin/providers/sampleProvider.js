(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['../dependencies/container'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('../dependencies/container'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.container);
    global.sampleProvider = mod.exports;
  }
})(this, function (_container) {
  'use strict';

  var _container2 = _interopRequireDefault(_container);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class SampleProvider {}

  _container2.default.registerType('$SampleProvider', SampleProvider);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb3ZpZGVycy9zYW1wbGVQcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFFBQU0sY0FBTixDQUFvQjs7QUFJcEIsc0JBQVUsWUFBVixDQUF1QixpQkFBdkIsRUFBMEMsY0FBMUMiLCJmaWxlIjoicHJvdmlkZXJzL3NhbXBsZVByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbnRhaW5lciBmcm9tICcuLi9kZXBlbmRlbmNpZXMvY29udGFpbmVyJztcblxuY2xhc3MgU2FtcGxlUHJvdmlkZXJ7XG5cbn1cblxuY29udGFpbmVyLnJlZ2lzdGVyVHlwZSgnJFNhbXBsZVByb3ZpZGVyJywgU2FtcGxlUHJvdmlkZXIpO1xuXG4iXX0=