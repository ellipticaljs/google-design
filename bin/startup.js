(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './controllers/homeController'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./controllers/homeController'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.homeController);
        global.startup = mod.exports;
    }
})(this, function (exports, _homeController) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _homeController2 = _interopRequireDefault(_homeController);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = app => {
        //-------controllers------------------------------------------------------------
        new _homeController2.default(app, 'Home', '/@action');
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJ0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUdnQixHQUFELElBQU87O0FBRWxCLHFDQUFtQixHQUFuQixFQUF1QixNQUF2QixFQUE4QixVQUE5QjtBQUVILEsiLCJmaWxlIjoic3RhcnR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IEhvbWVDb250cm9sbGVyIGZyb20gJy4vY29udHJvbGxlcnMvaG9tZUNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwKT0+e1xuLy8tLS0tLS0tY29udHJvbGxlcnMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBuZXcgSG9tZUNvbnRyb2xsZXIoYXBwLCdIb21lJywnL0BhY3Rpb24nKTtcblxufSJdfQ==