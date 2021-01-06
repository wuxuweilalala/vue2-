import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
export default {
    input:'./src/index.js',
    output:{
        format:'umd', // 支持 amd 和 commonjs规范
        name:'Vue',
        file:'dist/vue.js',
        sourcemap:true // es5 => es6 源代码
    },
    plugins:[
        babel({
            exclude:'node_modules/**'
        }),
      process.env.ENV === 'development' ? serve({
          open:true,
          openPage:'/index.html',
          port:3008,
          contentBase:''
      }):null
    ]
}