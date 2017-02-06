# contract-decorators

[![NPM](https://nodei.co/npm/contract-decorators.png?compact=true)](https://nodei.co/npm/contract-decorators/)

[![Build Status](https://travis-ci.org/vladen/contract-decorators.svg)](https://travis-ci.org/vladen/contract-decorators)
[![Code Climate](https://codeclimate.com/github/vladen/contract-decorators/badges/gpa.svg)](https://codeclimate.com/github/vladen/contract-decorators)
[![Test Coverage](https://codeclimate.com/github/vladen/contract-decorators/badges/coverage.svg)](https://codeclimate.com/github/vladen/contract-decorators/coverage)

Class method decorators to ensure that class method is called with valid arguments (precondition) and/or returns expected result (postcondition).

To get more information about preconditions and postconditions see [Design by contract](https://en.wikipedia.org/wiki/Design_by_contract) article on Wikipedia.

> ECMAScript decorators are currently in [proposal](https://github.com/tc39/proposal-decorators) state. Use [babeljs](https://babeljs.io) to transpile them into executable code.

# Contents

* [Installation](#installation)
* [Usage](#usage)
* [Customization](#customization)
* [Configuration](#configuration)
* [API](https://github.com/vladen/contract-decorators/blob/master/API.md)
* [Tests](https://github.com/vladen/contract-decorators/blob/master/SPEC.md)
* [License](#license)

## Installation

Install it via [npm](https://npmjs.com):

```
$ npm install --save contract-decorators
```

## Usage

```js
const contract = require('contract-decorators');
const { precondition, postcondition } = contract;
contract.enabled = true;

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

contract.enabled = false;

test.method(9, 0);
// 9
test.method(0, 0);
// 0
test.method(2, 4);
// 6
```

# Customization

## Custom errors

```js
class CustomPreconditionError extends Error {
  constructor(method, predicate, argument, index) {
    super(`Some friendly message containing name of ${method} that is called with contract violation, value of ${argument} causing the violation, its ${index} and name of ${predicate} that proves it`);
  }
}

contract.PreconditionError = CustomPreconditionError;

class CustomPostconditionError extends Error {
  constructor(method, predicate, result) {
    super(`Some friendly message containing name of ${method} that returns ${result} causing contract violation and name of ${predicate} that proves it.`);
  }
}

contract.PostconditionError = CustomPostconditionError;
```

## Custom method/predicate name resolvers

```js
const customNameResolver = func => func.name;

contract.methodNameResolver = customNameResolver;
contract.predicateNameResolver = customNameResolver;
```

> Decorated method is always wrapped into function with the same name that method has with `Contract` suffix (`${method.name}Contract`). To avoid multiple `Contract` suffixes, original name of the method is stored as `.originalName` property of wrapper function.

By default the following algorithms are used for method and predicate name resolution:
* `method.originalName || method.name`
* `predicate.name || predicate.toString()`

# Configuration

For performance reasons contract decorators are enabled by default in `development` environment only (`process.env === 'development'`). To enable them in other environments use:

```js
contract.enabled = true;
```

If contract decorators are disabled at the moment of decorator application, no decoration occurs and succeeding enabling won't have any effect. This behavior is intended to gain maximal performance in production.

```js
contract.enabled = false;

const test = new class WillNotBeDecorated {
  @precondition(() => false)
  method() {
    return 'ok';
  }
}

contract.enabled = true;

test.method();
// ok
```

Configuration and customization of contract decorators can be performed with one call:

```js
contract.configure({
  enabled: true,
  methodNameResolver: customNameResolver,
  PreconditionError: CustomPreconditionError,
  PostconditionError: CustomPostconditionError,
  predicateNameResolver: customNameResolver
});
```

# License

MIT
