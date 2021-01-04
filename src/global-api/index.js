import {mergeOptions} from "../utils";

export function initGlobalApi(Vue) {
    Vue.options = {} // 用来存放全局的配置 Vue.component Vue.filter Vue.directive
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options,options)
        // Vue.options.beforeCreate = [fn1,fn2]
        return this
    }

    Vue.options._base = Vue
    Vue.options.components = {}
    Vue.component = function (id,definition) {
        definition = this.options._base.extend(definition)
        this.options.components[id] = definition
    }

    Vue.extend =  function (opts) {
        const Sub = function VueComponent() {
            this._init()
        }
        Sub.prototype = Object.create(this.prototype)
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(this.options,opts)
        return Sub;
    }
}

