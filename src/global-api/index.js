import {mergeOptions} from "../utils";

export function initGlobalApi(Vue) {
    Vue.options = {} // 用来存放全局的配置 Vue.component Vue.filter Vue.directive
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options,options)
        // Vue.options.beforeCreate = [fn1,fn2]
        console.log(this.options);
        return this
    }
}

