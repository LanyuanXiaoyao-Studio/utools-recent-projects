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
    filename: 'utools-recent-projects.js',
    library: 'utoolsRecentProjects',
    libraryTarget: 'umd',
  },
}
