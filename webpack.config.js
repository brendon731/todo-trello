const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")
const webpack = require("webpack")
module.exports = {

    entry:"./js/app.js",
    output:{
        filename:"bundle.js",
        path:__dirname + "/dist",
        clean:true
    },
    module:{
        rules:[
            {
            test:/\.css$/,
             use:[
                MiniCssExtractPlugin.loader,
                 "css-loader"
                ]
            }
        ]
    },
    optimization:{
        minimize:true,
        minimizer:[
            new CssMinimizerWebpackPlugin(),
            "..."
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:"index.html",
            filename:"index.html",
            hash:true
        }),
        new MiniCssExtractPlugin({
            filename:"style.css"
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
        
    ],
    devServer:{
        static:path.resolve(__dirname, "dist"),
        port: 3000,
    }

}