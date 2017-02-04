'option strict';

const $name = Symbol();
const { defineProperties } = Object;
const enabled = typeof process === 'object' && process.env === 'development';
const writable = true;

const isFunction = value => typeof value === 'function';
const getMethodName = method => method[$name] || method.name;
const getPredicateName = predicate => predicate.name || predicate.toString();

function decorate(contract, descriptor, constraint, validator, template) {
  if (contract.enabled) {
    const method = descriptor.value;
    if (!isFunction(method))
      throw new TypeError('Postcondition can decorate class methods only');
    const name = getMethodName(method);
    const decorator = Function(
      'contract', 'method', 'constraint', 'validator',
      `return function ${name}Contract() {\n\t${template}\n}`
    )(contract, method, constraint, validator);
    decorator[$name] = name;
    descriptor.value = decorator;
  }
  return descriptor;
}

class PreconditionError extends Error {
  constructor(method, predicate, parameter, index) {
    super(`Precondition failed. Argument #${index} of method "${getMethodName(method)}" must satisfy predicate "${getPredicateName(predicate)}" but it does not: ${parameter}.`);
  }
}

function prevalidator(contract, method, predicates, parameters) {
  if (!contract.enabled) return;
  const { length } = predicates;
  for (let index = -1; ++index < length;) {
    const parameter = parameters[index];
    const predicate = predicates[index];
    if (!predicate(parameter)) {
      const { Error } = contract;
      throw new Error(method, predicate, parameter, index);
    }
  }
}

function precondition(...predicates) {
  if (!predicates.length)
    throw new TypeError('Any predicate must be passed');
  if (!predicates.every(isFunction))
    throw new TypeError('Each predicate must be a function');
  return function preconditionDecorator(target, key, descriptor) {
    return decorate(
      precondition, descriptor, predicates, prevalidator,
      'validator(contract, method, constraint, arguments); return method.apply(this, arguments);'
    );
  }
}
defineProperties(precondition, {
  enabled: { value: enabled, writable },
  Error: { value: PreconditionError, writable }
});

class PostconditionError extends Error {
  constructor(method, predicate, result) {
    super(`Postcondition failed. Result of method "${getMethodName(method)}" must satisfy predicate "${getPredicateName(predicate)}" but it does not: ${result}.`);
  }
}

function postvalidator(contract, method, predicate, result) {
  if (!contract.enabled) return result;
  if (!predicate(result)) {
    const { Error } = postcondition;
    throw new Error(method, predicate, result);
  }
  return result;
}

function postcondition(predicate) {
  if (!isFunction(predicate))
    throw new TypeError('Predicate must be a function');
  return function postconditionDecorator(target, key, descriptor) {
    return decorate(
      postcondition, descriptor, predicate, postvalidator,
      'return validator(contract, method, constraint, method.apply(this, arguments));'
    );
  }
}
defineProperties(postcondition, {
  enabled: { value: enabled, writable },
  Error: { value: PostconditionError, writable }
});

module.exports = { precondition, postcondition };
