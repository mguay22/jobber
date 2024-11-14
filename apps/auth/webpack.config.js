const { join } = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('../../webpack.app.config');

module.exports = merge(commonConfig, {
  output: {
    path: join(__dirname, '../../dist/apps/auth'),
  },
});
