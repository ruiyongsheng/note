
## 概念
webpack 是一个现代的静态模块打包器(module bundler)；
#### 四大概念
    1. 入口(entry)
    2. 输出(output)
    3. loader
    4. 插件(plugins)
### 入口(entry)
简言之： 
<b style="font-size:16px;">就是编译的起点<b> 

从该起点开始，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的,可以有一个入口起点（或多个入口起点） 

默认值为   *./src*。

  **webpack.config.js**
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
### 出口(output)
简言之： 
<b style="font-size:16px;">就是编译的输出<b>  

告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中

默认值为 *./dist*。

  **webpack.config.js**
```
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```
### loader(加载器)
简言之： 
<b style="font-size:16px;">处理非js的模块<b>

本质上，webpack loader 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

在 webpack 的配置中 loader 有两个目标：

1. ***test*** 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。（正则表达式去匹配相关文件);   
2. ***use*** 属性，表示进行转换时，应该使用哪个 loader。

    **webpack.config.js**
```
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { 
        test: /\.txt$/, 
        use: 'raw-loader' 
      }
    ]
  }
};

module.exports = config;
```
### 插件(plugins)
简言之： 
<b style="font-size:16px;">更强大的loader扩展，或者或者叫自定义loader<b>        

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

想要使用一个插件，操作
1. require() 它，
2. 添加到 plugins 数组中。
3. 自定义选项(option)。
4. 在一个配置文件中因为不同目的而多次使用同一个插件，通过使用 **new** 操作符来创建它的一个实例；

    **webpack.config.js**
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```
### 模式
简言之： 
<b style="font-size:16px;">定义development 或 production的环境<b>        

通过选择 development 或 production 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化

  **webpack.config.js**
```
module.exports = {
  mode: 'production'
};
```


接下来就是详细的用法

## 入口起点(entry points)
单个入口（简写）语法   
用法：entry: string|Array<string>

webpack.config.js


entry 属性的单个入口语法，是下面的简写：

    const config = {
      entry: {
        main: './path/to/my/entry/file.js'
      }
    };
对象语法   
用法：entry: {[entryChunkName: string]: string|Array<string>}

webpack.config.js

    const config = {
      entry: {
        app: './src/app.js',
        vendors: './src/vendors.js'
      }
    };

多页面应用程序 
webpack.config.js

    const config = {
      entry: {
        pageOne: './src/pageOne/index.js',
        pageTwo: './src/pageTwo/index.js',
        pageThree: './src/pageThree/index.js'
      }
    };

使用 CommonsChunkPlugin 为每个页面间的应用程序共享代码创建 bundle。  
最合适的方法：每个 HTML 文档只使用一个入口起点。

## 输出(output)
用法(Usage)
在 webpack 中配置 output 属性的最低要求是，将它的值设置为一个对象，包括以下两点：

1. **filename**   用于输出文件的文件名。
2. **目标输出目录**  path 的绝对路径。

webpack.config.js    

    const config = {
      output: {
        filename: 'bundle.js',
        path: '/home/proj/public/assets'
      }
    };
    module.exports = config;
此配置将一个单独的 bundle.js 文件输出到 /home/proj/public/assets 目录中

多个入口起点   

    {
      entry: {
        app: './src/app.js',
        search: './src/search.js'
      },
      output: {
        filename: '[name].js',
        path: __dirname + '/dist'
      }
    }

高级进阶
以下是使用 **CDN** 和资源 **hash** 的复杂示例：

config.js

    output: {
      path: "/home/proj/cdn/assets/[hash]",
      publicPath: "http://cdn.example.com/assets/[hash]/"
    }
在编译时不知道最终输出文件的 publicPath 的情况下，publicPath 可以留空，并且在入口起点文件运行时动态设置。如果你在编译时不知道 publicPath，你可以先忽略它，并且在入口起点设置 __webpack_public_path__。

    __webpack_public_path__ = myRuntimePublicPath

    // 剩余的应用程序入口

## 模式(mode)
区分开发环境和生产环境，方便开发调试和上线部署

mode: development

    // webpack.development.config.js
    module.exports = {
    + mode: 'development'
    - plugins: [
    -   new webpack.NamedModulesPlugin(),
    -   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
    - ]
    }

mode: production

    // webpack.production.config.js
    module.exports = {
    +  mode: 'production',
    -  plugins: [
    -    new UglifyJsPlugin(/* ... */),
    -    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
    -    new webpack.optimize.ModuleConcatenationPlugin(),
    -    new webpack.NoEmitOnErrorsPlugin()
    -  ]
    }

## 使用环境变量
要在开发和生产构建之间，消除 webpack.config.js 的差异，需要环境变量。

webpack 命令行环境配置中，通过设置 --env 可以使你根据需要，传入尽可能多的环境变量。在 webpack.config.js 文件中可以访问到这些环境变量。例如，--env.production 或 --env.NODE_ENV=local（NODE_ENV 通常约定用于定义环境类型，查看这里）。

    webpack --env.NODE_ENV=local --env.production --progress
  
module.exports 指向配置对象。    
要使用 env 变量，你必须将 module.exports 转换成一个函数：

webpack.config.js

    module.exports = env => {
      // Use env.<YOUR VARIABLE> here:
      console.log('NODE_ENV: ', env.NODE_ENV) // 'local'
      console.log('Production: ', env.production) // true

      return {
        entry: './src/index.js',
        output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, 'dist')
        }
      }
    }

## loader

loader 用于对模块的源代码进行转换。   
loader 可以使你在 import 或"加载"模块时预处理文件。    
loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。    
loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！

示例
例如，你可以使用 loader 告诉 webpack 加载 CSS 文件，或者将 TypeScript 转为 JavaScript。为此，首先安装相对应的 loader：

    npm install --save-dev css-loader
    npm install --save-dev ts-loader
然后指示 webpack 对每个 .css 使用 css-loader，以及对所有 .ts 文件使用 ts-loader：

webpack.config.js

    module.exports = {
      module: {
        rules: [
          { test: /\.css$/, use: 'css-loader' },
          { test: /\.ts$/, use: 'ts-loader' }
        ]
      }
    };
## 使用 loader    
在你的应用程序中，有三种使用 loader 的方式：

1. 配置（推荐）：在 webpack.config.js 文件中指定 loader。
2. 内联：在每个 import 语句中显式指定 loader。
3. CLI：在 shell 命令中指定它们。
## 配置[Configuration]
module.rules 允许你在 webpack 配置中指定多个 loader。 这是展示 loader 的一种简明方式，并且有助于使代码变得简洁。同时让你对各个 loader 有个全局概览：
```
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }
      ]
    }
  ]
}
```
## 内联
可以在 import 语句或任何等效于 "import" 的方式中指定 loader。使用 ! 将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。

    import Styles from 'style-loader!css-loader?modules!./styles.css';
通过前置所有规则及使用 !，可以对应覆盖到配置中的任意 loader。

选项可以传递查询参数，例如 ?key=value&foo=bar，或者一个 JSON 对象，例如 ?{"key":"value","foo":"bar"}。

尽可能使用 module.rules，因为这样可以减少源码中的代码量，并且可以在出错时，更快地调试和定位 loader 中的问题。
## CLI
你也可以通过 CLI 使用 loader：

    webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
这会对 .jade 文件使用 jade-loader，对 .css 文件使用 style-loader 和 css-loader。

## loader 特性
    loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的loader 将按照相反的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript。
    loader 可以是同步的，也可以是异步的。
    loader 运行在 Node.js 中，并且能够执行任何可能的操作。
    loader 接收查询参数。用于对 loader 传递配置。
    loader 也能够使用 options 对象进行配置。
    除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader，做法是在 package.json 里定义一个 loader 字段。
    插件(plugin)可以为 loader 带来更多特性。
    loader 能够产生额外的任意文件。
    loader 通过（loader）预处理函数，为 JavaScript 生态系统提供了更多能力。 用户现在可以更加灵活地引入细粒度逻辑，例如压缩、打包、语言翻译和其他更多。

## 解析 loader
loader 遵循标准的模块解析。多数情况下，loader 将从模块路径（通常将模块路径认为是 npm install, node_modules）解析。

## 插件(plugins)

插件是 wepback 的支柱功能，是更强大的 loader。

## 剖析
webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler（编译器）调用，并且 compiler 对象可在整个编译生命周期访问。

eg: ConsoleLogOnBuildWebpackPlugin.js

    const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

    class ConsoleLogOnBuildWebpackPlugin {
        apply(compiler) {
            compiler.hooks.run.tap(pluginName, compilation => {
                console.log("webpack 构建过程开始！");
            });
        }
    }
compiler hook 的 tap 方法的第一个参数，应该是驼峰式命名的插件名称。建议为此使用一个常量，以便它可以在所有 hook 中复用。

## 用法
由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入 new 实例。

根据你的 webpack 用法，这里有多种方式使用插件。

## 配置
webpack.config.js

    const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
    const webpack = require('webpack'); //访问内置的插件
    const path = require('path');

    const config = {
      entry: './path/to/my/entry/file.js',
      output: {
        filename: 'my-first-webpack.bundle.js',
        path: path.resolve(__dirname, 'dist')
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            use: 'babel-loader'
          }
        ]
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({template: './src/index.html'})
      ]
    };

    module.exports = config;

## 模块解析(module resolution)

resolver 是一个库(library)，用于帮助找到模块的绝对路径。一个模块可以作为另一个模块的依赖模块，然后被后者引用，如下：

    import foo from 'path/to/module'
    // 或者
    require('path/to/module')
所依赖的模块可以是来自应用程序代码或第三方的库(library)。resolver 帮助 webpack 找到 bundle 中需要引入的模块代码，这些代码在包含在每个 require/import 语句中。 当打包模块时，webpack 使用 enhanced-resolve 来解析文件路径

webpack 中的解析规则
使用 enhanced-resolve，webpack 能够解析三种文件路径：

    绝对路径
    import "/home/me/file";

    import "C:\\Users\\me\\file";
由于我们已经取得文件的绝对路径，因此不需要进一步再做解析。

    相对路径
    import "../src/file1";
    import "./file2";
在这种情况下，使用 import 或 require 的资源文件(resource file)所在的目录被认为是上下文目录(context directory)。在 import/require 中给定的相对路径，会添加此上下文路径(context path)，以产生模块的绝对路径(absolute path)。

    模块路径
    import "module";
    import "module/lib/file";
模块将在 resolve.modules 中指定的所有目录内搜索。 你可以替换初始模块路径，此替换路径通过使用 resolve.alias 配置选项来创建一个别名。


未完待续…………

#### 参考链接
1. https://webpack.docschina.org/guides/getting-started/
2. https://webpack.docschina.org/concepts/