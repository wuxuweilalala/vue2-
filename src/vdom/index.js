import {isObject, isReservedTag} from "../utils";

export function createElement(vm, tag, data = {}, ...children) {
    if(isReservedTag(tag)) {
        return vnode(vm, tag, data, data.key, children, undefined);
    }else {
        const Ctor = vm.$options.components[tag]
        return createComponent(vm, tag, data, data.key, children,Ctor)
    }
}
// 创建组件虚拟节点
function createComponent(vm, tag, data, key, children,Ctor) {
    if(isObject(Ctor)) {
        Ctor = vm.$options._base.extend(Ctor)
    }
    data.hook = {
        init(){}
    }
    return vnode(vm,`vue-component-${tag}`,data,key,undefined,undefined,{Ctor,children})
}

export function createTextElement(vm, text) {

    return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, data, key, children, text,componentOptions) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text,
        componentOptions
        // .....
    }
}