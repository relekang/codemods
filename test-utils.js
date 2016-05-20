import fs from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import * as diff from 'diff';
import chalk from 'chalk';

const readFile = Promise.promisify(fs.readFile);
const fixturesPath = name => join(__dirname, name, 'fixtures');

function getDiff(parts) {
  return parts.map(part => {
    const color = part.added ? 'green' : part.removed ? 'red' : 'grey'; // eslint-disable-line no-nested-ternary, max-len
    return chalk[color](part.value);
  }).join('  ');
}

export function generateTest(transformName, transform, testName) {
  let fixtureName = `${fixturesPath(transformName)}/`;
  if (testName) {
    fixtureName = `${fixturesPath(transformName)}/${testName}.`;
  }

  return [testName || 'default', async t => {
    const jscodeshift = require('jscodeshift'); // eslint-disable-line global-require
    const path = `${fixtureName}input.js`;
    const source = await readFile(path, 'utf8');
    const expected = await readFile(`${fixtureName}output.js`, 'utf8');

    const output = transform({ path, source }, { jscodeshift }, { quote: 'single' });

    t.is(output, expected, getDiff(diff.diffLines(expected, output)));
  }];
}
