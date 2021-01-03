import {isFunction} from "./utils";
import {observe} from "./observe/index";
import Watcher from "./observe/watcher";

export function initState(vm) {
    const opt = vm.$options;
    if(opt.data){
        initData(vm) // 数据劫持
    }
    if(opt.watch){
        initWatch(vm,opt.watch)
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

function initWatch(vm,watch) {
    for(let key in watch) {
        let handler = watch[key];
        if(Array.isArray(handler)) {
            for(let i=0;i<handler.length;i++) {
                createWatcher(vm,key,handler[i])
            }
        }else {
            createWatcher(vm,key,handler)
        }

    }
}
function createWatcher(vm,key,handler) {
    return vm.$watch(key,handler)
}

export function stateMixin(Vue) {
    Vue.prototype.$watch = function (key,handler,options = {}) {
        console.log(key);
        console.log(handler);
        options.user = true
        new Watcher(this,key,handler,options)
    }
}