export function isFunction(val) {
    return typeof val === 'function'
}

export function isObject(val) {
    return typeof val  === 'object' && val !== null
}

const callbacks = []

function flushCallbacks() {
    callbacks.forEach(item=>{
        item()
    })
    waiting = false
}

let waiting = false

let timerFn = ()=>{}

if(Promise) {// 微任务
    timerFn = ()=>{
        Promise.resolve().then(flushCallbacks)
    }
}else if(MutationObserver) {// 微任务
    let textNode = document.createTextNode(1)
    let observe = new MutationObserver(flushCallbacks);
    observe.observe(textNode,{
        characterData:true
    })
    timerFn = ()=>{
        textNode.textContent = 3
    }
}else if(setImmediate) {
    timerFn = ()=>{
        setImmediate(flushCallbacks())
    }
}else {
    timerFn = ()=>{
        setTimeout(flushCallbacks())
    }
}

export function nextTick(cb) {
    callbacks.push(cb)

    if(!waiting) {
        timerFn()
        waiting = true;
    }

}