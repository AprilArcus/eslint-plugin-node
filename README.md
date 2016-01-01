# eslint-plugin-node

[![Build Status](https://travis-ci.org/mysticatea/eslint-plugin-node.svg?branch=master)](https://travis-ci.org/mysticatea/eslint-plugin-node)
[![Coverage Status](https://coveralls.io/repos/mysticatea/eslint-plugin-node/badge.svg?branch=master)](https://coveralls.io/r/mysticatea/eslint-plugin-node?branch=master)
[![Dependency Status](https://david-dm.org/mysticatea/eslint-plugin-node.svg)](https://david-dm.org/mysticatea/eslint-plugin-node)
[![npm version](https://badge.fury.io/js/eslint-plugin-node.svg)](http://badge.fury.io/js/eslint-plugin-node)

Additional ESLint's rules for Node.js

Some rules are slow because it searches `package.json` and opens it.

## Install & Usage

```
> npm install --save-dev eslint eslint-plugin-node
```

**.eslintrc**

```json
{
    "extends": "eslint:recommended",
    "plugins": ["node"],
    "env": {
        "node": true
    },
    "rules": {
        "node/no-missing-import": 2,
        "node/no-missing-require": 2,
        "node/no-unsupported-features": [2, {"version": 4}],
        "node/shebang": 2
    }
}
```

## Rules

- [no-missing-import](docs/rules/no-missing-import.md) - Disallow `import` and `export` declarations for files that don't exist.
- [no-missing-require](docs/rules/no-missing-require.md) - Disallow `require()`s for files that don't exist.
- [no-unsupported-features](docs/rules/no-unsupported-features.md) - Disallow unsupported ECMAScript features on the specified version.
- [shebang](docs/rules/shebang.md) - Suggest correct usage of shebang. (fixable)
