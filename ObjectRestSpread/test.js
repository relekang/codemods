import test from 'ava';

import { generateTest } from '../test-utils';
import ObjectRestSpread from './';

test(...generateTest('ObjectRestSpread', ObjectRestSpread));
