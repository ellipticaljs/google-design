/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash category="array,collection"`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.10.1';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /** Used to fix the JScript `[[DontEnum]]` bug. */
  var shadowProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * ((order === 'asc' || order === true) ? 1 : -1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  var isHostObject = (function() {
    try {
      Object({ 'toString': 0 } + '');
    } catch(e) {
      return function() { return false; };
    }
    return function(value) {
      // IE < 9 presents many host objects as `Object` objects that can coerce
      // to strings despite having improperly defined `toString` methods.
      return typeof value.toString != 'function' && typeof (value + '') == 'string';
    };
  }());

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate free array.
   */
  function sortedUniq(array, iteratee) {
    var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (!index || seen !== computed) {
        seen = computed;
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /** Used for native method references. */
  var arrayProto = Array.prototype,
      errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;

  /** Used to resolve the decompiled source of functions. */
  var fnToString = Function.prototype.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Native method references. */
  var ArrayBuffer = root.ArrayBuffer,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      Set = getNative(root, 'Set'),
      splice = arrayProto.splice,
      Uint8Array = root.Uint8Array;

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeCeil = Math.ceil,
      nativeCreate = getNative(Object, 'create'),
      nativeFloor = Math.floor,
      nativeIsArray = getNative(Array, 'isArray'),
      nativeKeys = getNative(Object, 'keys'),
      nativeMax = Math.max,
      nativeMin = Math.min,
      nativeRandom = Math.random;

  /** Used as references for `-Infinity` and `Infinity`. */
  var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
      POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /**
   * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
   * of an array-like value.
   */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to lookup a type array constructors by `toStringTag`. */
  var ctorByTag = {};
  ctorByTag[float32Tag] = root.Float32Array;
  ctorByTag[float64Tag] = root.Float64Array;
  ctorByTag[int8Tag] = root.Int8Array;
  ctorByTag[int16Tag] = root.Int16Array;
  ctorByTag[int32Tag] = root.Int32Array;
  ctorByTag[uint8Tag] = Uint8Array;
  ctorByTag[uint8ClampedTag] = root.Uint8ClampedArray;
  ctorByTag[uint16Tag] = root.Uint16Array;
  ctorByTag[uint32Tag] = root.Uint32Array;

  /** Used to avoid iterating over non-enumerable properties in IE < 9. */
  var nonEnumProps = {};
  nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolTag] = nonEnumProps[stringTag] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectTag] = { 'constructor': true };

  arrayEach(shadowProps, function(key) {
    for (var tag in nonEnumProps) {
      if (hasOwnProperty.call(nonEnumProps, tag)) {
        var props = nonEnumProps[tag];
        props[key] = hasOwnProperty.call(props, key);
      }
    }
  });

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit chaining.
   * Methods that operate on and return arrays, collections, and functions can
   * be chained together. Methods that retrieve a single value or may return a
   * primitive value will automatically end the chain returning the unwrapped
   * value. Explicit chaining may be enabled using `_.chain`. The execution of
   * chained methods is lazy, that is, execution is deferred until `_#value`
   * is implicitly or explicitly called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
   * fusion is an optimization strategy which merge iteratee calls; this can help
   * to avoid the creation of intermediate data structures and greatly reduce the
   * number of iteratee executions.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers have `Array` and `String` methods.
   *
   * The wrapper `Array` methods are:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
   * `splice`, and `unshift`
   *
   * The wrapper `String` methods are:
   * `replace` and `split`
   *
   * The wrapper methods that support shortcut fusion are:
   * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
   * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
   * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
   * and `where`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
   * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
   * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
   * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
   * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
   * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
   * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
   * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
   * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
   * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
   * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
   * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
   * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
   * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
   * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
   * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
   * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
   * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
   * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
   * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
   * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
   * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
   * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
   * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
   * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
   * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
   * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
   * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
   * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
   * `unescape`, `uniqueId`, `value`, and `words`
   *
   * The wrapper method `sample` will return a wrapped value when `n` is provided,
   * otherwise an unwrapped value is returned.
   *
   * @name _
   * @constructor
   * @category Chain
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(total, n) {
   *   return total + n;
   * });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(n) {
   *   return n * n;
   * });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // No operation performed.
  }

  /**
   * An object environment feature flags.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = lodash.support = {};

  (function(x) {
    var Ctor = function() { this.x = x; },
        object = { '0': x, 'length': x },
        props = [];

    Ctor.prototype = { 'valueOf': x, 'y': x };
    for (var key in new Ctor) { props.push(key); }

    /**
     * Detect if `name` or `message` properties of `Error.prototype` are
     * enumerable by default (IE < 9, Safari < 5.1).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') ||
      propertyIsEnumerable.call(errorProto, 'name');

    /**
     * Detect if `prototype` properties are enumerable by default.
     *
     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
     * (if the prototype or a property on the prototype has been set)
     * incorrectly set the `[[Enumerable]]` value of a function's `prototype`
     * property to `true`.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumPrototypes = propertyIsEnumerable.call(Ctor, 'prototype');

    /**
     * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
     *
     * In IE < 9 an object's own properties, shadowing non-enumerable ones,
     * are made non-enumerable as well (a.k.a the JScript `[[DontEnum]]` bug).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumShadows = !/valueOf/.test(props);

    /**
     * Detect if `Array#shift` and `Array#splice` augment array-like objects
     * correctly.
     *
     * Firefox < 10, compatibility modes of IE 8, and IE < 9 have buggy Array
     * `shift()` and `splice()` functions that fail to remove the last element,
     * `value[0]`, of array-like objects even though the "length" property is
     * set to `0`. The `shift()` method is buggy in compatibility modes of IE 8,
     * while `splice()` is buggy regardless of mode in IE < 9.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.spliceObjects = (splice.call(object, 0, 1), !object[0]);

    /**
     * Detect lack of support for accessing string characters by index.
     *
     * IE < 8 can't access characters by index. IE 8 can only access characters
     * by index on string literals, not string objects.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';
  }(1, 0));

  /*------------------------------------------------------------------------*/

  /**
   *
   * Creates a cache object to store unique values.
   *
   * @private
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var length = values ? values.length : 0;

    this.data = { 'hash': nativeCreate(null), 'set': new Set };
    while (length--) {
      this.push(values[length]);
    }
  }

  /**
   * Checks if `value` is in `cache` mimicking the return signature of
   * `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache to search.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var data = cache.data,
        result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

    return result ? 0 : -1;
  }

  /**
   * Adds `value` to the cache.
   *
   * @private
   * @name push
   * @memberOf SetCache
   * @param {*} value The value to cache.
   */
  function cachePush(value) {
    var data = this.data;
    if (typeof value == 'string' || isObject(value)) {
      data.set.add(value);
    } else {
      data.hash[value] = true;
    }
  }

  /*------------------------------------------------------------------------*/

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function arrayCopy(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
   * with one argument: (value).
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} comparator The function used to compare values.
   * @param {*} exValue The initial extremum value.
   * @returns {*} Returns the extremum value.
   */
  function arrayExtremum(array, iteratee, comparator, exValue) {
    var index = -1,
        length = array.length,
        computed = exValue,
        result = computed;

    while (++index < length) {
      var value = array[index],
          current = +iteratee(value);

      if (comparator(current, computed)) {
        computed = current;
        result = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.map` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initFromArray] Specify using the first element of `array`
   *  as the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initFromArray) {
    var index = -1,
        length = array.length;

    if (initFromArray && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initFromArray] Specify using the last element of `array`
   *  as the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
    var length = array.length;
    if (initFromArray && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.sum` for arrays without support for callback
   * shorthands and `this` binding..
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function arraySum(array, iteratee) {
    var length = array.length,
        result = 0;

    while (length--) {
      result += +iteratee(array[length]) || 0;
    }
    return result;
  }

  /**
   * The base implementation of `_.assign` without support for argument juggling,
   * multiple sources, and `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssign(object, source) {
    return source == null
      ? object
      : baseCopy(source, keys(source), object);
  }

  /**
   * The base implementation of `_.at` without support for string collections
   * and individual key arguments.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {number[]|string[]} props The property names or indexes of elements to pick.
   * @returns {Array} Returns the new array of picked elements.
   */
  function baseAt(collection, props) {
    var index = -1,
        isNil = collection == null,
        isArr = !isNil && isArrayLike(collection),
        length = isArr ? collection.length : 0,
        propsLength = props.length,
        result = Array(propsLength);

    while(++index < propsLength) {
      var key = props[index];
      if (isArr) {
        result[index] = isIndex(key, length) ? collection[key] : undefined;
      } else {
        result[index] = isNil ? undefined : collection[key];
      }
    }
    return result;
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property names to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @returns {Object} Returns `object`.
   */
  function baseCopy(source, props, object) {
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = source[key];
    }
    return object;
  }

  /**
   * The base implementation of `_.callback` which supports specifying the
   * number of arguments to provide to `func`.
   *
   * @private
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function baseCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (type == 'function') {
      return thisArg === undefined
        ? func
        : bindCallback(func, thisArg, argCount);
    }
    if (func == null) {
      return identity;
    }
    if (type == 'object') {
      return baseMatches(func);
    }
    return thisArg === undefined
      ? property(func)
      : baseMatchesProperty(func, thisArg);
  }

  /**
   * The base implementation of `_.clone` without support for argument juggling
   * and `this` binding `customizer` functions.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {Function} [customizer] The function to customize cloning values.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The object `value` belongs to.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates clones with source counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return arrayCopy(value, result);
      }
    } else {
      var tag = objToString.call(value),
          isFunc = tag == funcTag;

      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
        if (isHostObject(value)) {
          return object ? value : {};
        }
        result = initCloneObject(isFunc ? {} : value);
        if (!isDeep) {
          return baseAssign(result, value);
        }
      } else {
        return cloneableTags[tag]
          ? initCloneByTag(value, tag, isDeep)
          : (object ? value : {});
      }
    }
    // Check for circular references and return its corresponding clone.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    // Add the source value to the stack of traversed objects and associate it with its clone.
    stackA.push(value);
    stackB.push(result);

    // Recursively populate clone (susceptible to call stack limits).
    (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
      result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
    });
    return result;
  }

  /**
   * The base implementation of `_.difference` which accepts a single array
   * of values to exclude.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Array} values The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   */
  function baseDifference(array, values) {
    var length = array ? array.length : 0,
        result = [];

    if (!length) {
      return result;
    }
    var index = -1,
        indexOf = getIndexOf(),
        isCommon = indexOf === baseIndexOf,
        cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
        valuesLength = values.length;

    if (cache) {
      indexOf = cacheIndexOf;
      isCommon = false;
      values = cache;
    }
    outer:
    while (++index < length) {
      var value = array[index];

      if (isCommon && value === value) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === value) {
            continue outer;
          }
        }
        result.push(value);
      }
      else if (indexOf(values, value, 0) < 0) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.forEach` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object|string} Returns `collection`.
   */
  var baseEach = createBaseEach(baseForOwn);

  /**
   * The base implementation of `_.forEachRight` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object|string} Returns `collection`.
   */
  var baseEachRight = createBaseEach(baseForOwnRight, true);

  /**
   * The base implementation of `_.every` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`
   */
  function baseEvery(collection, predicate) {
    var result = true;
    baseEach(collection, function(value, index, collection) {
      result = !!predicate(value, index, collection);
      return result;
    });
    return result;
  }

  /**
   * Gets the extremum value of `collection` invoking `iteratee` for each value
   * in `collection` to generate the criterion by which the value is ranked.
   * The `iteratee` is invoked with three arguments: (value, index|key, collection).
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} comparator The function used to compare values.
   * @param {*} exValue The initial extremum value.
   * @returns {*} Returns the extremum value.
   */
  function baseExtremum(collection, iteratee, comparator, exValue) {
    var computed = exValue,
        result = computed;

    baseEach(collection, function(value, index, collection) {
      var current = +iteratee(value, index, collection);
      if (comparator(current, computed) || (current === exValue && current === result)) {
        computed = current;
        result = value;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.fill` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to fill.
   * @param {*} value The value to fill `array` with.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns `array`.
   */
  function baseFill(array, value, start, end) {
    var length = array.length;

    start = start == null ? 0 : (+start || 0);
    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = (end === undefined || end > length) ? length : (+end || 0);
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : (end >>> 0);
    start >>>= 0;

    while (start < length) {
      array[start++] = value;
    }
    return array;
  }

  /**
   * The base implementation of `_.filter` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function baseFilter(collection, predicate) {
    var result = [];
    baseEach(collection, function(value, index, collection) {
      if (predicate(value, index, collection)) {
        result.push(value);
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
   * without support for callback shorthands and `this` binding, which iterates
   * over `collection` using the provided `eachFunc`.
   *
   * @private
   * @param {Array|Object|string} collection The collection to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @param {boolean} [retKey] Specify returning the key of the found element
   *  instead of the element itself.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFind(collection, predicate, eachFunc, retKey) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = retKey ? key : value;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.flatten` with added support for restricting
   * flattening and specifying the start index.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {boolean} [isDeep] Specify a deep flatten.
   * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, isDeep, isStrict, result) {
    result || (result = []);

    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index];
      if (isObjectLike(value) && isArrayLike(value) &&
          (isStrict || isArray(value) || isArguments(value))) {
        if (isDeep) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, isDeep, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  /**
   * The base implementation of `baseForIn` and `baseForOwn` which iterates
   * over `object` properties returned by `keysFunc` invoking `iteratee` for
   * each property. Iteratee functions may exit iteration early by explicitly
   * returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /**
   * This function is like `baseFor` except that it iterates over properties
   * in the opposite order.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseForRight = createBaseFor(true);

  /**
   * The base implementation of `_.forOwn` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return baseFor(object, iteratee, keys);
  }

  /**
   * The base implementation of `_.forOwnRight` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwnRight(object, iteratee) {
    return baseForRight(object, iteratee, keys);
  }

  /**
   * The base implementation of `get` without support for string paths
   * and default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} path The path of the property to get.
   * @param {string} [pathKey] The key representation of path.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path, pathKey) {
    if (object == null) {
      return;
    }
    object = toObject(object);
    if (pathKey !== undefined && pathKey in object) {
      path = [pathKey];
    }
    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = toObject(object)[path[index++]];
    }
    return (index && index == length) ? object : undefined;
  }

  /**
   * The base implementation of `_.isEqual` without support for `this` binding
   * `customizer` functions.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
  }

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `value` objects.
   * @param {Array} [stackB=[]] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = arrayTag,
        othTag = arrayTag;

    if (!objIsArr) {
      objTag = objToString.call(object);
      if (objTag == argsTag) {
        objTag = objectTag;
      } else if (objTag != objectTag) {
        objIsArr = isTypedArray(object);
      }
    }
    if (!othIsArr) {
      othTag = objToString.call(other);
      if (othTag == argsTag) {
        othTag = objectTag;
      } else if (othTag != objectTag) {
        othIsArr = isTypedArray(other);
      }
    }
    var objIsObj = objTag == objectTag && !isHostObject(object),
        othIsObj = othTag == objectTag && !isHostObject(other),
        isSameTag = objTag == othTag;

    if (isSameTag && !(objIsArr || objIsObj)) {
      return equalByTag(object, other, objTag);
    }
    if (!isLoose) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
      }
    }
    if (!isSameTag) {
      return false;
    }
    // Assume cyclic values are equal.
    // For more information on detecting circular references see https://es5.github.io/#JO.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == object) {
        return stackB[length] == other;
      }
    }
    // Add `object` and `other` to the stack of traversed objects.
    stackA.push(object);
    stackB.push(other);

    var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

    stackA.pop();
    stackB.pop();

    return result;
  }

  /**
   * The base implementation of `_.isMatch` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} matchData The propery names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, matchData, customizer) {
    var index = matchData.length,
        length = index,
        noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }
    object = toObject(object);
    while (index--) {
      var data = matchData[index];
      if ((noCustomizer && data[2])
            ? data[1] !== object[data[0]]
            : !(data[0] in object)
          ) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
          objValue = object[key],
          srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var result = customizer ? customizer(objValue, srcValue, key) : undefined;
        if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * The base implementation of `_.map` without support for callback shorthands
   * and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var index = -1,
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function(value, key, collection) {
      result[++index] = iteratee(value, key, collection);
    });
    return result;
  }

  /**
   * The base implementation of `_.matches` which does not clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   */
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      var key = matchData[0][0],
          value = matchData[0][1];

      return function(object) {
        if (object == null) {
          return false;
        }
        object = toObject(object);
        return object[key] === value && (value !== undefined || (key in object));
      };
    }
    return function(object) {
      return baseIsMatch(object, matchData);
    };
  }

  /**
   * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to compare.
   * @returns {Function} Returns the new function.
   */
  function baseMatchesProperty(path, srcValue) {
    var isArr = isArray(path),
        isCommon = isKey(path) && isStrictComparable(srcValue),
        pathKey = (path + '');

    path = toPath(path);
    return function(object) {
      if (object == null) {
        return false;
      }
      var key = pathKey;
      object = toObject(object);
      if ((isArr || !isCommon) && !(key in object)) {
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        if (object == null) {
          return false;
        }
        key = last(path);
        object = toObject(object);
      }
      return object[key] === srcValue
        ? (srcValue !== undefined || (key in object))
        : baseIsEqual(srcValue, object[key], undefined, true);
    };
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : toObject(object)[key];
    };
  }

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new function.
   */
  function basePropertyDeep(path) {
    var pathKey = (path + '');
    path = toPath(path);
    return function(object) {
      return baseGet(object, path, pathKey);
    };
  }

  /**
   * The base implementation of `_.pullAt` without support for individual
   * index arguments and capturing the removed elements.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {number[]} indexes The indexes of elements to remove.
   * @returns {Array} Returns `array`.
   */
  function basePullAt(array, indexes) {
    var length = array ? indexes.length : 0;
    while (length--) {
      var index = indexes[length];
      if (index != previous && isIndex(index)) {
        var previous = index;
        splice.call(array, index, 1);
      }
    }
    return array;
  }

  /**
   * The base implementation of `_.random` without support for argument juggling
   * and returning floating-point numbers.
   *
   * @private
   * @param {number} min The minimum possible value.
   * @param {number} max The maximum possible value.
   * @returns {number} Returns the random number.
   */
  function baseRandom(min, max) {
    return min + nativeFloor(nativeRandom() * (max - min + 1));
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight` without support
   * for callback shorthands and `this` binding, which iterates over `collection`
   * using the provided `eachFunc`.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initFromCollection Specify using the first or last element
   *  of `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initFromCollection
        ? (initFromCollection = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */
  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    start = start == null ? 0 : (+start || 0);
    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = (end === undefined || end > length) ? length : (+end || 0);
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }

  /**
   * The base implementation of `_.some` without support for callback shorthands
   * and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function baseSome(collection, predicate) {
    var result;

    baseEach(collection, function(value, index, collection) {
      result = predicate(value, index, collection);
      return !result;
    });
    return !!result;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define
   * the sort order of `array` and replaces criteria objects with their
   * corresponding values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sortByOrder` without param guards.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
   * @param {boolean[]} orders The sort orders of `iteratees`.
   * @returns {Array} Returns the new sorted array.
   */
  function baseSortByOrder(collection, iteratees, orders) {
    var callback = getCallback(),
        index = -1;

    iteratees = arrayMap(iteratees, function(iteratee) { return callback(iteratee); });

    var result = baseMap(collection, function(value) {
      var criteria = arrayMap(iteratees, function(iteratee) { return iteratee(value); });
      return { 'criteria': criteria, 'index': ++index, 'value': value };
    });

    return baseSortBy(result, function(object, other) {
      return compareMultiple(object, other, orders);
    });
  }

  /**
   * The base implementation of `_.sum` without support for callback shorthands
   * and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(collection, iteratee) {
    var result = 0;
    baseEach(collection, function(value, index, collection) {
      result += +iteratee(value, index, collection) || 0;
    });
    return result;
  }

  /**
   * The base implementation of `_.uniq` without support for callback shorthands
   * and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate free array.
   */
  function baseUniq(array, iteratee) {
    var index = -1,
        indexOf = getIndexOf(),
        length = array.length,
        isCommon = indexOf === baseIndexOf,
        isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
        seen = isLarge ? createCache() : null,
        result = [];

    if (seen) {
      indexOf = cacheIndexOf;
      isCommon = false;
    } else {
      isLarge = false;
      seen = iteratee ? [] : result;
    }
    outer:
    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (isCommon && value === value) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed) {
            continue outer;
          }
        }
        if (iteratee) {
          seen.push(computed);
        }
        result.push(value);
      }
      else if (indexOf(seen, computed, 0) < 0) {
        if (iteratee || isLarge) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    var index = -1,
        length = props.length,
        result = Array(length);

    while (++index < length) {
      result[index] = object[props[index]];
    }
    return result;
  }

  /**
   * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
   * and `_.takeWhile` without support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to query.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Array} Returns the slice of `array`.
   */
  function baseWhile(array, predicate, isDrop, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
    return isDrop
      ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
      : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
  }

  /**
   * Performs a binary search of `array` to determine the index at which `value`
   * should be inserted into `array` in order to maintain its sort order.
   *
   * @private
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @param {boolean} [retHighest] Specify returning the highest qualified index.
   * @returns {number} Returns the index at which `value` should be inserted
   *  into `array`.
   */
  function binaryIndex(array, value, retHighest) {
    var low = 0,
        high = array ? array.length : low;

    if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
      while (low < high) {
        var mid = (low + high) >>> 1,
            computed = array[mid];

        if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return high;
    }
    return binaryIndexBy(array, value, identity, retHighest);
  }

  /**
   * This function is like `binaryIndex` except that it invokes `iteratee` for
   * `value` and each element of `array` to compute their sort ranking. The
   * iteratee is invoked with one argument; (value).
   *
   * @private
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {boolean} [retHighest] Specify returning the highest qualified index.
   * @returns {number} Returns the index at which `value` should be inserted
   *  into `array`.
   */
  function binaryIndexBy(array, value, iteratee, retHighest) {
    value = iteratee(value);

    var low = 0,
        high = array ? array.length : 0,
        valIsNaN = value !== value,
        valIsNull = value === null,
        valIsUndef = value === undefined;

    while (low < high) {
      var mid = nativeFloor((low + high) / 2),
          computed = iteratee(array[mid]),
          isDef = computed !== undefined,
          isReflexive = computed === computed;

      if (valIsNaN) {
        var setLow = isReflexive || retHighest;
      } else if (valIsNull) {
        setLow = isReflexive && isDef && (retHighest || computed != null);
      } else if (valIsUndef) {
        setLow = isReflexive && (retHighest || isDef);
      } else if (computed == null) {
        setLow = false;
      } else {
        setLow = retHighest ? (computed <= value) : (computed < value);
      }
      if (setLow) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return nativeMin(high, MAX_ARRAY_INDEX);
  }

  /**
   * A specialized version of `baseCallback` which only supports `this` binding
   * and specifying the number of arguments to provide to `func`.
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function bindCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    if (thisArg === undefined) {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
      case 5: return function(value, other, key, object, source) {
        return func.call(thisArg, value, other, key, object, source);
      };
    }
    return function() {
      return func.apply(thisArg, arguments);
    };
  }

  /**
   * Creates a clone of the given array buffer.
   *
   * @private
   * @param {ArrayBuffer} buffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function bufferClone(buffer) {
    var result = new ArrayBuffer(buffer.byteLength),
        view = new Uint8Array(result);

    view.set(new Uint8Array(buffer));
    return result;
  }

  /**
   * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
   *
   * @private
   * @param {Function} setter The function to set keys and values of the accumulator object.
   * @param {Function} [initializer] The function to initialize the accumulator object.
   * @returns {Function} Returns the new aggregator function.
   */
  function createAggregator(setter, initializer) {
    return function(collection, iteratee, thisArg) {
      var result = initializer ? initializer() : {};
      iteratee = getCallback(iteratee, thisArg, 3);

      if (isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          setter(result, value, iteratee(value, index, collection), collection);
        }
      } else {
        baseEach(collection, function(value, key, collection) {
          setter(result, value, iteratee(value, key, collection), collection);
        });
      }
      return result;
    };
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      var length = collection ? getLength(collection) : 0;
      if (!isLength(length)) {
        return eachFunc(collection, iteratee);
      }
      var index = fromRight ? length : -1,
          iterable = toObject(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  /**
   * Creates a base function for `_.forIn` or `_.forInRight`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var iterable = toObject(object),
          props = keysFunc(object),
          length = props.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length)) {
        var key = props[index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * Creates a `Set` cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [values] The values to cache.
   * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
   */
  function createCache(values) {
    return (nativeCreate && Set) ? new SetCache(values) : null;
  }

  /**
   * Creates a `_.max` or `_.min` function.
   *
   * @private
   * @param {Function} comparator The function used to compare values.
   * @param {*} exValue The initial extremum value.
   * @returns {Function} Returns the new extremum function.
   */
  function createExtremum(comparator, exValue) {
    return function(collection, iteratee, thisArg) {
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      iteratee = getCallback(iteratee, thisArg, 3);
      if (iteratee.length == 1) {
        collection = isArray(collection) ? collection : toIterable(collection);
        var result = arrayExtremum(collection, iteratee, comparator, exValue);
        if (!(collection.length && result === exValue)) {
          return result;
        }
      }
      return baseExtremum(collection, iteratee, comparator, exValue);
    };
  }

  /**
   * Creates a `_.find` or `_.findLast` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new find function.
   */
  function createFind(eachFunc, fromRight) {
    return function(collection, predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate, fromRight);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, eachFunc);
    };
  }

  /**
   * Creates a `_.findIndex` or `_.findLastIndex` function.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new find function.
   */
  function createFindIndex(fromRight) {
    return function(array, predicate, thisArg) {
      if (!(array && array.length)) {
        return -1;
      }
      predicate = getCallback(predicate, thisArg, 3);
      return baseFindIndex(array, predicate, fromRight);
    };
  }

  /**
   * Creates a function for `_.forEach` or `_.forEachRight`.
   *
   * @private
   * @param {Function} arrayFunc The function to iterate over an array.
   * @param {Function} eachFunc The function to iterate over a collection.
   * @returns {Function} Returns the new each function.
   */
  function createForEach(arrayFunc, eachFunc) {
    return function(collection, iteratee, thisArg) {
      return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
        ? arrayFunc(collection, iteratee)
        : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
    };
  }

  /**
   * Creates a function for `_.reduce` or `_.reduceRight`.
   *
   * @private
   * @param {Function} arrayFunc The function to iterate over an array.
   * @param {Function} eachFunc The function to iterate over a collection.
   * @returns {Function} Returns the new each function.
   */
  function createReduce(arrayFunc, eachFunc) {
    return function(collection, iteratee, accumulator, thisArg) {
      var initFromArray = arguments.length < 3;
      return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
        ? arrayFunc(collection, iteratee, accumulator, initFromArray)
        : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
    };
  }

  /**
   * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
   *
   * @private
   * @param {boolean} [retHighest] Specify returning the highest qualified index.
   * @returns {Function} Returns the new index function.
   */
  function createSortedIndex(retHighest) {
    return function(array, value, iteratee, thisArg) {
      var callback = getCallback(iteratee);
      return (iteratee == null && callback === baseCallback)
        ? binaryIndex(array, value, retHighest)
        : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest);
    };
  }

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing arrays.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var index = -1,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
      return false;
    }
    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index],
          result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

      if (result !== undefined) {
        if (result) {
          continue;
        }
        return false;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (isLoose) {
        if (!arraySome(other, function(othValue) {
              return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
            })) {
          return false;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag) {
    switch (tag) {
      case boolTag:
      case dateTag:
        // Coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
        return +object == +other;

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case numberTag:
        // Treat `NaN` vs. `NaN` as equal.
        return (object != +object)
          ? other != +other
          : object == +other;

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings primitives and string
        // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
        return object == (other + '');
    }
    return false;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var objProps = keys(object),
        objLength = objProps.length,
        othProps = keys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isLoose) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    var skipCtor = isLoose;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key],
          result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

      // Recursively compare objects (susceptible to call stack limits).
      if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
        return false;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (!skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the appropriate "callback" function. If the `_.callback` method is
   * customized this function returns the custom method, otherwise it returns
   * the `baseCallback` function. If arguments are provided the chosen function
   * is invoked with them and its result is returned.
   *
   * @private
   * @returns {Function} Returns the chosen function or its result.
   */
  function getCallback(func, thisArg, argCount) {
    var result = lodash.callback || callback;
    result = result === callback ? baseCallback : result;
    return argCount ? result(func, thisArg, argCount) : result;
  }

  /**
   * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
   * customized this function returns the custom method, otherwise it returns
   * the `baseIndexOf` function. If arguments are provided the chosen function
   * is invoked with them and its result is returned.
   *
   * @private
   * @returns {Function|number} Returns the chosen function or its result.
   */
  function getIndexOf(collection, target, fromIndex) {
    var result = lodash.indexOf || indexOf;
    result = result === indexOf ? baseIndexOf : result;
    return collection ? result(collection, target, fromIndex) : result;
  }

  /**
   * Gets the "length" property value of `object`.
   *
   * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
   * that affects Safari on at least iOS 8.1-8.3 ARM64.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {*} Returns the "length" value.
   */
  var getLength = baseProperty('length');

  /**
   * Gets the propery names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = pairs(object),
        length = result.length;

    while (length--) {
      result[length][2] = isStrictComparable(result[length][1]);
    }
    return result;
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = object == null ? undefined : object[key];
    return isNative(value) ? value : undefined;
  }

  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */
  function initCloneArray(array) {
    var length = array.length,
        result = new array.constructor(length);

    // Add array properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    var Ctor = object.constructor;
    if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
      Ctor = Object;
    }
    return new Ctor;
  }

  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return bufferClone(object);

      case boolTag:
      case dateTag:
        return new Ctor(+object);

      case float32Tag: case float64Tag:
      case int8Tag: case int16Tag: case int32Tag:
      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
        // Safari 5 mobile incorrectly has `Object` as the constructor of typed arrays.
        if (Ctor instanceof Ctor) {
          Ctor = ctorByTag[tag];
        }
        var buffer = object.buffer;
        return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

      case numberTag:
      case stringTag:
        return new Ctor(object);

      case regexpTag:
        var result = new Ctor(object.source, reFlags.exec(object));
        result.lastIndex = object.lastIndex;
    }
    return result;
  }

  /**
   * Invokes the method at `path` on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the method to invoke.
   * @param {Array} args The arguments to invoke the method with.
   * @returns {*} Returns the result of the invoked method.
   */
  function invokePath(object, path, args) {
    if (object != null && !isKey(path, object)) {
      path = toPath(path);
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      path = last(path);
    }
    var func = object == null ? object : object[path];
    return func == null ? undefined : func.apply(object, args);
  }

  /**
   * Checks if `value` is array-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   */
  function isArrayLike(value) {
    return value != null && isLength(getLength(value));
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * Checks if the provided arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)) {
      var other = object[index];
      return value === value ? (value === other) : (other !== other);
    }
    return false;
  }

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    var type = typeof value;
    if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
      return true;
    }
    if (isArray(value)) {
      return false;
    }
    var result = !reIsDeepProp.test(value);
    return result || (object != null && value in toObject(object));
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   */
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }

  /**
   * A fallback implementation of `Object.keys` which creates an array of the
   * own enumerable property names of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function shimKeys(object) {
    var props = keysIn(object),
        propsLength = props.length,
        length = propsLength && object.length;

    var allowIndexes = !!length && isLength(length) &&
      (isArray(object) || isArguments(object) || isString(object));

    var index = -1,
        result = [];

    while (++index < propsLength) {
      var key = props[index];
      if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Converts `value` to an array-like object if it's not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Array|Object} Returns the array-like object.
   */
  function toIterable(value) {
    if (value == null) {
      return [];
    }
    if (!isArrayLike(value)) {
      return values(value);
    }
    if (lodash.support.unindexedChars && isString(value)) {
      return value.split('');
    }
    return isObject(value) ? value : Object(value);
  }

  /**
   * Converts `value` to an object if it's not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Object} Returns the object.
   */
  function toObject(value) {
    if (lodash.support.unindexedChars && isString(value)) {
      var index = -1,
          length = value.length,
          result = Object(value);

      while (++index < length) {
        result[index] = value.charAt(index);
      }
      return result;
    }
    return isObject(value) ? value : Object(value);
  }

  /**
   * Converts `value` to property path array if it's not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Array} Returns the property path array.
   */
  function toPath(value) {
    if (isArray(value)) {
      return value;
    }
    var result = [];
    baseToString(value).replace(rePropName, function(match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array of elements split into groups the length of `size`.
   * If `collection` can't be split evenly, the final chunk will be the remaining
   * elements.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to process.
   * @param {number} [size=1] The length of each chunk.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Array} Returns the new array containing chunks.
   * @example
   *
   * _.chunk(['a', 'b', 'c', 'd'], 2);
   * // => [['a', 'b'], ['c', 'd']]
   *
   * _.chunk(['a', 'b', 'c', 'd'], 3);
   * // => [['a', 'b', 'c'], ['d']]
   */
  function chunk(array, size, guard) {
    if (guard ? isIterateeCall(array, size, guard) : size == null) {
      size = 1;
    } else {
      size = nativeMax(nativeFloor(size) || 1, 1);
    }
    var index = 0,
        length = array ? array.length : 0,
        resIndex = -1,
        result = Array(nativeCeil(length / size));

    while (index < length) {
      result[++resIndex] = baseSlice(array, index, (index += size));
    }
    return result;
  }

  /**
   * Creates an array with all falsey values removed. The values `false`, `null`,
   * `0`, `""`, `undefined`, and `NaN` are falsey.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to compact.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * _.compact([0, 1, false, 2, '', 3]);
   * // => [1, 2, 3]
   */
  function compact(array) {
    var index = -1,
        length = array ? array.length : 0,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * Creates an array of unique `array` values not included in the other
   * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...Array} [values] The arrays of values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * _.difference([1, 2, 3], [4, 2]);
   * // => [1, 3]
   */
  var difference = restParam(function(array, values) {
    return (isObjectLike(array) && isArrayLike(array))
      ? baseDifference(array, baseFlatten(values, false, true))
      : [];
  });

  /**
   * Creates a slice of `array` with `n` elements dropped from the beginning.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @param {number} [n=1] The number of elements to drop.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.drop([1, 2, 3]);
   * // => [2, 3]
   *
   * _.drop([1, 2, 3], 2);
   * // => [3]
   *
   * _.drop([1, 2, 3], 5);
   * // => []
   *
   * _.drop([1, 2, 3], 0);
   * // => [1, 2, 3]
   */
  function drop(array, n, guard) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    if (guard ? isIterateeCall(array, n, guard) : n == null) {
      n = 1;
    }
    return baseSlice(array, n < 0 ? 0 : n);
  }

  /**
   * Creates a slice of `array` with `n` elements dropped from the end.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @param {number} [n=1] The number of elements to drop.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.dropRight([1, 2, 3]);
   * // => [1, 2]
   *
   * _.dropRight([1, 2, 3], 2);
   * // => [1]
   *
   * _.dropRight([1, 2, 3], 5);
   * // => []
   *
   * _.dropRight([1, 2, 3], 0);
   * // => [1, 2, 3]
   */
  function dropRight(array, n, guard) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    if (guard ? isIterateeCall(array, n, guard) : n == null) {
      n = 1;
    }
    n = length - (+n || 0);
    return baseSlice(array, 0, n < 0 ? 0 : n);
  }

  /**
   * Creates a slice of `array` excluding elements dropped from the end.
   * Elements are dropped until `predicate` returns falsey. The predicate is
   * bound to `thisArg` and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that match the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.dropRightWhile([1, 2, 3], function(n) {
   *   return n > 1;
   * });
   * // => [1]
   *
   * var users = [
   *   { 'user': 'barney',  'active': true },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': false }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
   * // => ['barney', 'fred']
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
   * // => ['barney']
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.dropRightWhile(users, 'active'), 'user');
   * // => ['barney', 'fred', 'pebbles']
   */
  function dropRightWhile(array, predicate, thisArg) {
    return (array && array.length)
      ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
      : [];
  }

  /**
   * Creates a slice of `array` excluding elements dropped from the beginning.
   * Elements are dropped until `predicate` returns falsey. The predicate is
   * bound to `thisArg` and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.dropWhile([1, 2, 3], function(n) {
   *   return n < 3;
   * });
   * // => [3]
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
   * // => ['fred', 'pebbles']
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.pluck(_.dropWhile(users, 'active', false), 'user');
   * // => ['pebbles']
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.dropWhile(users, 'active'), 'user');
   * // => ['barney', 'fred', 'pebbles']
   */
  function dropWhile(array, predicate, thisArg) {
    return (array && array.length)
      ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
      : [];
  }

  /**
   * Fills elements of `array` with `value` from `start` up to, but not
   * including, `end`.
   *
   * **Note:** This method mutates `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to fill.
   * @param {*} value The value to fill `array` with.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = [1, 2, 3];
   *
   * _.fill(array, 'a');
   * console.log(array);
   * // => ['a', 'a', 'a']
   *
   * _.fill(Array(3), 2);
   * // => [2, 2, 2]
   *
   * _.fill([4, 6, 8], '*', 1, 2);
   * // => [4, '*', 8]
   */
  function fill(array, value, start, end) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
      start = 0;
      end = length;
    }
    return baseFill(array, value, start, end);
  }

  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * _.findIndex(users, function(chr) {
   *   return chr.user == 'barney';
   * });
   * // => 0
   *
   * // using the `_.matches` callback shorthand
   * _.findIndex(users, { 'user': 'fred', 'active': false });
   * // => 1
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.findIndex(users, 'active', false);
   * // => 0
   *
   * // using the `_.property` callback shorthand
   * _.findIndex(users, 'active');
   * // => 2
   */
  var findIndex = createFindIndex();

  /**
   * This method is like `_.findIndex` except that it iterates over elements
   * of `collection` from right to left.
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': true },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': false }
   * ];
   *
   * _.findLastIndex(users, function(chr) {
   *   return chr.user == 'pebbles';
   * });
   * // => 2
   *
   * // using the `_.matches` callback shorthand
   * _.findLastIndex(users, { 'user': 'barney', 'active': true });
   * // => 0
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.findLastIndex(users, 'active', false);
   * // => 2
   *
   * // using the `_.property` callback shorthand
   * _.findLastIndex(users, 'active');
   * // => 0
   */
  var findLastIndex = createFindIndex(true);

  /**
   * Gets the first element of `array`.
   *
   * @static
   * @memberOf _
   * @alias head
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the first element of `array`.
   * @example
   *
   * _.first([1, 2, 3]);
   * // => 1
   *
   * _.first([]);
   * // => undefined
   */
  function first(array) {
    return array ? array[0] : undefined;
  }

  /**
   * Flattens a nested array. If `isDeep` is `true` the array is recursively
   * flattened, otherwise it's only flattened a single level.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to flatten.
   * @param {boolean} [isDeep] Specify a deep flatten.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flatten([1, [2, 3, [4]]]);
   * // => [1, 2, 3, [4]]
   *
   * // using `isDeep`
   * _.flatten([1, [2, 3, [4]]], true);
   * // => [1, 2, 3, 4]
   */
  function flatten(array, isDeep, guard) {
    var length = array ? array.length : 0;
    if (guard && isIterateeCall(array, isDeep, guard)) {
      isDeep = false;
    }
    return length ? baseFlatten(array, isDeep) : [];
  }

  /**
   * Recursively flattens a nested array.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to recursively flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flattenDeep([1, [2, 3, [4]]]);
   * // => [1, 2, 3, 4]
   */
  function flattenDeep(array) {
    var length = array ? array.length : 0;
    return length ? baseFlatten(array, true) : [];
  }

  /**
   * Gets the index at which the first occurrence of `value` is found in `array`
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons. If `fromIndex` is negative, it's used as the offset
   * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
   * performs a faster binary search.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {boolean|number} [fromIndex=0] The index to search from or `true`
   *  to perform a binary search on a sorted array.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * _.indexOf([1, 2, 1, 2], 2);
   * // => 1
   *
   * // using `fromIndex`
   * _.indexOf([1, 2, 1, 2], 2, 2);
   * // => 3
   *
   * // performing a binary search
   * _.indexOf([1, 1, 2, 2], 2, true);
   * // => 2
   */
  function indexOf(array, value, fromIndex) {
    var length = array ? array.length : 0;
    if (!length) {
      return -1;
    }
    if (typeof fromIndex == 'number') {
      fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
    } else if (fromIndex) {
      var index = binaryIndex(array, value);
      if (index < length &&
          (value === value ? (value === array[index]) : (array[index] !== array[index]))) {
        return index;
      }
      return -1;
    }
    return baseIndexOf(array, value, fromIndex || 0);
  }

  /**
   * Gets all but the last element of `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.initial([1, 2, 3]);
   * // => [1, 2]
   */
  function initial(array) {
    return dropRight(array, 1);
  }

  /**
   * Creates an array of unique values that are included in all of the provided
   * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of shared values.
   * @example
   * _.intersection([1, 2], [4, 2], [2, 1]);
   * // => [2]
   */
  var intersection = restParam(function(arrays) {
    var othLength = arrays.length,
        othIndex = othLength,
        caches = Array(length),
        indexOf = getIndexOf(),
        isCommon = indexOf === baseIndexOf,
        result = [];

    while (othIndex--) {
      var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
      caches[othIndex] = (isCommon && value.length >= 120) ? createCache(othIndex && value) : null;
    }
    var array = arrays[0],
        index = -1,
        length = array ? array.length : 0,
        seen = caches[0];

    outer:
    while (++index < length) {
      value = array[index];
      if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
        var othIndex = othLength;
        while (--othIndex) {
          var cache = caches[othIndex];
          if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
            continue outer;
          }
        }
        if (seen) {
          seen.push(value);
        }
        result.push(value);
      }
    }
    return result;
  });

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */
  function last(array) {
    var length = array ? array.length : 0;
    return length ? array[length - 1] : undefined;
  }

  /**
   * This method is like `_.indexOf` except that it iterates over elements of
   * `array` from right to left.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {boolean|number} [fromIndex=array.length-1] The index to search from
   *  or `true` to perform a binary search on a sorted array.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * _.lastIndexOf([1, 2, 1, 2], 2);
   * // => 3
   *
   * // using `fromIndex`
   * _.lastIndexOf([1, 2, 1, 2], 2, 2);
   * // => 1
   *
   * // performing a binary search
   * _.lastIndexOf([1, 1, 2, 2], 2, true);
   * // => 3
   */
  function lastIndexOf(array, value, fromIndex) {
    var length = array ? array.length : 0;
    if (!length) {
      return -1;
    }
    var index = length;
    if (typeof fromIndex == 'number') {
      index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
    } else if (fromIndex) {
      index = binaryIndex(array, value, true) - 1;
      var other = array[index];
      if (value === value ? (value === other) : (other !== other)) {
        return index;
      }
      return -1;
    }
    if (value !== value) {
      return indexOfNaN(array, index, true);
    }
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Removes all provided values from `array` using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * **Note:** Unlike `_.without`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to modify.
   * @param {...*} [values] The values to remove.
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = [1, 2, 3, 1, 2, 3];
   *
   * _.pull(array, 2, 3);
   * console.log(array);
   * // => [1, 1]
   */
  function pull() {
    var args = arguments,
        array = args[0];

    if (!(array && array.length)) {
      return array;
    }
    var index = 0,
        indexOf = getIndexOf(),
        length = args.length;

    while (++index < length) {
      var fromIndex = 0,
          value = args[index];

      while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
        splice.call(array, fromIndex, 1);
      }
    }
    return array;
  }

  /**
   * Removes elements from `array` corresponding to the given indexes and returns
   * an array of the removed elements. Indexes may be specified as an array of
   * indexes or as individual arguments.
   *
   * **Note:** Unlike `_.at`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to modify.
   * @param {...(number|number[])} [indexes] The indexes of elements to remove,
   *  specified as individual indexes or arrays of indexes.
   * @returns {Array} Returns the new array of removed elements.
   * @example
   *
   * var array = [5, 10, 15, 20];
   * var evens = _.pullAt(array, 1, 3);
   *
   * console.log(array);
   * // => [5, 15]
   *
   * console.log(evens);
   * // => [10, 20]
   */
  var pullAt = restParam(function(array, indexes) {
    indexes = baseFlatten(indexes);

    var result = baseAt(array, indexes);
    basePullAt(array, indexes.sort(baseCompareAscending));
    return result;
  });

  /**
   * Removes all elements from `array` that `predicate` returns truthy for
   * and returns an array of the removed elements. The predicate is bound to
   * `thisArg` and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * **Note:** Unlike `_.filter`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to modify.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the new array of removed elements.
   * @example
   *
   * var array = [1, 2, 3, 4];
   * var evens = _.remove(array, function(n) {
   *   return n % 2 == 0;
   * });
   *
   * console.log(array);
   * // => [1, 3]
   *
   * console.log(evens);
   * // => [2, 4]
   */
  function remove(array, predicate, thisArg) {
    var result = [];
    if (!(array && array.length)) {
      return result;
    }
    var index = -1,
        indexes = [],
        length = array.length;

    predicate = getCallback(predicate, thisArg, 3);
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result.push(value);
        indexes.push(index);
      }
    }
    basePullAt(array, indexes);
    return result;
  }

  /**
   * Gets all but the first element of `array`.
   *
   * @static
   * @memberOf _
   * @alias tail
   * @category Array
   * @param {Array} array The array to query.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.rest([1, 2, 3]);
   * // => [2, 3]
   */
  function rest(array) {
    return drop(array, 1);
  }

  /**
   * Creates a slice of `array` from `start` up to, but not including, `end`.
   *
   * **Note:** This method is used instead of `Array#slice` to support node
   * lists in IE < 9 and to ensure dense arrays are returned.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */
  function slice(array, start, end) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
      start = 0;
      end = length;
    }
    return baseSlice(array, start, end);
  }

  /**
   * Uses a binary search to determine the lowest index at which `value` should
   * be inserted into `array` in order to maintain its sort order. If an iteratee
   * function is provided it's invoked for `value` and each element of `array`
   * to compute their sort ranking. The iteratee is bound to `thisArg` and
   * invoked with one argument; (value).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {number} Returns the index at which `value` should be inserted
   *  into `array`.
   * @example
   *
   * _.sortedIndex([30, 50], 40);
   * // => 1
   *
   * _.sortedIndex([4, 4, 5, 5], 5);
   * // => 2
   *
   * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
   *
   * // using an iteratee function
   * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
   *   return this.data[word];
   * }, dict);
   * // => 1
   *
   * // using the `_.property` callback shorthand
   * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
   * // => 1
   */
  var sortedIndex = createSortedIndex();

  /**
   * This method is like `_.sortedIndex` except that it returns the highest
   * index at which `value` should be inserted into `array` in order to
   * maintain its sort order.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {number} Returns the index at which `value` should be inserted
   *  into `array`.
   * @example
   *
   * _.sortedLastIndex([4, 4, 5, 5], 5);
   * // => 4
   */
  var sortedLastIndex = createSortedIndex(true);

  /**
   * Creates a slice of `array` with `n` elements taken from the beginning.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @param {number} [n=1] The number of elements to take.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.take([1, 2, 3]);
   * // => [1]
   *
   * _.take([1, 2, 3], 2);
   * // => [1, 2]
   *
   * _.take([1, 2, 3], 5);
   * // => [1, 2, 3]
   *
   * _.take([1, 2, 3], 0);
   * // => []
   */
  function take(array, n, guard) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    if (guard ? isIterateeCall(array, n, guard) : n == null) {
      n = 1;
    }
    return baseSlice(array, 0, n < 0 ? 0 : n);
  }

  /**
   * Creates a slice of `array` with `n` elements taken from the end.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @param {number} [n=1] The number of elements to take.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.takeRight([1, 2, 3]);
   * // => [3]
   *
   * _.takeRight([1, 2, 3], 2);
   * // => [2, 3]
   *
   * _.takeRight([1, 2, 3], 5);
   * // => [1, 2, 3]
   *
   * _.takeRight([1, 2, 3], 0);
   * // => []
   */
  function takeRight(array, n, guard) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    if (guard ? isIterateeCall(array, n, guard) : n == null) {
      n = 1;
    }
    n = length - (+n || 0);
    return baseSlice(array, n < 0 ? 0 : n);
  }

  /**
   * Creates a slice of `array` with elements taken from the end. Elements are
   * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
   * and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.takeRightWhile([1, 2, 3], function(n) {
   *   return n > 1;
   * });
   * // => [2, 3]
   *
   * var users = [
   *   { 'user': 'barney',  'active': true },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': false }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
   * // => ['pebbles']
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
   * // => ['fred', 'pebbles']
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.takeRightWhile(users, 'active'), 'user');
   * // => []
   */
  function takeRightWhile(array, predicate, thisArg) {
    return (array && array.length)
      ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
      : [];
  }

  /**
   * Creates a slice of `array` with elements taken from the beginning. Elements
   * are taken until `predicate` returns falsey. The predicate is bound to
   * `thisArg` and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.takeWhile([1, 2, 3], function(n) {
   *   return n < 3;
   * });
   * // => [1, 2]
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false},
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
   * // => ['barney']
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.pluck(_.takeWhile(users, 'active', false), 'user');
   * // => ['barney', 'fred']
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.takeWhile(users, 'active'), 'user');
   * // => []
   */
  function takeWhile(array, predicate, thisArg) {
    return (array && array.length)
      ? baseWhile(array, getCallback(predicate, thisArg, 3))
      : [];
  }

  /**
   * Creates an array of unique values, in order, from all of the provided arrays
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of combined values.
   * @example
   *
   * _.union([1, 2], [4, 2], [2, 1]);
   * // => [1, 2, 4]
   */
  var union = restParam(function(arrays) {
    return baseUniq(baseFlatten(arrays, false, true));
  });

  /**
   * Creates a duplicate-free version of an array, using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons, in which only the first occurence of each element
   * is kept. Providing `true` for `isSorted` performs a faster search algorithm
   * for sorted arrays. If an iteratee function is provided it's invoked for
   * each element in the array to generate the criterion by which uniqueness
   * is computed. The `iteratee` is bound to `thisArg` and invoked with three
   * arguments: (value, index, array).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @alias unique
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {boolean} [isSorted] Specify the array is sorted.
   * @param {Function|Object|string} [iteratee] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new duplicate-value-free array.
   * @example
   *
   * _.uniq([2, 1, 2]);
   * // => [2, 1]
   *
   * // using `isSorted`
   * _.uniq([1, 1, 2], true);
   * // => [1, 2]
   *
   * // using an iteratee function
   * _.uniq([1, 2.5, 1.5, 2], function(n) {
   *   return this.floor(n);
   * }, Math);
   * // => [1, 2.5]
   *
   * // using the `_.property` callback shorthand
   * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
   * // => [{ 'x': 1 }, { 'x': 2 }]
   */
  function uniq(array, isSorted, iteratee, thisArg) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    if (isSorted != null && typeof isSorted != 'boolean') {
      thisArg = iteratee;
      iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
      isSorted = false;
    }
    var callback = getCallback();
    if (!(iteratee == null && callback === baseCallback)) {
      iteratee = callback(iteratee, thisArg, 3);
    }
    return (isSorted && getIndexOf() === baseIndexOf)
      ? sortedUniq(array, iteratee)
      : baseUniq(array, iteratee);
  }

  /**
   * This method is like `_.zip` except that it accepts an array of grouped
   * elements and creates an array regrouping the elements to their pre-zip
   * configuration.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array of grouped elements to process.
   * @returns {Array} Returns the new array of regrouped elements.
   * @example
   *
   * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
   * // => [['fred', 30, true], ['barney', 40, false]]
   *
   * _.unzip(zipped);
   * // => [['fred', 'barney'], [30, 40], [true, false]]
   */
  function unzip(array) {
    if (!(array && array.length)) {
      return [];
    }
    var index = -1,
        length = 0;

    array = arrayFilter(array, function(group) {
      if (isArrayLike(group)) {
        length = nativeMax(group.length, length);
        return true;
      }
    });
    var result = Array(length);
    while (++index < length) {
      result[index] = arrayMap(array, baseProperty(index));
    }
    return result;
  }

  /**
   * This method is like `_.unzip` except that it accepts an iteratee to specify
   * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
   * and invoked with four arguments: (accumulator, value, index, group).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array of grouped elements to process.
   * @param {Function} [iteratee] The function to combine regrouped values.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new array of regrouped elements.
   * @example
   *
   * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
   * // => [[1, 10, 100], [2, 20, 200]]
   *
   * _.unzipWith(zipped, _.add);
   * // => [3, 30, 300]
   */
  function unzipWith(array, iteratee, thisArg) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    var result = unzip(array);
    if (iteratee == null) {
      return result;
    }
    iteratee = bindCallback(iteratee, thisArg, 4);
    return arrayMap(result, function(group) {
      return arrayReduce(group, iteratee, undefined, true);
    });
  }

  /**
   * Creates an array excluding all provided values using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to filter.
   * @param {...*} [values] The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * _.without([1, 2, 1, 3], 1, 2);
   * // => [3]
   */
  var without = restParam(function(array, values) {
    return isArrayLike(array)
      ? baseDifference(array, values)
      : [];
  });

  /**
   * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
   * of the provided arrays.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of values.
   * @example
   *
   * _.xor([1, 2], [4, 2]);
   * // => [1, 4]
   */
  function xor() {
    var index = -1,
        length = arguments.length;

    while (++index < length) {
      var array = arguments[index];
      if (isArrayLike(array)) {
        var result = result
          ? arrayPush(baseDifference(result, array), baseDifference(array, result))
          : array;
      }
    }
    return result ? baseUniq(result) : [];
  }

  /**
   * Creates an array of grouped elements, the first of which contains the first
   * elements of the given arrays, the second of which contains the second elements
   * of the given arrays, and so on.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to process.
   * @returns {Array} Returns the new array of grouped elements.
   * @example
   *
   * _.zip(['fred', 'barney'], [30, 40], [true, false]);
   * // => [['fred', 30, true], ['barney', 40, false]]
   */
  var zip = restParam(unzip);

  /**
   * The inverse of `_.pairs`; this method returns an object composed from arrays
   * of property names and values. Provide either a single two dimensional array,
   * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
   * and one of corresponding values.
   *
   * @static
   * @memberOf _
   * @alias object
   * @category Array
   * @param {Array} props The property names.
   * @param {Array} [values=[]] The property values.
   * @returns {Object} Returns the new object.
   * @example
   *
   * _.zipObject([['fred', 30], ['barney', 40]]);
   * // => { 'fred': 30, 'barney': 40 }
   *
   * _.zipObject(['fred', 'barney'], [30, 40]);
   * // => { 'fred': 30, 'barney': 40 }
   */
  function zipObject(props, values) {
    var index = -1,
        length = props ? props.length : 0,
        result = {};

    if (length && !values && !isArray(props[0])) {
      values = [];
    }
    while (++index < length) {
      var key = props[index];
      if (values) {
        result[key] = values[index];
      } else if (key) {
        result[key[0]] = key[1];
      }
    }
    return result;
  }

  /**
   * This method is like `_.zip` except that it accepts an iteratee to specify
   * how grouped values should be combined. The `iteratee` is bound to `thisArg`
   * and invoked with four arguments: (accumulator, value, index, group).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to process.
   * @param {Function} [iteratee] The function to combine grouped values.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new array of grouped elements.
   * @example
   *
   * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
   * // => [111, 222]
   */
  var zipWith = restParam(function(arrays) {
    var length = arrays.length,
        iteratee = length > 2 ? arrays[length - 2] : undefined,
        thisArg = length > 1 ? arrays[length - 1] : undefined;

    if (length > 2 && typeof iteratee == 'function') {
      length -= 2;
    } else {
      iteratee = (length > 1 && typeof thisArg == 'function') ? (--length, thisArg) : undefined;
      thisArg = undefined;
    }
    arrays.length = length;
    return unzipWith(arrays, iteratee, thisArg);
  });

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array of elements corresponding to the given keys, or indexes,
   * of `collection`. Keys may be specified as individual arguments or as arrays
   * of keys.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {...(number|number[]|string|string[])} [props] The property names
   *  or indexes of elements to pick, specified individually or in arrays.
   * @returns {Array} Returns the new array of picked elements.
   * @example
   *
   * _.at(['a', 'b', 'c'], [0, 2]);
   * // => ['a', 'c']
   *
   * _.at(['barney', 'fred', 'pebbles'], 0, 2);
   * // => ['barney', 'pebbles']
   */
  var at = restParam(function(collection, props) {
    if (isArrayLike(collection)) {
      collection = toIterable(collection);
    }
    return baseAt(collection, baseFlatten(props));
  });

  /**
   * Creates an object composed of keys generated from the results of running
   * each element of `collection` through `iteratee`. The corresponding value
   * of each key is the number of times the key was returned by `iteratee`.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * _.countBy([4.3, 6.1, 6.4], function(n) {
   *   return Math.floor(n);
   * });
   * // => { '4': 1, '6': 2 }
   *
   * _.countBy([4.3, 6.1, 6.4], function(n) {
   *   return this.floor(n);
   * }, Math);
   * // => { '4': 1, '6': 2 }
   *
   * _.countBy(['one', 'two', 'three'], 'length');
   * // => { '3': 2, '5': 1 }
   */
  var countBy = createAggregator(function(result, value, key) {
    hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
  });

  /**
   * Checks if `predicate` returns truthy for **all** elements of `collection`.
   * The predicate is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @alias all
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   * @example
   *
   * _.every([true, 1, null, 'yes'], Boolean);
   * // => false
   *
   * var users = [
   *   { 'user': 'barney', 'active': false },
   *   { 'user': 'fred',   'active': false }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.every(users, { 'user': 'barney', 'active': false });
   * // => false
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.every(users, 'active', false);
   * // => true
   *
   * // using the `_.property` callback shorthand
   * _.every(users, 'active');
   * // => false
   */
  function every(collection, predicate, thisArg) {
    var func = isArray(collection) ? arrayEvery : baseEvery;
    if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
      predicate = undefined;
    }
    if (typeof predicate != 'function' || thisArg !== undefined) {
      predicate = getCallback(predicate, thisArg, 3);
    }
    return func(collection, predicate);
  }

  /**
   * Iterates over elements of `collection`, returning an array of all elements
   * `predicate` returns truthy for. The predicate is bound to `thisArg` and
   * invoked with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @alias select
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the new filtered array.
   * @example
   *
   * _.filter([4, 5, 6], function(n) {
   *   return n % 2 == 0;
   * });
   * // => [4, 6]
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
   * // => ['barney']
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.pluck(_.filter(users, 'active', false), 'user');
   * // => ['fred']
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.filter(users, 'active'), 'user');
   * // => ['barney']
   */
  function filter(collection, predicate, thisArg) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    predicate = getCallback(predicate, thisArg, 3);
    return func(collection, predicate);
  }

  /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is bound to `thisArg` and
   * invoked with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @alias detect
   * @category Collection
   * @param {Array|Object|string} collection The collection to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.result(_.find(users, function(chr) {
   *   return chr.age < 40;
   * }), 'user');
   * // => 'barney'
   *
   * // using the `_.matches` callback shorthand
   * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
   * // => 'pebbles'
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.result(_.find(users, 'active', false), 'user');
   * // => 'fred'
   *
   * // using the `_.property` callback shorthand
   * _.result(_.find(users, 'active'), 'user');
   * // => 'barney'
   */
  var find = createFind(baseEach);

  /**
   * This method is like `_.find` except that it iterates over elements of
   * `collection` from right to left.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * _.findLast([1, 2, 3, 4], function(n) {
   *   return n % 2 == 1;
   * });
   * // => 3
   */
  var findLast = createFind(baseEachRight, true);

  /**
   * Performs a deep comparison between each element in `collection` and the
   * source object, returning the first element that has equivalent property
   * values.
   *
   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
   * numbers, `Object` objects, regexes, and strings. Objects are compared by
   * their own, not inherited, enumerable properties. For comparing a single
   * own or inherited property value see `_.matchesProperty`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to search.
   * @param {Object} source The object of property values to match.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
   * // => 'barney'
   *
   * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
   * // => 'fred'
   */
  function findWhere(collection, source) {
    return find(collection, baseMatches(source));
  }

  /**
   * Iterates over elements of `collection` invoking `iteratee` for each element.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection). Iteratee functions may exit iteration early
   * by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length" property
   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
   * may be used for object iteration.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array|Object|string} Returns `collection`.
   * @example
   *
   * _([1, 2]).forEach(function(n) {
   *   console.log(n);
   * }).value();
   * // => logs each value from left to right and returns the array
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
   *   console.log(n, key);
   * });
   * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
   */
  var forEach = createForEach(arrayEach, baseEach);

  /**
   * This method is like `_.forEach` except that it iterates over elements of
   * `collection` from right to left.
   *
   * @static
   * @memberOf _
   * @alias eachRight
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array|Object|string} Returns `collection`.
   * @example
   *
   * _([1, 2]).forEachRight(function(n) {
   *   console.log(n);
   * }).value();
   * // => logs each value from right to left and returns the array
   */
  var forEachRight = createForEach(arrayEachRight, baseEachRight);

  /**
   * Creates an object composed of keys generated from the results of running
   * each element of `collection` through `iteratee`. The corresponding value
   * of each key is an array of the elements responsible for generating the key.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * _.groupBy([4.2, 6.1, 6.4], function(n) {
   *   return Math.floor(n);
   * });
   * // => { '4': [4.2], '6': [6.1, 6.4] }
   *
   * _.groupBy([4.2, 6.1, 6.4], function(n) {
   *   return this.floor(n);
   * }, Math);
   * // => { '4': [4.2], '6': [6.1, 6.4] }
   *
   * // using the `_.property` callback shorthand
   * _.groupBy(['one', 'two', 'three'], 'length');
   * // => { '3': ['one', 'two'], '5': ['three'] }
   */
  var groupBy = createAggregator(function(result, value, key) {
    if (hasOwnProperty.call(result, key)) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
  });

  /**
   * Checks if `target` is in `collection` using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons. If `fromIndex` is negative, it's used as the offset
   * from the end of `collection`.
   *
   * @static
   * @memberOf _
   * @alias contains, include
   * @category Collection
   * @param {Array|Object|string} collection The collection to search.
   * @param {*} target The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
   * @returns {boolean} Returns `true` if a matching element is found, else `false`.
   * @example
   *
   * _.includes([1, 2, 3], 1);
   * // => true
   *
   * _.includes([1, 2, 3], 1, 2);
   * // => false
   *
   * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
   * // => true
   *
   * _.includes('pebbles', 'eb');
   * // => true
   */
  function includes(collection, target, fromIndex, guard) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      collection = values(collection);
      length = collection.length;
    }
    if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
      fromIndex = 0;
    } else {
      fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
    }
    return (typeof collection == 'string' || !isArray(collection) && isString(collection))
      ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
      : (!!length && getIndexOf(collection, target, fromIndex) > -1);
  }

  /**
   * Creates an object composed of keys generated from the results of running
   * each element of `collection` through `iteratee`. The corresponding value
   * of each key is the last element responsible for generating the key. The
   * iteratee function is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * var keyData = [
   *   { 'dir': 'left', 'code': 97 },
   *   { 'dir': 'right', 'code': 100 }
   * ];
   *
   * _.indexBy(keyData, 'dir');
   * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
   *
   * _.indexBy(keyData, function(object) {
   *   return String.fromCharCode(object.code);
   * });
   * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
   *
   * _.indexBy(keyData, function(object) {
   *   return this.fromCharCode(object.code);
   * }, String);
   * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
   */
  var indexBy = createAggregator(function(result, value, key) {
    result[key] = value;
  });

  /**
   * Invokes the method at `path` of each element in `collection`, returning
   * an array of the results of each invoked method. Any additional arguments
   * are provided to each invoked method. If `methodName` is a function it's
   * invoked for, and `this` bound to, each element in `collection`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Array|Function|string} path The path of the method to invoke or
   *  the function invoked per iteration.
   * @param {...*} [args] The arguments to invoke the method with.
   * @returns {Array} Returns the array of results.
   * @example
   *
   * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
   * // => [[1, 5, 7], [1, 2, 3]]
   *
   * _.invoke([123, 456], String.prototype.split, '');
   * // => [['1', '2', '3'], ['4', '5', '6']]
   */
  var invoke = restParam(function(collection, path, args) {
    var index = -1,
        isFunc = typeof path == 'function',
        isProp = isKey(path),
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function(value) {
      var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
      result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
    });
    return result;
  });

  /**
   * Creates an array of values by running each element in `collection` through
   * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
   * arguments: (value, index|key, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
   * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
   * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
   * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
   * `sum`, `uniq`, and `words`
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * function timesThree(n) {
   *   return n * 3;
   * }
   *
   * _.map([1, 2], timesThree);
   * // => [3, 6]
   *
   * _.map({ 'a': 1, 'b': 2 }, timesThree);
   * // => [3, 6] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // using the `_.property` callback shorthand
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */
  function map(collection, iteratee, thisArg) {
    var func = isArray(collection) ? arrayMap : baseMap;
    iteratee = getCallback(iteratee, thisArg, 3);
    return func(collection, iteratee);
  }

  /**
   * Creates an array of elements split into two groups, the first of which
   * contains elements `predicate` returns truthy for, while the second of which
   * contains elements `predicate` returns falsey for. The predicate is bound
   * to `thisArg` and invoked with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the array of grouped elements.
   * @example
   *
   * _.partition([1, 2, 3], function(n) {
   *   return n % 2;
   * });
   * // => [[1, 3], [2]]
   *
   * _.partition([1.2, 2.3, 3.4], function(n) {
   *   return this.floor(n) % 2;
   * }, Math);
   * // => [[1.2, 3.4], [2.3]]
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': false },
   *   { 'user': 'fred',    'age': 40, 'active': true },
   *   { 'user': 'pebbles', 'age': 1,  'active': false }
   * ];
   *
   * var mapper = function(array) {
   *   return _.pluck(array, 'user');
   * };
   *
   * // using the `_.matches` callback shorthand
   * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
   * // => [['pebbles'], ['barney', 'fred']]
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.map(_.partition(users, 'active', false), mapper);
   * // => [['barney', 'pebbles'], ['fred']]
   *
   * // using the `_.property` callback shorthand
   * _.map(_.partition(users, 'active'), mapper);
   * // => [['fred'], ['barney', 'pebbles']]
   */
  var partition = createAggregator(function(result, value, key) {
    result[key ? 0 : 1].push(value);
  }, function() { return [[], []]; });

  /**
   * Gets the property value of `path` from all elements in `collection`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Array|string} path The path of the property to pluck.
   * @returns {Array} Returns the property values.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * _.pluck(users, 'user');
   * // => ['barney', 'fred']
   *
   * var userIndex = _.indexBy(users, 'user');
   * _.pluck(userIndex, 'age');
   * // => [36, 40] (iteration order is not guaranteed)
   */
  function pluck(collection, path) {
    return map(collection, property(path));
  }

  /**
   * Reduces `collection` to a value which is the accumulated result of running
   * each element in `collection` through `iteratee`, where each successive
   * invocation is supplied the return value of the previous. If `accumulator`
   * is not provided the first element of `collection` is used as the initial
   * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
   * (accumulator, value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.reduce`, `_.reduceRight`, and `_.transform`.
   *
   * The guarded methods are:
   * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
   * and `sortByOrder`
   *
   * @static
   * @memberOf _
   * @alias foldl, inject
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {*} Returns the accumulated value.
   * @example
   *
   * _.reduce([1, 2], function(total, n) {
   *   return total + n;
   * });
   * // => 3
   *
   * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
   *   result[key] = n * 3;
   *   return result;
   * }, {});
   * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
   */
  var reduce = createReduce(arrayReduce, baseEach);

  /**
   * This method is like `_.reduce` except that it iterates over elements of
   * `collection` from right to left.
   *
   * @static
   * @memberOf _
   * @alias foldr
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {*} Returns the accumulated value.
   * @example
   *
   * var array = [[0, 1], [2, 3], [4, 5]];
   *
   * _.reduceRight(array, function(flattened, other) {
   *   return flattened.concat(other);
   * }, []);
   * // => [4, 5, 2, 3, 0, 1]
   */
  var reduceRight = createReduce(arrayReduceRight, baseEachRight);

  /**
   * The opposite of `_.filter`; this method returns the elements of `collection`
   * that `predicate` does **not** return truthy for.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the new filtered array.
   * @example
   *
   * _.reject([1, 2, 3, 4], function(n) {
   *   return n % 2 == 0;
   * });
   * // => [1, 3]
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': false },
   *   { 'user': 'fred',   'age': 40, 'active': true }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
   * // => ['barney']
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.pluck(_.reject(users, 'active', false), 'user');
   * // => ['fred']
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.reject(users, 'active'), 'user');
   * // => ['barney']
   */
  function reject(collection, predicate, thisArg) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    predicate = getCallback(predicate, thisArg, 3);
    return func(collection, function(value, index, collection) {
      return !predicate(value, index, collection);
    });
  }

  /**
   * Gets a random element or `n` random elements from a collection.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to sample.
   * @param {number} [n] The number of elements to sample.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {*} Returns the random sample(s).
   * @example
   *
   * _.sample([1, 2, 3, 4]);
   * // => 2
   *
   * _.sample([1, 2, 3, 4], 2);
   * // => [3, 1]
   */
  function sample(collection, n, guard) {
    if (guard ? isIterateeCall(collection, n, guard) : n == null) {
      collection = toIterable(collection);
      var length = collection.length;
      return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
    }
    var index = -1,
        result = toArray(collection),
        length = result.length,
        lastIndex = length - 1;

    n = nativeMin(n < 0 ? 0 : (+n || 0), length);
    while (++index < n) {
      var rand = baseRandom(index, lastIndex),
          value = result[rand];

      result[rand] = result[index];
      result[index] = value;
    }
    result.length = n;
    return result;
  }

  /**
   * Creates an array of shuffled values, using a version of the
   * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to shuffle.
   * @returns {Array} Returns the new shuffled array.
   * @example
   *
   * _.shuffle([1, 2, 3, 4]);
   * // => [4, 1, 3, 2]
   */
  function shuffle(collection) {
    return sample(collection, POSITIVE_INFINITY);
  }

  /**
   * Gets the size of `collection` by returning its length for array-like
   * values or the number of own enumerable properties for objects.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to inspect.
   * @returns {number} Returns the size of `collection`.
   * @example
   *
   * _.size([1, 2, 3]);
   * // => 3
   *
   * _.size({ 'a': 1, 'b': 2 });
   * // => 2
   *
   * _.size('pebbles');
   * // => 7
   */
  function size(collection) {
    var length = collection ? getLength(collection) : 0;
    return isLength(length) ? length : keys(collection).length;
  }

  /**
   * Checks if `predicate` returns truthy for **any** element of `collection`.
   * The function returns as soon as it finds a passing value and does not iterate
   * over the entire collection. The predicate is bound to `thisArg` and invoked
   * with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @alias any
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   * @example
   *
   * _.some([null, 0, 'yes', false], Boolean);
   * // => true
   *
   * var users = [
   *   { 'user': 'barney', 'active': true },
   *   { 'user': 'fred',   'active': false }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.some(users, { 'user': 'barney', 'active': false });
   * // => false
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.some(users, 'active', false);
   * // => true
   *
   * // using the `_.property` callback shorthand
   * _.some(users, 'active');
   * // => true
   */
  function some(collection, predicate, thisArg) {
    var func = isArray(collection) ? arraySome : baseSome;
    if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
      predicate = undefined;
    }
    if (typeof predicate != 'function' || thisArg !== undefined) {
      predicate = getCallback(predicate, thisArg, 3);
    }
    return func(collection, predicate);
  }

  /**
   * Creates an array of elements, sorted in ascending order by the results of
   * running each element in a collection through `iteratee`. This method performs
   * a stable sort, that is, it preserves the original sort order of equal elements.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new sorted array.
   * @example
   *
   * _.sortBy([1, 2, 3], function(n) {
   *   return Math.sin(n);
   * });
   * // => [3, 1, 2]
   *
   * _.sortBy([1, 2, 3], function(n) {
   *   return this.sin(n);
   * }, Math);
   * // => [3, 1, 2]
   *
   * var users = [
   *   { 'user': 'fred' },
   *   { 'user': 'pebbles' },
   *   { 'user': 'barney' }
   * ];
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.sortBy(users, 'user'), 'user');
   * // => ['barney', 'fred', 'pebbles']
   */
  function sortBy(collection, iteratee, thisArg) {
    if (collection == null) {
      return [];
    }
    if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
      iteratee = undefined;
    }
    var index = -1;
    iteratee = getCallback(iteratee, thisArg, 3);

    var result = baseMap(collection, function(value, key, collection) {
      return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
    });
    return baseSortBy(result, compareAscending);
  }

  /**
   * This method is like `_.sortBy` except that it can sort by multiple iteratees
   * or property names.
   *
   * If a property name is provided for an iteratee the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If an object is provided for an iteratee the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
   *  The iteratees to sort by, specified as individual values or arrays of values.
   * @returns {Array} Returns the new sorted array.
   * @example
   *
   * var users = [
   *   { 'user': 'fred',   'age': 48 },
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 42 },
   *   { 'user': 'barney', 'age': 34 }
   * ];
   *
   * _.map(_.sortByAll(users, ['user', 'age']), _.values);
   * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
   *
   * _.map(_.sortByAll(users, 'user', function(chr) {
   *   return Math.floor(chr.age / 10);
   * }), _.values);
   * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
   */
  var sortByAll = restParam(function(collection, iteratees) {
    if (collection == null) {
      return [];
    }
    var guard = iteratees[2];
    if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
      iteratees.length = 1;
    }
    return baseSortByOrder(collection, baseFlatten(iteratees), []);
  });

  /**
   * This method is like `_.sortByAll` except that it allows specifying the
   * sort orders of the iteratees to sort by. If `orders` is unspecified, all
   * values are sorted in ascending order. Otherwise, a value is sorted in
   * ascending order if its corresponding order is "asc", and descending if "desc".
   *
   * If a property name is provided for an iteratee the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If an object is provided for an iteratee the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
   * @param {boolean[]} [orders] The sort orders of `iteratees`.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
   * @returns {Array} Returns the new sorted array.
   * @example
   *
   * var users = [
   *   { 'user': 'fred',   'age': 48 },
   *   { 'user': 'barney', 'age': 34 },
   *   { 'user': 'fred',   'age': 42 },
   *   { 'user': 'barney', 'age': 36 }
   * ];
   *
   * // sort by `user` in ascending order and by `age` in descending order
   * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
   * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
   */
  function sortByOrder(collection, iteratees, orders, guard) {
    if (collection == null) {
      return [];
    }
    if (guard && isIterateeCall(iteratees, orders, guard)) {
      orders = undefined;
    }
    if (!isArray(iteratees)) {
      iteratees = iteratees == null ? [] : [iteratees];
    }
    if (!isArray(orders)) {
      orders = orders == null ? [] : [orders];
    }
    return baseSortByOrder(collection, iteratees, orders);
  }

  /**
   * Performs a deep comparison between each element in `collection` and the
   * source object, returning an array of all elements that have equivalent
   * property values.
   *
   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
   * numbers, `Object` objects, regexes, and strings. Objects are compared by
   * their own, not inherited, enumerable properties. For comparing a single
   * own or inherited property value see `_.matchesProperty`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to search.
   * @param {Object} source The object of property values to match.
   * @returns {Array} Returns the new filtered array.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
   *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
   * ];
   *
   * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
   * // => ['barney']
   *
   * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
   * // => ['fred']
   */
  function where(collection, source) {
    return filter(collection, baseMatches(source));
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a function that invokes `func` with the `this` binding of the
   * created function and arguments from `start` and beyond provided as an array.
   *
   * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var say = _.restParam(function(what, names) {
   *   return what + ' ' + _.initial(names).join(', ') +
   *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
   * });
   *
   * say('hello', 'fred', 'barney', 'pebbles');
   * // => 'hello fred, barney, & pebbles'
   */
  function restParam(func, start) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          rest = Array(length);

      while (++index < length) {
        rest[index] = args[start + index];
      }
      switch (start) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, args[0], rest);
        case 2: return func.call(this, args[0], args[1], rest);
      }
      var otherArgs = Array(start + 1);
      index = -1;
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = rest;
      return func.apply(this, otherArgs);
    };
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `value` is greater than `other`.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
   * @example
   *
   * _.gt(3, 1);
   * // => true
   *
   * _.gt(3, 3);
   * // => false
   *
   * _.gt(1, 3);
   * // => false
   */
  function gt(value, other) {
    return value > other;
  }

  /**
   * Checks if `value` is classified as an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return isObjectLike(value) && isArrayLike(value) &&
      hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(function() { return arguments; }());
   * // => false
   */
  var isArray = nativeIsArray || function(value) {
    return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
  };

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in older versions of Chrome and Safari which return 'function' for regexes
    // and Safari 8 which returns 'object' for typed array constructors.
    return isObject(value) && objToString.call(value) == funcTag;
  }

  /**
   * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is a native function.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
   * @example
   *
   * _.isNative(Array.prototype.push);
   * // => true
   *
   * _.isNative(_);
   * // => false
   */
  function isNative(value) {
    if (value == null) {
      return false;
    }
    if (isFunction(value)) {
      return reIsNative.test(fnToString.call(value));
    }
    return isObjectLike(value) && (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
  }

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
  }

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  function isTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
  }

  /**
   * Checks if `value` is less than `other`.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
   * @example
   *
   * _.lt(1, 3);
   * // => true
   *
   * _.lt(3, 3);
   * // => false
   *
   * _.lt(3, 1);
   * // => false
   */
  function lt(value, other) {
    return value < other;
  }

  /**
   * Converts `value` to an array.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Array} Returns the converted array.
   * @example
   *
   * (function() {
   *   return _.toArray(arguments).slice(1);
   * }(1, 2, 3));
   * // => [2, 3]
   */
  function toArray(value) {
    var length = value ? getLength(value) : 0;
    if (!isLength(length)) {
      return values(value);
    }
    if (!length) {
      return [];
    }
    return (lodash.support.unindexedChars && isString(value))
      ? value.split('')
      : arrayCopy(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    var Ctor = object == null ? undefined : object.constructor;
    if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
        (typeof object == 'function' ? lodash.support.enumPrototypes : isArrayLike(object))) {
      return shimKeys(object);
    }
    return isObject(object) ? nativeKeys(object) : [];
  };

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    if (object == null) {
      return [];
    }
    if (!isObject(object)) {
      object = Object(object);
    }
    var length = object.length,
        support = lodash.support;

    length = (length && isLength(length) &&
      (isArray(object) || isArguments(object) || isString(object)) && length) || 0;

    var Ctor = object.constructor,
        index = -1,
        proto = (isFunction(Ctor) && Ctor.prototype) || objectProto,
        isProto = proto === object,
        result = Array(length),
        skipIndexes = length > 0,
        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error),
        skipProto = support.enumPrototypes && isFunction(object);

    while (++index < length) {
      result[index] = (index + '');
    }
    // lodash skips the `constructor` property when it infers it's iterating
    // over a `prototype` object because IE < 9 can't set the `[[Enumerable]]`
    // attribute of an existing property and the `constructor` property of a
    // prototype defaults to non-enumerable.
    for (var key in object) {
      if (!(skipProto && key == 'prototype') &&
          !(skipErrorProps && (key == 'message' || key == 'name')) &&
          !(skipIndexes && isIndex(key, length)) &&
          !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    if (support.nonEnumShadows && object !== objectProto) {
      var tag = object === stringProto ? stringTag : (object === errorProto ? errorTag : objToString.call(object)),
          nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];

      if (tag == objectTag) {
        proto = objectProto;
      }
      length = shadowProps.length;
      while (length--) {
        key = shadowProps[length];
        var nonEnum = nonEnums[key];
        if (!(isProto && nonEnum) &&
            (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
          result.push(key);
        }
      }
    }
    return result;
  }

  /**
   * Creates a two dimensional array of the key-value pairs for `object`,
   * e.g. `[[key1, value1], [key2, value2]]`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the new array of key-value pairs.
   * @example
   *
   * _.pairs({ 'barney': 36, 'fred': 40 });
   * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
   */
  function pairs(object) {
    object = toObject(object);

    var index = -1,
        props = keys(object),
        length = props.length,
        result = Array(length);

    while (++index < length) {
      var key = props[index];
      result[index] = [key, object[key]];
    }
    return result;
  }

  /**
   * Creates an array of the own enumerable property values of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property values.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.values(new Foo);
   * // => [1, 2] (iteration order is not guaranteed)
   *
   * _.values('hi');
   * // => ['h', 'i']
   */
  function values(object) {
    return baseValues(object, keys(object));
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a function that invokes `func` with the `this` binding of `thisArg`
   * and arguments of the created function. If `func` is a property name the
   * created callback returns the property value for a given element. If `func`
   * is an object the created callback returns `true` for elements that contain
   * the equivalent object properties, otherwise it returns `false`.
   *
   * @static
   * @memberOf _
   * @alias iteratee
   * @category Utility
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Function} Returns the callback.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * // wrap to create custom callback shorthands
   * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
   *   if (!match) {
   *     return callback(func, thisArg);
   *   }
   *   return function(object) {
   *     return match[2] == 'gt'
   *       ? object[match[1]] > match[3]
   *       : object[match[1]] < match[3];
   *   };
   * });
   *
   * _.filter(users, 'age__gt36');
   * // => [{ 'user': 'fred', 'age': 40 }]
   */
  function callback(func, thisArg, guard) {
    if (guard && isIterateeCall(func, thisArg, guard)) {
      thisArg = undefined;
    }
    return isObjectLike(func)
      ? matches(func)
      : baseCallback(func, thisArg);
  }

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Creates a function that performs a deep comparison between a given object
   * and `source`, returning `true` if the given object has equivalent property
   * values, else `false`.
   *
   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
   * numbers, `Object` objects, regexes, and strings. Objects are compared by
   * their own, not inherited, enumerable properties. For comparing a single
   * own or inherited property value see `_.matchesProperty`.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, _.matches({ 'age': 40, 'active': false }));
   * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
   */
  function matches(source) {
    return baseMatches(baseClone(source, true));
  }

  /**
   * Creates a function that returns the property value at `path` on a
   * given object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': { 'c': 2 } } },
   *   { 'a': { 'b': { 'c': 1 } } }
   * ];
   *
   * _.map(objects, _.property('a.b.c'));
   * // => [2, 1]
   *
   * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
   * // => [1, 2]
   */
  function property(path) {
    return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Gets the maximum value of `collection`. If `collection` is empty or falsey
   * `-Infinity` is returned. If an iteratee function is provided it's invoked
   * for each value in `collection` to generate the criterion by which the value
   * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
   * arguments: (value, index, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {*} Returns the maximum value.
   * @example
   *
   * _.max([4, 2, 8, 6]);
   * // => 8
   *
   * _.max([]);
   * // => -Infinity
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * _.max(users, function(chr) {
   *   return chr.age;
   * });
   * // => { 'user': 'fred', 'age': 40 }
   *
   * // using the `_.property` callback shorthand
   * _.max(users, 'age');
   * // => { 'user': 'fred', 'age': 40 }
   */
  var max = createExtremum(gt, NEGATIVE_INFINITY);

  /**
   * Gets the minimum value of `collection`. If `collection` is empty or falsey
   * `Infinity` is returned. If an iteratee function is provided it's invoked
   * for each value in `collection` to generate the criterion by which the value
   * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
   * arguments: (value, index, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {*} Returns the minimum value.
   * @example
   *
   * _.min([4, 2, 8, 6]);
   * // => 2
   *
   * _.min([]);
   * // => Infinity
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * _.min(users, function(chr) {
   *   return chr.age;
   * });
   * // => { 'user': 'barney', 'age': 36 }
   *
   * // using the `_.property` callback shorthand
   * _.min(users, 'age');
   * // => { 'user': 'barney', 'age': 36 }
   */
  var min = createExtremum(lt, POSITIVE_INFINITY);

  /**
   * Gets the sum of the values in `collection`.
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {number} Returns the sum.
   * @example
   *
   * _.sum([4, 6]);
   * // => 10
   *
   * _.sum({ 'a': 4, 'b': 6 });
   * // => 10
   *
   * var objects = [
   *   { 'n': 4 },
   *   { 'n': 6 }
   * ];
   *
   * _.sum(objects, function(object) {
   *   return object.n;
   * });
   * // => 10
   *
   * // using the `_.property` callback shorthand
   * _.sum(objects, 'n');
   * // => 10
   */
  function sum(collection, iteratee, thisArg) {
    if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
      iteratee = undefined;
    }
    iteratee = getCallback(iteratee, thisArg, 3);
    return iteratee.length == 1
      ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee)
      : baseSum(collection, iteratee);
  }

  /*------------------------------------------------------------------------*/

  // Add functions to the `Set` cache.
  SetCache.prototype.push = cachePush;

  // Add functions that return wrapped values when chaining.
  lodash.at = at;
  lodash.callback = callback;
  lodash.chunk = chunk;
  lodash.compact = compact;
  lodash.countBy = countBy;
  lodash.difference = difference;
  lodash.drop = drop;
  lodash.dropRight = dropRight;
  lodash.dropRightWhile = dropRightWhile;
  lodash.dropWhile = dropWhile;
  lodash.fill = fill;
  lodash.filter = filter;
  lodash.flatten = flatten;
  lodash.flattenDeep = flattenDeep;
  lodash.forEach = forEach;
  lodash.forEachRight = forEachRight;
  lodash.groupBy = groupBy;
  lodash.indexBy = indexBy;
  lodash.initial = initial;
  lodash.intersection = intersection;
  lodash.invoke = invoke;
  lodash.keys = keys;
  lodash.keysIn = keysIn;
  lodash.map = map;
  lodash.matches = matches;
  lodash.pairs = pairs;
  lodash.partition = partition;
  lodash.pluck = pluck;
  lodash.property = property;
  lodash.pull = pull;
  lodash.pullAt = pullAt;
  lodash.reject = reject;
  lodash.remove = remove;
  lodash.rest = rest;
  lodash.restParam = restParam;
  lodash.shuffle = shuffle;
  lodash.slice = slice;
  lodash.sortBy = sortBy;
  lodash.sortByAll = sortByAll;
  lodash.sortByOrder = sortByOrder;
  lodash.take = take;
  lodash.takeRight = takeRight;
  lodash.takeRightWhile = takeRightWhile;
  lodash.takeWhile = takeWhile;
  lodash.toArray = toArray;
  lodash.union = union;
  lodash.uniq = uniq;
  lodash.unzip = unzip;
  lodash.unzipWith = unzipWith;
  lodash.values = values;
  lodash.where = where;
  lodash.without = without;
  lodash.xor = xor;
  lodash.zip = zip;
  lodash.zipObject = zipObject;
  lodash.zipWith = zipWith;

  // Add aliases.
  lodash.collect = map;
  lodash.each = forEach;
  lodash.eachRight = forEachRight;
  lodash.iteratee = callback;
  lodash.object = zipObject;
  lodash.select = filter;
  lodash.tail = rest;
  lodash.unique = uniq;

  /*------------------------------------------------------------------------*/

  // Add functions that return unwrapped values when chaining.
  lodash.every = every;
  lodash.find = find;
  lodash.findIndex = findIndex;
  lodash.findLast = findLast;
  lodash.findLastIndex = findLastIndex;
  lodash.findWhere = findWhere;
  lodash.first = first;
  lodash.gt = gt;
  lodash.identity = identity;
  lodash.includes = includes;
  lodash.indexOf = indexOf;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isFunction = isFunction;
  lodash.isNative = isNative;
  lodash.isObject = isObject;
  lodash.isString = isString;
  lodash.isTypedArray = isTypedArray;
  lodash.last = last;
  lodash.lastIndexOf = lastIndexOf;
  lodash.lt = lt;
  lodash.max = max;
  lodash.min = min;
  lodash.reduce = reduce;
  lodash.reduceRight = reduceRight;
  lodash.size = size;
  lodash.some = some;
  lodash.sortedIndex = sortedIndex;
  lodash.sortedLastIndex = sortedLastIndex;
  lodash.sum = sum;

  // Add aliases.
  lodash.all = every;
  lodash.any = some;
  lodash.contains = includes;
  lodash.detect = find;
  lodash.foldl = reduce;
  lodash.foldr = reduceRight;
  lodash.head = first;
  lodash.include = includes;
  lodash.inject = reduce;

  /*------------------------------------------------------------------------*/

  // Add functions capable of returning wrapped and unwrapped values when chaining.
  lodash.sample = sample;

  /*------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
  lodash.VERSION = VERSION;

  /*--------------------------------------------------------------------------*/

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = lodash;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return lodash;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = lodash)._ = lodash;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports._ = lodash;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._=root._ || {};
    root._.c = lodash;
  }
}.call(this));
