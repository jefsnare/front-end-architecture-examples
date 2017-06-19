const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const Handlebars = require('handlebars-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const extractCSS = new ExtractTextPlugin('./css/[name].css');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './entry.js'
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: "../",
    filename: 'js/[name].js'
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "$",
    "foundation": "Foundation"
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', {modules: false}]
            ]
          }
        }]
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        use: [{
          loader: 'file-loader?name=[path][name].[ext]'
        }]
      },
      {
        test: /\.((ttf|eot)(\?[0-9a-z]))|(ttf|eot)$/,
        use: [{
          loader: 'url-loader',
        }],
        exclude: /node_modules/
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                discardComments: {
                  removeAll: true
                }
              }
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              }
            }, {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  './node_modules/foundation-sites/scss/',
                  './node_modules/motion-ui/src',
                  './src/scss/'
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader?importLoaders=1"]
        })
      }
    ]
  },
  plugins: [
    extractCSS,
    new webpack.LoaderOptionsPlugin({
      options: {
        context: path.join(__dirname, 'src'),
        output: {
          path: path.join(__dirname, 'dist', 'css')
        },
        debug: true
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    //Development settings
    new BrowserSyncPlugin({
      proxy: 'localhost:8080'
    }),

    // //Production settings
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify('production')
    //   }
    // }),
  ]
};
