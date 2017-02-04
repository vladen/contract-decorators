'option strict';

const { defineProperties, defineProperty } = Object;
const enabled = typeof process === 'object' && process.env === 'development';

const getSetDescriptor = (get, set) => ({ get, set });
const isDefined = value => value !== undefined;
const isFunction = value => typeof value === 'function';
const isConstructor = value => isFunction(value) && isDefined(value.prototype);
const methodNameResolver = method => method.originalName || method.name;
const predicateNameResolver = predicate => predicate.name || predicate.toString();
const valueDescriptor = value => ({ value });

class PostconditionError extends Error {
  constructor(method, predicate, result) {
    super(`Postcondition failed. Result of method "${method}" must satisfy predicate "${predicate}" but it does not: ${result}.`);
  }
}

class PreconditionError extends Error {
  constructor(method, predicate, argument, index) {
    super(`Precondition failed. Argument #${index} of method "${method}" must satisfy predicate "${predicate}" but it does not: ${argument}.`);
  }
}

const contract = {};

const current = {
  enabled,
  methodNameResolver,
  PreconditionError,
  PostconditionError,
  predicateNameResolver
};

function configure(config) {
  const {
    enabled, methodNameResolver, PreconditionError, PostconditionError, predicateNameResolver
  } = config;
  if (isDefined(enabled)) setEnabled(enabled);
  if (isDefined(methodNameResolver)) setMethodNameResolver(methodNameResolver);
  if (isDefined(PreconditionError)) setPreconditionError(PreconditionError);
  if (isDefined(PostconditionError)) setPostconditionError(PostconditionError);
  if (isDefined(predicateNameResolver)) setPredicateNameResolver(predicateNameResolver);
}

function getEnabled() {
  return current.enabled;
}

function getMethodNameResolver() {
  return current.methodNameResolver;
}

function getPreconditionError() {
  return current.PreconditionError;
}

function getPredicateNameResolver() {
  return current.predicateNameResolver;
}

function getPostconditionError() {
  return current.PostconditionError;
}

function setEnabled(enabled) {
  return current.enabled = enabled;
}

function validate(name, type, value, validator) {
  if (!validator(value))
    throw new TypeError(`Argument "${name}" expected to be ${type} but it is not: ${value}`);
  return value;
}

function setMethodNameResolver(value) {
  current.methodNameResolver = validate('value', 'a function', value, isFunction);
}

function setPreconditionError(value) {
  current.PreconditionError = validate('value', 'constructor function', value, isConstructor);
}

function setPostconditionError(value) {
  current.PostconditionError = validate('value', 'constructor function', value, isConstructor);
}

function setPredicateNameResolver(value) {
  current.predicateNameResolver = validate('value', 'a function', value, isFunction);
}

function decorate(descriptor, predicates, validator, template) {
  if (current.enabled) {
    const method = descriptor.value;
    if (!isFunction(method))
      throw new TypeError('Postcondition can decorate class methods only');
    const name = methodNameResolver(method);
    const decorator = Function(
      'method', 'predicates', 'validator',
      `return function ${name}Contract() {\n\t${template}\n}`
    )(method, predicates, validator);
    defineProperty(decorator, 'originalName', valueDescriptor(name));
    descriptor.value = decorator;
  }
  return descriptor;
}

function prevalidator(method, predicates, $arguments) {
  if (!current.enabled) return;
  const { length } = predicates;
  for (let index = -1; ++index < length;) {
    const argument = $arguments[index];
    const predicate = predicates[index];
    if (!predicate(argument))
      throw new current.PreconditionError(
        current.methodNameResolver(method),
        current.predicateNameResolver(predicate),
        argument,
        index
      );
  }
}

function precondition(...predicates) {
  if (!predicates.length)
    throw new TypeError('Any predicate must be passed');
  if (!predicates.every(isFunction))
    throw new TypeError('Each predicate must be a function');
  return function preconditionDecorator(target, key, descriptor) {
    return decorate(
      descriptor, predicates, prevalidator,
      'validator(method, predicates, arguments); return method.apply(this, arguments);'
    );
  }
}

function postvalidator(method, predicate, $return) {
  if (current.enabled && !predicate($return))
    throw new current.PostconditionError(
      current.methodNameResolver(method),
      current.predicateNameResolver(predicate),
      $return
    );
  return $return;
}

function postcondition(predicate) {
  if (!isFunction(predicate))
    throw new TypeError('Predicate must be a function');
  return function postconditionDecorator(target, key, descriptor) {
    return decorate(
      descriptor, predicate, postvalidator,
      'return validator(method, predicates, method.apply(this, arguments));'
    );
  }
}

module.exports = defineProperties(contract, {
  configure: valueDescriptor(configure),
  enabled: getSetDescriptor(getEnabled, setEnabled),
  methodNameResolver: getSetDescriptor(getMethodNameResolver, setMethodNameResolver),
  precondition: valueDescriptor(precondition),
  PreconditionError: getSetDescriptor(getPreconditionError, setPreconditionError),
  postcondition: valueDescriptor(postcondition),
  PostconditionError: getSetDescriptor(getPostconditionError, setPostconditionError),
  predicateNameResolver: getSetDescriptor(getPredicateNameResolver, setPredicateNameResolver)
});
