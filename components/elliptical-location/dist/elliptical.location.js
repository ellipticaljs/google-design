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



///Location

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('./url'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([root,'elliptical-utils','./url'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.Location=factory(root.elliptical.utils,root.elliptical.url);
        root.returnExports = root.elliptical.Location;
    }
}(this, function (utils,url) {

    var string=utils.string;
    var DEFAULT_ROOT='/';
    var HASH_TAG='#';

    var Location={
        "@resource":'Location',

        stateObject:null,

        /**
         *
         * @returns {string}
         * @public
         */
        get hashTag(){
            var hashTag=window.elliptical.$hashTag;
            if(hashTag===undefined)return false;
            return hashTag;
        },

        /**
         *
         * @returns {string}
         * @public
         */
        get virtualRoot(){
            var virtualRoot= window.elliptical.$virtualRoot;
            if(virtualRoot===undefined)return DEFAULT_ROOT;
            return virtualRoot;
        },

        /**
         * if hashTag bit is set, adds a hashtag to the route, if not already present
         * @param {string} route
         * @returns {string}
         * @public
         */
        hashify:function(route){
            var path=location.pathname;
            if(path===undefined) path='/';
            var hash=location.hash;
            var virtualRoot=this.virtualRoot;
            var isVirtual=(virtualRoot !== DEFAULT_ROOT);
            if(this.hashTag && isVirtual){
                if(route.indexOf(virtualRoot) !==0)route=virtualRoot + route;
                var index=virtualRoot.length;
                if((route).charAt(index + 1) !== HASH_TAG)route=string.insertAt(route,index,'/#');
            }else if(this.hashTag){
                if((route).charAt(1) !== HASH_TAG)route=path + '#' + route;
            }else if(isVirtual){
                if(route.indexOf(virtualRoot) !==0)route=virtualRoot + route;
            }

            return route;
        },

        /**
         * if hashTag bit is set, removes the leading hashtag from the route
         * @param {string} route
         * @returns {string}
         * @public
         */
        deHashify:function(route){
            var virtualRoot=this.virtualRoot;
            if(virtualRoot !==DEFAULT_ROOT){
                if(route.indexOf(virtualRoot)===0)route=route.replace(virtualRoot,'');
            }
            if(this.hashTag){
                var path=location.pathname;
                if(path !=='/') route=route.replace(path,'');
                if((route).charAt(1) === HASH_TAG)route=route.substring(2);
                route=route.replace(HASH_TAG,'');
            }
            return route;
        },

        /**
         *
         * @param {string} route
         * @returns {string}
         * @public
         */
        hashRoot:function(route){
            if(this.hashTag && route.slice(-1)===HASH_TAG) route+=DEFAULT_ROOT;
            return route;
        },

        /**
         * replaces location.path, factoring out virtual root and hashtag
         * @returns {string}
         * @public
         */
        get path(){
            var hashTag=this.hashTag;
            var virtualRoot=this.virtualRoot;
            var path;
            if(hashTag){
                path=location.hash;
                if((path).charAt(0) ===HASH_TAG)path=path.substring(1);
                if(path==='')path=DEFAULT_ROOT;
                path=this.toPath(path);
            }else{
                path=location.pathname;
                if(virtualRoot!==DEFAULT_ROOT ){
                    if(path.indexOf(virtualRoot)===0)path=path.replace(virtualRoot,'');
                }
            }
            return path;
        },

        /**
         *
         * @returns {string}
         * @public
         */
        get href(){
            var origin=location.origin;
            var path=this.path;
            var search=this.search;
            return origin + path + search;
        },

        /**
         *
         * @param {string} val
         * @public
         */
        set href(val){
            this.redirect(val);
        },

        /**
         *
         * @returns {object}
         * @public
         */
        get query(){
            var u=this.href;
            return url.query(u);
        },

        /**
         *
         * @returns {string}
         * @public
         */
        get search(){
            if(this.hashTag){
                var url_=location.hash;
                var length=url_.length;
                var index=url_.indexOf('?');
                if(index>-1)return url_.substring(index,length);
                else{
                    return '';
                }
            }else{
                return location.search;
            }
        },

        /**
         *
         * @param {string} val
         * @public
         */
        set search(val){
            if(this.hashTag){
                var hash=location.hash;
                var index=hash.indexOf('?');
                if(index>-1){
                    hash=string.replaceAt(hash,index,val);
                    location.hash=hash;
                }else{
                    location.hash+=val;
                }
            }else{
                location.search=val;
            }
        },

        /**
         *
         * @param {string} u
         * @returns {object}
         * @public
         */
        getQuery:function(u){
            return url.query(u);
        },

        /**
         *
         * @param {string} key
         * @param {string} val
         * @returns {string}
         * @public
         */
        setQuery:function(key,val){
            var search = this.search;
            if (search !== '') {
                var u = this.href;
                var val_ = url.queryString(u, key);
                if (!val_) search += '&' + key + '=' + encodeURIComponent(val);
                else {
                    search=search.replace(key + '=' + val_, key + '=' + val);
                }
            } else {
                search = '?' + key + '=' + encodeURIComponent(val);
            }
            return search;
        },

        getSearch:function(u){
            var s='';
            var index=0;
            var query=this.getQuery(u);
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    if(index===0) s+='?';
                    else s+='&';
                    s+=key + '=' + encodeURIComponent(query[key]);
                }
            }
            return s;
        },

        /**
         *
         * @param {string} route
         * @returns {string}
         * @public
         */
        toPath:function(route){
            var rte=route.split('?');
            return rte[0];
        },

        /**
         *
         * @returns {string}
         * @public
         */
        get referrer() {
            if(this.stateObject) return this.stateObject.url;
            else{
                return undefined;
            }
        },

        /**
         * triggers a registered route
         * @param {string} route
         */
        redirect:function(route){
            //default implementation using window.location
            location.href=route;
        },

        previous:function(){
            var referrer=this.referrer;
            this.redirect(referrer);
        },

        /**
         * reloads the current route
         * @public
         */
        reload:function(){
            //default implementation using window.location
            location.reload();
        },

        url:url,
        host:location.host,
        hostname:location.hostname,
        origin:location.origin,
        protocol:location.protocol,
        port:location.port

    };

    return Location;

}));

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-class'),require('elliptical-event'),require('./location'),require('./url'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-class','elliptical-event','./location','./url'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Router=factory(elliptical.utils,elliptical.Class,elliptical.Event,elliptical.Location,elliptical.url);
        root.returnExports = root.elliptical.Router;
    }
}(this, function (utils,Class,Event,Location,url) {

    var string=utils.string;
    var isTouch=('ontouchend' in document);
    var press=isTouch ? 'touchstart' : 'click';

    function _contains(arr,value){
        var bool=false;
        for(i=0;i<arr.length;i++){
            if(arr[i]===value){
                bool=true;
                break;
            }
        }
        return bool;
    }

    ///Listener
    var Listener=Class.extend({
        events:{
            request:'OnDocumentRequest',
            click:'touchclick',
            orientation: 'OnOrientationChange',
            press:press
        },
        backButtonSelector:'[data-role="back"]',

        on:function(){
            $(window).on(this.events.request, this.forward.bind(this));
            $(document).on(this.events.press, this.backButtonSelector, Router.history);
            $(window).on(this.events.orientation, this.forward.bind(this));
        },

        off:function(){
            $(window).off(this.events.request, this.forward.bind(this));
            $(document).off(this.events.press, this.backButtonSelector, Router.history);
            $(window).off(this.events.orientation, this.forward.bind(this));
        },

        reset:function(){
            this.off();
            this.on();
        },

        forward: function(event,data){
            var route=data.route;
            var params={};
            var method=data.method;
            if(data.body) params=data.body;
            if(method===undefined) method='get';
            Router.location(route,method,params);
        }

    },{});


    ///History
    var History=Class.extend({
        popEvent:'OnDocumentHistory',

        stateObject:null,

        poppedDelay:700,

        pushHistory:false,

        startDelay:1000,

        push:function(){
            if(this.pushHistory){
                var stateObject=this.stateObject;
                var title = '';
                stateObject.url = Location.href;
                stateObject.route = Location.hashify(stateObject.route);
                if(string.lastChar(stateObject.route) === '#')stateObject.route+='/';
                Location.stateObject=stateObject;
                window.history.pushState(stateObject, title, stateObject.route);
            }
        },

        pop:function(event){
            var self=this;
            if (event.originalEvent.state) {
                var route = event.originalEvent.state.route;
                route=Location.deHashify(route);
                var params = event.originalEvent.state.params;
                var method = event.originalEvent.state.method;

                this.pushHistory = false;
                if (isTouch) {
                    setTimeout(function () {
                        Route.location(route,method,params);
                        self.dispatchEvent(route,method,params);
                    }, self.poppedDelay);
                } else {
                    Route.location(route,method,params);
                    this.dispatchEvent(route,method,params);
                }
            }
        },

        dispatchEvent:function(route,method,params){
            if(Location.hashTag){
                if(route.indexOf('/#')===0)route=route.substr(2,route.length-2);
            }
            var data={
                route:route,
                url:Location.href,
                method:method,
                data:params
            };

            var event=document.createEvent("CustomEvent");
            event.initCustomEvent(this.popEvent,true,true,data);
            document.dispatchEvent(event);
        },

        start:function(){
            var self=this;
            var route=Location.path;
            var params = Location.search;
            var url = Location.href;
            var method = 'get';
            var stateObj = { route: route, params: params, method: method,url:url };
            this.stateObject = stateObj;
            Location.stateObject=stateObj;
            this.pushHistory = true;
            route=route + params;
            setTimeout(function(){
                Location.redirect(route);//fire the route of the current url
            },self.startDelay);

            $(window).on('popstate', function (event) {
                self.pop(event);
            });
        },

        end: function(){
            var self=this;
            this.stateObject = null;
            Location.stateObject=null;
            this.pushHistory = false;
            $(window).off('popstate', function (event) {
                self.pop(event);
            });
        }

    },{});


    ///Route
    var Route=Class.extend({
        dispatchEvent:'OnRouteDispatch',
        locationChange:'LocationChange',

        add: function (method, route, callbacks) {
            if (this.verify(route, method)) {
                var rte = { route: route, method: method, handle: callbacks };
                Router.routes.push(rte);
                if (Router.debug) {
                    var msg='route: ' + route + ' has been added. Method: ' + method;
                    (Router.enabled) ? console.log(msg) : Router.messageQueue.push(msg);
                }
            }
        },

        remove:function(route,method){
            var index = -1;
            Router.routes.forEach(function(obj,i){
                var route_=obj.route;
                var method_=obj.method;
                if(route===route_ && method===method_)index=i;
            });
            if (index > -1) {
                Router.routes.splice(index, 1);
                if (Router.debug) console.log('route: ' + route + ' has been removed');
            }
        },

        verify: function (route, method) {
            var bool=true;
            Router.routes.every(function(obj){
                var route_=obj.route;
                var method_=obj.method;
                if(route===route_ && method===method_)bool= false;
            });

            return bool;
        },

        decodeUrl:function(url){
            return decodeURIComponent(url.replace(/\+/g, '%20'));
        },

        deserialize:function(s){
            var data = s.split("&");
            var p = [];
            for (var i = 0; i < data.length; i++) {
                var pair = this.decodeUrl(data[i]).split("=");
                var _name = pair[0];
                var value = pair[1];
                var entry = { name: _name, value: value };
                p.push(entry);

            }
            return p;
        },

        location:function(route, method,params){

            route=Location.deHashify(route);
            if(route==='')route='/';
            History.push();

            if (!this.dispatch(route,method,params)) {
                //error --------->no matched route
                //emit the error

                var handlers = [];
                handlers.push(this.error);
                var data_={
                    route:route,
                    handlers:handlers
                };

                Event.emit(this.dispatchEvent,data_);
            }
        },

        dispatch:function(route, method, params){
            var self=this;
            var dispatchEvent=this.dispatchEvent;
            var locationChange=this.locationChange;
            var success = false;
            var routes=Router.routes;
            //retain original route for case sensitivity of querystrings
            var origRoute=route;
            /* routes should be case insensitive */
            route=route.toLowerCase();
            routes.forEach(function(obj,index){
                var body={};
                var query={};
                var route_ = obj.route;
                /* routes should be case insensitive */
                route_=route_.toLowerCase();
                var routePath=Location.toPath(route);
                var rule = url.match(route_);
                var data = rule.parse(routePath);

                if ((data != null) && (obj.method.toLowerCase() === method.toLowerCase()) &&(!success)) {
                    if(method.toLowerCase()!='get') body=params;
                    /* query component */
                    query=url.query(origRoute);

                    //populate the array of route handlers
                    var handlers = [];
                    var fn = self.next(data,body,query,routePath);
                    handlers.push(fn);

                    var callbacks = obj.handle;
                    for (var i = 0; i < callbacks.length; i++) {
                        handlers.push(callbacks[i]);
                    }

                    //emit the dispatch event
                    var data_={
                        route:routePath,
                        handlers:handlers
                    };

                    Event.emit(dispatchEvent, data_);
                    $(window).trigger(locationChange, routePath);
                    success = true;
                }

            });

            return success;

        },

        next: function(params, body,query, route){
            return function (req, res, next) {
                res.statusCode = 200;
                req.params = params;
                req.query=query;
                req.route = route;
                req.body = body;
                next();
            }
        },

        error: function(req, res, next){
            res.statusCode = 404;
            var err = 'Page does not exist';
            next();
        }

    },{});



    ///Router
    var Router = Class.extend({
        "@resource":'Router',
        validMethods:['get','post','put','delete'],
        enabled:false,
        debug:true,
        callbacks:[],
        routes:[],
        virtualRoot:'/',
        hashTag:false,
        messageQueue:[],


        get:function(route,callbacks){
            this.parseMethod('get',route,callbacks);
        },

        post:function(route,callbacks){
            this.parseMethod('post',route,callbacks);
        },

        put:function(route,callbacks){
            this.parseMethod('put',route,callbacks);
        },

        delete:function(route,callbacks){
            this.parseMethod('delete',route,callbacks);
        },

        parseMethod:function(method,route,callbacks){
            if(!_contains(this.validMethods,method))return false;
            var handlers = [];
            if ('string' != typeof route) route = '/';
            if (string.lastChar(route) === '/' && route.length > 1) route = string.trimLastChar(route);
            var args = Array.prototype.slice.call(arguments, 0);
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] === 'function') handlers.push(args[i]);
            }
            if (args.length < 1) console.log('error adding route: "' + route + '".  A route must have at least one handler function.');
            else Route.add(method, route, handlers);

        },

        remove:function(route, method){
            if (!this.enabled) return false;
            Route.remove(route, method);
        },

        removeAll:function(){
            var self=this;
            if (!this.enabled) return false;
            this.routes.forEach(function(obj){
                self.remove(obj.route,obj.method);
            });
        },

        location: function(route, method,params, delay){
            if (!this.enabled) return false;
            if(typeof params==='undefined') params={};
            route=url.sanitize(route);
            route=Location.hashRoot(route);
            var stateObj = { route: route, params: params, method: method,url:Location.href };
            History.stateObject = stateObj;
            History.pushHistory = true;

            if (typeof delay != 'undefined') {
                setTimeout(function () {
                    Route.location(route,method,params);
                }, delay);
            } else {
                Route.location(route, method, params);
            }
        },




        start:function(){
            if (this.enabled) return false;   /* if already started, exit */
            this.enabled = true;
            History.start();
            Listener.on();
            if (this.debug) {
                var msg = 'Router has started in debug mode';
                console.log(msg);
                this.messageQueue.forEach(function(m){
                    console.log(m);
                });
                this.messageQueue.length=0;
            }
        },


        pause: function(){
            this.enabled=false;
            Listener.off();
        },

        resume:function(){
            this.enabled=false;
            Listener.on();
        },

        history:function(pages, delay){
            if (typeof delay != 'undefined') {
                setTimeout(function () {
                    if (typeof pages === 'undefined') window.history.back();
                    else window.history.go(pages);
                }, delay);
            } else {
                if (typeof pages === 'undefined' || typeof pages==='object') window.history.back();
                else window.history.go(pages);
            }
        },

        end: function(){
            this.enabled=false;
            this.routes=[];
            History.end();
            Listener.off();
        },

        /**
         * set Route event provider and event name
         * @param {object} $event
         * @param {string} eventName
         */
        $provider:function($event,eventName){
            if(typeof $event==='string') Route.dispatchEvent=eventName;
            else if(typeof $event !== 'undefined'){
                Event=$event;
                if(typeof eventName==='string') Route.dispatchEvent=eventName;
            }
        },

        /* configure Listener/Event settings */
        configure:function(opts){
            if(opts.request) Listener.events.request=opts.request;
            if(opts.orientation) Listener.events.orientation=opts.orientation;
            if(opts.click) Listener.events.click=opts.click;
            if(opts.backButtonSelector) Listener.backButtonSelector=opts.backButtonSelector;
            if(opts.dispatchEvent) Route.dispatchEvent=opts.dispatchEvent;

            /* reset Listener */
            Listener.reset();
        }

    },{});


    Router.History=History;

    return Router;

}));