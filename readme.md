# JavaScript codemods

This is a collection of codemods I have created, some for learning some for
actual usecases.

## Usage
```
npm i -g relekang/codemods

rcm codemod-name path
```

### Codemods

#### `NamedExports`
Converts export default of an object to named exports.

From:
```es6
export default { answer: 42 }
```

To:
```es6
export const answer = 42
```

#### `SpecificLodashImport`

From:
```es6
import _ from "lodash"

_.map(items, item => console.log(item))
```

To:
```es6
import {map} from "lodash"

map(items, item => console.log(item))
```
