import { ObservableAction } from 'andux';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Todo } from './../models';

@Injectable()
export class TodoActions {

  // Observable actions will automatically fire actions.
  // In this case it can fire:
  // ADD_TODO_STARTED
  // ADD_TODO_SUCCESS
  // ADD_TODO_FAILED
  // ADD_TODO_COMPLETED
  @ObservableAction()
  addTodo(message: string) {
    // Imagine this would be an API call
    return Observable.create((observer: Observer<Todo> ) => {
      const todo = new Todo({
        finished: false,
        description: message
      });

      observer.next(todo);
      observer.complete();
    });
  }

  deleteTodo(todo) {
    return {
      type: 'DELETE_TODO',
      payload: todo
    };
  }
}
