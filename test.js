import test from 'ava';
import fs from 'fs';
import { join } from 'path';
import Promise from 'bluebird';

import NamedExports from './src/NamedExports';

const readFile = Promise.promisify(fs.readFile);
const fixturesPath = join(__dirname, 'test-fixtures');

export function generateTest(transformName, transform, testName) {
  let name = transformName;
  if (testName) {
    name = `${transformName}/${testName}`;
  }

  return [name, async t => {
    const jscodeshift = require('jscodeshift'); // eslint-disable-line global-require
    const path = `${fixturesPath}/${name}.input.js`;
    const source = await readFile(path, 'utf8');
    const expected = await readFile(`${fixturesPath}/${name}.output.js`, 'utf8');

    const output = transform({ path, source }, { jscodeshift }, { quote: 'single' });

    t.is(output, expected);
  }];
}

test(...generateTest('NamedExports', NamedExports, 'with-default-export'));
test(...generateTest('NamedExports', NamedExports, 'default-export-function'));
