import {popTarget, pushTarget} from "./dep";
import {queueWatcher} from "./scheduler";

let id = 0

class Watcher {
   // vm,updateComponent,()=>{console.log('视图更新了');},true
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.user = !!options.user;
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

        this.value  = this.get()
    }
    get(){
        pushTarget(this)
        const value = this.getter()
        popTarget()

        return value
    }
    update(){
        queueWatcher(this) // 多次调用update ，缓存下来，异步更新
        //this.get()
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

}

export default Watcher