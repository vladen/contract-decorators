/**
 * Decorators based code contract module.
 * @module contract
 */

module.exports = {
  /**
   * Configures preconditions and postconditions module.
   * @param {Object} config
   * Object, containing one or more settings to apply: enabled, methodNameResolver, PreconditionError, PostconditionError and predicateNameResolver.
   * @throws {TypeError}
   * Config contains properties with invalid values.
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
   * @param {Function} methodNameResolver
   * Resolver function accepting 1 argument: method to resolve.
   * @type {Function}
   * @throws {TypeError}
   * Attempt to assign something that not a function.
   */
  methodNameResolver: Function,

  /**
   * Decorator function validating arguments passed to decorated method.
   * @param {...Function} predicates
   * List of predicate functions alined with list of expected arguments.
   * Each predicate validates one argument.
   * Position of a predicate must match position of argument to validate with this predicate.
   * Argument considered valid if corresponding predicate returns truthy value.
   * @returns {Function}
   * @throws {TypeError}
   * Some predicate is not a function.
   */
  precondition(...predicates) {},

  /**
   * Gets or sets constructor function used to instantiate errors when preconditions are violated.
   * @param {Error} PreconditionError
   * Constructor function accepting 4 arguments: method name, predicate name, method argument value and index.
   * Method name is a string returned by methodNameResolver.
   * Method name is a string returned by predicateNameResolver.
   * @type {Error}
   * @throws {TypeError}
   * Attempt to assign something that not a constructor function.
   */
  PreconditionError: Error,

  /**
   * Decorator function validating result returned from decorated method.
   * @param {Function} predicate
   * Predicate function to validate result with.
   * @returns {Function}
   * @throws {TypeError}
   * Predicate is not a function.
   */
  postcondition(...predicates) {},

  /**
   * Gets or sets constructor function used to instantiate errors when postconditions are violated.
   * @param {Error} PostconditionError
   * Constructor function accepting 4 arguments: method name, predicate name and method return value.
   * Method name is a string returned by methodNameResolver.
   * Method name is a string returned by predicateNameResolver.
   * @type {Error}
   * @throws {TypeError}
   * Attempt to assign something that not a constructor function.
   */
  PostconditionError: Error,

  /**
   * Gets or sets function resolving name of predicate that asserted contract violation.
   * @param {Function} predicateNameResolver
   * Resolver function accepting 1 argument: predicate to resolve.
   * @type {Function}
   * @throws {TypeError}
   * Attempt to assign something that not a function.
   */
  predicateNameResolver: Function
};
