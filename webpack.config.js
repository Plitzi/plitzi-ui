const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const threadLoader = require('thread-loader');

const smp = new SpeedMeasurePlugin();

const PACKAGE = require('./package.json');

const DESTINATION = path.resolve(__dirname, './dist/');

const build = (env, args) => {
  const devMode = args.mode !== 'production';
  const onlyGzip = env.onlyGzip || false;
  const onlyAnalyze = env.onlyAnalyze || false;
  const watch = env.watch || false;
  const measure = env.measure || false;

  threadLoader.warmup(
    {
      poolTimeout: watch ? Infinity : 2000
    },
    [
      // modules to load
      // can be any module, i. e.
      'babel-loader',
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime'
    ]
  );

  let modules = {
    entry: { 'plitzi-ui': './src/index-webpack.js' },
    output: {
      path: DESTINATION,
      filename: '[name].js',
      chunkFilename: 'plitzi-ui-chunk-[name].js',
      library: 'PlitziUi',
      libraryTarget: 'umd',
      crossOriginLoading: 'anonymous',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      publicPath: 'auto'
    },
    watch,
    resolve: {
      symlinks: false,
      alias: {
        '@components': path.resolve('./src/components')
      }
    },
    target: 'web',
    devServer: {
      compress: false,
      hot: true,
      liveReload: false,
      historyApiFallback: true,
      allowedHosts: ['localhost'],
      static: {
        directory: path.join(__dirname, 'dist')
      },
      port: 4000
    },
    externals: { react: 'react', 'react-dom': 'react-dom', lodash: 'lodash' },
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'thread-loader',
              options: {
                poolTimeout: watch ? Infinity : 2000
              }
            },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]], // [classic] will disable new JSX compiler and [automatic] will enable it
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-transform-runtime',
                  devMode && 'react-refresh/babel'
                ].filter(Boolean)
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|...)$/,
          loader: 'url-loader',
          exclude: /(node_modules|bower_components)/
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/'
              }
            }
          ]
        },
        {
          test: /\.(sa|sc)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {}
            },
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: devMode
              }
            }
          ],
          exclude: /(node_modules|bower_components|\.module.(sa|sc|c)ss$)/
        },
        {
          test: /\.(c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {}
            },
            // 'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.module.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {}
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                modules: true
              }
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: devMode
              }
            }
          ],
          exclude: /(node_modules|bower_components)/
        },
        {
          resourceQuery: /loadAsUrl/,
          type: 'asset/resource',
          generator: {
            filename: 'css/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(PACKAGE.version)
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(es|pt|en).js/),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new CompressionPlugin({
        algorithm: 'gzip',
        filename: onlyGzip ? '[path][base]' : '[path][base].gz',
        deleteOriginalAssets: onlyGzip,
        test: /\.js$|\.css$|\.html$/,
        threshold: 0,
        minRatio: 0.8
      })
    ],
    stats: {
      colors: true
    }
  };

  if (devMode) {
    modules.devtool = 'source-map';
    if (env.WEBPACK_SERVE) {
      modules.plugins.push(new ReactRefreshWebpackPlugin());
    }
  } else {
    modules.plugins.push(new CleanWebpackPlugin());
    modules.optimization = {
      usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    };
  }

  if (onlyAnalyze) {
    modules.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 4000 }));
  }

  if (measure) {
    modules = smp.wrap(modules);
  }

  // https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
  modules.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'plitzi-ui-chunk-[name].css'
    })
  );

  return modules;
};

module.exports = [build];
