const path = require("path");

module.exports = {
    // devServer: {
    //     contentBase: path.resolve(__dirname, "./src"),
    //     historyApiFallback: true,
    // },
    entry: {
        main: "./static/js/App.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
            },
        ],
    },
    output: {
        path: __dirname + '/static/dist',
        filename: "[name].bundle.js",
    },
};
