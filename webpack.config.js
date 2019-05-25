var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')

const VENDOR_LIBS = [
  "faker",
  "lodash",
  "react",
  "react-dom",
  "react-input-range",
  "react-redux",
  "react-router",
  "redux",
  "redux-form",
  "redux-thunk"
];

module.exports = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS

  },
  output: {
    path: path.join(__dirname, 'dist'),
    // [name] is a webpack "magic" setting
    // [chunkhash] gives the bundle a unique hash that will cause the browser to ignore it's cache
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      }
    ]
  },
  plugins: [
    // this tells webpack to look at the different entries, and if there are copies only add
    // them to the vendor output
    new webpack.optimize.CommonsChunkPlugin({
      // manifest.js lets the browser know if the vendor.js file has changed
      names: ['vendor', 'manifest']
    }),
    // automatically adds script tags built from webpack based off the template
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
