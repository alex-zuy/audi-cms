const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const EXTENSIONS = {
    FONTS: ['eot', 'ttf', 'woff', 'woff2']
};

const PATHS = {
    JS_SRC: 'app/assets/javascripts',
    JS_OUTPUT: 'public/javascripts',
    STYLESHEETS_SRC: 'app/assets/stylesheets',
    STYLESHEETS_OUTPUT: 'public/stylesheets',
    NODE_MODULES: 'node_modules'
};

const JS_OUTPUT_RELATIVE_PATHS = {
    STYLESHEETS_OUTPUT: path.relative(PATHS.JS_OUTPUT, PATHS.STYLESHEETS_OUTPUT),
};

module.exports = {
    entry: 'AppLauncher.js',
    output: {
        filename: 'bundle.js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, PATHS.JS_OUTPUT),
    },
    resolve: {
        modules: [
            PATHS.JS_SRC,
            PATHS.STYLESHEETS_SRC,
            PATHS.NODE_MODULES
        ],
        alias: {
            mui: path.resolve(PATHS.NODE_MODULES, 'material-ui/lib'),
        }
    },
    externals: {
        ymaps: 'ymaps'
    },
    plugins: [
        new CleanWebpackPlugin([
            PATHS.JS_OUTPUT,
            PATHS.STYLESHEETS_OUTPUT
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new ExtractTextPlugin({
            filename: path.join(JS_OUTPUT_RELATIVE_PATHS.STYLESHEETS_OUTPUT, 'styles.css'),
            allChunks: true
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(PATHS.NODE_MODULES, 'tinymce/skins'),
                to: path.join(JS_OUTPUT_RELATIVE_PATHS.STYLESHEETS_OUTPUT, 'tinymce/skins')
            },
            {
                from: path.join(PATHS.NODE_MODULES, 'materialize-css/dist/css'),
                to: path.join(JS_OUTPUT_RELATIVE_PATHS.STYLESHEETS_OUTPUT, 'materialize/css')
            },
            {
                from: path.join(PATHS.NODE_MODULES, 'materialize-css/dist/fonts'),
                to: path.join(JS_OUTPUT_RELATIVE_PATHS.STYLESHEETS_OUTPUT, 'materialize/fonts')
            }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015'],
                    plugins: ['syntax-dynamic-import']
                }
            },
            {
                test: /\.bundle\.js$/,
                use: {
                    loader: 'bundle-loader',
                    options: {
                        lazy: true,
                        name: '[name]'
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        },
                        'sass-loader'
                    ]
                })
            }
        ]
    }
};
