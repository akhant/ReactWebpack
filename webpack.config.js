var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        app: ['./src/index.js']
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                
                use: [ 'style-loader', 'css-loader' ]
              },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                      loader: 'babel-loader',
                      options: {
                        presets: ['react', 'es2015', "stage-0"]
                      }
                    }
                  ],
                
            },
            /* {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            }, */
            {
                test: /\.(svg|ttf|woff|woff2|eot)(\?v=\d+\.\d\.\d+)?$/,
                
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "HAR Viewer RD2D2"
        })
        
    ],
    devtool: 'source-map'
}