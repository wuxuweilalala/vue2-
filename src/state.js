import {isFunction} from "./utils";
import {observe} from "./observe/index";

export function initState(vm) {
    const opt = vm.$options;
    if(opt.data){
        initData(vm)
    }
}

function initData(vm) {
    let data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm):data; // data 有可能是个函数
    observe(data)
}

