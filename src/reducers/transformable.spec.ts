import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai  from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import { Map } from 'immutable';

import { AnduxReducer } from './reducer';
import { Transformer, Transformable, } from './transformable';

describe('Transformer', () => {
  it('should construct', () => {
    const transformer = new Transformer('foo', () => {}, 50);
    expect(transformer).to.exist;
  });

  it('should have public properties: name, weight', () => {
    const transformer = new Transformer('foo', () => {}, 50);
    expect(transformer.name).to.equal('foo');
    expect(transformer.weight).to.equal(50);
  });

  it('should have an transform method', () => {
    const transformer = new Transformer('foo', () => {}, 50);
    expect(transformer.transform).to.be.a('function');
  });

  describe('transform', () => {
    it('transform method should not call transformer function when no state is given', () => {
      const spy = sinon.spy();
      const transformer = new Transformer('foo', spy, 50);

      transformer.transform(undefined);
      expect(spy).to.not.have.been.called;
    });


    it('transform method should return the result of the passed transformer function when a state is given', () => {
      const initialState = Map({foo: 'bar'});
      const transformer = new Transformer('foo', state => {
        return state.set('foo', 'not bar');
      }, 50);

      const state = transformer.transform(initialState);
      expect(state.get('foo')).to.equal('not bar');
    });

    it('transform method should throw an error if the transform method doesnt return the state', () => {
      const initialState = Map({foo: 'bar'});
      const transformer = new Transformer('foo', state => {
        state.set('foo', 'not bar');
      }, 50);

      const test = () => {
        transformer.transform(initialState);
      };

      expect(test).to.throw(`Transformer: foo doesn't return the state in it's transform method`);
    });
  });
});

describe('Transformable', () => {
  it('should have transform, addTransformer, removeTransformer methods', () => {
    @Transformable
    class MyReducer extends AnduxReducer {}

    const reducer = new MyReducer();
    expect(reducer['addTransformer']).to.exist;
    expect(reducer['removeTransformer']).to.exist;
  });

  describe('transform', () => {
    it('should wrap the reduce method and call transfomers at the end with the state', () => {
      @Transformable
      class MyReducer {
        reduce(state) {
          return state;
        }
      }

      const transformer = new Transformer('foo', (state) => {
        state.foo = 'not bar anymore';
        return state;
      }, 50);

      const state = {foo: 'bar'};
      const reducer = new MyReducer();
      reducer['addTransformer'](transformer);

      const newState = reducer.reduce(state);
      expect(newState.foo).to.equal('not bar anymore');
    });
  });

  describe('addTransformer', () => {
    it('should order transformers based on weight', () => {

      @Transformable
      class MyReducer {}

      const reducer = new MyReducer();
      reducer['addTransformer']({name: 'foo20', fn: () => {}, weight: 20});
      reducer['addTransformer']({name: 'foo10', fn: () => {}, weight: 10});
      reducer['addTransformer']({name: 'foo30', fn: () => {}, weight: 30});
      reducer['addTransformer']({name: 'foo15', fn: () => {}, weight: 15});

      expect(reducer['transformers'][3].name).to.equal('foo30');
      expect(reducer['transformers'][2].name).to.equal('foo20');
      expect(reducer['transformers'][1].name).to.equal('foo15');
      expect(reducer['transformers'][0].name).to.equal('foo10');

    });

    it('should not be possible to add the same transformer twice', () => {
      @Transformable
      class MyReducer {}

      const reducer = new MyReducer();
      const transformer = new Transformer('foo', () => {}, 10);
      reducer['addTransformer'](transformer);
      reducer['addTransformer'](transformer);

      expect(reducer['transformers'].length).to.equal(1);
    });

    it('should be able to add a transformer using a decorator', () => {
      function myDecorator() {
        return (reducer) => {
          // Make sure it's transformable
          Transformable(reducer);


          const transformerOne = new Transformer('one', (state) => {
            return state.set('one', 'transformer one');
          }, 30);

          reducer.prototype['addTransformer'](transformerOne);
        };
      }

      function myOtherDecorator() {
        return (reducer) => {
          // Make sure it's transformable
          Transformable(reducer);

          const transformerTwo = new Transformer('two', (state) => {
            return state.set('foo', 'transformer two');
          }, 10);

          reducer.prototype['addTransformer'](transformerTwo);
        };
      }

      @myDecorator()
      @myOtherDecorator()
      class MyReducer {}

      const reducer = new MyReducer();
      expect(reducer['transformers'].length).to.equal(2);
      expect(reducer['transformers'][0].name).to.equal('two');
      expect(reducer['transformers'][1].name).to.equal('one');
    });

    describe('removeTransformer', () => {
      it('should be possible to remove a transformer', () => {
        @Transformable
        class MyReducer {}

        const one = new Transformer('one', (state) => { return state; }, 10);
        const two = new Transformer('two', (state) => { return state; }, 10);
        const three = new Transformer('three', (state) => { return state; }, 10);

        const reducer = new MyReducer();
        reducer['addTransformer'](one);
        reducer['addTransformer'](two);
        reducer['addTransformer'](three);

        reducer['removeTransformer'](two);
        reducer['removeTransformer'](two); // Shouldn't fail on trying to remove the same reducer again

        expect(reducer['transformers'].length).to.equal(2);
        expect(reducer['transformers'][0]).to.equal(one);
        expect(reducer['transformers'][1]).to.equal(three);
      });
    });
  });
});

