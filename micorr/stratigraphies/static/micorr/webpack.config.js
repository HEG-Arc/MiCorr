const path = require('path');

module.exports = {
    entry: './scripts/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    devtool: 'source-map',
    module:
        {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['babel-preset-env']
                        }
                    }
                },
                {test: /\.html$/, loader: "html"},
                {test: /\.css$/, loader: "style!css"}
            ]
        }
};
