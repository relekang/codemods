/* eslint-disable no-console */
const Runner = require('jscodeshift/dist/Runner');
const chalk = require('chalk');
const { omit } = require('lodash');
const { resolve } = require('path');

module.exports = args => {
  console.log(chalk.green(chalk.bold(`Transforming using '${args.transform}' ✌`)));
  const options = Object.assign({ quote: 'single' }, omit(args, ['_', 'transform', 'path']));
  Runner.run(resolve(__dirname, `./${args.transform}/index.js`), args.path, options);
};
