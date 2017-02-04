'option strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const { expect } = chai;
const { spy } = sinon;

const contract = require('./');
const {
  configure, methodNameResolver, precondition, PreconditionError,
  postcondition, PostconditionError, predicateNameResolver
} = contract;

contract.enabled = true;

class CustomError extends Error {}

class Precondition {
  @precondition(argument1 => argument1, argument2 => argument2)
  method(argument1, argument2) {
    return [this, argument1, argument2];
  }
}

class Postcondition {
  @postcondition(result => result[1])
  method(argument) {
    return [this, argument];
  }
}

describe('constract', () => {
  afterEach(() => {
    configure({
      enabled: true,
      methodNameResolver, precondition, PreconditionError,
      postcondition, PostconditionError, predicateNameResolver
    });
  });

  it('Is an object', () =>
    // const contract = require('contract-decorators');
    expect(contract).to.be.an('object')
  );

  describe('configure', () => {
    it('Is a method', () =>
      // const { configure } = contract;
      expect(configure).to.be.a('function')
    );

    it('Configures enabled property', () => {
      const enabled = !contract.enabled;
      configure({ enabled  });
      expect(contract.enabled).to.equal(enabled);
    });

    it('Configures methodNameResolver property', () => {
      const config = { methodNameResolver: () => '' };
      configure(config);
      expect(contract.methodNameResolver).to.equal(config.methodNameResolver);
    });

    it('Configures PreconditionError property', () => {
      configure({ PreconditionError: CustomError  });
      expect(contract.PreconditionError).to.equal(CustomError);
    });

    it('Configures PostconditionError property', () => {
      configure({ PostconditionError: CustomError  });
      expect(contract.PostconditionError).to.equal(CustomError);
    });

    it('Configures predicateNameResolver property', () => {
      const config = { predicateNameResolver: () => '' };
      configure(config);
      expect(contract.predicateNameResolver).to.equal(config.predicateNameResolver);
    });
  });

  describe('enabled', () => {
    it('Is a property that returns boolean value', () =>
      expect(contract.enabled).to.be.a('boolean')
    );

    it('Is writable', () => {
      const enabled = contract.enabled = !contract.enabled;
      expect(contract.enabled).to.equal(enabled);
    });
  });

  describe('methodNameResolver', () => {
    it('Is a property that returns function', () =>
      expect(contract.methodNameResolver).to.be.a('function')
    );

    it('Is writable', () => {
      const methodNameResolver = () => '';
      contract.methodNameResolver = methodNameResolver;
      expect(contract.methodNameResolver).to.equal(methodNameResolver);
    });

    it('Throws TypeError if not a function is assigned', () =>
      expect(() => contract.methodNameResolver = 0).to.throw(TypeError)
    );

    it('Calls configured methodNameResolver with original method when contract is broken', () => {
      const method = () => {};
      contract.methodNameResolver = spy();
      const decorator = precondition(() => false);
      const descriptor = decorator({}, '', { value: method });
      try {
        descriptor.value();
      }
      catch (error) {
        expect(contract.methodNameResolver).to.be.calledWithExactly(method);
      }
    });
  });

  describe('precondition', () => {
    it('Is a method', () =>
      // const { precondition } = contract;
      expect(precondition).to.be.a('function')
    );

    it('Throws TypeError if called without arguments', () =>
      expect(() => precondition()).to.throw(TypeError)
    );

    it('Throws TypeError if one of predicates is not a function', () =>
      expect(() => precondition(() => true, 0)).to.throw(TypeError)
    );

    describe('result', () => {
      it('Is a function', () =>
        expect(precondition(() => true)).to.be.a('function')
      );

      it('Throws TypeError if not a method is being decorated', () => {
        const decorator = precondition(() => true);
        expect(() => decorator({}, '', {})).to.throw(TypeError);
      });

      it('Wraps decorated method into function with "Contract" suffix', () => {
        function test() {}
        const decorator = precondition(() => true);
        const { value } = decorator({}, 'method', { value: test });
        expect(value).to.be.a('function').and.have.property('name').that.equal('testContract');
      });

      it('Does not decorate method if contract is not enabled', () => {
        function test() {}
        contract.enabled = false;
        const decorator = precondition(() => true);
        const { value } = decorator({}, 'method', { value: test });
        expect(value).to.be.equal(test);
      });
    });

    describe('@precondition', () => {
      it('Does not throw if all arguments satisfy appropriate predicates', () => {
        /*
        class Precondition {
          @precondition(argument1 => argument1, argument2 => argument2)
          method(argument1, argument2) {
            return [this, argument1, argument2];
          }
        }
        */
        const test = new Precondition;
        expect(() => test.method(1, 2)).to.not.throw(PreconditionError);
      });

      it('Returns result returned by decorated method', () => {
        const test = new Precondition;
        expect(test.method(1, 2)).to.include.members([test, 1, 2]);
      });

      it('Throws PreconditionError if some arguments do not satisfy predicates', () => {
        // const { PreconditionError } = contract;
        const test = new Precondition;
        expect(() => test.method(1, 0)).to.throw(PreconditionError);
      });

      it('Throws custom error if it was assigned to PreconditionError and some arguments do not satisfy predicates', () => {
        contract.PreconditionError = CustomError;
        const test = new Precondition;
        expect(() => test.method(1, 0)).to.throw(CustomError);
      });

      it('Does not throw if contract is not enabled', () => {
        const test = new Precondition;
        contract.enabled = false;
        expect(() => test.method(0, 1)).to.not.throw(PreconditionError);
      });
    });
  });

  describe('PreconditionError', () => {
    it('Is a property that returns a constructor function', () =>
      expect(contract.PreconditionError)
        .to.be.a('function')
        .and.have.property('prototype').that.is.an('object')
    );

    it('Is writable', () => {
      contract.PreconditionError = CustomError;
      expect(contract.PreconditionError).to.equal(CustomError);
    });

    it('Throws TypeError if not a constructor function is assigned', () =>
      expect(() => contract.PreconditionError = () => {}).to.throw(TypeError)
    );

    it('Calls new PreconditionError with method name, predicate name, argument and argument index when contract is broken', () => {
      const argument = 1;
      function method() {}
      function predicate() { return false; }
      contract.PreconditionError = spy();
      const decorator = precondition(predicate);
      const descriptor = decorator({}, '', { value: method });
      try {
        descriptor.value(argument);
      }
      catch (error) {
        expect(contract.PreconditionError)
          .to.be.calledWithNew
          .and.calledWithExactly(method.name, predicate.name, argument, 0);
      }
    });

    it('Calls PreconditionError with method name and predicate returned by custom resolvers when contract is broken', () => {
      const name = 'test';
      contract.PreconditionError = spy();
      contract.methodNameResolver = () => name;
      contract.predicateNameResolver = () => name;
      const decorator = precondition(() => false);
      const descriptor = decorator({}, '', { value: () => {} });
      try {
        descriptor.value();
        expect(null).to.not.be.ok;
      }
      catch (error) {
        expect(contract.PreconditionError).to.be.calledWith(name, name);
      }
    });
  });

  describe('postcondition', () => {
    it('Is a function', () =>
      // const { postcondition } = contract;
      expect(postcondition).to.be.a('function')
    );

    it('Throws TypeError if called without arguments', () =>
      expect(() => postcondition()).to.throw(TypeError)
    );

    it('Throws TypeError if predicate is not a function', () =>
      expect(() => postcondition(0)).to.throw(TypeError)
    );

    describe('result', () => {
      it('Is a function', () =>
        expect(postcondition(() => true)).to.be.a('function')
      );

      it('Throws TypeError if not a method is being decorated', () => {
        const decorator = postcondition(() => true);
        expect(() => decorator({}, '', {})).to.throw(TypeError);
      });

      it('Wraps decorated method into function named with "Contract" suffix', () => {
        function test() {}
        const decorator = postcondition(() => true);
        const { value } = decorator({}, 'method', { value: test });
        expect(value).to.be.a('function').and.have.property('name').that.equal('testContract');
      });

      it('Does not decorate method if contract is not enabled', () => {
        function test() {}
        contract.enabled = false;
        const decorator = postcondition(() => true);
        const { value } = decorator({}, 'method', { value: test });
        expect(value).to.be.equal(test);
      });
    });

    describe('@postcondition', () => {
      it('Returns result returned by method', () => {
        const test = new Postcondition;
        expect(test.method(1)).to.include.members([test, 1]);
      });

      it('Does not throw if result satisfies predicate', () => {
        /*
        class Postcondition {
          @postcondition(result => result[1])
          method(argument) {
            return [this, argument];
          }
        }
        */
        const test = new Postcondition;
        expect(() => test.method(1)).to.not.throw(PostconditionError);
      });

      it('Throws PostconditionError if result does not satisfy predicate', () => {
        // const { PostconditionError } = contract;
        const test = new Postcondition;
        expect(() => test.method(0)).to.throw(PostconditionError);
      });

      it('Throws custom error if it was assigned to PostconditionError and result does not satisfy predicate', () => {
        contract.PostconditionError = CustomError;
        const test = new Postcondition;
        expect(() => test.method(0)).to.throw(CustomError);
      });

      it('Does not throw if contract is not enabled', () => {
        const test = new Postcondition;
        contract.enabled = false;
        expect(() => test.method(0)).to.not.throw(PostconditionError);
      });
    });
  });

  describe('PostconditionError', () => {
    it('Is a property that returns a constructor function', () =>
      expect(contract.PostconditionError)
        .to.be.a('function')
        .and.have.property('prototype').that.is.an('object')
    );

    it('Is writable', () => {
      contract.PostconditionError = CustomError;
      expect(contract.PostconditionError).to.equal(CustomError);
    });

    it('Throws TypeError if not a constructor function is assigned', () =>
      expect(() => contract.PostconditionError = () => {}).to.throw(TypeError)
    );

    it('Calls new PostconditionError with method name, predicate name and method result when contract is broken', () => {
      const result = 1;
      function method() { return result; }
      function predicate() { return false; }
      contract.PostconditionError = spy();
      const decorator = postcondition(predicate);
      const descriptor = decorator({}, '', { value: method });
      try {
        descriptor.value();
      }
      catch (error) {
        expect(contract.PostconditionError)
          .to.be.calledWithNew
          .and.calledWithExactly(method.name, predicate.name, result);
      }
    });

    it('Calls PostconditionError with method name and predicate returned by custom resolvers when contract is broken', () => {
      const name = 'test';
      contract.PostconditionError = spy();
      contract.methodNameResolver = () => name;
      contract.predicateNameResolver = () => name;
      const decorator = postcondition(() => false);
      const descriptor = decorator({}, '', { value: () => {} });
      try {
        descriptor.value();
        expect(null).to.not.be.ok;
      }
      catch (error) {
        expect(contract.PostconditionError).to.be.calledWith(name, name);
      }
    });
  });

  describe('predicateNameResolver', () => {
    it('Is a property that returns a function', () =>
      expect(contract.predicateNameResolver).to.be.a('function')
    );

    it('Is writable', () => {
      const predicateNameResolver = () => '';
      contract.predicateNameResolver = predicateNameResolver;
      expect(contract.predicateNameResolver).to.equal(predicateNameResolver);
    });

    it('Throws TypeError if not a function is assigned', () =>
      expect(() => contract.predicateNameResolver = 0).to.throw(TypeError)
    );

    it('Calls configured predicateNameResolver with predicate when contract is broken', () => {
      const predicate = () => false;
      contract.predicateNameResolver = spy();
      const decorator = precondition(predicate);
      const descriptor = decorator({}, '', { value: () => {} });
      try {
        descriptor.value();
      }
      catch (error) {
        expect(contract.predicateNameResolver).to.be.calledWithExactly(predicate);
      }
    });
  });
});
