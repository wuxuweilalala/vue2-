import {isObject} from "../utils";

class Observe {
    constructor(data) {
        this.walk(data)
    }
    walk(data){
        Object.keys(data).forEach(key=>{
            defineReactive(data,key,data[key])
        })
    }
}

function defineReactive(data,key,val) {
    observe(val) // 如果val是个对象，也需要劫持一下
    Object.defineProperty(data,key,{
        get(){
            return val
        },
        set(newVal){
            observe(newVal) // 如果给data中的属性赋值了一个新对象，需要对这个对下对象进行劫持
            val = newVal;
        }
    })
}

export function observe(data) {
    // 如果是对象才检测
    if(!isObject(data)) {return}
    return new Observe(data)
}

