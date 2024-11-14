const { join } = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('../../webpack.lib.config');

module.exports = merge(commonConfig, {
  output: {
    path: join(__dirname, '../../dist/libs/prisma'),
  },
});
