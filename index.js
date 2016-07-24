/* eslint-disable no-console */
const resolve = require('path').resolve;
const cli = require('jscodeshift').cli;

const pkg = require('./package.json');

cli({
  name: 'rcm',
  packageVersion: pkg.info,
  options: { quote: 'single' },
  resolve(name) {
    return resolve(__dirname, `./${name}/index.js`);
  },
});
