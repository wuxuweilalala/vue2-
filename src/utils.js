export function isFunction(val) {
    return typeof val === 'function'
}

export function isObject(val) {
    return typeof val === 'object' && val !== null
}

const callbacks = []

function flushCallbacks() {
    callbacks.forEach(item => {
        item()
    })
    waiting = false
}

let waiting = false

let timerFn = () => {
}

if (Promise) {// 微任务
    timerFn = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) {// 微任务
    let textNode = document.createTextNode(1)
    let observe = new MutationObserver(flushCallbacks);
    observe.observe(textNode, {
        characterData: true
    })
    timerFn = () => {
        textNode.textContent = 3
    }
} else if (setImmediate) {
    timerFn = () => {
        setImmediate(flushCallbacks())
    }
} else {
    timerFn = () => {
        setTimeout(flushCallbacks())
    }
}

export function nextTick(cb) {
    callbacks.push(cb)

    if (!waiting) {
        timerFn()
        waiting = true;
    }

}


const lifecycleHooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]

let strategy = [] // 策略

function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}

lifecycleHooks.forEach(hook => {
    strategy[hook] = mergeHook;
})
strategy.components = function (parentVal, childVal) {
    let options = Object.create(parentVal);

    for (let key in childVal) {
        options[key] = childVal[key]
    }
    return options
}

export function mergeOptions(parent, child) {
    const options = {};
    for (let key in parent) {
        mergeField(key)
    }
    for (let key in child) {
        if (parent.hasOwnProperty(key)) continue;
        mergeField(key)
    }

    function mergeField(key) {
        let parentVal = parent[key]
        let childVal = child[key]
        // 策略模式
        if (strategy[key]) {
            options[key] = strategy[key](parentVal, childVal)
        } else {
            if (isObject(parentVal) && isObject(childVal)) {
                options[key] = {...parentVal, ...childVal}
            } else {
                options[key] = childVal || parent[key]
            }
        }

    }

    return options;
}

export function isReservedTag(tag) {
    let str = 'a,div,span,p,h1,h2,h3,h4,h5,h6,img,ul,li,button';
    return str.includes(tag);

}