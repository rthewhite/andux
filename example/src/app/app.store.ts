import { AnduxStore } from 'andux';

import { environment } from './../environments/environment';
import * as reducers from './reducers';

export class Store extends AnduxStore {
  constructor() {
    super(reducers, [], environment.production === false);
  }
}
