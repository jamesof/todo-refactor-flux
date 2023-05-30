import React, { Component } from "react";

import TodoStore from "./stores/TodoStore";
import TodoList from "./components/TodoList";
import TodoActions from "./actions/TodoActions";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      todos: TodoStore.getAll(),
    };

    this._onChange = this._onChange.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);
    this._onClickAdd = this._onClickAdd.bind(this);
    this._onEnterPressAdd = this._onEnterPressAdd.bind(this);
  }

  componentDidMount() {
    TodoStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    TodoStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      todos: TodoStore.getAll(),
    });
  }

  _onChangeTitle(event) {
    const target = event.target;
    const value = target.value;

    this.setState({
      title: value,
    });
  }

  _onEnterPressAdd(event) {
    if (13 === event.keyCode) {
      this._onClickAdd();
    }
  }

  _onClickAdd(event) {
    TodoActions.create(this.state.title);
    this.setState({ title: "" });
  }

  _renderHeader() {
    const { title } = this.state;

    return (
      <div className="todos-app-header card-header">
        <h2>ToDo</h2>
        <div className="input-group">
          <input
            type="text"
            name="title"
            placeholder="What do you need to do?"
            className="form-control add-new-todo"
            onChange={this._onChangeTitle}
            onKeyDown={this._onEnterPressAdd}
            value={title}
          />
          <div className="input-group-append">
            <button
              className="btn btn-success"
              type="button"
              onClick={this._onClickAdd}
            >
              <span
                className=""
                style={{
                  fontSize: "24px",
                  lineHeight: "16px",
                }}
              >
                +
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { todos } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col col-md-8 offset-md-2 mt-2">
            <div className="todos-app card">
              {this._renderHeader()}
              <div className="card-body">
                {Object.keys(todos).length > 0 ? (
                  <TodoList todos={todos} />
                ) : (
                  <p className="error">No saved ToDos found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
