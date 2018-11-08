const path = require('path');

module.exports = {
  entry: './src/global/scripts/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', 'js']
  },
  watch:true,
  output: {
    filename: 'scripts.js',
    path: path.resolve(__dirname, '../docs/homework-8(client)/')
  },
  mode: 'development'
};