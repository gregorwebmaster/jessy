const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const production = process.env.NODE_ENV === "production";
production ? console.log("Enable production mode.") : console.log("Enable dev mode.");

module.exports = {

    entry: {
        main: [
            './app/main.js',
            './resources/scss/main.scss'
        ]
    },

    output: {
        path: __dirname + '/dist/js/',
        filename: '[name].js'
    },

    optimization: {
        minimizer: production ? [
            new UglifyJsPlugin(),
        ] : []
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: !production,
                            minimize: production
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !production,
                            plugins: () => [
                                require('precss'),
                                require('autoprefixer')
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: !production,
                            includePaths: [
                                path.resolve(__dirname, "./node_modules/foundation-sites"),
                                path.resolve(__dirname, "./node_modules/@fortawesome/fontawesome-free"),
                                path.resolve(__dirname + "/resources/images")
                            ]
                        }
                    }
                ]
            },

            {
                test: /\.png|jpe?g|gif$/,
                loaders: [{
                    loader: "file-loader",
                    options: {
                        name: "../images/[name].[ext]"
                    }
                },

                    "img-loader"
                ]
            },

            {
                test: /\.svg$/,
                loader: "file-loader",
                options: {
                    name: "../images/[name].[ext]"
                },
                include: [
                    path.resolve(__dirname + "./resources/images")
                ]
            },

            {
                test: /\.(eot|ttf|svg|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    limit: 50000,
                    name: "../fonts/[name].[ext]"
                }
            },

            {
                test: /\.js/,
                loader: "babel-loader",
                exclude: /node_modues/
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "../css/[name].css"
        }),
        new webpack.SourceMapDevToolPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new HtmlWebpackPlugin({
            chunks: ['main'],
            inject: 'head',
            template: path.resolve(__dirname + '/resources/templates/index.html'),
            filename: path.resolve(__dirname + '/dist/index.html')
        })
    ]
};