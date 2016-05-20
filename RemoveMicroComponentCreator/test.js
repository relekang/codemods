import test from 'ava';

import { generateTest } from '../test-utils';
import RemoveMicroComponentCreator from './';

test(...generateTest('RemoveMicroComponentCreator', RemoveMicroComponentCreator));
