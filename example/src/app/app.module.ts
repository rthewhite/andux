import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Store } from './app.store';

import { TodoActions } from './actions';
import { TodoListComponent } from './components';

@NgModule({
  declarations: [
    TodoListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    Store,
    TodoActions
  ],
  bootstrap: [TodoListComponent]
})
export class AppModule { }
