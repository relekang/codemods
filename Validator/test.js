import test from 'ava';

import { generateTest } from '../test-utils';
import Validator from './';

test.skip(...generateTest('Validator', Validator));
