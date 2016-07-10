/*
 * =============================================================
 * elliptical.url
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * in part, culled from https://github.com/cowboy/javascript-route-matcher
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.url=factory();
        root.returnExports = root.elliptical.url;

    }
}(this, function () {

    var reEscape = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
    var reParam = /([:*])(\w+)/g;

    /**
     *
     * @param rule
     * @param value
     * @returns {*}
     */
    function validateRule(rule, value) {
        var obj={};
        var type = obj.toString.call(rule).charAt(8);
        return type === "R" ? rule.test(value) : type === "F" ? rule(value) : rule == value;
    }

    var url;
    url = {
        match: function (route, rules) {
            var self = {};
            var names = [];
            var re = route;
            if (typeof route === "string") {
                re = re.replace(reEscape, "\\$&");
                re = re.replace(reParam, function (_, mode, name) {
                    names.push(name);
                    return mode === ":" ? "([^/]*)" : "(.*)";
                });
                re = new RegExp("^" + re + "$");
                self.parse = function (url) {
                    var i = 0;
                    var param, value;
                    var params = {};
                    var matches = url.match(re);
                    // If no matches, return null.
                    if (!matches) {
                        return null;
                    }
                    // Add all matched :param / *splat values into the params object.
                    while (i < names.length) {
                        param = names[i++];
                        value = matches[i];
                        // If a rule exists for thie param and it doesn't validate, return null.
                        if (rules && param in rules && !validateRule(rules[param], value)) {
                            return null;
                        }
                        params[param] = decodeURIComponent(value);
                    }
                    return params;
                };

                // Build path by inserting the given params into the route.
                self.stringify = function (params) {
                    var param, re;
                    var result = route;
                    // Insert each passed param into the route string. Note that this loop
                    // doesn't check .hasOwnProperty because this script doesn't support
                    // modifications to Object.prototype.
                    for (param in params) {
                        re = new RegExp("[:*]" + param + "\\b");
                        result = result.replace(re, params[param]);
                    }
                    // Missing params should be replaced with empty string.
                    return result.replace(reParam, "");
                };
            } else {
                // RegExp route was passed. This is super-simple.
                self.parse = function (url) {
                    var matches = url.match(re);
                    return matches && {captures: matches.slice(1)};
                };
                // There's no meaningful way to stringify based on a RegExp route, so
                // return empty string.
                self.stringify = function () {
                    return "";
                };
            }

            return self;
        },

        /**
         * strip protocol,hostname and trailing slash from route
         * @param url {String}
         * @returns {String}
         */
        sanitize: function (url) {
            var root, path;
            root = url.toString().replace(/^(.*\/\/[^\/?#]*).*$/, "$1");
            path = (root.indexOf('://') > -1) ? url.replace(root, '') : root;
            if (path.length > 1 && path.charAt(path.length - 1) === '/') {
                path = path.slice(0, -1);
            }
            return path;

        },

        queryString: function (url, ji) {
            var hu;
            if (typeof ji === 'undefined' && typeof window !== 'undefined') {
                hu = window.location.search.substring(1);
                ji = url;
            } else {
                hu = url.split('?')[1];
            }
            if (typeof hu !== 'undefined') {
                var gy = hu.split("&");
                for (i = 0; i < gy.length; i++) {
                    var ft = gy[i].split("=");
                    if (ft[0] == ji) {
                        return ft[1];
                    }
                }
            }
            return null;
        },

        query: function (url) {
            var query = {};
            var hu = url.split('?')[1];
            if (typeof hu !== 'undefined') {
                var gy = hu.split("&");
                for (i = 0; i < gy.length; i++) {
                    var ft = gy[i].split("=");
                    query[ft[0]] = ft[1];
                }
            }

            return query;
        },

        httpValueCollection: function (url) {
            var query = this.query(url);
            var arr = [];
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    var obj = {
                        key: key,
                        value: decodeURIComponent(query[key])
                    };
                    arr.push(obj);
                }
            }

            return arr;
        },

        httpRequestObject: function (route, url) {
            url = (url) ? url : location.pathname;
            var rule = this.match(route);
            return rule.parse(url);
        },

        body: function (prms) {
            var body = {};
            prms.forEach(function (p) {
                body[p.name] = p.value;
            });
            return body;
        },

        hashTagFormat: function (route) {
            if ((route).charAt(1) !== '#') {
                return '/#' + route;
            } else {
                return route;
            }
        },

        pathComponent: function (url) {
            var rte = url.split('?');
            return rte[0];
        }
    };

    return url;

}));

