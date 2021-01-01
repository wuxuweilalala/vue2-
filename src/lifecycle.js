import {patch} from "./vdom/patch";

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        //
        const vm = this;
        patch(vm.$el,vnode)
    }
}


export function mountComponent(vm,el) {
    // 更新函数，数据变化后会再次调用
    const updateComponent = () =>{
        // 1. 调用render生成虚拟 DOM
        // 2. 用虚拟 DOM 生成真实 DOM
        vm._update(vm._render())
    }
    updateComponent()
}