import React from "react";
import map from "lodash/map";

import TodoItem from "./TodoItem";

class TodoList extends React.Component {
  _renderTodos() {
    const { todos } = this.props;
    return map(todos, (todo) => {
      return (
        <TodoItem
          key={todo.id}
          id={todo.id}
          {...todo}
        />
      );
    });
  }

  render() {
    return <ul className="list-group todo-list">{this._renderTodos()}</ul>;
  }
}

export default TodoList;
