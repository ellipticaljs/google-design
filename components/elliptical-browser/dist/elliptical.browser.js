/* monkey patch support for Function.name(IE) */
(function(){
    if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
        Object.defineProperty(Function.prototype, 'name', {
            get: function() {
                var funcNameRegex = /function\s([^(]{1,})\(/;
                var results = (funcNameRegex).exec((this).toString());
                return (results && results.length > 1) ? results[1].trim() : "";
            },
            set: function(value) {}
        });
    }
})();



(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.delegate=root.elliptical.delegate || {};
        root.elliptical.delegate.request =factory();
        root.returnExports =root.elliptical.delegate.request;
    }
}(this, function () {

    //on touch devices, listen for both touchstart and click events for reliable capture
    var EVENT = ('ontouchend' in document) ? 'touchend' : 'click';
    var REQUEST_EVENT='OnDocumentRequest';
    //data-route attr excluded from delegated capture
    var SELECTOR='a:not([data-route])';
    var DOCUMENT=$(document);
    var RUNNING=false;
    
    return function request(){
        if(RUNNING) return;
        else RUNNING=true;
        
        DOCUMENT.on(EVENT, SELECTOR, onRequest);

        function onRequest(event) {
            var target = $(event.currentTarget);
            var href = target.attr('href');
            if (href !== undefined && href !== '#') {
                var propagation = target.attr('data-propagation');
                if (propagation) event.stopPropagation();
                event.preventDefault();

                //create data object
                var data = {
                    method: 'get',
                    href: href
                };

                /* query attributes and attach to the data objects
                 *
                 */
                $.each(this.attributes, function (i, att) {
                    data[att.name.toCamelCase()] = att.value;
                });
                data.route = href;
                //trigger event
                DOCUMENT.trigger(REQUEST_EVENT, data);
            }
        }

    };

}));

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-document'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-document'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.delegate=root.elliptical.delegate || {};
        root.elliptical.delegate.submit=factory($);
        root.returnExports =root.elliptical.delegate.submit;
    }
}(this, function ($) {

    var EVENT='submit';
    var SELECTOR='form[role="form"]';
    var REQUEST_EVENT='OnDocumentRequest';
    var SUBMIT_EVENT='OnDocumentSubmit';
    var DOCUMENT=$(document);
    var RUNNING=false;

    return function submit(){
        if(RUNNING) return;
        else RUNNING=true;

        //form must have role attribute to be captured
        DOCUMENT.on(EVENT, SELECTOR, onSubmit);

        function onSubmit(event) {
            event.stopPropagation();
            event.preventDefault();
            var target=$(event.currentTarget);
            var body = target.document(); //parse form to a javascript POJO

            //create data object
            var data = {
                route: this.action,
                body: body,
                method: $(this).attr('method'),
                element: this
            };

            if(this.action && this.action!=='') DOCUMENT.trigger(REQUEST_EVENT, data);
            DOCUMENT.trigger(SUBMIT_EVENT, data);
        }

    };

}));


(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-class'),require('elliptical-location'),require('elliptical-soa'),
            require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-class','elliptical-location','elliptical-soa'], factory);
    } else {
        //browser

        root.elliptical.Request=factory(root.elliptical.utils,root.elliptical.Class,root.elliptical,root.elliptical);
        root.returnExports = root.elliptical.Request;
    }
}(this, function (utils,Class,location,soa) {
    var Location=location.Location;
    var url=location.url;
    var $Cookie=soa.$Cookie;
    var $Session=soa.$Session;
    var cookieCount;
    var sessionCount;

    var Request;
    Request = Class.extend({}, {
        /**
         * @constructs
         */
        init: function () {

            this.params = {};
            this.query = {};
            this.body = {};
            this.route = {};
            this.files = {};
            cookieCount=$Cookie.count();
            sessionCount=$Session.count();

            Object.defineProperties(this, {
                'path': {
                    get: function () {

                        return Location.path;
                    },
                    configurable: false
                },

                'url': {
                    get: function () {

                        return Location.href;
                    },
                    configurable: false
                },

                'protocol': {
                    get: function () {
                        var protocol = Location.protocol;
                        protocol = protocol.replace(':', '');
                        return protocol;
                    },
                    configurable: false
                },

                'get': {
                    get: function (field) {
                        console.log('warning: "get" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'accepted': {
                    get: function () {
                        console.log('warning: "accepted" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'accepts': {
                    get: function () {
                        console.log('warning: "accepts" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'is': {
                    get: function () {
                        console.log('warning: "is" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'xhr': {
                    get: function () {
                        return true;
                    },
                    configurable: false
                },

                'acceptsLanguage': {
                    get: function (lang) {
                        console.log('warning: "acceptsLanguage" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'acceptsCharset': {
                    get: function (charset) {
                        console.log('warning: "acceptsLanguage" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'acceptsCharsets': {
                    get: function () {

                        return false;
                    },
                    configurable: false
                },

                'acceptedLanguages': {
                    get: function () {

                        return false;
                    },
                    configurable: false
                },

                'originalUrl': {
                    get: function () {

                        return false;
                    },
                    configurable: false
                },

                'subdomains': {
                    get: function () {

                        return false;
                    },
                    configurable: false
                },

                'secure': {
                    get: function () {

                        return false;
                    },
                    configurable: false
                },

                'stale': {
                    get: function () {
                        console.log('warning: "stale" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'fresh': {
                    get: function () {
                        console.log('warning: "fresh" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'host': {
                    get: function () {
                        return window.location.hostname;

                    },
                    configurable: false
                },

                'ip': {
                    get: function () {


                    },
                    configurable: false
                },

                'ips': {
                    get: function () {
                        console.log('warning: "ips" not implemented on the browser.');
                        return false;
                    },
                    configurable: false
                },

                'signedCookies': {
                    get: function () {

                        return {};
                    },
                    configurable: false
                }
            });
            this.session = {};
            for (var i = 0; i < sessionCount; i++) {
                var k = $Session.key(i);
                this.session[k] = $Session.get(k);
            }
            this.cookies = {};
            for (var j = 0 ; j < cookieCount; j++) {
                var k1=$Cookie.key(j);
                this.cookies[k1] = $Cookie.get(k1);
            }
            this._parsedUrl = {};
            this._parsedUrl.pathname = Location.path;
            this._parsedUrl.virtualize = function (u) {
                var hashTag = window.elliptical.$hashTag;
                if (hashTag) u = url.hashTagFormat(url);
                u = url.pathComponent(u);
                return u;
            };
            this.header = function (key) {
                switch (key) {
                    case 'Referer':
                        return document.referrer;
                        break;
                }
            };
        }
    });

    return Request;

}));


(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-class'),require('elliptical-location'),require('elliptical-soa'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-class','elliptical-location','elliptical-soa'], factory);
    } else {
        //browser
        root.elliptical.Response=factory(root.elliptical.utils,root.elliptical.Class,root.elliptical,root.elliptical);
        root.returnExports = root.elliptical.Response;
    }
}(this, function (utils,Class,location,soa) {
    var Location=location.Location;
    var $Cookie=soa.$Cookie;
    var $Session=soa.$Session;

    var Response;
    Response = Class.extend({
        req: {}


    }, {
        /**
         * @constructs
         * @param req
         */
        init: function (req) {
            this.req = req;
            this.charset = {};
            this.context = {};
            this.transition = {};
            this.locals = {};
            this.status = function (value) {

            };
            this.set = function (field, value) {

            };
            this.get = function (field) {

            };
            this.cookie = function (name, value, options) {
                $Cookie.set(name,value,options);
            };
            this.clearCookie = function (name, options) {
                $Cookie.delete(name);
            };

            this.redirect = function (status, url) {
                if (typeof url === 'undefined') {
                    url = status;
                }
                url = decodeURIComponent(url);
                Location.redirect(url);

            };

            this.session=function(name,value){
                $Session.set(name,value);
            };

            this.location = function (path) {

            };
            this.send = function (status, body) {

            };
            this.json = function (status, body) {

            };
            this.jsonp = function (status, body) {

            };
            this.type = function (type) {

            };
            this.format = function (obj) {

            };
            this.attachment = function (filename) {

            };
            this.sendfile = function (path, options, fn) {

            };
            this.download = function (path, options, fn) {

            };
            this.links = function (links) {

            };
            this.scrollTop=function(delay){
                if(delay===undefined) delay=100;
                setTimeout(function(){
                    window.scrollTo(0,0);
                },delay);
            };
            
            this.animateScrollTop=function (delay) {
                if(delay===undefined) delay=100;
                if ($.device.touch) {
                   setTimeout(function () {
                       window.scrollTo(0, 0);
                   }, 100);
                 }else{
                     $('html,body').animate({
                        scrollTop: 0
                     }, 500);
                 }
            }    
        },

        /**
         @param {object} context
         @param {string} template
         @param {object} params - props: append,selector,transition
         @param {function} callback
         */
        render: function (context,template,params, callback) {
            // support 0-4 args
            var req = this.req;
            var template_ = undefined, context_ = undefined, transition_ = undefined,params_=null, callback_ = null;
            var length = arguments.length;

            ///length==0
            if(length===0){
                template_ = {name: req.__name, view: req.__action};
                context_={};
            }

            ///length==1
            if (length === 1) if (typeof context === 'string') {
                template_=context;
                context_ = {};
            } else if (context instanceof Function) {
                callback_ = context;
                template_ = {name: req.__name, view: req.__action};
                context_ = {};
            } else {
                template_ = { name: req.__name, view: req.__action };
                context_ = context;
            }

            ///length==2
            if(length==2){
                if(typeof context==='object'){
                    context_=context;
                    if(typeof template==='string' || template===null) template_=template;
                    else if(template instanceof Function){
                        callback_=template;
                        template_ = { name: req.__name, view: req.__action };
                    }else{
                        params_=template;
                        template_ = { name: req.__name, view: req.__action };
                    }
                } else {
                    context_ = {};
                    template_=context;
                    if(template instanceof Function) callback_=template;
                    else params_=template;
                }
            }

            ///length==3
            if (length == 3) {
                if (typeof context === 'object') {
                    context_ = context;
                    if (typeof template === 'string' || template==null) {
                        template_ = template;
                        if (params instanceof Function) callback_ = params;
                        else params_ = params;
                    } else {
                        template_ = { name: req.__name, view: req.__action };
                        params_ = template;
                        callback_ = params;
                    }
                } else {
                    context_ = {};
                    template_ = context;
                    callback_ = params;
                    params_ = template;
                }
            }

            ///length==4
            if(length===4){
                template_=template;
                context_ = context;
                params_ = params;
                callback_ = callback;
            }

            if(length > 4)throw "View render does not support more than 4 parameters";

            ///if template has been set to null, reset it to the default controller name/action
            if (!template_) template_ = { name: req.__name, view: req.__action };
            else if(typeof template_==='string'){
                var namespaceView=template_.split('.');
                if(namespaceView.length ===2) template_ = { name: namespaceView[0], view: namespaceView[1] };
                else if(namespaceView.length===1) template_ = { name: req.__name, view: template_ };
            }
            if (!callback_ instanceof Function) callback_ = null;
            this.app.render(context_, template_,params_, req, callback_);
        },

        /**
         * merge a context with req.session.context
         * @param {object} context
         * @public
         */
        setContext: function (context) {
            var req = this.req;
            req.session = req.session || {};
            Object.assign(req.session, context);
        },
        
        /**
         * convenience method to execute function or next() based on error object
         * @param {object} err
         * @param {function} next
         * @param {function} fn
         * @public
         */
        dispatch: function (err, next, fn) {
            if (!err) fn.apply(this, arguments);
            else next(err);
        }


    });

    return Response;

}));
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('async'), require('elliptical-utils'), require('elliptical-soa'),
            require('elliptical-event'), require('elliptical-location'),
            require('elliptical-view'), require('elliptical-template'),
            require('./request'), require('./response'), require('./delegate.request'),
            require('./delegate.submit'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['async', 'elliptical-utils', 'elliptical-soa', 'elliptical-event', 'elliptical-location',
            'elliptical-view','elliptical-template', './request', './response',
            './delegate.request', './delegate.submit'], factory);
    } else {
        //browser

        root.elliptical.application = factory(root.async, root.elliptical.utils, root.elliptical, root.elliptical.Event, root.elliptical,
            root.elliptical.View, root.elliptical.$Template,root.elliptical.Request,
            root.elliptical.Response, root.elliptical.delegate.request, root.elliptical.delegate.submit);

        root.returnExports = root.elliptical.browser;
    }
}(this, function (async, utils, soa, Event, location, View, $Template,Request, Response, request, submit) {

    var Router = location.Router;
    var Location=location.Location;
    var url_ = location.url;
    var network=utils.network;
    var CALLBACK_EXECUTION_DELAY=500;
    var ROUTE_DISPATCH='OnRouteDispatch';
    var DOCUMENT_HISTORY='OnDocumentHistory';
    var DOCUMENT_HISTORY_REQUEST='OnDocumentHistoryRequest';
    var APP_ROUTER='appRouter';
    var PRODUCTION='production';
    var DEVELOPMENT='development';
    var DATA_ENVIRONMENT='data-environment';
    var ROOT='/';
    var GET='get';
    var EMPTY='';
    var HTML='html';



    return {
        /**
         * app init
         * @internal
         *
         */
        init: function () {
            window.elliptical.$hashTag = false;
            this.history = false;
            this.contextSettings();
            this.setEnvironment();
            this.$setDefaultProviders();
            this.cache = {};
            /* define middleware stack */
            this.stack = [];
            /* init locations */
            this.locations = [];
            this.Router = Router;
            this._defineProps();
            this._historyEventListener();
            this.context={};
            var initStack = function (app) {

                app.router = function appRouter() {
                    app.next();
                };
                /* use __name property to identify appRouter. Function.name is unreliable under minification */
                app.router.__name = APP_ROUTER;
                var route = ROOT;
                var fn = app.router;
                app.stack.push({route: route, handle: fn});
            };

            /* init the middleware stack */
            initStack(this);

        },

        /**
         *
         * @private
         */
        _defineProps: function () {
            /* getters/setters props */
            this._debug = false;
            this._virtualRoot = ROOT;
            this._hashTag = false;
            this.settings.siteTitle = EMPTY;
            var app_ = this;

            Object.defineProperties(this, {
                'debug': {
                    get: function () {
                        return app_._debug;
                    },

                    set: function (val) {
                        Router.debug = val;
                        app_._debug = val;
                    }
                },

                'hashTag': {
                    get: function () {
                        return app_._hashTag;
                    },

                    set: function (val) {
                        Router.hashTag = val;
                        app_._hashTag = val;
                        window.elliptical.$hashTag = val;
                    }
                },

                'virtualRoot': {
                    get: function () {
                        return app_._virtualRoot;
                    },

                    set: function (val) {
                        Router.virtualRoot = val;
                        app_._virtualRoot = val;
                        app_.context.rootPath = val;
                        window.elliptical.$virtualRoot = val;
                    }
                },

                'siteRootTitle': {
                    get: function () {
                        return app_.settings.siteTitle;
                    },

                    set: function (val) {
                        app_.settings.siteTitle = val;
                    }
                }
            });
        },

        /**
         * @public
         */
        $setDefaultProviders: function () {
            //set the default Model provider
            var Service = soa.Service;
            //pagination provider
            Service.$paginationProvider = soa.$Pagination;
            //set the view provider to the template provider
            View.$provider = $Template;
        },


        /**
         * sets the environment (production or dev)
         * @param {string} env
         * @returns {string}
         * @public
         */
        setEnvironment: function (env) {
            if (typeof env !== 'undefined') {
                this.context.ENV = env.toLowerCase();
            } else {
                if (!setFromDocumentQuery(this)) {
                    setFromLocationQuery(this);
                }
            }

            function setFromDocumentQuery(c) {
                var html = $(HTML);
                var dataEnv = html.attr(DATA_ENVIRONMENT);
                if (typeof dataEnv !== 'undefined') {
                    c.context.ENV = dataEnv.toLowerCase();
                    return true;
                } else {
                    return false;
                }
            }

            function setFromLocationQuery(c) {
                var hostname = document.location.hostname;
                c.context.ENV = (network.isLocalHost(hostname)) ? DEVELOPMENT : PRODUCTION;
            }
        },

        /**
         *
         * @returns {undefined}
         */
        getPort: function () {
            return undefined;
        },


        /**
         * returns the environment(production or dev)
         * @returns {string}
         * @public
         */
        getEnvironment: function () {
            return this.context.ENV;
        },

        /**
         * configure
         * @param {string} mode
         * @param {function} fn
         * @public
         */
        configure: function (mode, fn) {
            if (typeof mode === 'function') {
                fn = mode;
                fn.call(this);
            } else if (typeof mode === 'string') {
                if (mode.toLowerCase() === PRODUCTION && this.context.ENV === PRODUCTION) fn.call(this);
                else if (mode.toLowerCase() === DEVELOPMENT && this.context.ENV === DEVELOPMENT) fn.call(this);
            }
        },


        /**
         * SERVER ONLY
         * returns a configuration object from config.json
         */
        config: function () {
            //ignore
        },


        /**
         *  **History Enabled Only**
         *
         * maps to Router.get
         * @param {string} route
         * @param {function} callbacks
         * @public
         */
        get: function (route, callbacks) {
            Router.get(route, callbacks);
        },


        /**
         *  **History Enabled Only**
         *
         * maps to Router.post
         * @param {string} route
         * @param {function} callbacks
         * @public
         */
        post: function (route, callbacks) {
            Router.post(route, callbacks);
        },


        /**
         *  **History Enabled Only**
         *
         * maps to Router.put
         * @param {string} route
         * @param {function} callbacks
         * @public
         */
        put: function (route, callbacks) {
            Router.put(route, callbacks);
        },


        /**
         *  **History Enabled Only**
         *
         * maps to Router.delete
         * @param {string} route
         * @param {function} callbacks
         * @public
         */

        delete: function (route, callbacks) {
            Router.delete(route, callbacks);
        },

        
        /**
         *
         * context settings
         * @public
         */
        contextSettings: function () {
            /* init app.context merged with template context for every route */
            this.context = {};
            this.context.virtualRoot = ROOT;

            /* this is a browser app */
            this.isServer = false;
            this.isBrowser = true;


            /* create an empty config object on app.settings */
            this.settings = this.settings || {};
            this.settings.config = {
                cookie: {},
                session: {},
                providers: {}
            };
        },


        /**
         *  **History Enabled Only**
         *
         * add an acl to a root path
         * @param {string} path
         * @param {array} excludeArray
         * @public
         */
        location: function (path, excludeArray) {
            /* path must have leading slash */
            if (path.substring(0, 1) != ROOT) {
                path = ROOT + path;
            }

            if (typeof excludeArray !== 'object') {
                excludeArray = [];
            }

            var access = {
                path: path,
                exclude: excludeArray
            };

            this.locations.push(access);
        },

        /**
         *
         * @param {string} url
         * @returns {string}
         * @public
         */
        parseRoute: function (url) {
            return (this.hashTag) ? url_.hashTagFormat(url) : url;
        },


        /**
         *  **History Enabled Only**
         *  subscriber to the Router dispatch emitted event
         *  @public
         */
        onDispatchRequest: function () {
            var self = this;
            Event.on(ROUTE_DISPATCH, function (data) {
                //dispatch
                if (!(self.__cancelledRoute && self.__route === data.route)) {
                    var route = data.route;
                    var handlers = data.handlers;
                    self.dispatch(route, handlers);
                } else {
                    self.__cancelledRoute = false;
                    self.__route = null;
                }
            });

        },

        /**
         *   **History Enabled Only**
         *   One Exception: setting the rootPath
         *
         *   adds a function to the middleware stack
         *
         * @param {string} route
         * @param {function} fn
         * @public
         */
        use: function (route, fn) {
            var stack = this.stack;
            if ('string' != typeof route) {
                fn = route;
                route = '/';
            }

            if (typeof fn != 'function') {
                //set the root path
                this.virtualRoot = route;
                return; //if not a function, exit
            }

            /* check if handler is appRouter */
            if (fn.__name && fn.__name === this.router.__name) {
                /* if so, delete the current app.router position in the stack */
                for (var i = 0; i < stack.length; i++) {
                    var handle = stack[i].handle;
                    if (handle.__name && handle.__name === this.router.__name || handle.length === 0) {
                        stack.splice(i, 1);
                        break;
                    }
                }
            }

            try {
                if (fn.length === 0 && fn.__name === undefined) {
                    return;
                }
            } catch (ex) {

            }
            //push the handler onto the middleware stack
            stack.push({route: route, handle: fn});
        },

        /**
         *  **History Enabled Only**
         *
         *  dispatches the callbacks for a route
         * @param {string} route
         * @param {array} handlers
         * @public
         */
        dispatch: function (route, handlers) {
            route = _checkRoute(route);
            var stack = this.stack;

            /* build the middleware stack for this route */
            var thisCallStack = [];
            for (var i = 0; i < stack.length; i++) {
                var handle = stack[i].handle;
                if (handle.__name && handle.__name === this.router.__name) {
                    //push the route callbacks onto the stack at this position
                    for (var j = 0; j < handlers.length; j++) {
                        thisCallStack.push(handlers[j]);
                    }
                } else {
                    var rte = stack[i].route;
                    var index = route.toLowerCase().indexOf(rte);
                    if ((index > -1) && (route.length === rte.length || route.substring(index + 1, 0) === ROOT)) {
                        thisCallStack.push(stack[i].handle);
                    }
                }
            }

            /* instantiate request,response objects */
            var req = new Request();
            req.route = route;
            var res = new Response(req);
            var app_ = this;
            req.app = res.app = app_;
            req.res = res;
            res.req = req;

            /* if history, redefine res.redirect */
            if (this.history) {
                res.redirect = function (route) {
                    Router.location(route, GET, null);
                };
            }

            /* run the stack of callbacks */
            _callStack(thisCallStack, req, res);


            /**
             *
             * @param {string} route
             * @returns {string}
             * @private
             */
            function _checkRoute(route) {
                if (route.substring(0, 1) != ROOT) {
                    route = ROOT + route;
                }
                return route;
            }


            /**
             * executes the middleware stack
             * @param {array} stack
             * @param {object} req
             * @param {object} res
             * @private
             */
            function _callStack(stack, req, res) {
                var i = 0;

                function next(err) {
                    var fn = stack[i++];

                    if (typeof fn === 'undefined') {
                        return;
                    }

                    if (typeof err != 'undefined') {
                        if (fn.length === 4) {
                            req = _applyFnProps(req, fn);
                            res = _applyFnProps(res, fn);
                            fn(err, req, res, next);
                        } else {
                            next(err);
                        }
                    } else {
                        if (fn.length < 4) {
                            req = _applyFnProps(req, fn);
                            res = _applyFnProps(res, fn);
                            fn(req, res, next);
                        } else {
                            next();
                        }
                    }
                }

                app_.next = next;
                /* next() is mangled under minification, so preserve the name by attaching it as a prop  */
                next();
            }


            function _applyFnProps(obj, f) {
                obj.__name = f.__name;
                obj.__action = f.__action;
                return obj;
            }
        },

        /**
         * SERVER ONLY
         * server-side execution of a function
         * @param {function} fn
         * @public
         */
        server: function (fn) {
            //ignore
        },

        /**
         * BROWSER ONLY
         * client-side execution of a function
         * @param {function} fn
         * @public
         */
        browser: function (fn) {
            fn.call(this);
        },

        /**
         * SERVER ONLY
         * convenience method to set standard middleware,cookies and session
         * @param {object} params
         * @param {object} $provider
         * @public
         */
        defaultMiddleware: function (params, $provider) {
            //ignore
        },


        /**
         * SERVER ONLY
         * execute bootstrap functions on server start-up
         * @param {array} stack
         * @param {object} server
         * @param {function} fn
         * @public
         */
        bootstrap: function (stack, server, fn) {
            //ignore
        },

        /**
         * executes document listeners, if applicable, then executes user provided function
         * @param {boolean} history
         * @param {function} fn
         * @public
         */
        listen: function (history, fn) {
            var app_ = this;
            var func = null;
            var length = arguments.length;

            //suport 0-2 params
            if (length === 0) /* form actions */ submit();
            if(length===1){
                if(typeof history==='function') {
                    func=history;
                    submit();
                }else this._start(history);
            }
            if(length===2){
                func = fn;
                this._start(history);
            }

            if (func) {
                $(function () {
                    setTimeout(function () {
                        func.call(app_);
                    }, CALLBACK_EXECUTION_DELAY);
                });
            }

        },

        /**
         * @public
         */
        start:function(){
            this._start(true);
        },

        /**
         * 
         * @param {function} fn 
         */
        onHistory:function(fn){
            var app_ = this;
            document.addEventListener(DOCUMENT_HISTORY, function (event) {
                var data = event.detail;
                fn.call(app_, data);
            });
        },

        /**
         *
         * @param {boolean} history
         * @private
         */
        _start:function(history){
             //if history is already active, exit
            if(this.history) return;
            
            //if false is passed as the param, oblige the request, start submit only, then exit
            if(!history){
                submit();
                return;
            }
            
            //set the flag to indicate html5 history is active
            this.history=true;
            
            //form actions
            submit();

            //http get requests
            request();

            // start history
            this._startHistory();
        },
        
         _startHistory:function(){
            var app_ = this;
            var env = this.getEnvironment();
            
            /* subscribe to the router dispatch event */
            this.onDispatchRequest();

            /* overrride Location.redirect,Location.reload */
            this._setLocationHistoryService();

            ///start Router
            if (env === PRODUCTION) Router.debug = false;
            Router.start();
             
        },
        
         _startHistoryFromRequest:function(event,data){
            console.log('history started');
            if(data==undefined) data={};
            var disableRedirectOnStart=data.disableRedirectOnStart;
             //if history is already active, exit
            if(this.history) return;
            
             //set the flag to indicate html5 history is active
            this.history=true;
            if(disableRedirectOnStart) Router.History.redirectOnStart=false;
             //form actions
            submit();
            // start history
            this._startHistory();
        },
        
        
        /**
         *
         * @private
         */
        _setLocationHistoryService: function () {
            Location.redirect = function (route) {
                Router.location(route, GET, null);
            };

            Location.reload = function () {
                var route = Location.href;
                Router.location(route, GET);
            };
        },
        
        _historyEventListener:function(){
            $(document).on(DOCUMENT_HISTORY_REQUEST, this._startHistoryFromRequest.bind(this));
        },


        /**
         *  **History Enabled Only**
         *
         * render view
         * @param {object} context
         * @param {string|object} template
         * @param {object} params
         * @param {object} req
         * @param {function} callback
         * @public
         */
        render: function (context, template, params, req, callback) {
            context = context || {};
            var app = this;
            var transition = null, selector = null, append = false, delay = null;
            if (params && params !== undefined) {
                transition = params.transition;
                selector = params.selector;
                append = params.append;
                delay = params.delay;
            }

            //instantiate the view object
            var view = new View();

            try {
                //merge context with app.context
                Object.assign(context, app.context);

                //extend context with req.session
                if (req.session) Object.assign(context, req.session);

            } catch (ex) {

            }

            context = setPageTitle(context, app);

            //reset root path, if default
            if (context.rootPath && context.rootPath === ROOT) context.rootPath = '';

            //if no selector passes, get if from the View constructor
            if (!selector || selector === undefined) selector = View.selector;

            var intDelay = (delay && delay !== undefined) ? parseInt(delay) : 0;

            //render...if onBeforeRender hook is defined, pass to it before rendering the view

            if (typeof app.onBeforeRender === 'function') {
                app.onBeforeRender(req,req.res, context, function (data) {
                    setTimeout(function () {
                        _render(data);
                    }, intDelay)
                });
            } else {
                setTimeout(function () {
                    _render(context);
                }, intDelay)
            }

            //private dry function encapsulation of view render method
            function _render(cxt) {
                //set browser context
                setBrowserContext(cxt);
                var element_ = $(selector);
                view.render(template, cxt, function (err, out) {
                    if (append) {
                        var doc = $.parseHTML(out, document, true);
                        element_.append(doc);
                        if (callback && callback instanceof Function) callback(null, out);
                    } else if (transition && transition !== undefined) view.transition(selector, out, params, callback);
                    else {
                        element_.html(out);
                        if (callback && callback instanceof Function) callback.call(this);
                    }
                });
            }

            // set the browser viewData context
            function setBrowserContext(context) {
                if(context) window.__viewData=context;
                else{
                    if(!window.__viewData){
                        window.__viewData={};
                    }
                }
            }

            function setPageTitle(context, app) {
                if (context.PageTitle) {
                    if (app.settings.siteTitle) context.PageTitle = app.settings.siteTitle + '-' + context.PageTitle;
                } else {
                    if (app.settings.siteTitle) context.PageTitle = app.settings.siteTitle;
                }
                return context;
            }
        }
    }

}));


(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-soa'),require('elliptical-location'),
            require('elliptical-event'),require('elliptical-middleware'),require('elliptical-template'),
            require('elliptical-http'),require('elliptical-crypto'),
            require('./application'),require('./response'),require('./request'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-soa','elliptical-location',
            'elliptical-event','elliptical-middleware', 'elliptical-http',
            'elliptical-crypto','./application',
            './response','./request'], factory);
    } else {
        //browser
        root.elliptical.browser=factory(root.elliptical.utils,root.elliptical,root.elliptical.Location,
            root.elliptical.Event,root.elliptical.middleware,root.elliptical.$Template,
            root.elliptical.http, root.elliptical.crypto,root.elliptical.application,
            root.elliptical.Response,root.elliptical.Request);

        root.returnExports = root.elliptical.browser;
    }
}(this, function (utils,soa,Location,Event,middleware,$Template,http,crypto,application,Response,Request) {

    
    /**
     * Expose createApplication().
     */
    var exports_ = createApplication;

    exports_.Event=Event;
    exports_.application=application;
    exports_.Response=Response;
    exports_.Request=Request;
    exports_.http=http;
    exports_.crypto = crypto;
    exports_.Location=location.Location;
    exports_.$Template=$Template;

    /**
     * @return {Function}
     * @public
     */
    function createApplication() {
        /* create the browser app */
        var app=function(){};

        /* expose application object */
        Object.assign(app, application);

        /* init */
        app.init();

        return app;
    }

    /* expose elliptical middleware */
    Object.assign(soa, middleware);

    /* expose elliptical */
    Object.assign(exports_, soa);
    Object.assign(exports_,window.elliptical);

    Object.defineProperty(window, 'elliptical', {
        get: function() { return exports_; },
        set: function(newValue) { exports_[newValue]=newValue; },
        enumerable: true,
        configurable: true
    });
    window.elliptical.$virtualRoot='/';

    return exports_;

}));
