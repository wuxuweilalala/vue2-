let queue = []
let has = {}

let pending = false

function flushSchedulerQueue() {
    for(let i = 0;i<queue.length;i++){
        queue[i].run()
    }
    queue = [];
    has = {};
    pending = false;
}

export function queueWatcher(watcher) {
    const id = watcher.id;
    if(has[id] == null) {
        queue.push(watcher)
        has[id] = true
        // 开启一次更新操作 批处理 防抖
        if(!pending) {
            setTimeout(flushSchedulerQueue,0)
            pending = true
        }
    }else {

    }
}