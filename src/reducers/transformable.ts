export class Transformer {
  constructor(
    public name: string,
    private fn: Function,
    public weight: number
  ) {}

  transform(state) {
    if (state) {
      const result = this.fn(state);
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

    // Wrap the reduce method and call in the transformers at the end
    const originalReduce = reducer.prototype.reduce;

    Object.defineProperty(reducer.prototype, 'reduce', {
      value: function(state) {
        state = originalReduce.apply(this, arguments);

        this.transformers.forEach(transformer => {
          state = transformer.transform(state);
        });

        return state;
      }
    });

    // Define the array of transformers
    Object.defineProperty(reducer.prototype, 'transformers', {
      value: [],
      writable: false
    });

    // Helper method to add transformers
    Object.defineProperty(reducer.prototype, 'addTransformer', {
      value: function (transformer: Transformer) {
        if (this.transformers.indexOf(transformer) === -1) {
          this.transformers.push(transformer);

          this.transformers.sort((transA, transB) => {
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
        const index = this.transformers.indexOf(transformer);
        if (index >= 0) {
          this.transformers.splice(index, 1);
        }
      }
    });
  }

  return reducer;
}
