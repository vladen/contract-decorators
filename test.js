'option strict';

const { expect } = require('chai');
const { precondition, postcondition } = require('./');

precondition.enabled = true;
const PreconditionError = precondition.Error;
postcondition.enabled = true;
const PostconditionError = postcondition.Error;

class CustomError extends Error {}

class Precondition {
  @precondition(argument1 => argument1, argument2 => argument2)
  method(argument1, argument2) {
    return [this, argument1, argument2];
  }
}

describe('precondition', () => {
  beforeEach(() => precondition.enabled = true);

  it('Is a function', () =>
    // const { precondition } = require('contract-decorators');
    expect(precondition).to.be.a('function')
  );

  it('Throws TypeError if called without arguments', () =>
    expect(() => precondition()).to.throw(TypeError)
  );

  it('Throws TypeError if one of predicates is not function', () =>
    expect(() => precondition(() => true, 0)).to.throw(TypeError)
  );

  describe('result', () => {
    it('Is a function', () =>
      expect(precondition(() => true)).to.be.a('function')
    );

    it('Throws TypeError if not function is decorated', () => {
      const decorator = precondition(() => true);
      expect(() => decorator({}, '', {})).to.throw(TypeError);
    });

    it('Wraps decorated method into function with Contract suffix', () => {
      function test() {}
      const decorator = precondition(() => true);
      const { value } = decorator({}, 'method', { value: test });
      expect(value).to.be.a('function').and.have.property('name').that.equal('testContract');
    });

    it('Does not wrap decorated method if precondition is not enabled', () => {
      function test() {}
      precondition.enabled = false;
      const decorator = precondition(() => true);
      const { value } = decorator({}, 'method', { value: test });
      expect(value).to.be.equal(test);
    });
  });
});

describe('@precondition', () => {
  beforeEach(() => {
    precondition.enabled = true;
    precondition.Error = PreconditionError;
  });

  it('Does not throw if all arguments satisfy predicates', () => {
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

  it('Returns result returned by method', () => {
    const test = new Precondition;
    expect(test.method(1, 2)).to.include.members([test, 1, 2]);
  });

  it('Throws precondition.Error if some argument does not satisfy predicate', () => {
    // const { PreconditionError } = precondition;
    const test = new Precondition;
    expect(() => test.method(1, 0)).to.throw(PreconditionError);
  });

  it('Throws custom error if it was assigned to precondition.Error and some argument does not satisfy predicate', () => {
    // const { PreconditionError } = precondition;
    precondition.Error = CustomError;
    const test = new Precondition;
    expect(() => test.method(1, 0)).to.throw(CustomError);
  });

  it('Does not throw if not enabled', () => {
    const test = new Precondition;
    precondition.enabled = false;
    expect(() => test.method(0, 1)).to.not.throw(PreconditionError);
  });
});

class Postcondition {
  @postcondition(result => result[1])
  method(argument) {
    return [this, argument];
  }
}

describe('postcondition', () => {
  beforeEach(() => {
    postcondition.enabled = true;
    postcondition.Error = PostconditionError;
  });

  it('Is a function', () =>
    // const { postcondition } = require('contract-decorators');
    expect(postcondition).to.be.a('function')
  );

  it('Throws TypeError if called without arguments', () =>
    expect(() => postcondition()).to.throw(TypeError)
  );

  it('Throws TypeError if predicate is not function', () =>
    expect(() => postcondition(0)).to.throw(TypeError)
  );

  it('Returns function', () =>
    expect(postcondition(() => true)).to.be.a('function')
  );

  describe('result', () => {
    it('Is a function', () =>
      expect(postcondition(() => true)).to.be.a('function')
    );

    it('Throws TypeError if not function is decorated', () => {
      const decorator = postcondition(() => true);
      expect(() => decorator({}, '', {})).to.throw(TypeError);
    });

    it('Wraps decorated method into function named with Contract suffix', () => {
      function test() {}
      const decorator = postcondition(() => true);
      const { value } = decorator({}, 'method', { value: test });
      expect(value).to.be.a('function').and.have.property('name').that.equal('testContract');
    });

    it('Does not wrap decorated method if postcondition is not enabled', () => {
      function test() {}
      postcondition.enabled = false;
      const decorator = postcondition(() => true);
      const { value } = decorator({}, 'method', { value: test });
      expect(value).to.be.equal(test);
    });
  });
});

describe('@postcondition', () => {
  beforeEach(() => postcondition.enabled = true);

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

  it('Returns result returned by method', () => {
    const test = new Postcondition;
    expect(test.method(1)).to.include.members([test, 1]);
  });

  it('Throws postcondition.Error if result does not satisfy predicate', () => {
    // const { PreconditionError } = precondition;
    const test = new Postcondition;
    expect(() => test.method(0)).to.throw(PostconditionError);
  });

  it('Throws custom error if it was assigned to postcondition.Error and result does not satisfy predicate', () => {
    // const { PreconditionError } = precondition;
    postcondition.Error = CustomError;
    const test = new Postcondition;
    expect(() => test.method(0)).to.throw(CustomError);
  });

  it('Does not throw if not enabled', () => {
    const test = new Postcondition;
    postcondition.enabled = false;
    expect(() => test.method(0)).to.not.throw(PostconditionError);
  });
});
