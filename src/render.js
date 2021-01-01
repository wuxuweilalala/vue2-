import {createElement, createTextElement} from "./vdom/index";

export function renderMixin(Vue) {
    Vue.prototype._c = function(){ //createElement
        return createElement(this,...arguments)
    }
    Vue.prototype._v = function(text){ //createTextElement
        return createTextElement(this,text)
    }
    Vue.prototype._s = function(val){
        if(typeof val === 'object') return JSON.stringify(val)
        return val
    }
    Vue.prototype._render = function () {
        const vm = this
        const vnode = vm.$options.render.call(vm)
        return vnode
    }
}