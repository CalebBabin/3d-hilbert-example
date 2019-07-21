const Path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    mode: 'production',
    entry: {
        bundle: Path.resolve(__dirname, 'src/main.js'),
    },
    devtool: 'source-map',
    output: {
        filename:'[name].js',
        path:  Path.resolve(__dirname, 'docs/')
    },
    resolve: {
        modules: [
            Path.resolve('./src'),
            Path.resolve('./node_modules'),
        ]
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: false,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
            }),
        ]
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
}