import { Map } from 'immutable';

export class Todo {
  private data = Map<string, any>();

  constructor(data: any) {
    this.data = Map<string, any>(data);
  }

  get finished() {
    return this.data.get('finished');
  }

  setFinished(state: boolean) {
    return new Todo(this.data.set('finished', state).toJS());
  }

  get description() {
    return this.data.get('description');
  }

  setDescription(description: string) {
    return new Todo(this.data.set('description', description).toJS());
  }

  public toJS() {
    return this.data.toJS();
  }
}
