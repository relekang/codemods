import test from 'ava';
import fs from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import * as diff from 'diff';
import chalk from 'chalk';

import NamedExports from './src/NamedExports';
import RemoveMicroComponentCreator from './src/RemoveMicroComponentCreator';

const readFile = Promise.promisify(fs.readFile);
const fixturesPath = join(__dirname, 'test-fixtures');

function getDiff(parts) {
  return parts.map(part => {
    const color = part.added ? 'green' : part.removed ? 'red' : 'grey'; // eslint-disable-line no-nested-ternary, max-len
    return chalk[color](part.value);
  }).join('  ');
}

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

    t.is(output, expected, printDiff(diff.diffLines(expected, output)));
  }];
}

test(...generateTest('NamedExports', NamedExports, 'with-default-export'));
test(...generateTest('NamedExports', NamedExports, 'default-export-function'));
test(...generateTest('RemoveMicroComponentCreator', RemoveMicroComponentCreator));
