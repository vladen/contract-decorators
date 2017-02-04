# TOC
   - [constract](#constract)
     - [configure](#constract-configure)
     - [enabled](#constract-enabled)
     - [methodNameResolver](#constract-methodnameresolver)
     - [precondition](#constract-precondition)
       - [result](#constract-precondition-result)
       - [@precondition](#constract-precondition-precondition)
     - [PreconditionError](#constract-preconditionerror)
     - [postcondition](#constract-postcondition)
       - [result](#constract-postcondition-result)
       - [@postcondition](#constract-postcondition-postcondition)
     - [PostconditionError](#constract-postconditionerror)
     - [predicateNameResolver](#constract-predicatenameresolver)
<a name=""></a>
 
<a name="constract"></a>
# constract
Is an object.

```js
// const contract = require('contract-decorators');
  expect(contract).to.be.an('object')
```

<a name="constract-configure"></a>
## configure
Is a method.

```js
// const { configure } = contract;
    expect(configure).to.be.a('function')
```

Configures enabled property.

```js
const enabled = !contract.enabled;
configure({ enabled });
expect(contract.enabled).to.equal(enabled);
```

Configures methodNameResolver property.

```js
const config = { methodNameResolver: () => '' };
configure(config);
expect(contract.methodNameResolver).to.equal(config.methodNameResolver);
```

Configures PreconditionError property.

```js
configure({ PreconditionError: CustomError });
expect(contract.PreconditionError).to.equal(CustomError);
```

Configures PostconditionError property.

```js
configure({ PostconditionError: CustomError });
expect(contract.PostconditionError).to.equal(CustomError);
```

Configures predicateNameResolver property.

```js
const config = { predicateNameResolver: () => '' };
configure(config);
expect(contract.predicateNameResolver).to.equal(config.predicateNameResolver);
```

<a name="constract-enabled"></a>
## enabled
Is a property that returns boolean value.

```js
expect(contract.enabled).to.be.a('boolean')
```

Is writable.

```js
const enabled = contract.enabled = !contract.enabled;
expect(contract.enabled).to.equal(enabled);
```

<a name="constract-methodnameresolver"></a>
## methodNameResolver
Is a property that returns function.

```js
expect(contract.methodNameResolver).to.be.a('function')
```

Is writable.

```js
const methodNameResolver = () => '';
contract.methodNameResolver = methodNameResolver;
expect(contract.methodNameResolver).to.equal(methodNameResolver);
```

Throws TypeError if not a function is assigned.

```js
expect(() => contract.methodNameResolver = 0).to.throw(TypeError)
```

Calls configured methodNameResolver with original method when contract is broken.

```js
const method = () => {};
contract.methodNameResolver = spy();
const decorator = precondition(() => false);
const descriptor = decorator({}, '', { value: method });
try {
  descriptor.value();
} catch (error) {
  expect(contract.methodNameResolver).to.be.calledWithExactly(method);
}
```

<a name="constract-precondition"></a>
## precondition
Is a method.

```js
// const { precondition } = contract;
    expect(precondition).to.be.a('function')
```

Throws TypeError if called without arguments.

```js
expect(() => precondition()).to.throw(TypeError)
```

Throws TypeError if one of predicates is not a function.

```js
expect(() => precondition(() => true, 0)).to.throw(TypeError)
```

<a name="constract-precondition-result"></a>
### result
Is a function.

```js
expect(precondition(() => true)).to.be.a('function')
```

Throws TypeError if not a method is being decorated.

```js
const decorator = precondition(() => true);
expect(() => decorator({}, '', {})).to.throw(TypeError);
```

Wraps decorated method into function with "Contract" suffix.

```js
function test() {}
const decorator = precondition(() => true);
const { value } = decorator({}, 'method', { value: test });
expect(value).to.be.a('function').and.have.property('name').that.equal('testContract');
```

Does not decorate method if contract is not enabled.

```js
function test() {}
contract.enabled = false;
const decorator = precondition(() => true);
const { value } = decorator({}, 'method', { value: test });
expect(value).to.be.equal(test);
```

<a name="constract-precondition-precondition"></a>
### @precondition
Does not throw if all arguments satisfy appropriate predicates.

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

Returns result returned by decorated method.

```js
const test = new Precondition();
expect(test.method(1, 2)).to.include.members([test, 1, 2]);
```

Throws PreconditionError if some arguments do not satisfy predicates.

```js
// const { PreconditionError } = contract;
const test = new Precondition();
expect(() => test.method(1, 0)).to.throw(PreconditionError);
```

Throws custom error if it was assigned to PreconditionError and some arguments do not satisfy predicates.

```js
contract.PreconditionError = CustomError;
const test = new Precondition();
expect(() => test.method(1, 0)).to.throw(CustomError);
```

Does not throw if contract is not enabled.

```js
const test = new Precondition();
contract.enabled = false;
expect(() => test.method(0, 1)).to.not.throw(PreconditionError);
```

<a name="constract-preconditionerror"></a>
## PreconditionError
Is a property that returns a constructor function.

```js
expect(contract.PreconditionError).to.be.a('function').and.have.property('prototype').that.is.an('object')
```

Is writable.

```js
contract.PreconditionError = CustomError;
expect(contract.PreconditionError).to.equal(CustomError);
```

Throws TypeError if not a constructor function is assigned.

```js
expect(() => contract.PreconditionError = () => {}).to.throw(TypeError)
```

Calls new PreconditionError with method name, predicate name, argument and argument index when contract is broken.

```js
const argument = 1;
function method() {}
function predicate() {
  return false;
}
contract.PreconditionError = spy();
const decorator = precondition(predicate);
const descriptor = decorator({}, '', { value: method });
try {
  descriptor.value(argument);
} catch (error) {
  expect(contract.PreconditionError).to.be.calledWithNew.and.calledWithExactly(method.name, predicate.name, argument, 0);
}
```

Calls PreconditionError with method name and predicate returned by custom resolvers when contract is broken.

```js
const name = 'test';
contract.PreconditionError = spy();
contract.methodNameResolver = () => name;
contract.predicateNameResolver = () => name;
const decorator = precondition(() => false);
const descriptor = decorator({}, '', { value: () => {} });
try {
  descriptor.value();
  expect(null).to.not.be.ok;
} catch (error) {
  expect(contract.PreconditionError).to.be.calledWith(name, name);
}
```

<a name="constract-postcondition"></a>
## postcondition
Is a function.

```js
// const { postcondition } = contract;
    expect(postcondition).to.be.a('function')
```

Throws TypeError if called without arguments.

```js
expect(() => postcondition()).to.throw(TypeError)
```

Throws TypeError if predicate is not a function.

```js
expect(() => postcondition(0)).to.throw(TypeError)
```

<a name="constract-postcondition-result"></a>
### result
Is a function.

```js
expect(postcondition(() => true)).to.be.a('function')
```

Throws TypeError if not a method is being decorated.

```js
const decorator = postcondition(() => true);
expect(() => decorator({}, '', {})).to.throw(TypeError);
```

Wraps decorated method into function named with "Contract" suffix.

```js
function test() {}
const decorator = postcondition(() => true);
const { value } = decorator({}, 'method', { value: test });
expect(value).to.be.a('function').and.have.property('name').that.equal('testContract');
```

Does not decorate method if contract is not enabled.

```js
function test() {}
contract.enabled = false;
const decorator = postcondition(() => true);
const { value } = decorator({}, 'method', { value: test });
expect(value).to.be.equal(test);
```

<a name="constract-postcondition-postcondition"></a>
### @postcondition
Returns result returned by method.

```js
const test = new Postcondition();
expect(test.method(1)).to.include.members([test, 1]);
```

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

Throws PostconditionError if result does not satisfy predicate.

```js
// const { PostconditionError } = contract;
const test = new Postcondition();
expect(() => test.method(0)).to.throw(PostconditionError);
```

Throws custom error if it was assigned to PostconditionError and result does not satisfy predicate.

```js
contract.PostconditionError = CustomError;
const test = new Postcondition();
expect(() => test.method(0)).to.throw(CustomError);
```

Does not throw if contract is not enabled.

```js
const test = new Postcondition();
contract.enabled = false;
expect(() => test.method(0)).to.not.throw(PostconditionError);
```

<a name="constract-postconditionerror"></a>
## PostconditionError
Is a property that returns a constructor function.

```js
expect(contract.PostconditionError).to.be.a('function').and.have.property('prototype').that.is.an('object')
```

Is writable.

```js
contract.PostconditionError = CustomError;
expect(contract.PostconditionError).to.equal(CustomError);
```

Throws TypeError if not a constructor function is assigned.

```js
expect(() => contract.PostconditionError = () => {}).to.throw(TypeError)
```

Calls new PostconditionError with method name, predicate name and method result when contract is broken.

```js
const result = 1;
function method() {
  return result;
}
function predicate() {
  return false;
}
contract.PostconditionError = spy();
const decorator = postcondition(predicate);
const descriptor = decorator({}, '', { value: method });
try {
  descriptor.value();
} catch (error) {
  expect(contract.PostconditionError).to.be.calledWithNew.and.calledWithExactly(method.name, predicate.name, result);
}
```

Calls PostconditionError with method name and predicate returned by custom resolvers when contract is broken.

```js
const name = 'test';
contract.PostconditionError = spy();
contract.methodNameResolver = () => name;
contract.predicateNameResolver = () => name;
const decorator = postcondition(() => false);
const descriptor = decorator({}, '', { value: () => {} });
try {
  descriptor.value();
  expect(null).to.not.be.ok;
} catch (error) {
  expect(contract.PostconditionError).to.be.calledWith(name, name);
}
```

<a name="constract-predicatenameresolver"></a>
## predicateNameResolver
Is a property that returns a function.

```js
expect(contract.predicateNameResolver).to.be.a('function')
```

Is writable.

```js
const predicateNameResolver = () => '';
contract.predicateNameResolver = predicateNameResolver;
expect(contract.predicateNameResolver).to.equal(predicateNameResolver);
```

Throws TypeError if not a function is assigned.

```js
expect(() => contract.predicateNameResolver = 0).to.throw(TypeError)
```

Calls configured predicateNameResolver with predicate when contract is broken.

```js
const predicate = () => false;
contract.predicateNameResolver = spy();
const decorator = precondition(predicate);
const descriptor = decorator({}, '', { value: () => {} });
try {
  descriptor.value();
} catch (error) {
  expect(contract.predicateNameResolver).to.be.calledWithExactly(predicate);
}
```

