const webpack = require('webpack')
const merge = require('webpack-merge')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const TARGET = process.env.NODE_ENV
const isProd = TARGET === 'production'
const config = {}

config.common = {
  context: __dirname + '/src/script',
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.NoEmitOnErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: isProd,
      compress: true,
      parallel: {
        cache: true,
        workers: 4,
      },
      output: {
        comments: !isProd,
        beautify: !isProd,
      },
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx'],
    alias: {
      app: __dirname + '/src/script/app',
    },
  },
}

config.test = merge(config.common, {
  devtool: 'cheap-module-eval-source-map',
  externals: {
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: ['node_modules'],
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' },
        ],
      },
    ],
  },
})

config.production = merge(config.common, {
  entry: {
    app: __dirname + '/src/script/app/index.tsx',
    vendor: [
      'react',
      'react-dom',
    ],
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public/js',
    jsonpFunction: 'vendor',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: ['node_modules', /\.test\.tsx?$/],
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' },
        ],
      },
    ],
  },
})

config.development = merge(config.production, {
  devtool: 'cheap-module-eval-source-map',
  output: {
    pathinfo: true,
  },
  stats: {
    errorDetails: true,
    colors: true,
  },
  watch: true,
})

module.exports = config[TARGET]
