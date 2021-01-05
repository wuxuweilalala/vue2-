import {initState} from './state';
import {compileToFunction} from './compiler/index';
import {callHook, mountComponent} from "./lifecycle";
import {mergeOptions} from "./utils";

export function initMixin(Vue){
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = mergeOptions(vm.constructor.options,options);
        callHook(vm,'beforeCreate')
        // 对数据进行初始化 watch computed data props
        initState(vm)
        callHook(vm,'created')
        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }

    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options
        el = document.querySelector(el)
        vm.$el = el
        if(!options.render) {
            let template = options.template;
            if(!template && el) {
                template = el.outerHTML;
            }
            options.render = compileToFunction(template)
        }
        mountComponent(vm,el) //组件的挂载流程
    }
}



