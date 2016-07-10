(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['../references/elliptical', '../dependencies/container'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('../references/elliptical'), require('../dependencies/container'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.elliptical, global.container);
    global.sampleService = mod.exports;
  }
})(this, function (_elliptical, _container) {
  'use strict';

  var _elliptical2 = _interopRequireDefault(_elliptical);

  var _container2 = _interopRequireDefault(_container);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class SampleService extends _elliptical2.default.Service {}

  _container2.default.mapType('SampleService', SampleService, '$SampleProvider');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL3NhbXBsZVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLFFBQU0sYUFBTixTQUE0QixxQkFBVyxPQUF2QyxDQUErQzs7QUFLL0Msc0JBQVUsT0FBVixDQUFrQixlQUFsQixFQUFrQyxhQUFsQyxFQUFnRCxpQkFBaEQiLCJmaWxlIjoic2VydmljZXMvc2FtcGxlU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGVsbGlwdGljYWwgZnJvbSAnLi4vcmVmZXJlbmNlcy9lbGxpcHRpY2FsJztcbmltcG9ydCBjb250YWluZXIgZnJvbSAnLi4vZGVwZW5kZW5jaWVzL2NvbnRhaW5lcic7XG5cbmNsYXNzIFNhbXBsZVNlcnZpY2UgZXh0ZW5kcyBlbGxpcHRpY2FsLlNlcnZpY2Uge1xuXG59XG5cblxuY29udGFpbmVyLm1hcFR5cGUoJ1NhbXBsZVNlcnZpY2UnLFNhbXBsZVNlcnZpY2UsJyRTYW1wbGVQcm92aWRlcicpOyJdfQ==