import {popTarget, pushTarget} from "./dep";
import {queueWatcher} from "./scheduler";

let id = 0

class Watcher {
   // vm,updateComponent,()=>{console.log('视图更新了');},true
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.user = !!options.user; // watch
        this.lazy = options.lazy
        this.dirty = this.lazy;// 计算属性，默认是true
        this.cb = cb;
        this.options = options;
        this.id = id++;

        if(typeof exprOrFn === 'string') {
            this.getter = function () {
                let path = exprOrFn.split('.');
                let obj = vm;
                for(let i=0;i<path.length;i++){
                    obj = obj[path[i]]
                }
                return obj
            }
        }else {
            this.getter = exprOrFn
        }
        this.deps = []
        this.depsId= new Set()
        this.value  = this.lazy ? undefined : this.get()
    }
    get(){
        pushTarget(this)
        const value = this.getter.call(this.vm)
        popTarget()

        return value
    }
    evaluate(){
        this.dirty = false;
        this.value = this.get()
        return this.value
    }
    update(){
        if(this.lazy) { // 是计算属性 就需要重新计算
            this.dirty = true
        }else {
            queueWatcher(this) // 多次调用update ，缓存下来，异步更新
        }

    }
    run(){
        let newValue = this.get();
        let oldValue = this.value;

        this.value = newValue
        if(this.user) { // watch 监听属性方法会走
            this.cb.call(this.vm,newValue,oldValue)
        }
    }
    addDep(dep){
        let id = dep.id
        if(!this.depsId.has(id)){ // deps 去重 ，避免页面中用到一个数据多次get 进行了多次依赖收集
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    depend(){
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend()
        }
    }
}

export default Watcher