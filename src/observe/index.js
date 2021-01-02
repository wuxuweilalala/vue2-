import {isObject} from "../utils";
import {arrayMethods} from "./array";
import {Dep} from "./dep";

// 1. 如果数据是对象，会对对象进行递归劫持
// 2. 如果数据是数组，会劫持数组的7个方法。并且会对数组中新增的对象进行劫持


class Observe {
    constructor(data) {

        this.dep = new Dep()


        Object.defineProperty(data,'__ob__',{
            value:this,
            enumerable:false // 不可枚举，不然会走入死循环
        })
        if(Array.isArray(data)){
            // 对能改变原数组的七个方法进行改写，触发更新
            data.__proto__ = arrayMethods;
            // 数组中的值如果是对象，应也能触发更新
            this.observeArray(data)
        }else{
            this.walk(data)
        }
    }
    observeArray(data){
        data.forEach(item=>{
            observe(item)
        })
    }
    walk(data){
        Object.keys(data).forEach(key=>{
            defineReactive(data,key,data[key])
        })
    }
}

function dependArray(value) {
    for(let i =0;i<value.length;i++) {
        let current = value[i];
        current.__ob__ && current.__ob__.dep.depend()
        if(Array.isArray(current)) {
            dependArray(current)
        }
    }
}

function defineReactive(data,key,val) {
    let childOb = observe(val) // 如果val是个对象，也需要劫持一下
    let dep = new Dep()
    Object.defineProperty(data,key,{
        get(){
            if(Dep.target) {
                dep.depend()
                if(childOb){
                    childOb.dep.depend()
                    if(Array.isArray(val)) {
                        dependArray(val)
                    }
                }
            }
            return val
        },
        set(newVal){
            if(newVal !== val){
                observe(newVal) // 如果给data中的属性赋值了一个新对象，需要对这个对下对象进行劫持
                val = newVal;
                dep.notify()
            }
        }
    })
}

export function observe(data) {
    // 如果是对象才检测
    if(!isObject(data)) {return}
    if(data.__ob__) {return data.__ob__}
    return new Observe(data)
}

