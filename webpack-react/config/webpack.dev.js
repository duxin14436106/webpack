const path = require('path');
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const getStyleLoader = (loader) => {
    return [
        "style-loader",
        "css-loader", 
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
        loader
    ].filter(Boolean)
}
module.exports =  {
    entry: './src/main.js',
    output : {
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]'
    },
    module: {
        rules: [
        //css
            {
                test: /\.css$/,
                use: getStyleLoader()
            },
            {
                test: /\.less$/,
                use: getStyleLoader('less-loader')
            },
            {
                test: /\.s[a|c]ss&/,
                use: getStyleLoader('sass-loader')
            },
            {
                test: /\.styl$/,
                use: getStyleLoader('stylus-loader')
            },
            // 其他资源 字符
            {
                test: /\.(woff3?|ttf)$/,
                type: 'asset/resource'
            },
             //img
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                }
            },
            //js/
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, '../src'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        'react-refresh/babel' // 激活HRM效果
                    ]
                }
            }
        ]
    },
      //html
      plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname,'../src'),
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),
        new ReactRefreshWebpackPlugin()
    ],
    mode: 'development',
    devtool: 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint}`
        }
    },
    resolve: {
        // 自动补全文件扩展名
        extensions: [".jsx", ".js", ".json"]
    },
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器的端口号
        open: true, // 是否自动打开浏览器
        hot: true
    },
}