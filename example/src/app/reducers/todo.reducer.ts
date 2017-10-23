import { AnduxReducer } from 'andux';
import { Action } from 'redux';
import { Map, List } from 'immutable';

import { Todo } from './../models';

const initialState = Map({
  todos: List<Todo>([
    new Todo({
      finished: false,
      description: 'Learn Angular 2'
    }),
    new Todo({
      finished: false,
      description: 'Learn about Redux'
    }),
    new Todo({
      finished: false,
      description: 'Learn Andux'
    })
  ])
});

export class TodoReducer implements AnduxReducer {
  public initialState = initialState;
  public key = 'todo';

  addTodoSuccess(state: Map<string, any>, action) {
    const todos: List<Todo> = state.get('todos');
    return state.set('todos', todos.push(action.payload.response));
  }

  deleteTodo(state: Map<string, any>, action) {
    const todos: List<Todo> = state.get('todos');

    const index = todos.findIndex((todo: Todo) => {
      return todo === action['payload'];
    });

    return state.set('todos', todos.delete(index));
  }
}
