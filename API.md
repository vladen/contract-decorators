<a name="module_contract"></a>

## contract
Decorators based code contract module.


* [contract](#module_contract)
    * [.enabled](#module_contract.enabled) : <code>Boolean</code>
    * [.methodNameResolver](#module_contract.methodNameResolver) : <code>function</code>
    * [.PreconditionError](#module_contract.PreconditionError) : <code>Error</code>
    * [.PostconditionError](#module_contract.PostconditionError) : <code>Error</code>
    * [.predicateNameResolver](#module_contract.predicateNameResolver) : <code>function</code>
    * [.configure(config)](#module_contract.configure)
    * [.precondition(...predicates)](#module_contract.precondition) ⇒ <code>function</code>
    * [.postcondition(predicate)](#module_contract.postcondition) ⇒ <code>function</code>

<a name="module_contract.enabled"></a>

### contract.enabled : <code>Boolean</code>
Gets or sets value indicating if preconditions and postconditions are enabled.
In other environments than development preconditions and postconditions are disabled by default for performance reasons.

**Kind**: static property of <code>[contract](#module_contract)</code>  
<a name="module_contract.methodNameResolver"></a>

### contract.methodNameResolver : <code>function</code>
Gets or sets function resolving name of method that caused contract violation.

**Kind**: static property of <code>[contract](#module_contract)</code>  
**Throws**:

- <code>TypeError</code> Attempt to assign something that not a function.

**Params**

- methodNameResolver <code>function</code> - Resolver function accepting 1 argument: method to resolve.

<a name="module_contract.PreconditionError"></a>

### contract.PreconditionError : <code>Error</code>
Gets or sets constructor function used to instantiate errors when preconditions are violated.

**Kind**: static property of <code>[contract](#module_contract)</code>  
**Throws**:

- <code>TypeError</code> Attempt to assign something that not a constructor function.

**Params**

- PreconditionError <code>Error</code> - Constructor function accepting 4 arguments: method name, predicate name, method argument value and index.
Method name is a string returned by methodNameResolver.
Method name is a string returned by predicateNameResolver.

<a name="module_contract.PostconditionError"></a>

### contract.PostconditionError : <code>Error</code>
Gets or sets constructor function used to instantiate errors when postconditions are violated.

**Kind**: static property of <code>[contract](#module_contract)</code>  
**Throws**:

- <code>TypeError</code> Attempt to assign something that not a constructor function.

**Params**

- PostconditionError <code>Error</code> - Constructor function accepting 4 arguments: method name, predicate name and method return value.
Method name is a string returned by methodNameResolver.
Method name is a string returned by predicateNameResolver.

<a name="module_contract.predicateNameResolver"></a>

### contract.predicateNameResolver : <code>function</code>
Gets or sets function resolving name of predicate that asserted contract violation.

**Kind**: static property of <code>[contract](#module_contract)</code>  
**Throws**:

- <code>TypeError</code> Attempt to assign something that not a function.

**Params**

- predicateNameResolver <code>function</code> - Resolver function accepting 1 argument: predicate to resolve.

<a name="module_contract.configure"></a>

### contract.configure(config)
Configures preconditions and postconditions module.

**Kind**: static method of <code>[contract](#module_contract)</code>  
**Throws**:

- <code>TypeError</code> Config contains properties with invalid values.

**Params**

- config <code>Object</code> - Object, containing one or more settings to apply: enabled, methodNameResolver, PreconditionError, PostconditionError and predicateNameResolver.

<a name="module_contract.precondition"></a>

### contract.precondition(...predicates) ⇒ <code>function</code>
Decorator function validating arguments passed to decorated method.

**Kind**: static method of <code>[contract](#module_contract)</code>  
**Throws**:

- <code>TypeError</code> Some predicate is not a function.

**Params**

- ...predicates <code>function</code> - List of predicate functions alined with list of expected arguments.
Each predicate validates one argument.
Position of a predicate must match position of argument to validate with this predicate.
Argument considered valid if corresponding predicate returns truthy value.

<a name="module_contract.postcondition"></a>

### contract.postcondition(predicate) ⇒ <code>function</code>
Decorator function validating result returned from decorated method.

**Kind**: static method of <code>[contract](#module_contract)</code>  
**Throws**:

- <code>TypeError</code> Predicate is not a function.

**Params**

- predicate <code>function</code> - Predicate function to validate result with.

