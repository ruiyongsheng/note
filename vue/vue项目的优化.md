### 1. 路由采用懒加载
官方文档：[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)；<br>
before：
![](https://user-gold-cdn.xitu.io/2019/4/12/16a111f02a3fdbcd?w=523&h=144&f=png&s=23024)
after:

![](https://user-gold-cdn.xitu.io/2019/4/12/16a1121a6e5f825a?w=548&h=160&f=png&s=27500)

### 2. 配置webpack中externals，将静态资源采用第三方托管<br>
   #### 第一步：在**webpack.base.conf.js**中添加
    ```
    externals: {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios',
     },
    ```
    #### 第二步：修改html文件，将externals中的引用改成cdn资源
    
![](https://user-gold-cdn.xitu.io/2019/4/12/16a1129ed5cd99db?w=1730&h=432&f=png&s=149921)
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>test</title>
    <link href="https://cdn.bootcss.com/element-ui/2.3.8/theme-chalk/index.css" rel="stylesheet">
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
    <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js"></script>
    <script src="https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js"></script>
    <script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdn.bootcss.com/element-ui/2.3.8/index.js"></script>
  </body>
</html>
```

    
#### 第三步：修改main.js文件，取掉element-ui组件 
![](https://user-gold-cdn.xitu.io/2019/4/12/16a112817e55a9e0?w=878&h=818&f=png&s=131918)

让我们再来看下app.js的大小

![](https://user-gold-cdn.xitu.io/2019/4/12/16a112bee0c428ad?w=509&h=272&f=png&s=48718)

是不是小了很多呢？😀

<!--3. 分离样式信息至单独文件：配置 **extract-text-webpack-plugin**-->

<!--#### 第一步：安装插件-->
<!--```-->
<!--# 通过 npm 安装-->
<!--npm install --save-dev mini-css-extract-plugin-->
<!--# or 通过 yarn 安装-->
<!--yarn add mini-css-extract-plugin --dev-->
<!--```-->
<!--#### 第二步： 引入和实例化在 webpack.base.conf.js 中添加-->
<!--```-->
<!--// 首先生成将插件引入至当前配置文件-->
<!--const ExtractTextPlugin = require('extract-text-webpack-plugin');-->
<!--// 其次是最简单对目标文件-->
<!--// 也就是提取出来的样式文件进行命名-->
<!--const extractSCSS = new ExtractTextPlugin('style_scss.css');-->
<!--```-->
<!--将 extract-text-webpack-plugin 结合到现有针对 /\.scss$/ 文件中。 在这里单独提取所有样式文件到一个单独的样式表 .css 文件中去，意味着我们不再需要使用 style-loader 来将样式表数据注入到 html 里 标签中去，所以这里就会把 style-loader 剔除掉。-->
<!--```-->
<!--{-->
<!--  test: /\.scss/,-->
<!--  use: extractSCSS.extract([-->
<!--    {-->
<!--      loader: 'css-loader',-->
<!--      options: { sourceMap: true }-->
<!--    },-->
<!--    {-->
<!--      loader: 'sass-loader',-->
<!--      options: {-->
<!--        includePaths: ['node_modules'],-->
<!--        sourceMap: true-->
<!--      }-->
<!--    }-->
<!--  ])-->
<!--}-->
<!--```-->

### 3. 对输出的样式表文件进行压缩：loaderOptionsPlugin，在webpack.base.conf.js中配置
处理 SCSS 文件、或者普通的 CSS，都需要处理对生成的文件进行压缩，特别是在生产环境里。这里就可以使用 loaderOptionsPlugin 对输出的 CSS 文件进行压缩。和 extract-text-webpack-plugin 不同，该插件是一个 Webpack 自带的（built-in）的插件，所以使用的时候可以免去安装的步骤，如下，在 plugins 中添加上就可以： 
```
const Webpack = require('webpack')
......
plugins: [
  // …
  new Webpack.LoaderOptionsPlugin({ 
    minimize: process.NODE_ENV === 'production'（或者直接设置成true，不区分环境）
  })
  // … 
]
```
设置完成之后，我们再次打包：

![](https://user-gold-cdn.xitu.io/2019/4/12/16a11795f19e05c9?w=1034&h=624&f=png&s=122239)
又小了11Kb，😀

#### 4.提取公共代码 
如果每个页面的代码都将这些公共的部分包含进去，则会造成以下问题 ：<br>         1.**相同的资源被重复加载，浪费用户的流量和服务器的成本。** <br> 2.**每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。** 如果将多个页面的公共代码抽离成单独的文件，就能优化以上问题 。Webpack内置了专门用于提取多个Chunk中的公共部分的插件CommonsChunkPlugin。

```
// 所有在 package.json 里面依赖的包，都会被打包进 vendor.js 这个文件中。
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function(module, count) {
    return (
      module.resource &&
      /\.js$/.test(module.resource) &&
      module.resource.indexOf(
        path.join(__dirname, '../node_modules')
      ) === 0
    );
  }
}),
// 抽取出代码模块的映射关系
new webpack.optimize.CommonsChunkPlugin({
  name: 'manifest',
  chunks: ['vendor']
}),

```
重新打包之后，app.js被拆分成 **vendor.js** 和 **manifest.js**

![](https://user-gold-cdn.xitu.io/2019/4/13/16a1587b7cb2872d?w=666&h=135&f=png&s=28446)



