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