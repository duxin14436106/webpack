const os = require("os");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// MiniCssExtractPlugin.loader 会将文件提取成一个文件
const path = require("path"); // node的核心模块，专门处理路径问题

const TerserWebpackPlugin = require('terser-webpack-plugin');
const { EntryPlugin } = require("webpack");
const threads = os.cpus().length

function getStyleLoader(pre) {
    return [
        MiniCssExtractPlugin.loader, //将js中css通过创建style标签添加hrml文件中生效
        "css-loader", // 将css资源编译成commonjs的模块到js中 
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                plugins: [
                "postcss-preset-env", // 能解决大多数样式兼容性问题
                ]
                }
            }
        },
        pre
    ].filter(Boolean)
}

module.exports = {
    //入口
        entry: './src/main.js', //相对路径
    
    // 输出
    output: {
        // 所有文件的输出路径
        // __dirname是nodejs的变量，代表当前文件的文件夹目录
        path: path.resolve(
            __dirname, "../dist" // 绝对路径
        ),
        // 输出文件的目录及目录名
        filename: 'static/js/main.[contenthash:10].js', // 入口文件
        chunkFilename: 'static/js/[name].[contenthash:10].js', // 给打包输出的其他文件的名字
        assetModuleFilename: 'static/images/[hash:10][ext][query]',
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
                use: getStyleLoader()
            }, 
            {
                test: /\.less$/,
                // loader: 'less-loader' // 字符串形式 ，只能使用一个loader
                use:  getStyleLoader("less-loader") // 解析less代码
            }, 
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoader("sass-loader") //解析sass代码
            }, 
            {
                test: /\.styl$/,
                use: getStyleLoader("stylus-loader") // 解析sass代码
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
                // generator: {
                //     /**
                //      * [hash:10] 表示截取hash值前10位
                //      * [ext] 后缀名  打包前是什么 打包后是什么
                //      * [query] ？ 后面的参数
                //      */
                //     filename: 'static/images/[hash:10][ext][query]',
                //   },
            },
            {
                test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
                type: 'asset/resource',
                // generator: {
                //     filename: 'static/media/[hash:10][ext][query]',
                // }
            }, 
            {
                test: /\.js$/,
                // include exclude 只需要写一种  否则有问题
                // exclude: /node_modules/,  // node_modules中的js文件不处理
                include: path.resolve(__dirname,'../src'), // 只处理src下面的js
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
            ]}
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
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.esklitcache'),
            threads // 开启多进程
        }),
        new MiniCssExtractPlugin({
            filename: '../dist/static/css/main.[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10]..css'
        }),
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin({
            parallel: threads
        }),
        new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              options: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                //   ["gifsicle", { interlaced: true }],
                //   ["jpegtran", { progressive: true }],
                //   ["optipng", { optimizationLevel: 5 }]
                ],
              },
            },
          }),
    ],
    optimization: {
        // splitChunks: {
        //     chunks: 'all'
        // },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint}`
        }
    },
    mode: "production",
    devtool: 'source-map'
}