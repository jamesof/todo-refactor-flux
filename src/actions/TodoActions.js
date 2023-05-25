import * as TodoConstants from "../constants/TodoConstants";
import ETDispatcher from "../dispatcher/et-builder-dispatcher";

const TodoActions = {
  /**
   * @param {string} title
   */
  create: function (title) {
    ETDispatcher.dispatch({
      actionType: TodoConstants.TODO_CREATE,
      title: title,
    });
  },
  /**
   * @param {string} id
   * @param {string} title
   */
  update: function (id, title) {
    ETDispatcher.dispatch({
      actionType: TodoConstants.TODO_UPDATE,
      id: id,
      title: title,
    });
  },
  /**
   * @param {string} id
   */
  complete: function (id) {
    ETDispatcher.dispatch({
      actionType: TodoConstants.TODO_COMPLETE,
      id: id,
    });
  },
  /**
   * @param {string} id
   */
  destroy: function (id) {
    ETDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY,
      id: id,
    });
  },
};

export default TodoActions;
