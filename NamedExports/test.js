import test from 'ava';

import { generateTest } from '../test-utils';
import NamedExports from './';

test(...generateTest('NamedExports', NamedExports, 'with-default-export'));
test(...generateTest('NamedExports', NamedExports, 'default-export-function'));
