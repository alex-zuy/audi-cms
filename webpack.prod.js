const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(require('./webpack.common'), {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                warnings: 'verbose'
            }
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano')({
                preset: ['default', {
                    discardComments: {
                        removeAll: true,
                    },
                }]
            }),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            }
        })
    ],
    devtool: 'source-map'
});
