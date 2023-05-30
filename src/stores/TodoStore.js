import { ulid } from "ulid";
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
   * @return {object}
   */
  getAll: function () {
    return _todos;
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
