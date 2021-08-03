const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: 'public', to: ''},
      ],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'preload.js',
  },
}
