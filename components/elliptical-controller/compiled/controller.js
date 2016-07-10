'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical = root.elliptical || {};
        root.elliptical.Controller = factory();
        root.returnExports = root.elliptical.Controller;
    }
})(undefined, function () {
    var Controller = function Controller(app, name, route) {
        _classCallCheck(this, Controller);

        this._app = app;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.getOwnPropertyNames(Object.getPrototypeOf(this))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var action = _step.value;

                var fn = this[action];
                var method = 'get';
                if (action !== 'constructor') {
                    if (!(fn instanceof Function)) {
                        method = fn.method;
                        fn = fn.value;
                    }
                    bindControllerAction(fn, action, method, route, name, app, this);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };

    function bindControllerAction(actionFn, actionName, method, route, controllerName, app, controllerContext) {
        var length;
        var args = [];
        if (actionName === 'Index' && !testIndexProp(route)) {
            //e.g.,: "/Home/Index" =>"/Home", "/Product/Index/1" => "/Product/Index/1"
            route = route.replace(/@action/g, '');
        } else {
            var actionName_ = actionName.replace(/_/g, '-'); //ex: '/Sign-In' ---> Sign_In:fn()
            route = route.replace(/@action/g, actionName_);
        }
        length = route.length;
        if (!(controllerName.toLowerCase() === 'home' && actionName.toLowerCase() === 'index')) {
            //don't rewrite '/' as '/Home/Index'
            route = length > 1 ? '/' + controllerName + route : '/' + controllerName;
        }
        ///private props to maintain controller name/action reference in the event of js minification
        actionFn = actionFn.bind(controllerContext);
        actionFn.__name = controllerName;
        actionFn.__action = actionName;
        app[method.toLowerCase()].call(controllerContext, route, actionFn);
    }

    /**
     *
     * @param {string} args
     * @returns {boolean}
     * @private
     */
    function testIndexProp(args) {
        var str = args.split('@action');
        return str[1] && str[1].length > 1;
    }

    return Controller;
});
