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
        root.elliptical = root.elliptical || {};
        root.elliptical.DomEvent = factory();
        root.returnExports = root.elliptical.DomEvent;
    }
}(this, function () {

    var SCROLL_EVENT = 'scroll.infinite';
    var SCROLL_TOP_EVENT = 'scroll.top';
    var SCROLL_TOLERANCE = 100;


    /**
     * @param {object} node -html element
     * @param {object} [context]
     * @constructor
     */
    function DomEvent(node,context){
        this._events= [];
        this._node=null;
        this._context=this;
        this._infiniteScrollOn=false;
        this._scrollOn=false;

        if (node && node !== undefined) {
            if (node.nodeName !== undefined) this._node = $(node);
        }
        if (context && context !== undefined) this._context = context;

        /**
         *
         * @param {object} [element] -jquery object
         * @param {string} event
         * @param {string} [selector]
         * @param {function} callback
         * @public
         */
        this.event=function (element, event, selector, callback) {
            var context=this._context;

            //support 2-4 params
            var length = arguments.length;

            if(length===2){
                callback=event;
                event=element;
                element=this._node;
                selector=null;
            }
            if (length === 3) {
                if(typeof element==='string'){
                    callback=selector;
                    selector=event;
                    event=element;
                    element=this._node;
                }else{
                    callback=selector;
                    selector=null;
                }
            }
            //store the params
            var obj = {};
            obj.element = element;
            obj.event = event;
            obj.selector = selector;
            obj.callback = callback;

            this._events.push(obj);
            if (selector) {
                element.on(event, selector, function () {
                    var args = [].slice.call(arguments);
                    if (callback) callback.apply(context, args);
                });
            } else {
                element.on(event, function () {
                    var args = [].slice.call(arguments);
                    if (callback) callback.apply(context, args);
                });
            }
        };


        /**
         * @public
         */
        this.unbind=function () {
            var events = this._events;
            var length = events.length;
            for (var i = 0; i < length; i++) {
                var obj = events[i];
                (obj.selector) ? obj.element.off(obj.event, obj.selector) : obj.element.off(obj.event);
            }
            events.length = 0;
        };

        /**
         * @public
         */
        this.onScroll=function (callback) {
            if(this._scrollOn) return;
            else this._scrollOn=true;
            var handleScroll = function () {
                if (callback) callback(window.scrollY);
            };
            var bindScroll = function () {
                window.requestAnimationFrame(handleScroll)
            };
            this.event($(window), SCROLL_TOP_EVENT, bindScroll);
        };

        /**
         * @public
         */
        this.scrollOff=function () {
            if(!this._scrollOn) return;
            else this._scrollOn=false;

            var events = this._events;
            var length = events.length;
            for (var i = 0; i < length; i++) {
                var obj = events[i];
                if (obj.event === SCROLL_TOP_EVENT) {
                    (obj.selector) ? obj.element.off(obj.event, obj.selector) : obj.element.off(obj.event);
                    events.splice(i);
                    break;
                }
            }
        };



        /**
         * @public
         */
        this.onInfiniteScroll=function (y,callback) {
            if(typeof y==='function'){
                callback=y;
                y=SCROLL_TOLERANCE;
            }
            if(this._infiniteScrollOn) return;
            else this._infiniteScrollOn=true;
            var handleScroll = function () {
                var diff = $(document).height() - $(window).height();
                if ($(window).scrollTop() > (diff - y)) {
                    if (callback) callback();
                }
            };
            var bindScroll = function () {
                window.requestAnimationFrame(handleScroll)
            };
            this.event($(window), SCROLL_EVENT, bindScroll);
        };

        /**
         * @public
         */
        this.infiniteScrollOff=function () {
            if(!this._scrollOn) return;
            else this._scrollOn=false;

            var events = this._events;
            var length = events.length;
            for (var i = 0; i < length; i++) {
                var obj = events[i];
                if (obj.event === SCROLL_EVENT) {
                    (obj.selector) ? obj.element.off(obj.event, obj.selector) : obj.element.off(obj.event);
                    events.splice(i);
                    break;
                }
            }
        };

        /**
         *
         * @param {array} arr - array of string
         * @public
         */
        this.register=function (arr) {
            var self=this;
            if (!arr.length) return;
            arr.forEach(function (name) {
                if (!self._isRegistered(name)) document.registerElement(name);
            });
        };

        /**
         *
         * @param {string} src
         * @param {function} callback
         */
        this.load=function (src, callback) {
            var newImg = new Image();
            var $newImg=$(newImg);
            $newImg.bind('load.newImg',function(){
                $newImg.unbind('load.newImg');
                if(callback) callback(this);
            });
            //assign the src property to trigger bind
            newImg.src = src;
        };

        /**
         *
         * @param {object} [node] -html element
         * @param {function} callback
         * @returns {boolean}
         * @public
         */
        this.preload=function (node, callback) {
            if(typeof node==='function'){
                callback=node;
                node=this._node;
            }
            var imgArray = [];
            var data = {};
            var element = $(node);
            var images = element.find('img');
            var length = images.length;
            var counter = 0;
            if (length === 0) {
                if (callback) callback(null);
                return false;
            }
            $.each(images, function (i, img) {
                var image = new Image();
                var $image=$(image);
                $image.bind('load.image', function (event) {
                    counter++;
                    imgArray.push(image);
                    $image.unbind('load.image');
                    if (counter === length) {
                        if (callback) {
                            data.images = imgArray;
                            data.length = counter;
                            callback(data);
                        }
                    }
                });
                //assign the src property to trigger the event above
                image.src = img.src;
            });
            return true;
        };

        /**
         *
         * @param {string} selector
         * @returns {object} -jquery object
         */
        this.find=function(selector){
            if(this._node) return this._node.find(selector);
            else return null;
        };

        this.dispose=function(){
            this.unbind();
            this.scrollOff();
        };

        /**
         *
         * @returns {string}
         * @private
         */
        this._click=function () {
            return ('ontouchend' in document) ? 'touchstart' : 'click';
        };

        /**
         *
         * @returns {string}
         * @private
         */
        this._press=function () {
            return ('ontouchend' in document) ? 'touchend' : 'click';
        };

        /**
         *
         * @returns {string}
         * @private
         */
        this._tap=function () {
            return ('ontouchend' in document) ? 'tap' : 'click';
        };

        /**
         *
         * @param {string} evt
         * @returns {string}
         * @private
         */
        this._getEvent=function (evt) {
            if (evt === 'click') return this._click();
            else if (evt === 'press') return this._press();
            else if (evt === 'tap') return this._tap();
            else return evt;
        };

        /**
         *
         * @param {object} events
         * @param {string} prop
         * @private
         */
        this._bindEvent=function (events, prop) {
            var element=this._node;
            var event;
            var callback = events[prop];
            var eventParams = prop.split('@');
            var length = eventParams.length;
            if (length === 1) {
                event = this._getEvent(eventParams[0]);
                this.event(element, event, callback);
            } else if (length === 2) {
                var selector = eventParams[0];
                event = this._getEvent(eventParams[1]);
                if (selector === 'document') this.event($(document), event, callback);
                if (selector === 'window') this.event($(window), event, callback);
                else this.event(element, event, selector, callback)
            }
        };

        /**
         *
         * @param {string} name
         * @returns {boolean}
         * @private
         */
        this._isRegistered=function(name){
            return document.createElement(name).constructor !== HTMLElement;
        };

    }

    return DomEvent;


}));

