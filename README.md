webpack5 练习
webpack4 和 5 的区别
1. 自动清除打包后的dist文件夹
  a. webpack4 需要下载插件 claen-webpack-plugin
// npm i clean-webpack-plugin -D
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// 调用插件

plugins: [
  //....其他plugin  
  // 最后一行 清除dist文件
  new CleanWebpackPlugin()
]

  b. webpack5  不需要下载插件 仅需在output对象中添加clean: true即可
   // 输出
    output: {
        path: path.resolve(
            __dirname, "dist" // 绝对路径
        ),
        filename: 'static/js/main.js',
        // 自动清空上次打包的内容
        // 原理： 在打包前 将path整个目录内容清空
        clean: true
    },

 npx webpack serve  --config ./config/webpack.dev.js 
表示执行node_module 中的webpack文件  启动serve服务 
--config 表示配置文件在哪里
./config/...  表示执行的哪个配置文件
 "browserslist": [
   // 并集内容
    "last 2 version", // 市面上存在的浏览器的最后两个版本
    "> 1%",//99%的浏览器
    "not dead" // 还存活的浏览器
  ]



## 优化
1. 提升开发体验
  a. SourceMap
    ⅰ. 为什么
      1. 通过webpage打包后，当程序报错时，浏览器报错行数为打包后的行数，并不准确，以至于无法定位问题
    ⅱ. 是什么
      1. 源代码映射，是用来生成源代码构建后代码一一映射的文件的方案
      2. 会生成一个xxx.map文件，包含源代码和构建后代码每一行，每一列的映射关系，当构建后代码出错了，会通过xxx.map文件，从构建后的出错位置找到出错的位置，从而定位
    ⅲ. 怎么用（Devtool）
      1. 开发环境
        a. 使用 cheap-module-source-map
        b. 优点：打包编译速度快，只包含行映射
        c. 缺点：没有列映射
        d. 在配置文件加一行
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map'
}
      2. 生产环境
        a. source-map
        b. 优点：包含行/列映射
        c. 打包编译速度更慢
module.exports = {
  mode: 'production',
  devtool: 'source-map'
}
2. 提升打包构建速度
  a. HotModuleReplacement（HMR / 热更新）
    ⅰ. 为什么
      1. 开发过程中修改了其中模块  重新构建速度也很慢 若是修改哪个模块 就只重新打包编译哪个模块 其他模块不变  这样速度会更快
    ⅱ. 是什么
      1. HMR 热更新
    ⅲ. 怎么用
 devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器的端口号
        open: true, // 是否自动打开浏览器
        hot: true // 仅支持css热更新
    },
if(module.hot) {
    module.hot.accept('./js/sum.js') // 引入哪个文件才能hot哪个文件
}

ps: 在项目中 会有框架自己的loader自己处理： vue有 vue-loader react有react-loacer
  b. oneOf
    ⅰ. 为什么
      1. 在webpack对文件打包或者构建的时候，都会将rules里所有的规则都过一遍，这样会影响构建性能，因为单个文件只会匹配rules里的单条规则，匹配上了就没必要继续匹配，所以这里就用到了oneOf来处理这个问题。
    ⅱ. 是什么
      1. 避免每个loader都过一遍
    ⅲ. 怎么用
   // 加载器
    module: {
        rules:[
            // loader 的配置
            {
                oneOf: [
                      {
                          test: /\.css$/,
                          use: getStyleLoader()
                      }, 
                  ]
            }
          ]
    }
  c. Include/Exclude
    ⅰ. 为什么
      1. 开发时我们需要使用第三方库或插件，这些文件都是下载到node_modules中，而这些文件是不需要编译就可以使用的，所以在对js文件处理时，要排除node_modules中的文件
    ⅱ. 是什么
      1. include 包含   只处理xxx文件
      2. exclude 排除  除了xxx文件以外的文件都处理
    ⅲ. 怎么用
   module: {
        rules:[
            // loader 的配置
            {
                oneOf: [
                  {
                    test: /\.js$/,
                    // include exclude 只需要写一种  否则有问题
                    // exclude: /node_modules/,  // node_modules中的js文件不处理
                    include: path.resolve(__dirname,'../src'), // 只处理src下面的js
                    use: {
                      loader: 'babel-loader'
                    }
                  }
                 ]
            }
          ]
    } 


 plugins: [
        // plugin 的配置
        new ESLintWebpackPlugin({
            // 检测哪些文件
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_module' // 默认值  不加也是默认的
        }),
    ],
  d. cache
    ⅰ. 为什么
      1. 每次打包的时候都会经过eslint babel 编译 很慢，若是之前的加上缓存 第二次打包就会很快  
    ⅱ. 是什么
      1. 对eslint 和babel过的文件加上缓存
    ⅲ. 怎么用
plugins: [
     
        new ESLintWebpackPlugin({
            // 检测哪些文件
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_module', // 默认值  不加也是默认的
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.esklitcache')
        })
    ],
  e. Thead
    ⅰ. 为什么
      1. 提升打包js的速度 就是提升eslint babel Terser三个工具，可以开启多进程进行处理js文件 这样速度就比之前更快了 
    ⅱ. 是什么
      1. 多进程打包：开启电脑的多个进程同时干一件事，速度更快
      2. 注意 仅在耗时的操作中使用，因为每个进程启动就有大约为600ms左右开销
    ⅲ. 怎么用
      1. 启用进程的数量就是CPU的核数
        a. 如何获取？
const os = require('os')
const threads = os.cups().lenghth
3. 减少代码体积
  a. Tree Shaking
    ⅰ. 为什么
      1. 引入无用的代码 体积会太大
    ⅱ. 是什么
      1. 术语 ，可以移除js中没有使用的代码（就是摇掉无用的代码）
    ⅲ. 怎么用
      1. webpack 默认开启，无需配置
  b. babel
    ⅰ. 为什么
      1. babel为编译的文件都插入了辅助代码 ，使体积过大，比如Babel对一些公共方法使用了很小的辅助代码，默认情况下会用一次引入一次
      2. 可以将这个抽离出来一个独立的模块，来避免重复引入
    ⅱ. 是什么
      1. @babel/plugin-transform-runtime : 禁用了babel自动对每个文件的runtime注入，而是引入
      2. 并且使所有辅助代码都从这里引用
    ⅲ. 怎么用
      1. npm i @babel/plugin-transform-runtime -D
  c. ImageMinimizerPlugin
4. 优化代码运行性能
  a. Code Split
    ⅰ. 为什么
      1. 打包代码时候会将js全部打包到一个文件中，体积太大了，若是只渲染首页，应该只加载首页js文件就行
      2. 所以可以进行分割，生成多个js文件，这样加载资源就少，速度就会更快
    ⅱ. 是什么
      1. 主要做两件事：
        a. 分割文件：将打包生成的文件进行分割，生成多个js文件
        b. 按需加载，需要哪个文件就加载哪个文件
    ⅲ. 怎么用
      1. 多入口
        a. entry: {}
        b. 多入口按需加载
        c. import 动态导入，会将动态导入的文件代码分割（拆分成单独模块），需要的时候自动加载
      2. 单入口
  b. Preload / prefetch
    ⅰ. 为什么
      1. 按需加载会在需要时再加载 但是项目过大情况下， 用户会感觉加载慢，所以需要浏览器在空闲时间内 偷偷加载资源 （不执行）
    ⅱ. 是什么
      1. Preload  立即加载资源
      2. prefetch  告诉浏览器空闲时候才开始加载资源
        a. 共同点：只加载不执行；都有缓存
        b. 区别：preload 加载优先级高，prefetch 加载优先级低
preload 只能加载当前页面需要使用的资源
prefetch 可以加载当前页面资源，也可以加载下一个页面的资源
c. 当前页面优先级高的资源用Preload加载
    下一个页需要使用的用prefetch加载
兼容性都不好（can I use? 可以查兼容性）
    ⅲ. 怎么用
  c. Network Cache
  d. Core-js
    ⅰ. 为什么
      1. 处理async promise includes 兼容性问题
    ⅱ. 是什么
      1. core.js是专门用来处理es6以上的API的polyfill
      2. polyfill 翻译过来就是叫垫片/补丁。可以兼容
    ⅲ. 怎么用
  e. PWA
    ⅰ. 为什么
      1. 项目一旦处于离线 就无法访问
    ⅱ. 是什么
      1. 渐进式网络应用程序，是一种可以提供类似于native app （原生应用程序）体验的web app 的技术
      2. 最重要的就是 在离线状态下能够继续运行功能
      3. 通过service worker
    ⅲ. 怎么用
      1. npm i workbox-webpack-plugin -D
