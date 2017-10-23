import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { List } from 'immutable';
import { observe } from 'andux';

import { TodoActions } from './../../actions';
import { Store } from './../../app.store';
import { Todo } from './../../models';

@Component({
  selector: 'app-todo-list',
  styleUrls: ['./todo-list.style.scss'],
  templateUrl: './todo-list.template.html'
})
export class TodoListComponent {
  @observe('todo.todos')
  public todos: BehaviorSubject<List<string>>;

  constructor(private store: Store, private actions: TodoActions) {}

  public addTodo() {
    this.store.dispatch(this.actions.addTodo('Some other todo'));
  }

  public deleteTodo(todo: Todo) {
    this.store.dispatch(this.actions.deleteTodo(todo));
  }
}
