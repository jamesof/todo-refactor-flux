import { ulid } from "ulid";
import filter from "lodash/filter";
import EventEmitter from "events";

import * as TodoConstants from "../constants/TodoConstants";
import ETDispatcher from "../dispatcher/et-builder-dispatcher";

let CHANGE_EVENT = "change";
let _todos = {}; // collection of todo items

const savedTodos = localStorage.getItem("et-todos");

if (savedTodos) {
  try {
    _todos = JSON.parse(savedTodos);
  } catch (error) {
    console.error("Saved ToDos could not be parsed: ", savedTodos);
  }
}

/**
 * Save all ToDos to local storage.
 * Ideally call this function every time you make a change to the ToDos e.g delete/update
 */
function perisitToLocalStorage() {
  localStorage.setItem("et-todos", JSON.stringify(_todos));
}

/**
 * Create a ToDo item.
 * @param {string} title The content of the ToDo item
 */
function create(title) {
  const id = ulid();

  _todos[id] = {
    id: id,
    complete: false,
    title: title,
  };

  perisitToLocalStorage();
}

/**
 * Create a ToDo item.
 * @param {string} id The id of the ToDo item
 * @param {string} title The updated content of the ToDo item
 */
function update(id, title) {
  _todos[id].title = title;

  perisitToLocalStorage();
}

/**
 * Delete a ToDo item.
 * @param {string} id
 */
function destroy(id) {
  delete _todos[id];

  perisitToLocalStorage();
}

/**
 * Update completed status of a ToDo item.
 * @param {string} id The id of the ToDo item
 */
function complete(id) {
  _todos[id].complete = !_todos[id].complete;

  perisitToLocalStorage();
}

let TodoStore = Object.assign({}, EventEmitter.prototype, {
  /**
   * Get the entire collection of ToDos.
   * @param null|true|false pass null to get all ToDos. Pass a boolean to filter by complete state. Defaults to null.
   * @return {object}
   */
  getAll: function (complete = null) {
    if (complete === true || complete === false) {
      return filter(_todos, (todo) => todo.complete === complete);
    }

    return _todos;
  },

  /**
   * Get the number of all ToDos.
   * @return {int}
   */
  todosCount: function () {
    return Object.keys(_todos).length;
  },

  /**
   * Get the number of completed ToDos.
   * @return {int}
   */
  completeCount: function () {
    return Object.keys(filter(_todos, (todo) => todo.complete)).length;
  },

  /**
   * Get the number of incomplete ToDos.
   * @return {int}
   */
  inCompleteCount: function () {
    return Object.keys(filter(_todos, (todo) => !todo.complete)).length;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: ETDispatcher.register(function (payload) {
    switch (payload.actionType) {
      case TodoConstants.TODO_CREATE:
        if (payload.title) {
          const title = payload.title.trim();

          if (title !== "") {
            create(title);
            TodoStore.emitChange();
          }
        } else {
          console.error("Invalid todo title provided: ", payload.title);
        }
        break;
      case TodoConstants.TODO_UPDATE:
        if (payload.id && payload.title) {
          const title = payload.title.trim();

          if (title !== "") {
            update(payload.id, title);
            TodoStore.emitChange();
          }
        } else {
          console.error(
            "Invalid todo title or ID provided for updating: ",
            payload.id,
            payload.title
          );
        }
        break;
      case TodoConstants.TODO_DESTROY:
        if (payload.id) {
          destroy(payload.id);
          TodoStore.emitChange();
        } else {
          console.error("Invalid todo ID provided for deleting: ", payload.id);
        }
        break;
      case TodoConstants.TODO_COMPLETE:
        if (payload.id) {
          complete(payload.id);
          TodoStore.emitChange();
        }
        break;
      default:
        break;
    }
    return true; // No errors. Needed by promise in Dispatcher.
  }),
});

export default TodoStore;
