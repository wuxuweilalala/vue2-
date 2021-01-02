import {popTarget, pushTarget} from "./dep";
import {queueWatcher} from "./scheduler";

let id = 0

class Watcher {
   // vm,updateComponent,()=>{console.log('视图更新了');},true
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.options = options;
        this.id = id++


        this.getter = exprOrFn
        this.deps = []
        this.depsId= new Set()

        this.get()
    }
    get(){
        pushTarget(this)
        this.getter()
        popTarget()
    }
    update(){
        queueWatcher(this) // 多次调用update ，缓存下来，异步更新
        //this.get()
    }
    run(){
        this.get()
    }
    addDep(dep){
        let id = dep.id
        if(!this.depsId.has(id)){ // deps 去重 ，避免页面中用到一个数据多次get 进行了多次依赖收集
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }

}

export default Watcher