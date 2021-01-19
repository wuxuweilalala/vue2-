import {initMixin} from "./init";
import {lifecycleMixin} from "./lifecycle";
import {renderMixin} from "./render";
import {stateMixin} from "./state";
import {initGlobalApi} from "./global-api/index";

function Vue(options) {
    this._init(options)
}

// 扩展原型
initMixin(Vue)
renderMixin(Vue) // _render
lifecycleMixin(Vue) // _update
stateMixin(Vue) // $watch

// 在类上面进行扩展 Vue.mixin
initGlobalApi(Vue)


import {compileToFunction} from './compiler/index';
import {createElm,patch} from './vdom/patch';

// diff
let oldTemplate = `<div>
<li>A</li>
<li>B</li>
<li>C</li>
<li>D</li>
</div>`;
const render1 = compileToFunction(oldTemplate);
let vm1 = new Vue({data:{msg:'wxw'}});
const oldVnode = render1.call(vm1);
document.body.appendChild(createElm(oldVnode))

let newTemplate = `<div>
<li>D</li>
<li>A</li>
<li>B</li>
<li>C</li>
</div>`;
const render2 = compileToFunction(newTemplate);
let vm2 = new Vue({data:{msg:'hjj'}});
const newVnode = render2.call(vm2);

setTimeout(()=>{
    patch(oldVnode,newVnode)
},1000)

export default Vue
