const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'moonbit.es.min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'module',
  },
  experiments: {
    outputModule: true,
  },
};

