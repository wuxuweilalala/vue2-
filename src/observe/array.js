const oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods);
const methods = ['push','pop','shift','unshift','reverse','sort','splice'];

methods.forEach(method=>{
    arrayMethods[method] = function (...args) {
        console.log('数据发生了变化');
        console.log(...args);
        let ob = this.__ob__;
        let inserted;
        oldArrayMethods[method].call(this,...args)
        switch (method) {
            case 'push':
            case 'unshift':
                inserted= args
                break;
            case 'splice':
                inserted = args.slice(2)
        }
        if(inserted){
            ob.observeArray(inserted)
        }
    }
})