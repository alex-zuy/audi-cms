const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports = merge(require('./webpack.common'), {
    devtool: 'inline-cheap-source-map'
});
