import {patch} from "./vdom/patch";
import Watcher from "./observe/watcher";

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        //
        const vm = this;
       vm.$el = patch(vm.$el,vnode)
    }
}


export function mountComponent(vm,el) {
    // 更新函数，数据变化后会再次调用
    const updateComponent = () =>{
        // 1. 调用render生成虚拟 DOM
        // 2. 用虚拟 DOM 生成真实 DOM
        vm._update(vm._render())
    }

    new Watcher(vm,updateComponent,()=>{
        console.log('视图更新了');
    },true) // true 表示是一个渲染 watcher

    //updateComponent()
}