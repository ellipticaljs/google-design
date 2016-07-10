/*
 * =============================================================
 * elliptical.$Transitions
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        if(typeof window !=='undefined'){
            module.exports = factory();
        }

    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.elliptical=root.elliptical || {};
        root.elliptical.$Transitions=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Transitions;
    }
}(this, function (Class) {
    

    var $Transitions;
    $Transitions = Class.extend({

        transition: function (selector, html, opts, callback) {
            var self = this;
        	var element = $(selector);
        	var transition = opts.transition || 'none';
        	opts.transitionOut = opts.transitionOut || 'none';
        	var preload = opts.preload;
        	if (preload === undefined) preload = true;
        	if (transition !== 'none') {
        	    if (opts.transitionOut !== 'none') {
        	        _transitionOut(opts, function () {
        	            element.addClass('hidden');
        	            element.show();
        	            element.html(html);
        	            if (preload) {
        	                self.preload(element, function () {
        	                    element.removeClass('hidden');
        	                    _transitionIn(opts, callback);
        	                });
        	            } else {
        	                element.removeClass('hidden');
        	                _transitionIn(opts, callback);
        	            }
        	        });
        	    } else {
        	        element.addClass('hidden');
        	        element.show();
        	        element.html(html);
        	        if (preload) {
        	            this.preload(element, function () {
        	                element.removeClass('hidden');
        	                _transitionIn(opts, callback);
        	            });
        	        } else {
        	            element.removeClass('hidden');
        	            _transitionIn(opts, callback);
        	        }
        	    }
            } else {
                element.html(html);
                if (callback && callback instanceof Function) callback.call(this);
        	}

            //private
            function _transitionOut(params,callback) {
                var o = {};
                o.duration = params.durationOut || 150;
                o.delay = params.delayOut || 0;
                o.preset = params.transitionOut || 'fadeOut';
                element.transition(o, callback);
            }
            //private
            function _transitionIn(params,callback) {
                var o = {};
                o.duration = params.duration || 300;
                o.delay = params.delayIn || 0;
                o.preset = transition;
                element.transition(o, callback);
            }
        },

        preload: function (element,callback) {
            var images = element.find('img');
            var length = images.length;
            var counter = 0;
            if (length === 0) if (callback && callback instanceof Function) callback();
            $.each(images, function (i, img) {
                var image = new Image();
                var $image = $(image);
                $image.on('load', function (event) {
                    counter++;
                    $image.off('load');
                    $image.off('error');
                    if (counter === length) if (callback && callback instanceof Function) callback();
                });
                image.src = img.src;
                $image.on('error', function (event) {
                    counter++;
                    $image.off('load');
                    $image.off('error');
                    if (counter === length) if (callback && callback instanceof Function) callback();
                });
            });
        }
    }, {

    	transition: function (selector, html, transition, callback) {
    		this.constructor.transition(selector, html, transition, callback);
    	}
    });

    return $Transitions;

}));
