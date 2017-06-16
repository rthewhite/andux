import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai  from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import { observe, Observe } from './observe';

describe('Observe', () => {
  it('Should thrown an error if no store is available on the component', () => {

    class SelectTest {
      @observe()
      public myProperty

      constructor() {}
    }

    const selectTest = new SelectTest();

    function shouldThrow() {
      selectTest.myProperty;
    }

    expect(shouldThrow).to.throw('Observe decorator can only be used if the store is injected');
  });

  it('Should call observe method on the store with the given selector', () => {

    class SelectTest {
      @observe('foobar')
      public myProperty;

      constructor(private store: any) {
        this.store = store;
      }
    }

    const observeSpy = sinon.spy();
    const store = {
      observe: observeSpy
    };

    const selectTest = new SelectTest(store);
    const observable = selectTest.myProperty;
    expect(observeSpy).to.be.calledWith('foobar');
  });


  it('Should call observe method on the store with the property name converted to path if no selector given', () => {

    class SelectTest {
      @observe()
      public myProperty;

      constructor(private store: any) {}
    }

    const observeSpy = sinon.spy();
    const store = {
      observe: observeSpy
    };

    const selectTest = new SelectTest(store);
    const observable = selectTest.myProperty;
    expect(observeSpy).to.be.calledWith('my.property');
  });

  it('Should work with multiple observers', () => {
    class SelectTest {
      @observe()
      public myProperty;

      @observe()
      public myOtherProperty;

      constructor(private store: any) {}
    }

    const observeSpy = sinon.spy();
    const store = {
      observe: observeSpy
    };

    const selectTest = new SelectTest(store);
    const observable = selectTest.myProperty;
    const observableTwo = selectTest.myOtherProperty;

    expect(observeSpy).to.be.calledTwice;
    expect(observeSpy).to.be.calledWith('my.property');
    expect(observeSpy).to.be.calledWith('my.other.property');
  });

  it('Should strip off $ from the selector when using property name', () => {
    class SelectTest {
      @observe()
      public myProperty$;

      constructor(private store: any) {}
    }

    const observeSpy = sinon.spy();
    const store = {
      observe: observeSpy
    };

    const selectTest = new SelectTest(store);
    const observable = selectTest.myProperty$;
    expect(observeSpy).to.be.calledWith('my.property');
  });

  it('Should not transform given selector camelCase', () => {
    class SelectTest {
      @observe('some.selecTor')
      public myProperty;

      constructor(private store: any) {}
    }

    const observeSpy = sinon.spy();
    const store = {
      observe: observeSpy
    };

    const selectTest = new SelectTest(store);
    const observable = selectTest.myProperty;
    expect(observeSpy).to.be.calledWith('some.selecTor');
  });

  it('Should also export observe as Observe', () => {
    class SelectTest {
      @Observe('foobar')
      public myProperty;

      constructor(private store: any) {
        this.store = store;
      }
    }

    const observeSpy = sinon.spy();
    const store = {
      observe: observeSpy
    };

    const selectTest = new SelectTest(store);
    const observable = selectTest.myProperty;
    expect(observeSpy).to.be.calledWith('foobar');
  });
});
