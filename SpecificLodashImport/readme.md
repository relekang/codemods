# SpecificLodashImport

## Usage
```
$ rcm SpecificLodashImport <path>
```

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
