/*
 * =============================================================
 * elliptical.document
 * =============================================================
 *    parses a form submission to a javascript POJO to be posted to an endpoint.
 *   the plugin handles broad cases of mapping a form to a model schema, including:
 *   (i) posting the form as an array or a deeply nested object
 *   (ii) checkbox handling, including posting boolean values for both checked and unchecked boxes
 *
 *   Note: the return object is not a json document.
 *   a json document can be constructed by simply calling JSON.stringify(which is usually handled by your js mvc framework).
 *   if you are not using a framework and manually invoking $.ajax(), you will need to stringify the return object
 *
 *   the idea is that the dev time is spent on form markup and not processing callbacks on submit captures
 *
 *   Most of the code culled from:
 *   SerializeJSON jQuery plugin.
 *   https://github.com/marioizquierdo/jquery.serializeJSON
 *  version 1.1.1 (Feb 16, 2014)
 *
 *  the method override for serializeArray() to include checkboxes as boolean values:
 *  http://tdanemar.wordpress.com/2010/08/24/jquery-serialize-method-and-checkboxes/
 *
 *  Final note: forms posted to the server-side controller action may not match client-side capture and post to json endpoint
 *  using this plugin due to different implementations by server-side frameworks re: array posts and checkboxes.
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
        root.returnExports = factory();
    }
}(this, function () {


    $.fn.document = function (options) {
        var o = $.extend({
            boolean: true,
            arrayAsBody:true
        }, options || {});
        var obj, formAsArray;
        obj = {};
        formAsArray = this.booleanSerializeArray(o);

        $.each(formAsArray, function (i, input) {
            var name, value, keys;
            name = input.name;
            value = input.value;

            // Split the input name in programatically readable keys
            // name = "foo"              => keys = ['foo']
            // name = "[foo]"            => keys = ['foo']
            // name = "foo[inn][bar]"    => keys = ['foo', 'inn', 'bar']
            // name = "foo[inn][arr][0]" => keys = ['foo', 'inn', 'arr', '0']
            // name = "arr[][val]"       => keys = ['arr', '', 'val']
            keys = $.map(name.split('['), function (key) {
                var last;
                last = key[key.length - 1];
                return last === ']' ? key.substring(0, key.length - 1) : key;
            });
            if (keys[0] === '') { keys.shift(); } // "[foo][inn]" should be same as "foo[inn]"

            // Set value in the object using the keys
            $.deepSet(obj, keys, value);
        });

        /* if obj has only array prop && if arrayAsBody is set, return the array
         *  else return the object
         */
        if(Object.keys(obj).length===1 && o.arrayAsBody){
            var prop=obj[Object.keys(obj)[0]];
            return (isArray(prop)) ? prop : obj;
        }else{
            return obj;
        }

    };

    // Auxiliar function to check if a variable is an Object
    var isObject = function (obj) {
        return obj === Object(obj);
    };

    var isArray =function(obj){
        return (/Array/).test(Object.prototype.toString.call(obj));
    };

    // Auxiliar function to check if a variable is a valid Array index
    var isValidArrayIndex = function(val){
        return /^[0-9]+$/.test(String(val));
    };

    /**
     Access the object in a deep key and assigns the value:

     // Examples:
     deepSet(obj, ['foo'], v)                //=> obj['foo'] = v
     deepSet(obj, ['foo', 'inn'], v)         //=> obj['foo']['inn'] = v // Create the inner obj['foo'] object, if needed
     deepSet(obj, ['foo', 'inn', 'inn'], v)  //=> obj['foo']['inn']['inn'] = v
     deepSet(obj, ['0'], v)                  //=> obj[0] = v // obj may be an Array
     deepSet(obj, [''], v)                   //=> obj.push(v) // assume obj as array, and add a new value to the end
     deepSet(obj, ['arr', '0'], v)           //=> obj['arr']['0'] = v // obj['arr'] is created as Array if needed
     deepSet(obj, ['arr', ''], v)            //=> obj['arr'].push(v)
     deepSet(obj, ['foo', 'arr', '0'], v)    //=> obj['foo']['arr'][0] = v // obj['foo'] is created as object and obj['foo']['arr'] as a Array, if needed
     deepSet(obj, ['arr', '0', 'foo'], v)    //=> obj['arr']['0']['foo'] = v // obj['foo'] is created as object and obj['foo']['arr'] as a Array and obj['foo']['arr'][0] as object, if needed

     // Complex example with array empty index,
     // it creates a new element, unless there is a nested non repeated key, so it assigns to the last element object:
     var arr = []
     deepSet(arr, [''], v)                   //=> arr === [v]
     deepSet(arr, ['', 'foo'], v)            //=> arr === [v, {foo: v}]
     deepSet(arr, ['', 'bar'], v)            //=> arr === [v, {foo: v, bar: v}]
     deepSet(arr, ['', 'bar'], v)            //=> arr === [v, {foo: v, bar: v}, {bar: v}]
     */
    $.deepSet = function (obj, keys, value) {
        var key, nextKey, tail, objectOrArray, lastKey, lastElement;

        if (!keys || keys.length === 0) { throw new Error("ArgumentError: keys param expected to be an array with least one key"); }
        key = keys[0];

        if (keys.length == 1) { // only one key, then it's not a deepSet, just assign the value.
            if (key === '') {
                obj.push(value); // empty key is used to add values to the array
            } else {
                obj[key] = value; // other keys can be used as array indexes or object keys
            }

        } else { // more keys menas a deepSet. Apply recursively

            nextKey = keys[1];

            // Empty key is used to add values to the array => merge next keys in the object element.
            if (key === '') {
                lastKey = obj.length - 1;
                lastElement = obj[obj.length - 1];
                if (isObject(lastElement) && !lastElement[nextKey]) { // if nextKey is a new attribute in the last object element then set the new value in there.
                    key = lastKey;
                } else { // if the array does not have an object as last element, create one.
                    obj.push({});
                    key = lastKey + 1;
                }
            }

            // obj[key] defaults to Object or Array, depending on the next key
            if (obj[key] === undefined) {
                if (nextKey === '' || isValidArrayIndex(nextKey)) { // if is '', 1, 2, 3 ... then use an Array
                    obj[key] = [];
                } else { // if is something else, use an Object
                    obj[key] = {};
                }
            }

            // Recursively access the inner Object
            tail = keys.slice(1);
            $.deepSet(obj[key], tail, value);
        }

    };
    $.fn.booleanSerializeArray = function (options) {
        var o = $.extend({
            boolean: true
        }, options || {});

        var rselectTextarea = /select|textarea/i;
        var rinput = /text|number|hidden|password|date|datetime|color|email|month|range|tel|time|url|week|search/i;

        return this.map(function () {
                return this.elements ? $.makeArray(this.elements) : this;
            })
            .filter(function () {
                return this.name && !this.disabled &&
                    (this.checked
                    || (o.boolean && this.type === 'checkbox')
                    || rselectTextarea.test(this.nodeName)
                    || rinput.test(this.type));
            })
            .map(function (i, elem) {
                var val = $(this).val();
                return val == null ?
                    null :
                    $.isArray(val) ?
                        $.map(val, function (val, i) {
                            return { name: elem.name, value: val };
                        }) :
                    {
                        name: elem.name,
                        value: (o.boolean && this.type === 'checkbox') ?
                            (this.checked ? 'true' : 'false') :
                            val
                    };
            }).get();
    };


    return $;


}));
