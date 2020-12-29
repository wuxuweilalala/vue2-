import {isFunction} from "./utils";
import {observe} from "./observe/index";

export function initState(vm) {
    const opt = vm.$options;
    if(opt.data){
        initData(vm) // 数据劫持
    }

}
function  proxy(vm,source,key) {
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newVal){
            vm[source][key] = newVal
        }
    })
}

function initData(vm) {
    let data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm):data; // data 有可能是个函数
    for(let key in data){ // 对数据进行代理 vm.name => vm.__data.name
        proxy(vm,'_data',key)
    }
    observe(data)
}

