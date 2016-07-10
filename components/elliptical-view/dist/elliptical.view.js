/*
 * =============================================================
 * elliptical.View
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
        root.elliptical.View=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.View;
    }
}(this, function (Class) {


    var View;
    View = Class.extend({
            _data: {}, //{Object}
            $transitionProvider: null, //{String},
            $provider: null, //{Object}
            selector: '[content-placeholder]', //{String}
            selectorSet: false,
            clientContextRootNamespace: '$$', //{String}
            pushContextToClient: true,

            /**
             * static render method
             * @param template {String}
             * @param context {Object}
             * @param callback {Function}
             * @returns callback
             * @public
             */
            render: function (template, context, callback) {

                this.$provider.render(template, context,callback);
            },

            /**
             @param {string} selector
             @param {string} html
             @param {string} transitionEffect
             @param {function} callback
             */
            transition: function (selector, html, transitionEffect, callback) {
                this.$transitionProvider.transition(selector, html, transitionEffect, callback);
            },

            /**
             * set the template provider
             * @param $provider {Function}
             * @public
             */
            $setProvider: function ($provider) {
                this.$provider = $provider;
            }

        },
        {
            /**
             * prototype render method
             * @param template {String}
             * @param context {Object}
             * @param callback {Function}
             * @returns callback
             * @public
             */
            render: function (template, context, callback) {
                this.constructor.render(template,context,callback);
            },

            /**
             @param {string} selector
             @param {string} html
             @param {string} transitionEffect
             @param {function} callback

             */
            transition: function (selector, html, transitionEffect, callback) {
                this.constructor.transition(selector, html, transitionEffect, callback);
            }
        });

    return View;
}));


