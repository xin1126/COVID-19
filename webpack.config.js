const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './js/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      // {
      //   test: /\.(png|jpg|gif|jpe?g|svg)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name]-[hash].[ext]',
      //         publicPath: './img',
      //         outputPath: './img',
      //       },
      //     },
      //     {
      //       loader: 'image-webpack-loader',
      //       options: {
      //         bypassOnDebug: true,
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../src/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: '../src/taiwan.html',
      filename: 'taiwan.html',
    }),
    new HtmlWebpackPlugin({
      template: '../src/world.html',
      filename: 'world.html',
    }),
  ],
};
