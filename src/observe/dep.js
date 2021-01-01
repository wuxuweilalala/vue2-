let id= 0

export class Dep { //每个属性都要分配一个dep , dep 可以存放 watcher
    constructor() {
        this.id = id++
        this.subs = [] // 存放 watcher
    }
    depend(){
        if(Dep.target) {
            Dep.target.addDep(this)
        }
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>{
            watcher.update()
        })
    }

}

Dep.target = null;

export function pushTarget(watcher) {
    Dep.target = watcher
}

export function popTarget() {
    Dep.target = null;
}
