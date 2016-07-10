/*
 * =============================================================
 * elliptical.http.browser
 * =============================================================
 */


//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory($);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.http=root.elliptical.http || {};
        root.elliptical.http.browser=factory(root.$);
        root.returnExports = root.elliptical.http.browser;
    }
}(this, function ($) {

    //https://gist.github.com/monsur/706839
    var parseResponseHeaders=function(headerStr) {
        var headers = {};
        if (!headerStr) {
            return headers;
        }
        var headerPairs = headerStr.split('\u000d\u000a');
        for (var i = 0; i < headerPairs.length; i++) {
            var headerPair = headerPairs[i];
            // Can't use split() here because it does the wrong thing
            // if the header value has the string ": " in it.
            var index = headerPair.indexOf('\u003a\u0020');
            if (index > 0) {
                var key = headerPair.substring(0, index);
                var val = headerPair.substring(index + 2);
                headers[key] = val;
            }
        }
        return headers;
    };

    var browser={
        send: function (params, callback) {
            var settings = {
                type: params.method || 'GET',
                dataType: params.dataType || 'json',
                url: params.protocol + '://' + params.host + ':' + (params.port || 80) + params.path

            };

            if (params.data) {
                params.data = JSON.stringify(params.data);
                settings.data = params.data;
                settings.contentType = 'application/json';

            }
            if (params.authorization) {
                settings.beforeSend = function (req) {
                    req.setRequestHeader('Authorization', params.authorization);
                }
            }

            var ajax = $.ajax(settings).done(function (data, status) {
                try {
                    if(typeof data==='string'){
                        data=JSON.parse(data);
                    }
                    callback(null, data);

                } catch (ex) {

                    var _err = {
                        statusCode: 500,
                        message: ex
                    };
                    callback(_err, null);
                }

            }).fail(function (data, status, errThrown) {
                var err = {};
                var _data=null;
                err.statusCode = data.status;
                if (data.responseJSON && data.responseJSON.message) err.message = data.responseJSON.message;
                else if(data.responseJSON){
                    _data=data.responseJSON;
                    err.message=errThrown;
                }else err.message = errThrown;
                err.headers = parseResponseHeaders(data.getAllResponseHeaders());
                callback(err, _data);
            });
        }
    };

    return browser;
}));

/*
 * =============================================================
 * elliptical.http
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        var transport=require('./node');
        if(typeof window != 'undefined'){
            //we are in a browserify bundle
            transport=require('./browser');
        }
        module.exports = factory(transport,require('elliptical-crypto'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./browser','elliptical-crypto'], factory);
    } else {
        // Browser globals (root is window)
        var browser=root.elliptical.http.browser;
        var crypto=root.elliptical.crypto;
        var http=factory(browser,crypto);
        http.browser=browser;
        root.elliptical.http=http;
        root.returnExports = root.elliptical.http;
    }
}(this, function (transport,crypto) {

    var http={
        send: function (options, callback) {
            transport.send(options,function(err,data){
                if (callback) {
                    callback(err, data);
                }
            });
        },

        base64Encrypt: crypto.base64Encrypt,

        base64:crypto.base64,

        encodeSessionToken: function(token){
            return 'Session ' + token;
        },

        encodeBasicToken: function(token){
            return 'Basic ' + token;
        },

        encodeBasicCredentials: function(u,p){
            return crypto.base64Encrypt(u,p);
        },

        encodeOAuthToken: function(token){
            return 'OAuth ' + token;
        }


    };

    http.crypto=crypto;

    return http;


}));
