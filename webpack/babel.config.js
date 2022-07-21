module.exports = {
    // 解析es6语法
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: "usege", //按需加载自动引入
                corejs: 3
            }
        ]
    ]
}