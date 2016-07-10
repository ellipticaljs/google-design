(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "../references/elliptical", "../dependencies/container"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("../references/elliptical"), require("../dependencies/container"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.elliptical, global.container);
        global.homeController = mod.exports;
    }
})(this, function (exports, _elliptical, _container) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _elliptical2 = _interopRequireDefault(_elliptical);

    var _container2 = _interopRequireDefault(_container);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    class Controller extends _elliptical2.default.Controller {
        Index(req, res, next) {
            res.render();
        }
    }
    exports.default = Controller;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL2hvbWVDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR2UsVUFBTSxVQUFOLFNBQXlCLHFCQUFXLFVBQXBDLENBQStDO0FBQzFELGNBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsSUFBaEIsRUFBc0I7QUFDbEIsZ0JBQUksTUFBSjtBQUNIO0FBSHlEO3NCQUF6QyxVIiwiZmlsZSI6ImNvbnRyb2xsZXJzL2hvbWVDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVsbGlwdGljYWwgZnJvbSBcIi4uL3JlZmVyZW5jZXMvZWxsaXB0aWNhbFwiO1xuaW1wb3J0IGNvbnRhaW5lciBmcm9tICcuLi9kZXBlbmRlbmNpZXMvY29udGFpbmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlciBleHRlbmRzIGVsbGlwdGljYWwuQ29udHJvbGxlciB7XG4gICAgSW5kZXgocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmVzLnJlbmRlcigpO1xuICAgIH1cbn1cbiJdfQ==