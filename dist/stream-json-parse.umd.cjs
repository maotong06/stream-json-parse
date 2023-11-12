(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.streamFetchJson = {}));
})(this, function(exports2) {
  "use strict";
  function structuralClone(obj) {
    return new Promise((resolve) => {
      const { port1, port2 } = new MessageChannel();
      port2.onmessage = (ev) => resolve(ev.data);
      port1.postMessage(obj);
    });
  }
  function arrayEqual(a, b) {
    if (a.length === b.length) {
      let len = a.length;
      for (let i = len - 1; i >= 0; i--) {
        if (a[i] !== b[i])
          return false;
      }
      return true;
    }
    return false;
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var lodash_isequal = { exports: {} };
  lodash_isequal.exports;
  (function(module2, exports3) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = exports3 && !exports3.nodeType && exports3;
    var freeModule = freeExports && true && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer = moduleExports ? root.Buffer : void 0, Symbol2 = root.Symbol, Uint8Array = root.Uint8Array, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
    var DataView = getNative(root, "DataView"), Map = getNative(root, "Map"), Promise2 = getNative(root, "Promise"), Set = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values == null ? 0 : values.length;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;
      var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object, +other);
        case errorTag:
          return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
          return object == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };
    var getTag = baseGetTag;
    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArguments = baseIsArguments(function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isEqual2(value, other) {
      return baseIsEqual(value, other);
    }
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function stubArray() {
      return [];
    }
    function stubFalse() {
      return false;
    }
    module2.exports = isEqual2;
  })(lodash_isequal, lodash_isequal.exports);
  var lodash_isequalExports = lodash_isequal.exports;
  const isEqual = /* @__PURE__ */ getDefaultExportFromCjs(lodash_isequalExports);
  const suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
  const suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;
  function json_parse(options) {
    var _options = {
      strict: false,
      // not being strict means do not generate syntax errors for "duplicate key"
      // storeAsString: false, // toggles whether the values should be stored as BigNumber (default) or a string
      // alwaysParseAsBig: false, // toggles whether all numbers should be Big
      // useNativeBigInt: false, // toggles whether to use native BigInt instead of bignumber.js
      protoAction: "error",
      constructorAction: "error",
      completeItemPath: void 0,
      updatePeriod: 300,
      // ms
      jsonCallback: () => {
      },
      diffCallBack: () => {
      }
    };
    if (options !== void 0 && options !== null) {
      if (options.strict === true) {
        _options.strict = true;
      }
      if (typeof options.completeItemPath !== "undefined") {
        if (Array.isArray(options.completeItemPath) && options.completeItemPath.every((item) => typeof item === "string")) {
          _options.completeItemPath = options.completeItemPath;
        } else {
          throw new Error(
            `Incorrect value for completeItemPath option, must be an array of strings but passed ${options.completeItemPath}`
          );
        }
      }
      if (typeof options.constructorAction !== "undefined") {
        if (options.constructorAction === "error" || options.constructorAction === "ignore" || options.constructorAction === "preserve") {
          _options.constructorAction = options.constructorAction;
        } else {
          throw new Error(
            `Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`
          );
        }
      }
      if (typeof options.protoAction !== "undefined") {
        if (options.protoAction === "error" || options.protoAction === "ignore" || options.protoAction === "preserve") {
          _options.protoAction = options.protoAction;
        } else {
          throw new Error(
            `Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`
          );
        }
      }
      if (typeof (options == null ? void 0 : options.updatePeriod) !== "undefined") {
        if (typeof (options == null ? void 0 : options.updatePeriod) === "number" && (options == null ? void 0 : options.updatePeriod) > 0) {
          _options.updatePeriod = options == null ? void 0 : options.updatePeriod;
        } else {
          throw new Error(
            `Incorrect value for updatePeriod option, must be a number > 0 but passed ${options.updatePeriod}`
          );
        }
      }
      if (typeof (options == null ? void 0 : options.jsonCallback) === "function") {
        _options.jsonCallback = options == null ? void 0 : options.jsonCallback;
      } else {
        throw new Error(
          `Incorrect value for jsonCallback option, must be a function but passed ${options.jsonCallback}`
        );
      }
    }
    let at, ch, escapee = {
      '"': '"',
      "\\": "\\",
      "/": "/",
      b: "\b",
      f: "\f",
      n: "\n",
      r: "\r",
      t: "	"
    }, text = "", textLenth = 0, isTextEnd = false, res, seedResCb = async (data) => {
      if (isDone || lastCount !== count) {
        lastCount = count;
        let sendRes = {
          done: isDone,
          value: await structuralClone(data)
        };
        _options.jsonCallback(null, sendRes);
      }
    }, lastUpdateTime = Number(/* @__PURE__ */ new Date()), count = 0, lastCount = -1, isDone = false, keyStack = [], isCompleteItem = false, checkAndPop = () => {
      if (_options.completeItemPath && arrayEqual(keyStack, _options.completeItemPath)) {
        isCompleteItem = true;
      } else {
        isCompleteItem = false;
      }
      return isCompleteItem;
    }, updateResWrap = (updateResFn) => {
      return (val) => {
        checkTimeAndCountSendRes();
        updateResFn(val);
      };
    }, checkTimeAndCountSendRes = () => {
      ++count;
      let data = Number(/* @__PURE__ */ new Date());
      if (res !== void 0 && data - lastUpdateTime >= _options.updatePeriod) {
        if (_options.completeItemPath) {
          if (isCompleteItem) {
            lastUpdateTime = data;
            seedResCb == null ? void 0 : seedResCb(res);
          }
        } else {
          lastUpdateTime = data;
          seedResCb == null ? void 0 : seedResCb(res);
        }
      }
    }, updateRes = updateResWrap((val) => {
      res = val;
    }), error = function(m) {
      const e = {
        name: "SyntaxError",
        message: m,
        at,
        text
      };
      _options.jsonCallback(e);
      throw e;
    }, next = function(c) {
      if (c && c !== ch) {
        error("Expected '" + c + "' instead of '" + ch + "'");
      }
      ch = text.charAt(at);
      at += 1;
      return ch;
    }, number = function* () {
      var number2, string2 = "";
      if (ch === "-") {
        string2 = "-";
        yield* nextValue("-");
      }
      while (ch >= "0" && ch <= "9") {
        string2 += ch;
        yield* nextValue();
      }
      if (ch === ".") {
        string2 += ".";
        while ((yield* nextValue()) && ch >= "0" && ch <= "9") {
          string2 += ch;
        }
      }
      if (ch === "e" || ch === "E") {
        string2 += ch;
        yield* nextValue();
        if (ch === "-" || ch === "+") {
          string2 += ch;
          yield* nextValue();
        }
        while (ch >= "0" && ch <= "9") {
          string2 += ch;
          yield* nextValue();
        }
      }
      number2 = +string2;
      if (!isFinite(number2)) {
        error("Bad number");
      } else {
        updateRes(number2);
        return number2;
      }
    }, string = function* () {
      var hex, i, string2 = "", uffff;
      if (ch === '"') {
        var startAt = at;
        while (yield* nextValue()) {
          if (ch === '"') {
            if (at - 1 > startAt)
              string2 += text.substring(startAt, at - 1);
            yield* nextValue();
            updateRes(string2);
            return string2;
          }
          if (ch === "\\") {
            if (at - 1 > startAt)
              string2 += text.substring(startAt, at - 1);
            yield* nextValue();
            if (ch === "u") {
              uffff = 0;
              for (i = 0; i < 4; i += 1) {
                hex = parseInt(yield* nextValue(), 16);
                if (!isFinite(hex)) {
                  break;
                }
                uffff = uffff * 16 + hex;
              }
              string2 += String.fromCharCode(uffff);
            } else if (typeof escapee[ch] === "string") {
              string2 += escapee[ch];
            } else {
              break;
            }
            startAt = at;
          }
        }
      }
      error("Bad string");
    }, white = function* () {
      while (ch && ch <= " ") {
        yield* nextValue();
      }
    }, word = function* () {
      switch (ch) {
        case "t":
          yield* nextValue("t");
          yield* nextValue("r");
          yield* nextValue("u");
          yield* nextValue("e");
          updateRes(true);
          return true;
        case "f":
          yield* nextValue("f");
          yield* nextValue("a");
          yield* nextValue("l");
          yield* nextValue("s");
          yield* nextValue("e");
          updateRes(false);
          return false;
        case "n":
          yield* nextValue("n");
          yield* nextValue("u");
          yield* nextValue("l");
          yield* nextValue("l");
          updateRes(null);
          return null;
      }
      error("Unexpected '" + ch + "'");
    }, value, array = function* () {
      const currentArray = [];
      function arrUpdateRes(val) {
        currentArray.push(val);
      }
      function checkAndSend() {
        checkAndPop();
        if (isCompleteItem) {
          checkTimeAndCountSendRes();
        }
      }
      if (ch === "[") {
        yield* nextValue("[");
        yield* white();
        updateRes(currentArray);
        keyStack.push("[]");
        if (ch === "]") {
          yield* nextValue("]");
          checkAndSend();
          keyStack.pop();
          return currentArray;
        }
        while (ch) {
          updateRes = updateResWrap(arrUpdateRes);
          yield* value();
          yield* white();
          if (ch === "]") {
            yield* nextValue("]");
            checkAndSend();
            keyStack.pop();
            return currentArray;
          }
          yield* nextValue(",");
          checkAndSend();
          yield* white();
        }
      }
      error("Bad array");
    }, object = function* () {
      let currentObject = /* @__PURE__ */ Object.create(null);
      function objUpdateRes(key) {
        return (val) => {
          currentObject[key] = val;
        };
      }
      if (ch === "{") {
        isCompleteItem = false;
        updateRes(currentObject);
        yield* nextValue("{");
        yield* white();
        if (ch === "}") {
          yield* nextValue("}");
          checkAndPop();
          return currentObject;
        }
        while (ch) {
          let key = "";
          updateRes = updateResWrap((newKey) => {
            currentObject[newKey] = null;
            key = newKey;
          });
          yield* string();
          keyStack.push(key);
          isCompleteItem = false;
          updateRes = updateResWrap(objUpdateRes(key));
          yield* white();
          yield* nextValue(":");
          if (_options.strict === true && Object.hasOwnProperty.call(currentObject, key)) {
            error('Duplicate key "' + key + '"');
          }
          if (suspectProtoRx.test(key) === true) {
            if (_options.protoAction === "error") {
              error("Object contains forbidden prototype property");
            } else if (_options.protoAction === "ignore") {
              const _updateRes = updateRes;
              updateRes = () => {
              };
              yield* value();
              updateRes = _updateRes;
            } else {
              yield* value();
            }
          } else if (suspectConstructorRx.test(key) === true) {
            if (_options.constructorAction === "error") {
              error("Object contains forbidden constructor property");
            } else if (_options.constructorAction === "ignore") {
              const _updateRes = updateRes;
              updateRes = () => {
              };
              yield* value();
              updateRes = _updateRes;
            } else {
              yield* value();
            }
          } else {
            yield* value();
          }
          yield* white();
          if (ch === "}") {
            yield* nextValue("}");
            keyStack.pop();
            checkAndPop();
            return currentObject;
          }
          yield* nextValue(",");
          keyStack.pop();
          yield* white();
        }
      }
      error("Bad object");
    };
    value = function* () {
      yield* white();
      switch (ch) {
        case "{":
          yield* object();
          break;
        case "[":
          yield* array();
          break;
        case '"':
          yield* string();
          break;
        case "-":
          yield* number();
          break;
        default:
          ch >= "0" && ch <= "9" ? yield* number() : yield* word();
      }
    };
    function* nextValue(c) {
      if (isTextEnd) {
        return next(c);
      }
      return at === textLenth ? (yield) ? next(c) : next(c) : next(c);
    }
    return {
      parseGenerate: function* parseGenerate() {
        var _a;
        at = 0;
        ch = " ";
        yield* value();
        yield* white();
        isDone = true;
        if (ch) {
          error("Syntax error");
        } else {
          seedResCb(res);
          let parseRes = JSON.parse(text);
          if (!isEqual(res, parseRes)) {
            (_a = _options.diffCallBack) == null ? void 0 : _a.call(_options, parseRes);
          }
        }
      },
      updateText(newText, isEnd) {
        text += newText;
        textLenth += newText.length;
        isTextEnd = isEnd;
      }
    };
  }
  async function fetchStreamJson({ url, fetchOptions, JSONParseOption }) {
    const {
      parseGenerate,
      updateText
    } = json_parse(JSONParseOption);
    const parseCtrl = parseGenerate();
    parseCtrl.next();
    const utf8Decoder = new TextDecoder("utf-8");
    const response = await fetch(url, fetchOptions);
    if (!response.body) {
      throw new Error("response.body is undefined");
    }
    const reader = response.body.getReader();
    let readerDone = false;
    let chunk;
    while (!readerDone) {
      ({ value: chunk, done: readerDone } = await reader.read());
      const chunkText = utf8Decoder.decode(chunk);
      updateText(chunkText, readerDone);
      parseCtrl.next();
    }
  }
  exports2.fetchStreamJson = fetchStreamJson;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
