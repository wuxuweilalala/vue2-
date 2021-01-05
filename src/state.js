import {isFunction} from "./utils";
import {observe} from "./observe/index";
import Watcher from "./observe/watcher";
import {Dep} from "./observe/dep";

export function initState(vm) {
    const opt = vm.$options;
    if(opt.data){// 数据劫持
        initData(vm)
    }
    if(opt.watch){ // 监听属性
        initWatch(vm,opt.watch)
    }
    if(opt.computed) {
        initComputed(vm,opt.computed)
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
        options.user = true
        new Watcher(this,key,handler,options)
    }
}

function initComputed(vm,computed) {
    const watchers = vm._computedWatchers ={}
    for(let key in computed) {
       const userDef =  computed[key]

        let getter = typeof userDef === 'function' ? userDef : userDef.get;

        watchers[key] = new Watcher(vm,getter,()=>{},{lazy:true})

        defineComputed(vm,key,userDef)
    }
}

function createComputedGetter(key) {
    return function computedGetter() { // 取计算属性的值，走的是这个函数
        let watcher = this._computedWatchers[key]
        if(watcher.dirty) {
            watcher.evaluate()
        }
        if(Dep.target) {
            watcher.depend()
        }

        return watcher.value;
    }
}


function defineComputed(vm,key,userDef) {
    let sharedProperty = {};

    if(typeof userDef === 'function') {
        sharedProperty.get = userDef;
    }else {
        sharedProperty.get = createComputedGetter(key)
        sharedProperty.set = userDef.set
    }

    Object.defineProperty(vm,key,sharedProperty)
}