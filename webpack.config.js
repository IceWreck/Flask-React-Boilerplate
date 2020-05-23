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
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                loader: 'file-loader',

                options: {
                    name: '[name].[ext]',
                    outputPath: '../../static/dist'
                }
            }
        ],
    },
    output: {
        path: __dirname + '/static/dist',
        filename: "[name].bundle.js",
    },
};
