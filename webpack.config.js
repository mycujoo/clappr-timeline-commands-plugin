var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

var plugins = [
    new Clean(['dist'])
];

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    plugins: plugins,
    externals: {
        clappr: 'Clappr',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    compact: true,
                }
            },
        ],
    },
    resolve: {
        extensions: ['', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'clappr-timeline-events-plugin.js',
        library: 'ClapprTimelineEventsPlugin',
        libraryTarget: 'umd',
    },
};