import { generate } from './generate';
import {parserHTML} from './parser';

export function compileToFunction(template) {
  console.log('template');
  console.log(template);
  let root = parserHTML(template)
  console.log('root');
  console.log(root);
  // 生成代码
  let code = generate(root)
  console.log('code');
  console.log(code);
  let render = new Function(`with(this){return ${code}}`); // code 中会用到数据 数据在vm上

  return render;
  // render(){
  //     return
  // }
  // html=> ast（只能描述语法 语法不存在的属性无法描述） => render函数 + (with + new Function) => 虚拟dom （增加额外的属性） => 生成真实dom
}