(function (global, factory) {
     if (typeof define === "function" && define.amd) {
          define(["exports"], factory);
     } else if (typeof exports !== "undefined") {
          factory(exports);
     } else {
          var mod = {
               exports: {}
          };
          factory(mod.exports);
          global.keys = mod.exports;
     }
})(this, function (exports) {
     "use strict";

     Object.defineProperty(exports, "__esModule", {
          value: true
     });
     var keys = {
          GRID_SIZE: 12
     };

     exports.default = keys;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZmVyZW5jZXMva2V5cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFJLE9BQUs7QUFDSixxQkFBVTtBQUROLE1BQVQ7O3VCQUllLEkiLCJmaWxlIjoicmVmZXJlbmNlcy9rZXlzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGtleXM9e1xuICAgICBHUklEX1NJWkU6MTJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGtleXM7Il19