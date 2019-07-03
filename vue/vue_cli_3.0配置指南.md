### vue-cli 3.0的踩坑之旅
1. 一份完整的vue.config.js配置（包含多页面配置）

```
const path = require('path');

module.exports = {
  // 基本路径
  baseUrl: './',
  assetsDir: 'static',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  //如果你想要在生产构建时禁用 eslint-loader，你可以用如下配置
  lintOnSave: process.env.NODE_ENV !== 'production',
  // webpack的配置
  configureWebpack: {
    devtool: 'inline-source-map',
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@assets': '@/assets',
        '@components': '@/components',
        '@common': '@/components/common',
        '@views': '@/views',
        '@utils': '@/utils',
      }
    },
  },

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: process.env.NODE_ENV === 'production',
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // 该选项在系统的 CPU 有多于一个内核时自动启用
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: 'localhost',
    port: 8081,
    https: false, // 是否启用https
    hot: true, // 启用webpack的热模块替换功能：
    hotOnly: false, // devServer.hot在没有页面刷新的情况下启用热模块替换（请参阅）作为构建失败时的后备。
    inline: true, // 在开发服务器的两种不同模式之间切换，默认为true
    compress: true, // 是否开启压缩
    proxy: null, // 设置代理
  },
  // 第三方插件配置
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/assets/css/reset.css'),
      ]
    }
  },
  <!--  配置多页面  -->
  pages: {
    index: {
      // page 的入口
      entry: 'src/pages/index/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    share: {
      // page 的入口
      entry: 'src/pages/share/share.js',
      // 模板来源
      template: 'public/share.html',
      // 在 dist/index.html 的输出
      filename: 'share.html',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'share']
    },
  }
}
```

2. 动态加载meta标签的值

只需要在router.js时配置

```
//router内的设置
    {
      path: '/teachers',
      name: 'TDetail',
      component: TDetail,
      meta: {
        title:"首页",
        content: 'disable'
      }
    },
    {
      path: '/article',
      name: 'Article',
      component: Article,
      meta: {
        title: "文章",
        content: 'disable-no'
      }
    },
  //main.js里面的代码
  router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面meta */
  if(to.meta.content){
    let head = document.getElementsByTagName('head');
    let meta = document.createElement('meta');
    meta.content = to.meta.content;
    head[0].appendChild(meta)
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
});
```

3. facebook分享的问题；<br/>

分享的meta标签里边必须是固定值，js动态加进去是不生效的；

4. 点击radio会清空所有的checked状态 <br/>

举例说，比如一个问卷调查，会有很多radio,当用户选择所有题项之后，才让提交按钮变色，当状态值更改的时候，触发了视图更新，这时候所有的raido都会初始的checked装填，就变为空，这时候需要做的就是在项目中，也让checked的状态等于当前选择的；

5. axios请求的时候，后端拿不到值
 
参考文章： [axios发post请求，后端接收不到参数](https://blog.csdn.net/csdn_yudong/article/details/79668655)；

6. 写一个插件，比如一个toast弹窗

新建 toast.js 
```
import ToastComponent from './Toast.vue'
const Toast = {};

// 注册Toast
Toast.install = function (Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const ToastConstructor = Vue.extend(ToastComponent);
  // 生成一个该子类的实例
  const instance = new ToastConstructor();
  // 将这个实例挂载在我创建的div上
  instance.$mount(document.createElement('div'));
  // 并将此div加入全局挂载点内部
  document.body.appendChild(instance.$el);
  //定义一个外部的变量，用于控制调用多次提示组件时，清除延时器
  let timer;
  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法 
  const message_main = {
    all_message(msg, type, duration) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        instance.visible = false;
      }, duration);
      instance.message = msg;
      instance.visible = true;
      instance.type = type;

    },
    success(msg, duration = 3000) {
      this.all_message(msg, 1, duration);
    },
    error(msg, duration = 3000) {
      this.all_message(msg, 2, duration);
    },
  }
  //将方法挂载全局
  Vue.prototype.$toast = message_main;
}

export default Toast
```

新建 toast.vue
```
<template>
  <div>
    <span v-show="visible" class="dialog-tips">
      {{message}}
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      message: "",
    };
  }
};
</script>
<style lang="scss" scoped>
  .dialog-tips {
    max-width: 1.4rem;
    white-space: nowrap;
    font-size: .14rem;
    font-weight: bold;
    padding: .1rem .2rem;
    text-align: center;
    color: green;
    background: rgba(204, 204, 204, 0.2);
    position: fixed;
    bottom: .84rem;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>

```
在main.js

![](https://user-gold-cdn.xitu.io/2019/2/2/168ad6aae05e8e91?w=864&h=174&f=png&s=22466)

这是toast组件挂载vue原型上，哪用哪儿引用就OK👌；

7. 封装axios;

```
import axios from "axios";

axios.defaults.timeout = 10000;
axios.defaults.baseURL = process.env.API_ROOT; // 域名
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 异常处理
axios.interceptors.response.use(
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 404:
          console.log("找不到该页面");
          break;
        case 500:
          console.log("服务器出错");
          break;
        case 503:
          console.log("服务器失效");
          break;
        default:
          console.log(`连接错误${err.response.status}`);
      }
    } else {
      console.log("连接到服务器失败");
    }
    return Promise.resolve(err.response);
  }
);

export default axios;
```




