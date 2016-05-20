# RemoveMicroComponentCreator

Written to remove usage of a helper that made it
possible to use micro components prior to React 0.14.

## Usage
```
$ rcm RemoveMicroComponentCreator <path>
```

From:
```es6
import microComponentCreator from './micro_component_creator';

export const SomeForm = microComponentCreator('SomeForm', props => (
  <form>
    <input name='field' value={props.value} />
  </form>
));
```

To:
```es6
export const SomeForm = props => (
  <form>
    <input name='field' value={props.value} />
  </form>
);
```
