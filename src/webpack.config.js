var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');


module.exports = {
    entry: path.join(__dirname, "js/app/index.js"),//__dirname，当前文件所在路径。path拼接后的路径为绝对路径
    output: {
        path: path.join(__dirname, "../public"),
        filename: "js/index.js"
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "less-loader", "postcss-loader"]
                }) //把 css 抽离出来生成一个文件， style.css 也看成是一个模块，然后用 css-loader 来读取它，再用 style-loader 把它插入到页面中。
        }]
    },
    resolve: {//webpack预编译时，就加载进整个webpack编译的配置中的
        alias: {//一般情况下，require的时候先从node_modulles下面找，alias就是一些例外，相当于requireJs里面config里配置的paths
            jquery: path.join(__dirname, "js/lib/jquery-2.2.0.min.js"),
            mod: path.join(__dirname, "js/mod"),
            less: path.join(__dirname, "less")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        new ExtractTextPlugin("css/index.css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer(),
                ]
            }
        })
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     output: {
        //         comments: false,
        //     },
        // }),
    ]
};