#!/usr/bin/env node
const argv = require('nomnom')
  .script('rcm')
  .options({
    transform: {
      position: 0,
      help: 'The transformer to use',
      required: true,
    },
    path: {
      position: 1,
      help: 'Files or directory to transform',
      list: true,
      metavar: 'FILE',
      required: true,
    },
    ignorePattern: {
      full: 'ignore',
      list: true,
    },
  })
  .parse();

require('./index.js')(argv);
