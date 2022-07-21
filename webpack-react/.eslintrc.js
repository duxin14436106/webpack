module.exports = {
    // 继承ESLint规则
    extends: ["react-app"],
    parserOptions: {
        presets: [
            ["babel-preset-react-app", false],
            "babel-preset-react-app/prod"
        ]
    }
}