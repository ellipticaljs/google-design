
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
