第一步：在你的工程目录下添加依赖包
```
npm install node-sass --save-dev
npm install sass-loader --save-dev
npm install style-loader -save-dev
```
第二步：打开webpack.base.config.js在loaders里面加上
```
{
  test: /\.scss$/,
  loaders: ["style", "css", "sass"]
}
```
第三步： 在需要用scss的组件中
```
<style lang="scss" scoped>

</style>
```
第四步：在vue2.0中使用scss配置全局变量
 1. 添加依赖
 ```
 npm install sass-resources-loader --save-dev
 ```
 2. 修改build/utils.js
 ```
 scss: generateLoaders('sass').concat(
{
  loader: 'sass-resources-loader',
  options: {
  // 把一些公用的方法都定义在var.scss;
    resources: path.resolve(__dirname, '../src/assets/var.scss')
    }
  }
)
 ```
 

## vue-cli 构建的项目 webpack 如何配置不 build 出 .map 文件？
 
 config/inde.js 下面:

 productionSourceMap: false, // false 不开启调试，build不会生成map调试文件。默认true，开启
 
## vue-cli webpack打包后index.html引入文件没有引号
```
在对vue-cli项目打包后出现index.html引入的css和js没有引号 即：

<link href=/css/xxx.css rel=stylesheet>

解决办法：

找到webpack.prod.conf.js，在webpack.prod.conf.js找到minify

把minify中的  removeAttributeQuotes: true改为

 removeAttributeQuotes: false（如果该方法没有用那就把整个minify去掉再试一下）

然后在执行打包命令：npm run build

执行完打包后index.html中的css和js引入时就会有引号

<link href="/css/xxx.css" rel="stylesheet">
 ```

 
 
参考文章：
1. [vue脚手架中配置Sass的方法](https://www.jb51.net/article/132165.htm);
2. [如何在vue2.0中使用scss配置全局变量](https://blog.csdn.net/qq_30472559/article/details/80144916);