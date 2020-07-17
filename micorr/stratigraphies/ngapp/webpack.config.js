const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../static/micorr/dist')
    },
    mode: 'development',
    target: 'web',
    devtool: 'source-map',
    module:
            {
            rules: [
                {
                    /* Here we use CommonJS style import with webpack import-loader to turn around this/window test issue in svg.js
                     module export code ( see https://github.com/svgdotjs/svg.js/issues/767 ) */
                    //const SVG = require("imports-loader?define=>false!../dependencies/svg.js");
                  test: require.resolve("svg.js"),
                  use: "imports-loader?define=>false"
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|nodeServices)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                },
                {test: /\.html$/, loader: "html-loader"},
                {test: /\.css$/, loader: "style!css"}
            ]
        },
    plugins: [
        // build optimization plugins
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            WEBPACK_TARGET: "web",
        }),
         new webpack.IgnorePlugin(/datauri/)
      /*  new webpack.node.NodeSourcePlugin({
            name: 'vendor',
            filename: 'vendor-[hash].min.js',
        })*/
    ],
    node: {
        fs: "empty"
    }
};

