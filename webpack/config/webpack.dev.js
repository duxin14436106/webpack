const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path"); // node的核心模块，专门处理路径问题
const TerserWebpackPlugin = require('terser-webpack-plugin');
const os = require("os");
const threads = os.cpus().lenghth

module.exports = {
    //入口
        entry: './src/main.js', //相对路径
    
    // 输出
    output: {
        // 所有文件的输出路径
        // 开发模式没有输出
        path: undefined,
        // 输出文件的目录及目录名
        filename: 'static/js/main.js',
        // 自动清空上次打包的内容
        // 原理： 在打包前 将path整个目录内容清空
        clean: true
    },
    // 加载器
    module: {
        rules:[
            // loader 的配置
           {
            oneOf: [
                {
                    test: /\.css$/,
                    use: [
                        "style-loader", //将js中css通过创建style标签添加hrml文件中生效
                        "css-loader" // 将css资源编译成commonjs的模块到js中 
                    ]
                }, 
                {
                    test: /\.less$/,
                    // loader: 'less-loader' // 字符串形式 ，只能使用一个loader
                    use: [
                        "style-loader", //将js中css通过创建style标签添加hrml文件中生效
                        "css-loader", // 将css资源编译成commonjs的模块到js中 
                        "less-loader" // 解析less代码
                    ]
                }, 
                {
                    test: /\.s[ac]ss$/,
                    use: [
                        "style-loader", //将js中css通过创建style标签添加hrml文件中生效
                        "css-loader", // 将css资源编译成commonjs的模块到js中 
                        "sass-loader" // 解析sass代码
                    ]
                }, 
                {
                    test: /\.styl$/,
                    use: [
                        "style-loader", //将js中css通过创建style标签添加hrml文件中生效
                        "css-loader", // 将css资源编译成commonjs的模块到js中 
                        "stylus-loader" // 解析sass代码
                    ]
                }, 
                {
                    test: /\.(png|jpe?g|gif|webp|svg)$/,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            //  小于10kb的图片转成base64
                            //  优点：减少请求数量  缺点：体积会扩大三分之一
                            maxSize: 10 *1024
                        }
                    },
                    // 导出图片名称
                    generator: {
                        /**
                         * [hash:10] 表示截取hash值前10位
                         * [ext] 后缀名  打包前是什么 打包后是什么
                         * [query] ？ 后面的参数
                         */
                        filename: 'static/images/[hash:10][ext][query]',
                      },
                },
                {
                    test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/media/[hash:10][ext][query]',
                    }
                }, 
                {
                    test: /\.js$/,
                    exclude: /node_modules/,  // node_modules中的js文件不处理
                    use: [
                        {
                            loader: 'thread-loader', // 多进程loader
                            options: {
                                works: threads // 远程数量
                            }
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                               cacheDirectory: true, // 开启babel缓存
                               cacheCompression: false, // g关闭缓存文件压缩
                               plugins: ["@babel/plugin-transform-runtime"]
                            }
                          }
                    ]
                  }
            ]
           }
        ]
    },
    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        // plugin 的配置
        new ESLintWebpackPlugin({
            // 检测哪些文件
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_module', // 默认值  不加也是默认的
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.esklitcache')
        }),
        new TerserWebpackPlugin({
            parallel: threads
        })
    ],
    // 开发服务器：不会输出资源，在内存中编译打包的
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器的端口号
        open: true, // 是否自动打开浏览器
        hot: true
    },
    mode: "development",
    devtool: 'cheap-module-source-map'
}