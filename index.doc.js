/**
 * Decorators based code contract module.
 * @module contract
 */

module.exports = {
  /**
   * Configures preconditions and postconditions module.
   * @param {Object} config
   * Object, containing one or more settings to apply: enabled, methodNameResolver, PreconditionError, PostconditionError and predicateNameResolver.
   */
  configure(config) {},

  /**
   * Gets or sets value indicating if preconditions and postconditions are enabled.
   * In other environments than development preconditions and postconditions are disabled by default for performance reasons.
   * @type {Boolean}
   */
  enabled: true,

  /**
   * Gets or sets function resolving name of method that caused contract violation.
   * @param {Function} method
   * Resolver function accepting 1 argument: method to resolve.
   * @type {Function}
   */
  methodNameResolver: Function,

  /**
   * Decorator function validating arguments passed to decorated method.
   * @param {...Function} predicates
   * List of predicate functions alined with list of expected arguments.
   * Each predicate validates one argument.
   * Position of a predicate must match position of argument to validate with this predicate.
   * Argument considered valid if corresponding predicate returns truthy value.
   * @return {Function}
   */
  precondition(...predicates) {},

  /**
   * Gets or sets constructor function used to instantiate errors when preconditions are violated.
   * @param {Error} PreconditionError
   * Constructor function accepting 4 arguments: method name, predicate name, method argument value and index.
   * Method name is a string returned by methodNameResolver.
   * Method name is a string returned by predicateNameResolver.
   * @type {Error}
   */
  PreconditionError: Error,

  /**
   * Decorator function validating result returned from decorated method.
   * @param {Function} predicate
   * Predicate function to validate result with.
   * @return {Function}
   */
  postcondition(...predicates) {},

  /**
   * Gets or sets constructor function used to instantiate errors when postconditions are violated.
   * @param {Error} PostconditionError
   * Constructor function accepting 4 arguments: method name, predicate name and method return value.
   * Method name is a string returned by methodNameResolver.
   * Method name is a string returned by predicateNameResolver.
   * @type {Error}
   */
  PostconditionError: Error,

  /**
   * Gets or sets function resolving name of predicate that asserted contract violation.
   * @param {Function} predicateNameResolver
   * Resolver function accepting 1 argument: predicate to resolve.
   * @type {Function}
   */
  predicateNameResolver: Function
};
