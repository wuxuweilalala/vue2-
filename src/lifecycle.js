import {patch} from "./vdom/patch";
import Watcher from "./observe/watcher";
import {nextTick} from "./utils";

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this;
        const preVnode = vm._vnode;
        if (!preVnode) { // 初次渲染
            vm.$el = patch(vm.$el, vnode);
            vm._vnode = vnode
        } else {
            vm.$el = patch(preVnode, vnode)
        }

    }
    Vue.prototype.$nextTick = nextTick
}


export function mountComponent(vm, el) {
    callHook(vm, 'beforeMount')
    // 更新函数，数据变化后会再次调用
    const updateComponent = () => {
        // 1. 调用render生成虚拟 DOM
        // 2. 用虚拟 DOM 生成真实 DOM
        vm._update(vm._render())
    }

    new Watcher(vm, updateComponent, () => {
        console.log('视图更新了');
    }, true) // true 表示是一个渲染 watcher

    //updateComponent()
}

export function callHook(vm, hook) {
    let handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}