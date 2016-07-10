(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Dialog=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Dialog;
    }
}(this, function (Class) {


    var Dialog=Class.extend({
        '@resource':'Dialog', //{String}
        $provider:null,

        /**
         * @param {object} params
         * @public
         */
        show:function(params){
            return this.$provider.show(params);
        },

        /**
         * @public
         */
        hide:function(){
            return this.$provider.hide();
        },

        /**
         * @param {string} html
         */
        setContent:function(html){
            return this.$provider.setContent(html);
        },

        setActionLabel:function(text){
            return this.$provider.setActionLabel(text);
        },

        setCancelLabel:function(text){
            return this.$provider.setCancelLabel(text);
        },

        setHeight:function(height){
            return this.$provider.setHeight(height);
        },

        setWidth:function(width){
            return this.$provider.setWidth(width);
        },

        hideAction:function(bool){
            return this.$provider.hideAction(bool);
        },

        disableModal:function(bool){
            return this.$provider.disableModal(bool);
        }

    },{
        /**
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
         * @param {object} params
         * @public
         */
        show:function(params){
            return this.constructor.show(params);
        },

        /**
         * @public
         */
        hide:function(){
            return this.constructor.hide();
        },

        /**
         * @param {string} html
         */
        setContent:function(html){
            return this.constructor.setContent(html);
        },

        setActionLabel:function(text){
            return this.constructor.setActionLabel(text);
        },

        setCancelLabel:function(text){
            return this.constructor.setCancelLabel(text);
        },

        setHeight:function(height){
            return this.constructor.setHeight(height);
        },

        setWidth:function(width){
            return this.constructor.setWidth(width);
        },

        hideAction:function(bool){
            return this.constructor.hideAction(bool);
        },

        disableModal:function(bool){
            return this.constructor.disableModal(bool);
        }

    });

    return Dialog;

}));



(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.Notify=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Notify;
    }
}(this, function (Class) {


    var Notify=Class.extend({
        '@resource':'Notify', //{String}
        $provider:null,

        /**
         *
         * @param {string} text
         * @param {object} params
         * @public
         */
        show:function(text,params){
            return this.$provider.show(text,params);
        },

        /**
         *
         * @public
         */
        hide:function(){
            return this.$provider.hide();
        },

        /**
         *
         * @returns {boolean}
         * @public
         */
        visible:function(){
            return this.$provider.visible();
        }

    },{

        /**
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
         * @param {string} text
         * @param {object} params
         * @returns {*}
         * @public
         */
        show:function(text,params){
            return this.constructor.show(text,params);
        },

        /**
         *
         * @returns {*}
         * @public
         */
        hide:function(){
            return this.constructor.hide();
        },

        /**
         *
         * @returns {*}
         * @public
         */
        visible:function(){
            return this.constructor.visible();
        }
    });

    return Notify;



}));



(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Dialog=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Dialog;
    }
}(this, function (Class) {


    return Class.extend({
        '@resource':'$DialogProvider', //{String}
        _element:null,

        /**
         * @public
         */
        show:function(){
            var element = this._getElement();
            if (element) element.open();
            else this._throwWarning();
        },

        /**
         * @public
         */
        hide:function(){
            var element = this._getElement();
            if(element) element.close();
            else this._throwWarning();
        },

        /**
         * @param {string} html
         */
        setContent:function(html){
            var element = this._getElement();
            if(element) element.setContent(html);
            else this._throwWarning();
        },

        setActionLabel:function(text){
            var element = this._getElement();
            if(element) element.action=text;
            else this._throwWarning();
        },

        setCancelLabel:function(text){
            var element = this._getElement();
            if(element) element.cancel=text;
            else this._throwWarning();
        },

        setHeight:function(height){
            var element = this._getElement();
            if(element) element.height=height;
            else this._throwWarning();
        },

        setWidth:function(width){
            var element = this._getElement();
            if(element) element.width=width;
            else this._throwWarning();
        },

        hideAction:function(bool){
            var element = this._getElement();
            if(element) element.hideAction=bool;
            else this._throwWarning();
        },

        disableModal:function(bool){
            var element = this._getElement();
            if(element) element.disableModal=bool;
            else this._throwWarning();
        },

        /**
         * @returns {object}
         * @private
         */
        _getElement:function(){
            if (this._element) return this._element;
            else {
                this._element=document.querySelector('md-dialog');
                return this._element;
            }
        },

        _throwWarning:function(){
            console.warn('no dialog element available');
        }

    },{});



}));





(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.$Notify=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Notify;
    }
}(this, function (Class) {


    return Class.extend({
        '@resource':'$NotifyProvider', //{String}
        _element:null,

        /**
         *
         * @param {string} text
         * @param {object} params
         * @returns {*}
         * @public
         */
        show:function(text,params){
            var element = this._getElement();
            if(!element){
                this._throwWarning();
                return;
            }
            if (params === undefined) params = {};
            var duration = params.duration;
            if (duration === undefined) {
                duration = 3000;
            }
            element.text = text;
            if (!element.visible) {
                element.duration = duration;
                try {
                    element.show();
                } catch (ex) {

                }
            }
        },

        /**
         *
         * @public
         */
        hide:function(){
            var element = this._getElement();
            if(element) element.hide();
            else this._throwWarning();
        },

        /**
         *
         * @returns {boolean}
         * @public
         */
        visible:function(){
            var element = this._getElement();
            if(element) return element.visible;
            else return false;
        },


        /**
         *
         * @returns {object}
         * @private
         */
        _getElement:function(){
            if (this._element) return this._element;
            else {
                this._element=document.querySelector('paper-toast');
                return this._element;
            }
        },

        /**
         *
         * @private
         */
        _throwWarning:function(){
            console.warn('no notify element available');
        }

    },{});


}));
