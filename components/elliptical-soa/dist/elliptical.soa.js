/*
 * =============================================================
 * elliptical.Provider
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Provider=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Provider;
    }
}(this, function (Class) {

    return Class.extend({
        "@resource":null
    },{});

}));


/*
 * =============================================================
 * elliptical.factory
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-lodash').func);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-lodash'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.factory=factory(root._.func);
        root.returnExports = root.elliptical.factory;
    }
}(this, function (_) {
    if(_.func !==undefined) _=_.func;

    var factory;
    factory = {
        partial: function () {
            var args = [].slice.call(arguments);
            return _.partial.apply(this, args);
        },

        partialRight: function () {
            var args = [].slice.call(arguments);
            return _.partialRight.apply(this, args);
        },

        curry: function () {
            var args = [].slice.call(arguments);
            return _.curry.apply(this, args);
        },

        defer: function () {
            var args = [].slice.call(arguments);
            return _.defer.apply(this, args);
        },

        delay: function () {
            var args = [].slice.call(arguments);
            return _.delay.apply(this, args);
        },

        after: function () {
            var args = [].slice.call(arguments);
            return _.after.apply(this, args);
        },

        bind: function () {
            var args = [].slice.call(arguments);
            return _.bind.apply(this, args);
        },

        bindKey: function () {
            var args = [].slice.call(arguments);
            return _.bindKey.apply(this, args);
        },

        bindAll: function () {
            var args = [].slice.call(arguments);
            return _.bindAll.apply(this, args);
        },

        debounce: function () {
            var args = [].slice.call(arguments);
            return _.debounce.apply(this, args);
        },

        throttle: function () {
            var args = [].slice.call(arguments);
            return _.throttle.apply(this, args);
        },


        wrap: function () {
            var args = [].slice.call(arguments);
            return _.wrap.apply(this, args);
        },

        memoize: function () {
            var args = [].slice.call(arguments);
            return _.memoize.apply(this, args);
        }

    };

    return factory;

}));


/*
 * =============================================================
 * elliptical.noop
 * =============================================================
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
        root.elliptical.noop=factory();
        root.returnExports = root.elliptical.noop;
    }
}(this, function () {

    return{
        noop:function(){},
        throwErr:function(err){
            if (err) {
                throw err;
            }
        },
        doop:function(fn,args,context){
            if(typeof fn==='function') {
                return fn.apply(context, args);
            }
        }
    }


}));

/*
 * =============================================================
 * elliptical.Interval
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./debounce'),require('./throttle'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./debounce','./throttle'], factory);
    } else {
        root.elliptical.Interval=factory(root.elliptical.debounce,root.elliptical.throttle);
        root.returnExports = root.elliptical.Interval;
    }
}(this, function (debounce,throttle) {

    function _exe(fn,opts){
        fn();
    }

    return function Interval(opts){
        this.delay=opts.delay;
        this.timeOutId=null;
        if(opts.thread==='throttle')this.thread=throttle;
        else if(opts.thread==='debounce')this.thread=debounce;
        else{
            this.thread=_exe;
        }
        this.run=function(fn){
            var self=this;
            this.timeOutId=setInterval(function(){
                self.thread(fn,{
                    delay:10
                });

            },self.delay);
        };

        this.terminate=function(){
            clearInterval(this.timeOutId);
        }
    };


}));


/*
 * =============================================================
 * elliptical.debounce
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-lodash').func);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-lodash'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.debounce=factory(root._.func);
        root.returnExports = root.elliptical.debounce;
    }
}(this, function (_) {
    if(_.func !==undefined) _=_.func;

    return function debounce(fn,delay,opts){
        if(typeof delay==='undefined'){
            delay=1000;
        }
        if(typeof opts==='undefined'){
            opts={};
        }
        _.debounce(fn,delay,opts);
    }


}));


/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */



(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    }else if (typeof module === 'object' && module.exports) {
        //CommonJS module

        if(typeof window!='undefined'){
            factory($);
        }

    } else {
        // Browser globals.
        factory($);
    }
}(function ($) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch(er) {}
    }

    var config = $.cookie = function (key, value, options) {
        config.raw = true;
        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

    return $;

}));


/*
 * =============================================================
 * elliptical.$Cookie
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Cookie = factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Cookie;
    }
}(this, function (Class) {

    function _getCookies() {
        var cookies = [];
        if (document.cookie && document.cookie != '') {
            var _cookies = document.cookie.split(';');
            for (var i = 0; i < _cookies.length; i++) {
                var name_value = _cookies[i].split("=");
                name_value[0] = name_value[0].replace(/^ /, '');
                cookies.push({
                    key:decodeURIComponent(name_value[0]),
                    value:decodeURIComponent(name_value[1])
                })
            }
        }
        return cookies;
    }

    var $Cookie;
    $Cookie = Class.extend({

        /**
         * @param {string} key
         * @returns {object}
         * @public
         */

        get: function (key) {
            var value= $.cookie(key);
            try {
                value = JSON.parse(value);
            } catch (ex) {
            }
            return value;
        },

        /**
         *
         * @param {string} key
         * @param {object} value
         * @param {object} [params]
         * @public
         */
        set: function (key,value,params) {
            if(params===undefined){
                params={};
                params.path='/';
            }
            if(params.path===undefined)params.path='/';
            if (params.expires === undefined) params.expires = 365;
            if(typeof value==='object')value=JSON.stringify(value);
            $.cookie(key,value,params);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            var cookies = _getCookies();
            try{
                return cookies[index].key;
            }catch(ex){
                return null;
            }
        },

        /**
         *
         * @param {string} key
         * @param {object} params
         * @public
         */
        delete: function (key,params) {
            if(params===undefined)params={path:'/'};
            $.removeCookie(key,params);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            var cookies = document.cookie.split('; ');
            return cookies.length;
        },

        /**
         * @public
         */
        clear:function(){
            throw "Method 'clear' not implemented by the cookie provider";
        }

    }, {});



    return $Cookie;

}));

/*
 * =============================================================
 * elliptical.$Local
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Local = factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Local;
    }
}(this, function (Class) {

    var $Local;
    $Local = Class.extend({


        /**
         * @param {string} key
         * @returns {object}
         * @public
         */
        get: function (key) {
            var value = localStorage.getItem(key);
            try {
                value = JSON.parse(value);
            } catch (ex) {

            }

            return value;
        },

        /**
         * @param {string} key
         * @param {object} value
         * @param {object} [params]
         * @public
         */
        set: function (key, value, params) {
            if (typeof value === 'object') value = JSON.stringify(value);
            localStorage.setItem(key, value);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return sessionStorage.key(index);
        },

        /**
         *
         * @param {string} key
         */
        delete: function (key) {
            localStorage.removeItem(key);
        },

        /**
         * @returns {number}
         * @public
         */
        count:function(){
            return localStorage.length;
        },

        /**
         * @public
         */
        clear: function () {
            localStorage.clear();
        }


    }, {});



    return $Local;

}));



/*
 * =============================================================
 * elliptical.$Session
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Session = factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Session;
    }
}(this, function (Class) {

    var $Session;
    $Session = Class.extend({


        /**
         * @param {string} key
         * @returns {object}
         * @public
         */
        get: function (key) {
            var value = sessionStorage.getItem(key);
            try {
                value = JSON.parse(value);
            } catch (ex) {

            }

            return value;
        },

        /**
         * @param {string} key
         * @param {object} value
         * @param {object} [params]
         * @public
         */
        set: function (key, value, params) {
            if (typeof value === 'object') value = JSON.stringify(value);
            sessionStorage.setItem(key, value);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return sessionStorage.key(index);
        },

        /**
         *
         * @param {string} key
         * @public
         */
        delete: function (key) {
            sessionStorage.removeItem(key);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            return sessionStorage.length;
        },

        /**
         * @public
         */
        clear: function () {
            sessionStorage.clear();
        }


    }, {});


    return $Session;

}));



/*
 * =============================================================
 * elliptical.$Memory
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Memory = factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Memory;
    }
}(this, function (Class) {

    var $Memory;
    $Memory = Class.extend({

        _Map: {
            _map:null,
            get dictionary(){
                if(this._map) return this._map;
                else return new Map();
            }
        },


        /**
         * @param {string} key
         * @returns {object}
         * @public
         */
        get: function (key) {
            var map=this._Map.dictionary;
            return map.get(key);

        },

        /**
         * @param {string} key
         * @param {object} value
         * @param {object} [params]
         * @public
         */
        set: function (key, value, params) {
            var map=this._Map.dictionary;
            map.set(key,value);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            var map=this._Map.dictionary;
            var i=0;
            var key_=null;
            map.forEach(function(value, key) {
                if(index===i) key_=key;
                i++;
            });

            return key_;
        },

        /**
         *
         * @param {string} key
         */
        delete: function (key) {
            var map=this._Map.dictionary;
            map.delete(key);
        },

        /**
         * @returns {number}
         * @public
         */
        count:function(){
            var map=this._Map.dictionary;
            return map.size;
        },

        /**
         * @public
         */
        clear: function () {
            var map=this._Map.dictionary;
            map.clear();
        }


    }, {});



    return $Memory;

}));



/*
 * =============================================================
 * elliptical.$OData
 * =============================================================
 * for odata v4
 * 
 * supports common odata queries
 * supports navigation,complex queries as pass throughs
 * 
 * e.g
 *  can take a standard url query: ?c_Name=Book&cq_12=Filters/any(d:d/id eq 5)
 *  and convert into odata format-->$filter=contains(Name%2C%27Book%27)%20and%20Filters%2Fany(d%3Ad%2FId%20eq%2012)&$top=12&$count=true
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./provider'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./provider'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.$OData = factory(root.elliptical.Provider);
        root.returnExports = root.elliptical.$OData;
    }
}(this, function (Provider) {

    var $OData;
    $OData = Provider.extend({

        /**
         *
         * @param {string} endpoint
         * @param {*} filter
         * @returns {string}
         */
        filter: function (endpoint, filter) {
            if (typeof filter === 'object') filter = this._getFilterString(filter);
            if(filter && filter !==''){
                var encodedFilter = '$filter=' + encodeURIComponent(filter);
                return (endpoint.indexOf('?') > -1) ? '&' + encodedFilter : '?' + encodedFilter;
            }else return '';

        },

        /**
         *
         * @param {string} endpoint
         * @param {string} orderBy
         * @returns {string}
         * @public
         */
        orderBy: function (endpoint, orderBy) {
            if(orderBy.indexOf('.') > -1) orderBy=this._getNestedQueryProp(orderBy);
            var encodedOrderBy = '$orderby=' + encodeURIComponent(orderBy);
            return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderBy : '?' + encodedOrderBy;
        },

        /**
         *
         * @param endpoint
         * @param orderBy
         * @param orderByDesc
         * @returns {string}
         * @public
         */
        orderByDesc: function (endpoint, orderBy, orderByDesc) {
            if(orderByDesc.indexOf('.') > -1) orderByDesc=this._getNestedQueryProp(orderByDesc);
            if (orderBy !== undefined) return ', ' + encodeURIComponent(orderByDesc + ' desc');
            else {
                var encodedOrderByDesc = '$orderby=' + encodeURIComponent(orderByDesc + ' desc');
                return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderByDesc : '?' + encodedOrderByDesc;
            }
        },

        /**
         *
         * @param {string} endpoint
         * @param {string} top
         * @returns {string}
         * @public
         */
        top: function (endpoint, top) {
            var encodedTop = '$top=' + top;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedTop : '?' + encodedTop;
        },

        /**
         *
         * @param {string} endpoint
         * @param {string} skip
         * @returns {string}
         * @public
         */
        skip: function (endpoint, skip) {
            var encodedSkip = '$skip=' + skip;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedSkip : '?' + encodedSkip;
        },

        /**
         *
         * @param {string} endpoint
         * @param {object} params
         * @returns {string}
         * @public
         */
        paginate: function (endpoint, params) {
            var page = params.page,
                pageSize = params.pageSize,
                skip,
                encodedPaginate;

            if (typeof page === 'undefined' || typeof pageSize === 'undefined') return endpoint;
            else {
                page--;
                skip = page * pageSize;
                encodedPaginate = (skip > 0) ? '$skip=' + skip + '&$top=' + pageSize + '&$count=true' : '$top=' + pageSize + '&$count=true';
                return (endpoint.indexOf('?') > -1) ? '&' + encodedPaginate : '?' + encodedPaginate;
            }
        },

        _getNestedQueryProp:function(nestedProp){
            nestedProp=nestedProp.replace(/\./g,'/');
            return nestedProp;
        },

        _getFilterString: function (query) {
            /*
             default:[field] eq [value]

             sw_[field]==startswith
             swl_[field]==startswith, tolower
             swu_[field]==startswith, toupper
             c_[field]==contains
             cl_[field]==contains,tolower
             cu_[field]==contains,toupper
             ew_[field]==endswith
             ewl_[field]==endswith,tolower
             ewu_[field]==endswith,toupper
             eql_[field]==eq, tolower
             equ_[field]==eq,toupper
             cq_[xxx] ==custom query; value passed as is
             examples: sw_Name=Bob ---> startswith(Name,'Bob')
             Name=Bob --> Name eq 'Bob'
             cl_Name=B ---> substringof(tolower(Name),tolower('B'))
             cq_S=Styles/any(d:d/id eq 5)  --> $filter=Styles/any(d:d/id eq 5)
             */
            var str = '';
            var checksum = 0;
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    var prop;
                    var value = decodeURIComponent(query[key]);
                    if (key.indexOf('sw_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and startswith(" + prop + ",'" + value + "')" : "startswith(" + prop + ",'" + value + "')";
                        checksum++;
                    } else if (key.indexOf('swl_') === 0) {
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and startswith(tolower(" + prop + "),tolower('" + value + "'))" : "startswith(tolower(" + prop + "),tolower('" + value + "'))";
                        checksum++;
                    }else if(key.indexOf('swu_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and startswith(toupper(" + prop + "),toupper('" + value + "'))" : "startswith(toupper(" + prop + "),toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('c_') === 0) {
                        prop = key.substring(2);
                        str += (checksum > 0) ? " and contains(" + prop + ",'" + value + "')" : "contains(" + prop + ",'" + value + "')";
                        checksum++;
                    } else if (key.indexOf('cl_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and contains(tolower(" + prop + "),tolower('" + value + "'))" : "contains(tolower(" + prop + "),(tolower('" + value + "'))";
                        checksum++;
                    } else if(key.indexOf('cu_')===0){
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and contains(toupper(" + prop + "),toupper('" + value + "'))" : "contains(toupper(" + prop + "),(toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('ew_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and endswith(" + prop + ",'" + value + "')" : "endswith(" + prop + ",'" + value + "')";
                        checksum++;
                    }else if (key.indexOf('ewl_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and endswith(tolower(" + prop + "),tolower('" + value + "'))" : "endswith(tolower(" + prop + "),tolower('" + value + "'))";
                        checksum++;
                    }else if(key.indexOf('ewu_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and endswith(toupper(" + prop + "),toupper('" + value + "'))" : "endswith(toupper(" + prop + "),toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('eql_') === 0) {
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and tolower(" + key + ") eq tolower('" + value + "')" : "tolower(" + key + ") eq tolower('" + value + "')";
                        checksum++;
                    }else if(key.indexOf('equ_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and toupper(" + key + ") eq toupper('" + value + "')" : "toupper(" + key + ") eq toupper('" + value + "')";
                        checksum++;
                    } else if(key.indexOf('cq_') ===0){
                        str += (checksum > 0) ? " and " + value : value;
                        checksum++;
                    } else if(key.indexOf('search_')===0){
                        prop=key.substring(7);
                        var props=prop.split("_");
                        var search='';
                        //search_Name_Id=bob
                        //Name=bob_Id=11
                        for(var i=0;i<props.length;i++){
                            var _prop=props[i];
                            if(i>0) search += " or ";
                            search += "contains(tolower(" + _prop + "),tolower('" + value + "'))";
                        }
                        str += (checksum > 0) ? " and " + search : search;
                        checksum++;
                    } else if ((key.indexOf('$') !== 0) && key.toLowerCase()!=='page') {
                        str += (checksum > 0) ? " and " + key + " eq '" + value + "'" : key + " eq '" + value + "'";
                        checksum++;
                    }

                }
            }

            return str;
        }

    }, {});

    return $OData;


}));

/*
 * =============================================================
 * elliptical.$Rest
 * =============================================================
 * generic rest provider
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('./provider'), require('elliptical-http'), require('./provider.odata'),require('./factory'),require('async'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','./provider', 'elliptical-http', './provider.odata','./factory','async'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Rest = factory(root.elliptical.utils,root.elliptical.Provider, root.elliptical.http, root.elliptical.$OData,root.elliptical.factory,root.async);
        root.returnExports = root.elliptical.$Rest;
    }
}(this, function (utils,Provider, http, $OData,factory,async) {

    var object=utils.object;
    var string=utils.string;

    var $Rest;
    $Rest = Provider.extend({
        _data: null,
        port: null,
        path: null,
        host: null,
        protocol: null,
        $queryProvider: $OData,
        onSend: null,
        withCredentials: false,

        /**
         * @constructs
         * @param {object} opts
         * @param {object} $queryProvider
         */
        init: function (opts, $queryProvider) {
            opts = opts || {};
            this.host = opts.host || this.constructor.host;
            this.host = this.host || 'localhost';
            this.port = opts.port || this.constructor.port;
            this.port = this.port || 80;
            this.path = opts.path || this.constructor.path;
            this.path = this.path || '/api';
            this.protocol = opts.protocol || this.constructor.protocol;
            this.protocol = this.protocol || 'http';
            this.withCredentials = opts.withCredentials || this.constructor.withCredentials;

            if ($queryProvider !== undefined) this.$queryProvider = $queryProvider;
        },

        /**
         * http get
         * @param params {Object}
         * @param resource {String}
         * @param query {Object}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        get: function (params, resource, query, callback) {
            if (typeof query === 'function') callback = query;

            var options = this._getOptions(resource, 'GET', undefined);

            var q = '';
            var i = 0;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var val = encodeURIComponent(params[key]);
                    if (i === 0) {
                        q += '?' + key + '=' + val;
                        i++;
                    } else {
                        q += '&' + key + '=' + val;
                    }
                }
            }

            if (q !== '') {
                if(resource) options.path += (resource.indexOf('/') === -1) ? '/' + q : q;
                else options.path +=q;
            }

            //test query options
            if (query && typeof query.filter !== 'undefined' && !object.isEmpty(query.filter)) {
                options.path += this.$queryProvider.filter(options.path, query.filter);
            }

            if (query && typeof query.orderBy !== 'undefined' && !object.isEmpty(query.orderBy)) {
                options.path += this.$queryProvider.orderBy(options.path, query.orderBy);
            }

            if (query && typeof query.orderByDesc !== 'undefined' && !object.isEmpty(query.orderByDesc)) {
                options.path += this.$queryProvider.orderByDesc(options.path, query.orderBy, query.orderByDesc);
            }

            if (query && typeof query.paginate !== 'undefined') {
                options.path += this.$queryProvider.paginate(options.path, query.paginate);
            } else {
                //don't allow mixing of paginate with skip/top since paginate is more or less a convenience wrapper for skip & top
                if (query && typeof query.skip !== 'undefined') options.path += this.$queryProvider.skip(options.path, query.skip);
                if (query && typeof query.top !== 'undefined') options.path += this.$queryProvider.top(options.path, query.top);
            }

            //send
            this._send(options, resource, callback);

        },

        /**
         * http post
         * @param {object} params
         * @param {string} resource
         * @param {function} callback
         * @public
         */
        post: function (params, resource, callback) {
            var options = this._getOptions(resource, 'POST', params);
            this._send(options, resource, callback);
        },



        /**
         * http put
         * @param {object} params
         * @param {string} resource
         * @param {function} callback
         * @public
         */
        put: function (params, resource, callback) {
            var options = this._getOptions(resource, 'PUT', params);
            this._send(options, resource, callback);
        },


        /**
         * http delete
         * @param {object} params
         * @param {string} resource
         * @param {function} callback
         * @public
         */
        delete: function (params, resource, callback) {
            if (params.ids && params.ids !== undefined) this.post(params.ids, resource, callback);
            else this._delete(params, resource, callback);
        },

        /**
         *
         * @param {object} params
         * @param {string} resource
         * @param {function} callback
         * @private
         */
        _delete: function (params, resource, callback) {
            var options = this._getOptions(resource, 'DELETE', undefined);
            var q = '';
            var i = 0;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var val = encodeURIComponent(params[key]);
                    if (i === 0) {
                        q += '?' + key + '=' + val;
                        i++;
                    } else {
                        q += '&' + key + '=' + val;
                    }
                }
            }

            if (q != '') options.path += '/' + q;

            //send
            this._send(options, resource, callback);
        },


        /**
         * send the request
         * @param {object} options
         * @param {string} resource
         * @param {function} callback
         * @private
         */
        _send: function (options, resource, callback) {

            /* we asynchronously pass through to onSend(if a callback has been defined)

             ex:
             $myRestProvider.onSend=function(options, resource,callback){
             options.authorization=http.encodeSessionToken(req.cookies.authToken);
             callback.call(this,null,options);
             };
             */

            if(this.onSend) {
                this.onSend(options,resource,function(err,data){
                    if(err) callback(err,data);
                    else http.send(data,callback);
                });
            }
            else http.send(options,callback);
        },

        /**
         * constructs the request options object
         * @param {string} method
         * @param {string} resource
         * @param {object} data
         * @returns {object}
         * @private
         */
        _getOptions: function (resource, method, data) {
            var options = {};
            options.host = this.host || this.constructor.host;
            options.port = this.port || this.constructor.port;
            options.method = method;
            options.path = this.path || this.constructor.path;
            if(resource) resource = (string.firstChar(resource) === '/') ? resource : '/' + resource;
            else resource='';
            options.path = options.path + resource;
            options.protocol = this.protocol || this.constructor.protocol;
            options.withCredentials = this.withCredentials || this.constructor.withCredentials;

            if (data && data !== undefined) options.data = data;

            return options;
        }


    });

    return $Rest;

}));

/*
 * =============================================================
 * elliptical.$Pagination
 * =============================================================
 * returns a pagination ui context(object) for template binding
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./provider'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./provider'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Pagination = factory(root.elliptical.Provider);
        root.returnExports = root.elliptical.$Pagination;
    }
}(this, function (Provider) {
    /**
     * @param paginate {Object}
     * @param pagination {Object}
     * @param data {Object}
     * @returns {Object}
     */


    var $Pagination;
    $Pagination = Provider.extend({
        count: 'count',
        data: 'data',
        spread: 10,
        pageQueryString:false,

        /**
         *
         * @param {object} params
         * @param {object} data
         * @returns {{pagination, data}|*}
         * @public
         */
        get: function (params, data) {

            var count_ = this.count;
            var data_ = this.data;
            var spread_ = this.spread;

            if (params.paginate) params = params.paginate;

            return _pagination(params, data,this.pageQueryString);

            /**
             *
             * @param {object} params
             * @param {object} result
             * @param {boolean} useQueryString
             * @returns {object}
             * @qpi private
             */
            function _pagination(params, result,useQueryString) {
                var baseUrl, rawUrl, page, count, pageSize, pageSpread, data;
                baseUrl = params.baseUrl;
                rawUrl = params.rawUrl;
                page = params.page;


                if (result instanceof Array) {
                    count = result.length;
                    data = result;

                } else {
                    count = result[count_];
                    data = result[data_];
                    if (count === undefined) count = result.count;
                    if (data === undefined) data = result.data;
                }


                pageSize = params.pageSize;
                pageSpread = spread_;
                try {
                    page = parseInt(page);
                } catch (ex) {
                    page = 1;
                }

                var pageCount = parseInt(count / pageSize);
                var remainder = count % pageSize;
                if (pageCount < 1) pageCount = 1;
                else if (remainder > 0) pageCount++;

                //query search part of url
                var querySearch = getQuerySearch(rawUrl);

                //pagination object
                var pagination = {
                    page: page,
                    pageCount: pageCount,
                    prevPage: assignUrl(baseUrl,1,querySearch,rawUrl,useQueryString),
                    firstPage: null,
                    prevClass: 'hide',
                    nextPage: assignUrl(baseUrl,pageCount,querySearch,rawUrl,useQueryString),
                    nextClass: 'hide',
                    lastPage: null,
                    pages: [],
                    beginRecord: null,
                    endRecord: null,
                    count: count

                };
                //assign pagination properties
                //prev
                if (page > 1) {
                    pagination.prevClass = '';
                    pagination.prevPage = assignUrl(baseUrl, parseInt(page - 1), querySearch,rawUrl,useQueryString);
                }
                //next
                if (page < pageCount) {
                    pagination.nextClass = '';
                    pagination.nextPage = assignUrl(baseUrl, parseInt(page + 1), querySearch,rawUrl,useQueryString);
                }

                //get page links

                pagination.pages = _pageLinks(baseUrl, page, pageCount, pageSpread, querySearch,rawUrl,useQueryString);


                //first,last pages
                pagination.firstPage = assignUrl(baseUrl, 1, querySearch,rawUrl,useQueryString);
                pagination.lastPage = assignUrl(baseUrl, pageCount, querySearch,rawUrl,useQueryString);
                if (page === pageCount) pagination.nextPage = pagination.lastPage;

                //assign record pointers
                var currentPointer = assignRecordPointers(count, page, pageSize);
                pagination.beginRecord = currentPointer.beginRecord;
                pagination.endRecord = currentPointer.endRecord;

                return {
                    pagination: pagination,
                    data: data
                };

            }


            /**
             *
             * @param {string} baseUrl
             * @param {number} page
             * @param {number} pageCount
             * @param {number} pageSpread
             * @param {string} querySearch
             * @param {string} rawUrl
             * @param {boolean} useQueryString
             * @returns {Array}
             * @api private
             */
            function _pageLinks(baseUrl, page, pageCount, pageSpread, querySearch,rawUrl,useQueryString) {
                var pages = [];
                if (pageSpread > pageCount) {
                    pageSpread = pageCount;
                }

                if (page < pageSpread) {

                    for (var i = 0; i < pageSpread; i++) {
                        var obj = {
                            page: i + 1,
                            pageUrl: assignUrl(baseUrl, parseInt(i + 1), querySearch,rawUrl,useQueryString)
                        };

                        if (i === parseInt(page - 1)) obj.activePage = 'active';
                        pages.push(obj);
                    }
                    return pages;
                } else {
                    var halfSpread = parseInt(pageSpread / 2);
                    var beginPage, endPage;
                    if (pageCount < page + halfSpread) {
                        endPage = pageCount;
                        beginPage = endPage - pageSpread;
                    } else {
                        endPage = page + halfSpread;
                        beginPage = page - halfSpread;
                    }
                    if(beginPage===0) beginPage=1;
                    for (var i = beginPage; i < endPage + 1; i++) {
                        var obj = {
                            page: i,
                            pageUrl: assignUrl(baseUrl, i, querySearch,rawUrl,useQueryString)
                        };
                        if (i === page) obj.activePage = 'active';
                        pages.push(obj);
                    }
                    return pages;
                }
            }

            /**
             *
             * @param {string} baseUrl
             * @param {number} index
             * @param {string} querySearch
             * @param {string} rawUrl
             * @param {boolean} useQueryString
             * @returns {string}
             * @api private
             */
            function assignUrl(baseUrl, index, querySearch,rawUrl,useQueryString) {
                var pageUrl;
                if(useQueryString){
                    pageUrl=baseUrl + setQuery('page',index,querySearch,rawUrl);
                }else{
                    pageUrl = baseUrl + '/' + index;
                    if (querySearch && querySearch !== undefined) pageUrl += querySearch;
                }
                
                return pageUrl;
            }

            /**
             *
             * @param {number} count
             * @param {number} page
             * @param {number} pageSize
             * @returns {object}
             * @api private
             */
            function assignRecordPointers(count, page, pageSize) {
                var beginRecord = (page - 1) * pageSize + 1;
                if (count === 0) beginRecord = 0;
                var endRecord = page * pageSize;
                if (endRecord > count) endRecord = count;
                return {
                    beginRecord: beginRecord,
                    endRecord: endRecord
                };
            }

             /**
             *
             * @param {string} url
             * @returns {string}
             * @api private
             */
            function getQuerySearch(url) {
                if(!url) return null;
                var index = url.indexOf('?');
                var length = url.length;
                if (index > -1) return url.substring(index, length);
                else return null;
            }
            
            /**
             *
             * @param {string} url
             * @param {string} ji
             * @returns {string}
             * @api private
             */
            function queryString(url, ji) {
               var hu = url.split('?')[1];
               if (typeof hu !== 'undefined') {
                  var gy = hu.split("&");
                  for (i = 0; i < gy.length; i++) {
                      var ft = gy[i].split("=");
                      if (ft[0] == ji) return ft[1];
                  }
               }
               
               return null;
            }
            
            /**
             *
             * @param {string} url
             * @param {string} val
             * @param {string} search
             * @param {string} u
             * @returns {string}
             * @api private
             */
            function setQuery(key,val,search,u){
               if (search && search!=='') {
                  var val_ = queryString(u, key);
                  if (!val_) search += '&' + key + '=' + encodeURIComponent(val);
                  else search=search.replace(key + '=' + val_, key + '=' + val);
               }else search = '?' + key + '=' + encodeURIComponent(val);
            
               return search;
            }
        }


    }, {});


    return $Pagination;

}));
/*
 * =============================================================
 * elliptical.$Sort
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'),require('elliptical-location').Location);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class','elliptical-location'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Sort = factory(root.elliptical.Class,root.elliptical.Location);
        root.returnExports = root.elliptical.$Sort;
    }
}(this, function (Class,Location) {
    if(Location.Location !==undefined) Location=Location.Location;
    var $Sort;

    $Sort = Class.extend({

        /**
         * @param {object} params
         * @public
         */
        sort: function (params) {
            var sortOrder = params.sortOrder;
            var field = params.field;
            var url = Location.href;
            var queryVar = (sortOrder === 'asc') ? '$orderBy' : '$orderByDesc';
            var path = this._getSortUrl(url, field, queryVar);
            Location.href=path;
        },

        /**
         * @param {object} params
         * @public
         */
        sorted: function (params) {
            var url = Location.href;
            if (url.indexOf('$orderBy') <= -1) return null;
            else {
                var field = Location.url.queryString(url, '$orderBy');
                if (field && field !== undefined) {
                    return {
                        field: field,
                        sort: 'asc'
                    };
                } else {
                    return {
                        field: Location.url.queryString(url, '$orderByDesc'),
                        sort: 'desc'
                    }
                }
            }
        },

        /**
         *
         * @param {object} params
         * @public
         */
        refresh: function (params) {
            if (typeof params === 'string') Location.redirect(params);
        },

        _getSortUrl: function (url, val, queryVar) {
            var index = url.indexOf('$orderBy');
            var str = queryVar + '=' + encodeURIComponent(val);
            if (index > -1) {
                url = url.substr(0, index) + str;
                return url;
            } else {
                url += (url.indexOf('?') > -1) ? '&' + str : '?' + str;
                return url;
            }
        }


    }, {});


    return $Sort;

}));


/*
 * =============================================================
 * elliptical.Store
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Store=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Store;
    }
}(this, function (Class) {

    var Store;
    Store=Class.extend({
        '@resource':'Store',
        $provider:null,

        /**
         *
         * @param {string} key
         * @returns {*}
         * @public
         */
        get:function(key){
            return this.$provider.get(key);
        },

        /**
         *
         * @param {string} key
         * @param {object} value
         * @param {object} params
         * @public
         */
        set:function(key,value,params){
            return this.$provider.set(key,value,params);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return this.$provider.key(index);
        },

        /**
         *
         * @param {string} key
         * @public
         */
        delete:function(key){
            return this.$provider.delete(key);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            return this.$provider.count();
        },

        /**
         *
         * @public
         */
        clear:function(){
            return this.$provider.clear();
        }
    },{
        /**
         * Constructor
         * @constructs
         * @param {string} name
         * @param {object} provider
         */
        init:function(name,provider){
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }
        },

        /**
         *
         * @param {string} key
         * @returns {*}
         * @public
         */
        get:function(key){
            return this.constructor.get(key);
        },

        /**
         *
         * @param {string} key
         * @param {object} value
         * @param {object} params
         * @public
         */
        set:function(key,value,params){
            return this.constructor.set(key,value,params);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return this.constructor.key(index);
        },

        /**
         *
         * @param {string} key
         * @public
         */
        delete:function(key){
            return this.constructor.delete(key);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            return this.constructor.count();
        },

        /**
         *
         * @public
         */
        clear:function(){
            return this.constructor.clear();
        }
    });

    return Store;

}));

/*
 * =============================================================
 * elliptical.Validation
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.Validation=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Validation;
    }
}(this, function (Class) {


    var Validation=Class.extend({
        '@resource':'Validation', //{String},
        $provider:null,

        /**
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        post: function (data, name, callback) {
            this.$provider.post(data,name,callback);
        },


        /**
         *
         * @param {object} data
         * @returns {*}
         * @public
         */
        onSuccess:function(data){
            return this.$provider.onSuccess(data);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        onError:function(params){
            return this.$provider.onError(params);
        }



    }, {
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },

        /**
         *
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        post: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !this.$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.post(data, name, callback);
        },

        /**
         *
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        put: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.put(data, name, callback);
        },

        /**
         *
         * @param {object} data
         * @returns {*}
         * @public
         */
        onSuccess: function (data) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onSuccess(data);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        onError: function (params) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onError(params);
        }

    });

    return Validation;



}));


/*
 * =============================================================
 * elliptical.Search
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Search=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Search;
    }
}(this, function (Class) {

    var Search;
    Search=Class.extend({
        '@resource':'Search',
        $provider:null,

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        find:function(params){
            return this.$provider.find(params);
        }

    },{
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },


        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        find:function(params){
            return this.constructor.find(params);
        }


    });

    return Search;

}));


/*
 * =============================================================
 * elliptical.Sort
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Sort=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Sort;
    }
}(this, function (Class) {

    var Sort;
    Sort=Class.extend({
        '@resource':'Sort',
        $provider:null,

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sort:function(params){
            return this.$provider.sort(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sorted:function(params){
            return this.$provider.sorted(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        refresh:function(params){
            return this.$provider.refresh(params);
        }

    },{
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },


        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sort:function(params){
            return this.constructor.sort(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sorted:function(params){
            return this.constructor.sorted(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        refresh:function(params){
            return this.constructor.refresh(params);
        }


    });

    return Sort;

}));

/*
 * =============================================================
 * elliptical.throttle
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-lodash').func);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-lodash'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.throttle=factory(root._.func);
        root.returnExports = root.elliptical.throttle;
    }
}(this, function (_) {

    if(_.func !==undefined) _=_.func;

    return function throttle(fn,delay,opts){
        if(typeof delay==='undefined'){
            delay=1000;
        }
        if(typeof opts==='undefined'){
            opts={};
        }
        _.throttle(fn,delay,opts);
    }


}));