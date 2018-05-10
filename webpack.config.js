const path = require('path');


module.exports = {
  // the entry file for the bundle
  entry: path.join(__dirname, '/client/App.jsx'),

  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, '/server/compiled'),
    filename: 'app.js',
  },

  module: {

    // apply loaders to files that meet given conditions
    rules: [
      {
      test: /\.jsx?$/,
      include: path.join(__dirname, '/client'),
      loader: 'babel-loader',
      query: {
        presets: ["react", "es2015"]
      }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [ 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ],
  },
  resolve: {
    extensions: [ '.js', '.css', '.jpg', '.png' ]
  },

  // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
  watch: false
};
