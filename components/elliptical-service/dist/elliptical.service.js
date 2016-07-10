(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'elliptical-utils'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('elliptical-utils'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.elliptical.utils);
        global.elliptical.Service = mod.exports.default;
    }
})(this, function (exports, _ellipticalUtils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _ellipticalUtils2 = _interopRequireDefault(_ellipticalUtils);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            return step("next", value);
                        }, function (err) {
                            return step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var object = _ellipticalUtils2.default.object;

    var Service = function () {

        /**
         *
         * @param {Object} params
         */

        function Service(params) {
            _classCallCheck(this, Service);

            if (params) this._data = params;
            this.$query = {};
        }

        /**
         *
         * @param {Object} params
         * @param {Object} query
         * @param {Function} callback
         */


        _createClass(Service, [{
            key: 'getAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(params) {
                    var query;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    query = this.$query;
                                    return _context.abrupt('return', this.constructor.getAsync(params, query));

                                case 2:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function getAsync(_x) {
                    return ref.apply(this, arguments);
                }

                return getAsync;
            }()
        }, {
            key: 'get',
            value: function get(params, callback) {
                var data = this._data,
                    query = this.$query;
                if (typeof params === 'function') {
                    callback = params;
                    params = data;
                }
                this.constructor.get(params, query, callback);
            }
        }, {
            key: 'postAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(params) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    return _context2.abrupt('return', this.constructor.postAsync(params));

                                case 1:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function postAsync(_x2) {
                    return ref.apply(this, arguments);
                }

                return postAsync;
            }()
        }, {
            key: 'post',
            value: function post(params, callback) {
                var data = this._data;
                if (typeof params === 'function') {
                    callback = params;
                    params = data;
                }
                this.constructor.post(params, callback);
            }
        }, {
            key: 'putAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(params) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    return _context3.abrupt('return', this.constructor.putAsync(params));

                                case 1:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));

                function putAsync(_x3) {
                    return ref.apply(this, arguments);
                }

                return putAsync;
            }()
        }, {
            key: 'put',
            value: function put(params, callback) {
                var data = this._data;
                if (typeof params === 'function') {
                    callback = params;
                    params = data;
                }
                this.constructor.put(params, callback);
            }
        }, {
            key: 'deleteAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(params) {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    return _context4.abrupt('return', this.constructor.deleteAsync(params));

                                case 1:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));

                function deleteAsync(_x4) {
                    return ref.apply(this, arguments);
                }

                return deleteAsync;
            }()
        }, {
            key: 'delete',
            value: function _delete(params, callback) {
                var x = parseFloat(params);
                this.constructor.delete(params, callback);
            }
        }, {
            key: 'saveAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(params) {
                    var idProp, data;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    idProp = this.constructor.id;
                                    data = this._data;

                                    if (params === undefined) params = data;

                                    if (!params[idProp]) {
                                        _context5.next = 7;
                                        break;
                                    }

                                    return _context5.abrupt('return', this.constructor.putAsync(params));

                                case 7:
                                    return _context5.abrupt('return', this.constructor.postAsync(params));

                                case 8:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this);
                }));

                function saveAsync(_x5) {
                    return ref.apply(this, arguments);
                }

                return saveAsync;
            }()
        }, {
            key: 'save',
            value: function save(params, callback) {
                var idProp = this.constructor.id;
                var data = this._data;
                if (params === undefined) params = data;
                if (params[idProp]) this.constructor.put(params, callback);else this.constructor.post(params, callback);
            }
        }, {
            key: 'filter',
            value: function filter(val) {
                if (val) {
                    if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
                        var newVal = this._toQueryable(val);
                        if (!object.isEmpty(newVal)) this.$query.filter = newVal;
                    } else this.$query.filter = val;
                }
                return this;
            }
        }, {
            key: 'orderBy',
            value: function orderBy(val) {
                if (val && !object.isEmpty(val)) this.$query.orderBy = val;
                return this;
            }
        }, {
            key: 'orderByDesc',
            value: function orderByDesc(val) {
                if (val && !object.isEmpty(val)) this.$query.orderByDesc = val;
                return this;
            }
        }, {
            key: 'top',
            value: function top(val) {
                if (val && !object.isEmpty(val)) this.$query.top = val;
                return this;
            }
        }, {
            key: 'skip',
            value: function skip(val) {
                if (val && !object.isEmpty(val)) this.$query.skip = val;
                return this;
            }
        }, {
            key: 'paginate',
            value: function paginate(params) {
                try {
                    params.page = parseInt(params.page);
                } catch (ex) {
                    params.page = 1;
                }
                this.$query.paginate = params;
                return this;
            }
        }, {
            key: '_toQueryable',
            value: function _toQueryable(val) {
                return this.constructor._toQueryable(val);
            }
        }], [{
            key: 'get',
            value: function get(params, query, callback) {
                if (typeof query === 'function') {
                    callback = query;
                    query = {};
                }
                var self = this,
                    $provider = this.$provider,
                    $paginationProvider = this.$paginationProvider,
                    resource = this['@resource'],
                    result = null;

                $provider.get(params, resource, query, function (err, data) {
                    if (!err) {
                        self._data = data;
                        if (query.paginate && $paginationProvider) result = $paginationProvider.get(query, data);else result = data;
                    }
                    if (callback) callback(err, result);
                });
            }
        }, {
            key: 'getAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(params, query) {
                    var self, $provider, $paginationProvider, resource, result;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    self = this;
                                    $provider = this.$provider;
                                    $paginationProvider = this.$paginationProvider;
                                    resource = this['@resource'];

                                    if (query === undefined) query = {};
                                    return _context6.abrupt('return', new Promise(function (resolve, reject) {
                                        $provider.get(params, resource, query, function (err, data) {
                                            if (err) reject(err);else {
                                                self._data = data;
                                                if (query.paginate && $paginationProvider) result = $paginationProvider.get(query, data);else result = data;
                                                resolve(result);
                                            }
                                        });
                                    }));

                                case 6:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, this);
                }));

                function getAsync(_x6, _x7) {
                    return ref.apply(this, arguments);
                }

                return getAsync;
            }()
        }, {
            key: 'post',
            value: function post(params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.post(params, resource, callback);
            }
        }, {
            key: 'postAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(params) {
                    var $provider, resource;
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    $provider = this.$provider;
                                    resource = this['@resource'];
                                    return _context7.abrupt('return', new Promise(function (resolve, reject) {
                                        $provider.post(params, resource, function (err, data) {
                                            if (err) reject(err);else resolve(data);
                                        });
                                    }));

                                case 3:
                                case 'end':
                                    return _context7.stop();
                            }
                        }
                    }, _callee7, this);
                }));

                function postAsync(_x8) {
                    return ref.apply(this, arguments);
                }

                return postAsync;
            }()
        }, {
            key: 'put',
            value: function put(params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.put(params, resource, callback);
            }
        }, {
            key: 'putAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(params) {
                    var $provider, resource;
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                        while (1) {
                            switch (_context8.prev = _context8.next) {
                                case 0:
                                    $provider = this.$provider;
                                    resource = this['@resource'];
                                    return _context8.abrupt('return', new Promise(function (resolve, reject) {
                                        $provider.put(params, resource, function (err, data) {
                                            if (err) reject(err);else resolve(data);
                                        });
                                    }));

                                case 3:
                                case 'end':
                                    return _context8.stop();
                            }
                        }
                    }, _callee8, this);
                }));

                function putAsync(_x9) {
                    return ref.apply(this, arguments);
                }

                return putAsync;
            }()
        }, {
            key: 'deleteAsync',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(params) {
                    var $provider, resource;
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                        while (1) {
                            switch (_context9.prev = _context9.next) {
                                case 0:
                                    $provider = this.$provider;
                                    resource = this['@resource'];
                                    return _context9.abrupt('return', new Promise(function (resolve, reject) {
                                        $provider.delete(params, resource, function (err, data) {
                                            if (err) reject(err);else resolve(data);
                                        });
                                    }));

                                case 3:
                                case 'end':
                                    return _context9.stop();
                            }
                        }
                    }, _callee9, this);
                }));

                function deleteAsync(_x10) {
                    return ref.apply(this, arguments);
                }

                return deleteAsync;
            }()
        }, {
            key: 'delete',
            value: function _delete(params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.delete(params, resource, callback);
            }
        }, {
            key: '_toQueryable',
            value: function _toQueryable(obj) {
                if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return obj;
                var qry = {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key.indexOf('$') !== 0) qry[key] = obj[key];
                    }
                }
                return qry;
            }
        }]);

        return Service;
    }();

    Service.id = 'id';
    Service.$provider = null;
    Service["@resource"] = null;
    Service._data = null;
    Service.$paginationProvider = null;

    exports.default = Service;
});
