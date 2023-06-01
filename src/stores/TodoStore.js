import { ulid } from "ulid";
import filter from "lodash/filter";
import { createReduxStore, register, select, subscribe } from "@wordpress/data";

import * as TodoConstants from "../constants/TodoConstants";
import { loadTodos, saveTodos } from "../stores/localStorage";

/*
 * Save all ToDos to local storage.
 * Called (via subscribe) every time we make a change to the ToDos e.g delete/update
 */
subscribe(() => saveTodos(select(store).getAll()));

const DEFAULT_STATE = {
  todos: loadTodos(),
};

const actions = {
  create: function (title) {
    return {
      type: TodoConstants.TODO_CREATE,
      title,
    };
  },

  update: function (id, title) {
    return {
      type: TodoConstants.TODO_UPDATE,
      id,
      title,
    };
  },

  complete: function (id) {
    return {
      type: TodoConstants.TODO_COMPLETE,
      id,
    };
  },

  destroy: function (id) {
    return {
      type: TodoConstants.TODO_DESTROY,
      id,
    };
  },
};

const store = createReduxStore("et-todos", {
  reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
      case TodoConstants.TODO_CREATE:
        if (action.title) {
          const title = action.title.trim();

          if (title !== "") {
            const id = ulid();
            const updatedTodos = { ...state.todos };

            updatedTodos[id] = {
              id: id,
              complete: false,
              title: action.title,
            };

            return {
              ...state,
              todos: {
                ...updatedTodos,
              },
            };
          }
        } else {
          console.error("Invalid todo title provided: ", action.title);
        }
        break;
      case TodoConstants.TODO_UPDATE:
        if (action.id && action.title) {
          const title = action.title.trim();

          if (title !== "") {
            const updatedTodos = { ...state.todos };
            updatedTodos[action.id].title = action.title;

            return {
              ...state,
              todos: {
                ...updatedTodos,
              },
            };
          }
        } else {
          console.error(
            "Invalid todo title or ID provided for updating: ",
            action.id,
            action.title
          );
        }
        break;
      case TodoConstants.TODO_DESTROY:
        if (action.id) {
          const updatedTodos = { ...state.todos };
          delete updatedTodos[action.id];

          return {
            ...state,
            todos: {
              ...updatedTodos,
            },
          };
        } else {
          console.error("Invalid todo ID provided for deleting: ", action.id);
        }
        break;
      case TodoConstants.TODO_COMPLETE:
        if (action.id) {
          const updatedTodos = { ...state.todos };

          updatedTodos[action.id].complete = !updatedTodos[action.id].complete;

          return {
            ...state,
            todos: {
              ...updatedTodos,
            },
          };
        }
        break;
      default:
        break;
    }

    return state;
  },

  actions,

  selectors: {
    /**
     * Get the entire collection of ToDos.
     * @param {object} state
     * @param null|true|false pass null to get all ToDos. Pass a boolean to filter by complete state. Defaults to null.
     * @return {object}
     */
    getAll(state, complete = null) {
      const { todos } = state;

      if (complete === true || complete === false) {
        return filter(todos, (todo) => todo.complete === complete);
      }

      return todos;
    },

    /**
     * Get the number of all ToDos.
     * @return {int}
     */
    todosCount(state) {
      return Object.keys(state.todos).length;
    },

    /**
     * Get the number of completed ToDos.
     * @return {int}
     */
    completeCount(state) {
      return Object.keys(filter(state.todos, (todo) => todo.complete)).length;
    },

    /**
     * Get the number of incomplete ToDos.
     * @return {int}
     */
    inCompleteCount(state) {
      return Object.keys(filter(state.todos, (todo) => !todo.complete)).length;
    },
  },

  controls: {
    //
  },

  resolvers: {
    //
  },
});

register(store);

export { store };
