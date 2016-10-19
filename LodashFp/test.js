import test from 'ava';

import { generateTest } from '../test-utils';
import LodashFp from './';

test(...generateTest('LodashFp', LodashFp));
