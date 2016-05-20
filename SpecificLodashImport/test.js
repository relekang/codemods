import test from 'ava';

import { generateTest } from '../test-utils';
import SpecificLodashImport from './';

test(...generateTest('SpecificLodashImport', SpecificLodashImport, 'with-chain'));
test(...generateTest('SpecificLodashImport', SpecificLodashImport, 'without-chain'));
