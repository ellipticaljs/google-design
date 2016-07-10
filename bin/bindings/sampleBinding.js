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
        global.sampleBinding = mod.exports;
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

    _elliptical2.default.binding('sample', function (node) {
        var DomEvent = _container2.default.getType('DomEvent');
        var dom = new DomEvent(node, this);

        this.dispose = () => {
            dom.unbind();
        };
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJpbmRpbmdzL3NhbXBsZUJpbmRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLHlCQUFXLE9BQVgsQ0FBbUIsUUFBbkIsRUFBNkIsVUFBVSxJQUFWLEVBQWdCO0FBQ3pDLFlBQUksV0FBVyxvQkFBVSxPQUFWLENBQWtCLFVBQWxCLENBQWY7QUFDQSxZQUFJLE1BQU0sSUFBSSxRQUFKLENBQWEsSUFBYixFQUFtQixJQUFuQixDQUFWOztBQUVBLGFBQUssT0FBTCxHQUFlLE1BQUs7QUFDaEIsZ0JBQUksTUFBSjtBQUNILFNBRkQ7QUFJSCxLQVJEIiwiZmlsZSI6ImJpbmRpbmdzL3NhbXBsZUJpbmRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBlbGxpcHRpY2FsIGZyb20gJy4uL3JlZmVyZW5jZXMvZWxsaXB0aWNhbCc7XG5pbXBvcnQgY29udGFpbmVyIGZyb20gJy4uL2RlcGVuZGVuY2llcy9jb250YWluZXInO1xuXG5cbmVsbGlwdGljYWwuYmluZGluZygnc2FtcGxlJywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgRG9tRXZlbnQgPSBjb250YWluZXIuZ2V0VHlwZSgnRG9tRXZlbnQnKTtcbiAgICB2YXIgZG9tID0gbmV3IERvbUV2ZW50KG5vZGUsIHRoaXMpO1xuICAgIFxuICAgIHRoaXMuZGlzcG9zZSA9ICgpPT4ge1xuICAgICAgICBkb20udW5iaW5kKCk7XG4gICAgfTtcblxufSk7XG4iXX0=