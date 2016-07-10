/*
 * =============================================================
 * elliptical.Event
 * =============================================================
 *
 * environment-independent Events/Pubsub implementation. Code culled in part from:
 * https://github.com/federico-lox/pubsub.js
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
        root.elliptical=root.elliptical || {};
        root.elliptical.Event = factory();
        root.returnExports = root.elliptical.Event;
    }
}(this, function () {
    var Event = {};
    (function (context) {


        /**
         * @private
         */
        function init() {
            //the channel subscription hash
            var channels = {},
            //help minification
                funcType = Function;

            return {
                /*
                 * @public
                 *
                 * Publish/Emit some data on a channel
                 *
                 * @param String channel The channel to publish on
                 * @param Mixed argument The data to publish, the function supports
                 * as many data parameters as needed
                 *
                 * @example Publish stuff on '/some/channel'.
                 * Anything subscribed will be called with a function
                 * signature like: function(a,b,c){ ... }
                 *
                 * Event.emit(
                 *		"/some/channel", "a", "b",
                 *		{total: 10, min: 1, max: 3}
                 * );
                 */
                emit: function () {
                    //help minification
                    var args = arguments,
                    // args[0] is the channel
                        subs = channels[args[0]],
                        len,
                        params,
                        x;

                    if (subs) {
                        len = subs.length;
                        params = (args.length > 1) ?
                            Array.prototype.splice.call(args, 1) : [];

                        //run the callbacks asynchronously,
                        //do not block the main execution process
                        setTimeout(
                            function () {
                                //executes callbacks in the order
                                //in which they were registered
                                for (x = 0; x < len; x += 1) {
                                    try{
                                        subs[x].apply(context, params);

                                    } catch (ex) {

                                    }

                                }

                                //clear references to allow garbage collection
                                subs = context = params = null;
                            },
                            0
                        );
                    }
                },

                /*
                 * @public
                 *
                 * Register a callback on a channel
                 *
                 * @param String channel The channel to subscribe to
                 * @param Function callback The event handler, any time something is
                 * published on a subscribed channel, the callback will be called
                 * with the published array as ordered arguments
                 *
                 * @return Array A handle which can be used to unsubscribe this
                 * particular subscription
                 *
                 * @example Event.on(
                 *				"/some/channel",
                 *				function(data){ ... }
                 *			);
                 */
                on: function (channel, callback) {
                    if (typeof channel !== 'string') {
                        throw "invalid or missing channel";
                    }

                    if (!(callback instanceof funcType)) {
                        throw "invalid or missing callback";
                    }

                    if (!channels[channel]) {
                        channels[channel] = [];
                    }

                    channels[channel].push(callback);

                    return { channel: channel, callback: callback };
                },

                /*
                 * @public
                 *
                 * Disconnect a subscribed function f.
                 *
                 * @param Mixed handle The return value from a subscribe call or the
                 * name of a channel as a String
                 * @param Function callback [OPTIONAL] The event handler originaally
                 * registered, not needed if handle contains the return value
                 * of subscribe
                 *
                 * @example
                 * var handle = Event.on("/some/channel", function(){});
                 * Event.off(handle);
                 *
                 * or
                 *
                 * Event.off("/some/channel", callback);
                 */
                off: function (handle, callback) {
                    if (handle.channel && handle.callback) {
                        callback = handle.callback;
                        handle = handle.channel;
                    }

                    if (typeof handle !== 'string') {
                        throw "invalid or missing channel";
                    }

                    if (!(callback instanceof funcType)) {
                        throw "invalid or missing callback";
                    }

                    var subs = channels[handle],
                        x,
                        y = (subs instanceof Array) ? subs.length : 0;

                    for (x = 0; x < y; x += 1) {
                        if (subs[x] === callback) {
                            subs.splice(x, 1);
                            break;
                        }
                    }

                },
                /* convenient global unsubscribe/off  */
                flush: function () {
                    channels = {};
                },

                /* list the channels */
                list: function (callback) {
                    if (callback) {
                        callback(channels);
                    }
                }
            };
        }

        Event.init = init();

    }(this));

    return Event.init; //UMD

}));
