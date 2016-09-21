import { expect } from 'chai';

import { Map } from 'immutable';
import { stateTransformer } from './logger';

describe('loggerMiddleware', () => {
  it('stateTransformer should transform immutable objects to plain javascript', () => {
    const immutableData = {
      immutable: Map({
        foo: 'bar',
        bar: {
          foo: 'bar'
        }
      })
    };

    const data = stateTransformer(immutableData);
    expect(data['immutable']['foo']).to.equal('bar');
    expect(data['immutable']['bar']['foo']).to.equal('bar');
  });

  it('stateTransformer should work with a mix of immutable and none immutable objects', () => {
    const immutableData = {
      immutable: Map({
        foo: 'bar',
        bar: {
          foo: 'bar'
        }
      }),
      mutable: {
        foo: 'bar',
        bar: {
          foo: 'bar'
        }
      }
    };

    const data = stateTransformer(immutableData);
    expect(data['immutable']['foo']).to.equal('bar');
    expect(data['immutable']['bar']['foo']).to.equal('bar');
    expect(data['mutable']['foo']).to.equal('bar');
    expect(data['mutable']['bar']['foo']).to.equal('bar');
  });
});
