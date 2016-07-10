(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../references/elliptical'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../references/elliptical'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.elliptical);
    global.container = mod.exports;
  }
})(this, function (exports, _elliptical) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _elliptical2 = _interopRequireDefault(_elliptical);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var container = _elliptical2.default.container;

  var http = _elliptical2.default.http;
  var Service = _elliptical2.default.Service;
  var Location = _elliptical2.default.Location;
  var $Cookie = _elliptical2.default.$Cookie;
  var Sort = _elliptical2.default.Sort;
  var $Sort = _elliptical2.default.$Sort;
  var DomEvent = _elliptical2.default.DomEvent;
  var $Rest = _elliptical2.default.$Rest;

  //set Rest endpoint props
  $Rest.protocol = 'http';
  $Rest.host = '';
  $Rest.path = '/api';
  $Rest.port = 80;

  var $rest = new $Rest();

  //registrations
  container.mapType('Service', Service, $rest);
  container.mapType('Sort', Sort, $Sort);
  container.mapType('Notify', _elliptical2.default.Notify, _elliptical2.default.$Notify);
  container.registerType('$Rest', $Rest);
  container.registerType('Location', Location);
  container.registerType('$Local', _elliptical2.default.$Local);
  container.registerType('$Cookie', $Cookie);
  container.registerType('DomEvent', DomEvent);
  container.registerType('$ViewData', _elliptical2.default.$ViewData);

  exports.default = container;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlcGVuZGVuY2llcy9jb250YWluZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsTUFBSSxZQUFVLHFCQUFXLFNBQXpCOztBQUVBLE1BQUksT0FBTyxxQkFBVyxJQUF0QjtBQUNBLE1BQUksVUFBVSxxQkFBVyxPQUF6QjtBQUNBLE1BQUksV0FBVyxxQkFBVyxRQUExQjtBQUNBLE1BQUksVUFBVSxxQkFBVyxPQUF6QjtBQUNBLE1BQUksT0FBTyxxQkFBVyxJQUF0QjtBQUNBLE1BQUksUUFBUSxxQkFBVyxLQUF2QjtBQUNBLE1BQUksV0FBVyxxQkFBVyxRQUExQjtBQUNBLE1BQUksUUFBUSxxQkFBVyxLQUF2Qjs7O0FBSUEsUUFBTSxRQUFOLEdBQWlCLE1BQWpCO0FBQ0EsUUFBTSxJQUFOLEdBQWEsRUFBYjtBQUNBLFFBQU0sSUFBTixHQUFhLE1BQWI7QUFDQSxRQUFNLElBQU4sR0FBYSxFQUFiOztBQUVBLE1BQUksUUFBUSxJQUFJLEtBQUosRUFBWjs7O0FBTUEsWUFBVSxPQUFWLENBQWtCLFNBQWxCLEVBQTZCLE9BQTdCLEVBQXNDLEtBQXRDO0FBQ0EsWUFBVSxPQUFWLENBQWtCLE1BQWxCLEVBQTBCLElBQTFCLEVBQWdDLEtBQWhDO0FBQ0EsWUFBVSxPQUFWLENBQWtCLFFBQWxCLEVBQTRCLHFCQUFXLE1BQXZDLEVBQStDLHFCQUFXLE9BQTFEO0FBQ0EsWUFBVSxZQUFWLENBQXVCLE9BQXZCLEVBQWdDLEtBQWhDO0FBQ0EsWUFBVSxZQUFWLENBQXVCLFVBQXZCLEVBQW1DLFFBQW5DO0FBQ0EsWUFBVSxZQUFWLENBQXVCLFFBQXZCLEVBQWlDLHFCQUFXLE1BQTVDO0FBQ0EsWUFBVSxZQUFWLENBQXVCLFNBQXZCLEVBQWtDLE9BQWxDO0FBQ0EsWUFBVSxZQUFWLENBQXVCLFVBQXZCLEVBQW1DLFFBQW5DO0FBQ0EsWUFBVSxZQUFWLENBQXVCLFdBQXZCLEVBQW9DLHFCQUFXLFNBQS9DOztvQkFHZSxTIiwiZmlsZSI6ImRlcGVuZGVuY2llcy9jb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBlbGxpcHRpY2FsIGZyb20gJy4uL3JlZmVyZW5jZXMvZWxsaXB0aWNhbCc7XG5cbnZhciBjb250YWluZXI9ZWxsaXB0aWNhbC5jb250YWluZXI7XG5cbnZhciBodHRwID0gZWxsaXB0aWNhbC5odHRwO1xudmFyIFNlcnZpY2UgPSBlbGxpcHRpY2FsLlNlcnZpY2U7XG52YXIgTG9jYXRpb24gPSBlbGxpcHRpY2FsLkxvY2F0aW9uO1xudmFyICRDb29raWUgPSBlbGxpcHRpY2FsLiRDb29raWU7XG52YXIgU29ydCA9IGVsbGlwdGljYWwuU29ydDtcbnZhciAkU29ydCA9IGVsbGlwdGljYWwuJFNvcnQ7XG52YXIgRG9tRXZlbnQgPSBlbGxpcHRpY2FsLkRvbUV2ZW50O1xudmFyICRSZXN0ID0gZWxsaXB0aWNhbC4kUmVzdDtcblxuXG4vL3NldCBSZXN0IGVuZHBvaW50IHByb3BzXG4kUmVzdC5wcm90b2NvbCA9ICdodHRwJztcbiRSZXN0Lmhvc3QgPSAnJztcbiRSZXN0LnBhdGggPSAnL2FwaSc7XG4kUmVzdC5wb3J0ID0gODA7XG5cbnZhciAkcmVzdCA9IG5ldyAkUmVzdCgpO1xuXG5cblxuXG4vL3JlZ2lzdHJhdGlvbnNcbmNvbnRhaW5lci5tYXBUeXBlKCdTZXJ2aWNlJywgU2VydmljZSwgJHJlc3QpO1xuY29udGFpbmVyLm1hcFR5cGUoJ1NvcnQnLCBTb3J0LCAkU29ydCk7XG5jb250YWluZXIubWFwVHlwZSgnTm90aWZ5JywgZWxsaXB0aWNhbC5Ob3RpZnksIGVsbGlwdGljYWwuJE5vdGlmeSk7XG5jb250YWluZXIucmVnaXN0ZXJUeXBlKCckUmVzdCcsICRSZXN0KTtcbmNvbnRhaW5lci5yZWdpc3RlclR5cGUoJ0xvY2F0aW9uJywgTG9jYXRpb24pO1xuY29udGFpbmVyLnJlZ2lzdGVyVHlwZSgnJExvY2FsJywgZWxsaXB0aWNhbC4kTG9jYWwpO1xuY29udGFpbmVyLnJlZ2lzdGVyVHlwZSgnJENvb2tpZScsICRDb29raWUpO1xuY29udGFpbmVyLnJlZ2lzdGVyVHlwZSgnRG9tRXZlbnQnLCBEb21FdmVudCk7XG5jb250YWluZXIucmVnaXN0ZXJUeXBlKCckVmlld0RhdGEnLCBlbGxpcHRpY2FsLiRWaWV3RGF0YSk7XG5cblxuZXhwb3J0IGRlZmF1bHQgY29udGFpbmVyO1xuIl19