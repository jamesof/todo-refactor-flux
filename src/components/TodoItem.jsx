import React from "react";

import Editable from "./Editable";
import TodoActions from "../actions/TodoActions";

class TodoItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editedTitle: props.title,
    };

    //we use this to keep a reference to the input field such that we can focus it when the user start editing
    this._todoEditInputRef = React.createRef();

    this._onDeleteTodo = this._onDeleteTodo.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);
    this._onSaveTodoEdit = this._onSaveTodoEdit.bind(this);
    this._onCompleteCheck = this._onCompleteCheck.bind(this);
  }

  _onSaveTodoEdit() {
    if (!this.state.editedTitle) {
      this.setState({
        editedTitle: this.props.title,
      });

      return;
    }

    if (this.props.title !== this.state.editedTitle) {
      if (
        window.confirm(
          `Continue to update from:\n${this.props.title}\nTO:\n${this.state.editedTitle}`
        )
      ) {
        const { id } = this.props;
        const { editedTitle } = this.state;

        TodoActions.update(id, editedTitle);
      } else {
        this.setState({
          editedTitle: this.props.title,
        });
      }
    }
  }

  _onCompleteCheck(event) {
    const { id } = this.props;

    TodoActions.complete(id);
  }

  _onDeleteTodo(event) {
    if (
      window.confirm(
        `Are you sure you want to delete the item: ${this.props.title}?\n\nThis action is NOT reversible!!!`
      )
    ) {
      const { id } = this.props;

      TodoActions.destroy(id);
    }
  }

  _renderCheckbox() {
    const { complete } = this.props;

    return (
      <div className="col-2 todo-item__checkbox">
        <input
          type="checkbox"
          className="form-control"
          defaultChecked={complete}
          onChange={this._onCompleteCheck}
        />
      </div>
    );
  }

  _onChangeTitle(event) {
    const target = event.target;
    const value = target.value;

    this.setState({
      editedTitle: value,
    });
  }

  _renderTitle() {
    const { editedTitle } = this.state;

    return (
      <div className="col-9 todo-item__title">
        <Editable
          type="input"
          text={editedTitle}
          todoEditInputRef={this._todoEditInputRef}
          placeholder="What do you need to do?"
        >
          <input
            type="text"
            name="task"
            value={editedTitle}
            ref={this._todoEditInputRef}
            className="form-control add-new-todo"
            placeholder="What do you need to do?"
            onChange={this._onChangeTitle}
            onBlur={this._onSaveTodoEdit}
          />
        </Editable>
      </div>
    );
  }

  _renderDeleteButton() {
    const { title } = this.props;

    return (
      <div className="col-1 todo-item__delete" onClick={this._onDeleteTodo}>
        <img
          className="todo-item-delete-icon"
          src="/images/delete-button.svg"
          alt="Delete Item"
          title={`Delete ${title}`}
        />
      </div>
    );
  }

  render() {
    return (
      <li className="list-group-item todo-item">
        <div className="row">
          {this._renderCheckbox()}
          {this._renderTitle()}
          {this._renderDeleteButton()}
        </div>
      </li>
    );
  }
}

export default TodoItem;
