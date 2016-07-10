(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './references/elliptical', './startup', './modules/ui'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./references/elliptical'), require('./startup'), require('./modules/ui'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.elliptical, global.startup, global.ui);
        global.app = mod.exports;
    }
})(this, function (exports, _elliptical, _startup, _ui) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _elliptical2 = _interopRequireDefault(_elliptical);

    var _startup2 = _interopRequireDefault(_startup);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    //create the app
    var app = (0, _elliptical2.default)();

    //-------configuration-------------------------------------------------
    //views root
    var viewsRoot = '/app/views';
    var $Template = _elliptical2.default.$Template; ///template provider
    $Template.setRoot(viewsRoot); ///set views root
    var View = _elliptical2.default.View;
    View.$provider = $Template;

    app.configure(function () {
        //app.router
        app.use(app.router);

        //error
        app.use(_elliptical2.default.httpError());

        //http 404
        app.use(_elliptical2.default.http404());
    });

    //bind startup
    (0, _startup2.default)(app);

    //global View onBeforeRender callback
    app.onBeforeRender = function (req, res, context, callback) {
        _ui.progress.end();
        callback(context);
    };

    /* listen */
    app.listen();

    exports.default = app;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxRQUFJLE1BQU0sMkJBQVY7Ozs7QUFLQSxRQUFJLFlBQVksWUFBaEI7QUFDQSxRQUFJLFlBQVkscUJBQVcsU0FBM0IsQztBQUNBLGNBQVUsT0FBVixDQUFrQixTQUFsQixFO0FBQ0EsUUFBSSxPQUFLLHFCQUFXLElBQXBCO0FBQ0EsU0FBSyxTQUFMLEdBQWUsU0FBZjs7QUFJQSxRQUFJLFNBQUosQ0FBYyxZQUFZOztBQUV0QixZQUFJLEdBQUosQ0FBUSxJQUFJLE1BQVo7OztBQUdBLFlBQUksR0FBSixDQUFRLHFCQUFXLFNBQVgsRUFBUjs7O0FBR0EsWUFBSSxHQUFKLENBQVEscUJBQVcsT0FBWCxFQUFSO0FBQ0gsS0FURDs7O0FBY0EsMkJBQVEsR0FBUjs7O0FBR0EsUUFBSSxjQUFKLEdBQXFCLFVBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsT0FBcEIsRUFBNkIsUUFBN0IsRUFBdUM7QUFDeEQscUJBQVMsR0FBVDtBQUNBLGlCQUFTLE9BQVQ7QUFDSCxLQUhEOzs7QUFPQSxRQUFJLE1BQUo7O3NCQUVlLEciLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgZWxsaXB0aWNhbCBmcm9tICcuL3JlZmVyZW5jZXMvZWxsaXB0aWNhbCc7XG5pbXBvcnQgc3RhcnR1cCBmcm9tICcuL3N0YXJ0dXAnO1xuaW1wb3J0IHtwcm9ncmVzc30gZnJvbSAnLi9tb2R1bGVzL3VpJztcblxuLy9jcmVhdGUgdGhlIGFwcFxudmFyIGFwcCA9IGVsbGlwdGljYWwoKTtcblxuXG4vLy0tLS0tLS1jb25maWd1cmF0aW9uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy92aWV3cyByb290XG52YXIgdmlld3NSb290ID0gJy9hcHAvdmlld3MnO1xudmFyICRUZW1wbGF0ZSA9IGVsbGlwdGljYWwuJFRlbXBsYXRlOyAvLy90ZW1wbGF0ZSBwcm92aWRlclxuJFRlbXBsYXRlLnNldFJvb3Qodmlld3NSb290KTsgIC8vL3NldCB2aWV3cyByb290XG52YXIgVmlldz1lbGxpcHRpY2FsLlZpZXc7XG5WaWV3LiRwcm92aWRlcj0kVGVtcGxhdGU7XG5cblxuXG5hcHAuY29uZmlndXJlKGZ1bmN0aW9uICgpIHtcbiAgICAvL2FwcC5yb3V0ZXJcbiAgICBhcHAudXNlKGFwcC5yb3V0ZXIpO1xuXG4gICAgLy9lcnJvclxuICAgIGFwcC51c2UoZWxsaXB0aWNhbC5odHRwRXJyb3IoKSk7XG5cbiAgICAvL2h0dHAgNDA0XG4gICAgYXBwLnVzZShlbGxpcHRpY2FsLmh0dHA0MDQoKSk7XG59KTtcblxuXG5cbi8vYmluZCBzdGFydHVwXG5zdGFydHVwKGFwcCk7XG5cbi8vZ2xvYmFsIFZpZXcgb25CZWZvcmVSZW5kZXIgY2FsbGJhY2tcbmFwcC5vbkJlZm9yZVJlbmRlciA9IGZ1bmN0aW9uIChyZXEsIHJlcywgY29udGV4dCwgY2FsbGJhY2spIHtcbiAgICBwcm9ncmVzcy5lbmQoKTtcbiAgICBjYWxsYmFjayhjb250ZXh0KTtcbn07XG5cblxuLyogbGlzdGVuICovXG5hcHAubGlzdGVuKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFwcDsiXX0=