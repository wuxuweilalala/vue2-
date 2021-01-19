export function patch(oldVnode, vnode) {
    if (!oldVnode) {
        return createElm(vnode); // 如果没有el元素，那就直接根据虚拟节点返回真实节点
    }

    if (oldVnode.nodeType == 1) {
        // 用vnode  来生成真实dom 替换原本的dom元素
        const parentElm = oldVnode.parentNode; // 找到他的父亲
        let elm = createElm(vnode); //根据虚拟节点 创建元素
        // 在第一次渲染后 是删除掉节点，下次在使用无法获取
        parentElm.insertBefore(elm, oldVnode.nextSibling);

        parentElm.removeChild(oldVnode);

        return elm;
    } else {//  vnode diff
        // 1. 如果标签名称不一样 则删掉老节点 换成新节点即可
        if (oldVnode.tag !== vnode.tag) {
            // vnode.el 属性是当前虚拟dom 的真实dom
            return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
        }
        // 如果标签一样就比较属性,属性可能有删除的时候
        let el = vnode.el = oldVnode.el; // 表示当前新节点 服用老节点
        patchProps(vnode, oldVnode.data) // 对比属性


        // 2. 如果两个虚拟节点是文本节点，比较文本节点
        if (vnode.tag === undefined) {
            if (oldVnode.text !== vnode.text) {
                el.textContent = vnode.text;
            }
            return
        }


        // 一方有子节点 一方没有子节点
        let oldChildren = oldVnode.children || [];
        let newChildren = vnode.children || [];

        if (oldChildren.length > 0 && newChildren.length > 0) { // 双方都有子节点
            // 双指针比较
            patchChildren(el, oldChildren, newChildren)

        } else if (newChildren.length > 0) { // 老的没子节点 新的有子节点
            for (let i = 0; i < newChildren.length; i++) { // 循环创建新节点
                let child = createElm(newChildren[i])
                el.appendChild(child)
            }
        } else if (oldChildren.length > 0) { // 新的没子节点 老的有子节点
            el.innerHTML = ``; // 直接删除老节点
        }
        // vue 每个组件都有一个 watcher ，当前组件中数据变化 只需要更新当前组件
    }
}

function isSameVNode(oldVNode, newVNode) {
    //return (oldVNode.tag === newVNode.tag) &&(oldVNode.key === newVNode.key);
    return oldVNode.tag === newVNode.tag
}

function patchChildren(el, oldChildren, newChildren) {
    let oldStartIndex = 0;
    let oldStartVNode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVNode = oldChildren[oldEndIndex];

    let newStartIndex = 0;
    let newStartVNode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVNode = newChildren[newEndIndex];

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 双指针循环
        if (isSameVNode(oldStartVNode, newStartVNode)) {// 从头部开始 diff
            patch(oldStartVNode, newStartVNode);
            oldStartVNode = oldChildren[++oldStartIndex]
            newStartVNode = newChildren[++newStartIndex]
        } else if (isSameVNode(oldEndVNode, newEndVNode)) {// 从尾部开始 diff
            patch(oldEndVNode, newEndVNode);
            oldEndVNode = oldChildren[--oldEndIndex]
            newEndVNode = newChildren[--newEndIndex]
        }else if(isSameVNode(oldStartVNode,newEndVNode)) { // 头尾比较 reverse
            patch(oldStartVNode, newEndVNode);
            el.insertBefore(oldStartVNode.el,oldEndVNode.el.nextSibling);
            oldStartVNode = oldChildren[++oldStartIndex];
            newEndVNode = newChildren[--newEndIndex];
        }else if(isSameVNode(oldEndVNode,newStartVNode)) { // 尾头比较 reverse
            patch(oldEndVNode, newStartVNode);
            el.insertBefore(oldEndVNode.el,oldStartVNode.el);
            oldEndVNode = oldChildren[--oldEndIndex];
            newStartVNode = newChildren[++newStartIndex];
        }
    }
    // 新节点比老节点多
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            //el.appendChild(createElm(newChildren[i]))
            let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
            el.insertBefore(createElm(newChildren[i]), anchor)
        }
    }
    // 新节点比老节点少
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            el.removeChild(oldChildren[i].el)
        }
    }

}

function patchProps(vnode, oldProps = {}) { // 初次渲染时调用，后续更新也可以调用
    let newProps = vnode.data || {};
    let el = vnode.el;
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}

    // 如果老的属性有 新的没有直接删除
    for (let key in oldStyle) {
        if (!newStyle[key]) { // 新的style 不存在这个样式
            el.style[key] = ''
        }
    }

    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }

    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps[key]) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}

function createComponent(vnode) {
    let i = vnode.data; //  vnode.data.hook.init
    if ((i = i.hook) && (i = i.init)) {
        i(vnode); // 调用init方法
    }
    if (vnode.componentInstance) { // 有属性说明子组件new完毕了，并且组件对应的真实DOM挂载到了componentInstance.$el
        return true;
    }
}

// 创建真实节点
export function createElm(vnode) {
    let {tag, data, children, text, vm} = vnode;
    if (typeof tag === 'string') { // 元素
        if (createComponent(vnode)) {
            // 返回组件对应的真实节点
            return vnode.componentInstance.$el;
        }
        vnode.el = document.createElement(tag); // 虚拟节点会有一个el属性 对应真实节点
        patchProps(vnode)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child));
        });
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}