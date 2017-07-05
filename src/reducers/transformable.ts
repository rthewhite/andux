export class Transformer {
  constructor(
    public name: string,
    private fn: Function,
    public weight: number
  ) {}

  transform(state, action) {
    if (state) {
      const result = this.fn(state, action);
      if (!result) {
        throw new Error(`Transformer: ${this.name} doesn't return the state in it's transform method`);
      }
      return result;
    }

    return state;
  }
}

export function Transformable(reducer) {

  // Check if the reducer is already transformable
  if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, '_transformable')) {
    // Define property indicating this reducer is transformable
    Object.defineProperty(reducer.prototype, '_transformable', {
      value: true,
      writable: false
    });

    // Define the array of transformers
    Object.defineProperty(reducer.prototype, '_transformers', {
      value: [],
      writable: false
    });

    // Helper method to add transformers
    Object.defineProperty(reducer.prototype, 'addTransformer', {
      value: function (transformer: Transformer) {
        if (this._transformers.indexOf(transformer) === -1) {
          this._transformers.push(transformer);

          this._transformers.sort((transA, transB) => {
            if (transA.weight > transB.weight) {
              return 1;
            } else if (transA.weight < transB.weight) {
              return -1;
            }
            return 0;
          });
        }
      }
    });

    // Helper method to remove transformers
    Object.defineProperty(reducer.prototype, 'removeTransformer', {
      value: function (transformer: Transformer) {
        const index = this._transformers.indexOf(transformer);
        if (index >= 0) {
          this._transformers.splice(index, 1);
        }
      }
    });
  }

  return reducer;
}
