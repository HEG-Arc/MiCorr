const path = require('path');

module.exports = {
  entry: './scripts/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
    mode: 'development'
};
