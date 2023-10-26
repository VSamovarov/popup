const path = require('path')
const FileManagerPlugin = require('filemanager-webpack-plugin')

const config = {
  entry: {
    app: path.resolve(__dirname, 'src', 'index.js')
  },
  output: {
    filename: 'popup.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            comments: false
          }
        }
      }
    ]
  },
  devServer: {
    hot: true,
    static:
      [
        {
          directory: path.join(__dirname, 'examples')
        },
        {
          directory: path.join(__dirname, 'dist')
        }
      ],
    watchFiles: path.join(__dirname, 'src')
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ['dist']
        }
      }
    })
  ]
}
module.exports = (env, argv) => {
  console.log(argv)
  if (argv.mode === 'development') {
    config.devtool = 'source-map'
  }
  return config
}
