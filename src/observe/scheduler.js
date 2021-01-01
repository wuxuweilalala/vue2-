let queue = []
let has = {}

let pending = false

function flushSchedulerQueue() {
    console.log(4);
    for(let i = 0;i<queue.length;i++){
        queue[i].run()
    }
    queue = [];
    has = {};
    pending = false;
}

export function queueWatcher(watcher) {
    const id = watcher.id;
    console.log(11);
    if(has[id] == null) {
        console.log(2);
        queue.push(watcher)
        has[id] = true
        // 开启一次更新操作 批处理 防抖
        if(!pending) {
            console.log(3);
            setTimeout(flushSchedulerQueue,0)
            pending = true
        }
    }else {

    }
}