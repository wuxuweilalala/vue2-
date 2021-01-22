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



export default Vue
