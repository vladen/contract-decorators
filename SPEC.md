# TOC
   - [precondition](#precondition)
     - [result](#precondition-result)
   - [@precondition](#precondition)
   - [postcondition](#postcondition)
     - [result](#postcondition-result)
   - [@postcondition](#postcondition)
<a name=""></a>
 
<a name="precondition"></a>
# precondition
Is a function.

```js
// const { precondition } = require('contract-decorators');
  expect(precondition).to.be.a('function')
```

Throws TypeError if called without arguments.

```js
expect(() => precondition()).to.throw(TypeError)
```

Throws TypeError if one of predicates is not function.

```js
expect(() => precondition(() => true, 0)).to.throw(TypeError)
```

<a name="precondition-result"></a>
## result
Is a function.

```js
expect(precondition(() => true)).to.be.a('function')
```

Throws TypeError if not function is decorated.

```js
const decorator = precondition(() => true);
expect(() => decorator({}, '', {})).to.throw(TypeError);
```

Wraps decorated method into function with Contract suffix.

```js
function test() {}
const decorator = precondition(() => true);
const { value } = decorator({}, 'method', { value: test });
expect(value).to.be.a('function').and.have.property('name').that.equal('testContract');
```

Does not wrap decorated method if precondition is not enabled.

```js
function test() {}
precondition.enabled = false;
const decorator = precondition(() => true);
const { value } = decorator({}, 'method', { value: test });
expect(value).to.be.equal(test);
```

<a name="precondition"></a>
# @precondition
Does not throw if all arguments satisfy predicates.

```js
/*
class Precondition {
  @precondition(argument1 => argument1, argument2 => argument2)
  method(argument1, argument2) {
    return [this, argument1, argument2];
  }
}
*/
const test = new Precondition();
expect(() => test.method(1, 2)).to.not.throw(PreconditionError);
```

Returns result returned by method.

```js
const test = new Precondition();
expect(test.method(1, 2)).to.include.members([test, 1, 2]);
```

Throws precondition.Error if some argument does not satisfy predicate.

```js
// const { PreconditionError } = precondition;
const test = new Precondition();
expect(() => test.method(1, 0)).to.throw(PreconditionError);
```

Throws custom error if it was assigned to precondition.Error and some argument does not satisfy predicate.

```js
// const { PreconditionError } = precondition;
precondition.Error = CustomError;
const test = new Precondition();
expect(() => test.method(1, 0)).to.throw(CustomError);
```

Does not throw if not enabled.

```js
const test = new Precondition();
precondition.enabled = false;
expect(() => test.method(0, 1)).to.not.throw(PreconditionError);
```

<a name="postcondition"></a>
# postcondition
Is a function.

```js
// const { postcondition } = require('contract-decorators');
  expect(postcondition).to.be.a('function')
```

Throws TypeError if called without arguments.

```js
expect(() => postcondition()).to.throw(TypeError)
```

Throws TypeError if predicate is not function.

```js
expect(() => postcondition(0)).to.throw(TypeError)
```

Returns function.

```js
expect(postcondition(() => true)).to.be.a('function')
```

<a name="postcondition-result"></a>
## result
Is a function.

```js
expect(postcondition(() => true)).to.be.a('function')
```

Throws TypeError if not function is decorated.

```js
const decorator = postcondition(() => true);
expect(() => decorator({}, '', {})).to.throw(TypeError);
```

Wraps decorated method into function named with Contract suffix.

```js
function test() {}
const decorator = postcondition(() => true);
const { value } = decorator({}, 'method', { value: test });
expect(value).to.be.a('function').and.have.property('name').that.equal('testContract');
```

Does not wrap decorated method if postcondition is not enabled.

```js
function test() {}
postcondition.enabled = false;
const decorator = postcondition(() => true);
const { value } = decorator({}, 'method', { value: test });
expect(value).to.be.equal(test);
```

<a name="postcondition"></a>
# @postcondition
Does not throw if result satisfies predicate.

```js
/*
class Postcondition {
  @postcondition(result => result[1])
  method(argument) {
    return [this, argument];
  }
}
*/
const test = new Postcondition();
expect(() => test.method(1)).to.not.throw(PostconditionError);
```

Returns result returned by method.

```js
const test = new Postcondition();
expect(test.method(1)).to.include.members([test, 1]);
```

Throws postcondition.Error if result does not satisfy predicate.

```js
// const { PreconditionError } = precondition;
const test = new Postcondition();
expect(() => test.method(0)).to.throw(PostconditionError);
```

Throws custom error if it was assigned to postcondition.Error and result does not satisfy predicate.

```js
// const { PreconditionError } = precondition;
postcondition.Error = CustomError;
const test = new Postcondition();
expect(() => test.method(0)).to.throw(CustomError);
```

Does not throw if not enabled.

```js
const test = new Postcondition();
postcondition.enabled = false;
expect(() => test.method(0)).to.not.throw(PostconditionError);
```

