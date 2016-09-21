import { expect } from 'chai';

import {
  convertMethodNameToActionType,
  convertActionTypeToMethodName,
  getReducerClassName,
  getActionsClassName
} from './utils';

describe('Utils', () => {
  describe('convertMethodNameToActionType', () => {
    it('It should convert camelcase method name to proper actionType', () => {
      expect(convertMethodNameToActionType('fooBar')).to.equal('FOO_BAR');
      expect(convertMethodNameToActionType('fooBar23')).to.equal('FOO_BAR23');
      expect(convertMethodNameToActionType('23fooBar')).to.equal('23FOO_BAR');
      expect(convertMethodNameToActionType('fooBarFooBar')).to.equal('FOO_BAR_FOO_BAR');
    });
  });

  describe('convertActionTypeToMethodName', () => {
    it('It should convert actionType to camelcased methodName', () => {
      expect(convertActionTypeToMethodName('FOO_BAR')).to.equal('fooBar');
      expect(convertActionTypeToMethodName('FOO_BAR23')).to.equal('fooBar23');
      expect(convertActionTypeToMethodName('23FOO_BAR')).to.equal('23fooBar');
      expect(convertActionTypeToMethodName('FOO_BAR_FOO_BAR')).to.equal('fooBarFooBar');
    });
  });

  describe('getReducerClassName', () => {
    it('It should return the name off the class without Reducer at the end', () => {
      expect(getReducerClassName('FooReducer')).to.equal('Foo');
      expect(getReducerClassName('FooBarReducer')).to.equal('FooBar');
    });
  });

  describe('getActionsClassName', () => {
    it('It should return the name off the class without Actions at the end', () => {
      expect(getActionsClassName('FooActions')).to.equal('Foo');
      expect(getActionsClassName('FooBarActions')).to.equal('FooBar');
    });
  });
});
