const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './webpack/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '/client/dist/bundle.js',
    publicPath: '/client/public'
  },  
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      crossOriginLoading: 'anonymous',
      inject: 'body',
    }),    
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/js', to: 'js' },
        // { from: 'public/css', to: 'css' }, // Remove this line
        { from: 'public/images', to: 'images' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[id].css',
    }),
  ],
  
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3001,
  },
};
