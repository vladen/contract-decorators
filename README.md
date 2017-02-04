# contract-decorators

[![npm](https://img.shields.io/npm/v/contract-decorators.svg)](https://www.npmjs.com/package/contract-decorators)
[![Build Status](https://img.shields.io/travis/vladen/contract-decorators/master.svg)](https://travis-ci.org/vladen/contract-decorators)
[![Code Climate](https://img.shields.io/codeclimate/github/vladen/contract-decorators.svg)](https://codeclimate.com/github/vladen/contract-decorators)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/vladen/contract-decorators.svg)](https://codeclimate.com/github/vladen/contract-decorators/coverage)
[![Issues](https://img.shields.io/codeclimate/issues/github/vladen/contract-decorators.svg)](https://codeclimate.com/github/vladen/contract-decorators/issues)

* [Installation](#installation)
* [Usage](#usage)
* [Tests](https://github.com/vladen/contract-decorators/blob/master/SPEC.md)
* [License](#license)

## Installation

Install it via [npm](https://npmjs.com):

```
$ npm install --save contract-decorators
```

> This module requires NodeJS 6.9 or higher.

## Usage

Example code:

```js
const { precondition, postcondition } = require('contract-decorators');

precondition.enabled = postcondition.enabled = true;

const test = new class Test {
  @precondition(a => a < 9, b => b > 1)
  @postcondition(result => result % 2)
  method(a, b) {
    return a + b;
  }
}

test.method(1, 2);
// 3
test.method(9, 0);
// Uncaught PreconditionError: Precondition failed. Argument #0 of method "method" must satisfy predicate "a => a < 9" but it does not: 9.
test.method(0, 0);
// Uncaught PreconditionError: Precondition failed. Argument #1 of method "method" must satisfy predicate "b => b > 1" but it does not: 0.
test.method(2, 4);
// Uncaught PostconditionError: Postcondition failed. Result of method "method" must satisfy predicate "result => result % 2" but it does not: 6.

precondition.enabled = postcondition.enabled = false;

test.method(9, 0);
// 9
test.method(0, 0);
// 0
test.method(2, 4);
// 6
```

# License

MIT
