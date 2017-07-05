// import { expect } from 'chai';
// import { Map } from 'immutable';

// import { AnduxReducer } from './reducer';

// describe('Reducer', () => {
//   it('should properly construct', () => {
//     class MyReducer extends AnduxReducer {
//       public key = 'foobar';
//       public initialState = 'foobar';
//     }

//     const reducer = new MyReducer();
//     expect(reducer).to.exist;
//     expect(reducer instanceof AnduxReducer).to.equal(true);
//   });

//   describe('reduce', () => {
//     it('should return initialState of no state provided', () => {
//       class MyReducer extends AnduxReducer {
//         initialState = 'foobar';
//       }

//       const reducer = new MyReducer();
//       const result = reducer['reduce'](undefined, { type: 'SOME_ACTION'});
//       expect(result).to.equal('foobar');
//     });

//     it('should call the appropriate method on the class based on the actionType', () => {
//       let myState = Map({
//         foo: 'bar'
//       });

//       class MyReducer extends AnduxReducer {
//         initialState = myState;
//         myAwesomeAction(state, action) {
//           state = state.set('foo', 'not bar anymore');
//           return state;
//         }
//       }

//       const reducer = new MyReducer();
//       const state = reducer['reduce'](myState, {type: 'MY_AWESOME_ACTION'});

//       expect(state.get('foo')).to.equal('not bar anymore');
//     });
//   });
// });

