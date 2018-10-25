const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require("webpack-livereload-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');

let production = process.env.NODE_ENV === "production" ? true : false;
production ? console.log("Enable production mode.") : null;

module.exports = {

    entry: {
        main: [
            './app/main.js',
            './resources/scss/main.scss'
        ]
    },

    output: {
        path: __dirname + '/dist/',
        filename: 'js/[name].js'
    },

    optimization: {
        minimizer: production ? [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ] : []
    },

    watchOptions: {
        aggregateTimeout: 300
    },

    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        },

            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: function () {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                includePaths: [
                                    path.resolve(__dirname, "./node_modules/foundation-sites"),
                                    path.resolve(__dirname, "./node_modules/@fortawesome/fontawesome-free-webfonts"),
                                    path.resolve(__dirname + "/resources/images")
                                ]
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
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
                test: /\.eot|ttf|woff|woff2|svg$/,
                loader: "file-loader",
                options: {
                    name: "../fonts/[name].[ext]"
                },
                include: [
                    path.resolve(__dirname + "/resources/fonts"),
                    path.resolve(__dirname + "/node_modules/@fortawesome/fontawesome-free-webfonts")
                ]
            },

            {
                test: /\.js/,
                loader: "babel-loader",
                exclude: /node_modues/
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin("css/[name].css"),
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