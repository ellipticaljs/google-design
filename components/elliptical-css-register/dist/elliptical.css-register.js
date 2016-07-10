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
        root.elliptical.cssElements=factory();
        root.returnExports = root.elliptical.cssElements;
    }
}(this, function () {

    return {
        elements:['ui-container',
            'ui-brand',
            'ui-toggle',
            'ui-overlay',
            'ui-modal',
            'ui-menu',
            'ui-dropdown',
            'ui-mega-dropdown',
            'ui-media-object',
            'ui-box',
            'ui-breadcrumb',
            'ui-select',
            'ui-badge',
            'ui-tip',
            'ui-columns',
            'ui-social',
            'ui-radio-list',
            'ui-checkbox-list',
            'ui-icons',
            'menu-item',
            'menu-item-dropdown',
            'menu-item-search',
            'menu-divider',
            'grid-row',
            'grid-columns',
            'breadcrumb-item',
            'flex-box',
            'flex-list',
            'flex-label',
            'social-icon',
            'screen-icon',
            'touch-ui-drawer',
            'touch-ui-menu',
            'touch-ui-dropdown',
            'touch-ui-toggle',
            'touch-ui-brand',
            'touch-icons',
            'touch-icon',
            'touch-drawer',
            'touch-header',
            'touch-section',
            'touch-bar'
        ],

        register:function(){
            var elements=this.elements;
            var name=elements[0];
            var registered=this._isRegistered(name);
            if(registered) return;
            if(!document.registerElement) return;
            elliptical._cssRegistered=true;

            elements.forEach(function(element){
                document.registerElement(element);
            });
        },

        _isRegistered:function(name){
            return document.createElement(name).constructor !== HTMLElement;
        }
    };

}));


//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./css-elements'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./css-elements'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.elliptical.cssElements);
    }
}(this, function (css) {

    document.addEventListener('WebComponentsReady', function () {
        css.register();
    });

}));

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./css-elements'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./css-elements'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.elliptical.cssElements);
    }
}(this, function (css) {

    document.addEventListener('WebComponentsReady', function () {
       css.register();
    });

}));