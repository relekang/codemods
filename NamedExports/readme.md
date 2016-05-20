# NamedExports

Converts export default of an object to named exports.

## Usage
```
$ rcm NamedExports <path>
```

From:
```es6
export default { answer: 42 }
```

To:
```es6
export const answer = 42
```
