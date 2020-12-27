(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isFunction(val) {
    return typeof val === 'function';
  }
  function isObject(val) {
    return _typeof(val) === 'object' && val !== null;
  }

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      this.walk(data);
    }

    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observe;
  }();

  function defineReactive(data, key, val) {
    observe(val); // 如果val是个对象，也需要劫持一下

    Object.defineProperty(data, key, {
      get: function get() {
        return val;
      },
      set: function set(newVal) {
        observe(newVal); // 如果给data中的属性赋值了一个新对象，需要对这个对下对象进行劫持

        val = newVal;
      }
    });
  }

  function observe(data) {
    // 如果是对象才检测
    if (!isObject(data)) {
      return;
    }

    return new Observe(data);
  }

  function initState(vm) {
    var opt = vm.$options;

    if (opt.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data; // data 有可能是个函数

    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 对数据进行初始化 watch computed data props

      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  } // 扩展原型


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
