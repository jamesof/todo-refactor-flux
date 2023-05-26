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
      filterByCompleteState: null,
    };

    this._onChange = this._onChange.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);
    this._onClickAdd = this._onClickAdd.bind(this);
    this._onEnterPressAdd = this._onEnterPressAdd.bind(this);
    this._filterByCompleteState = this._filterByCompleteState.bind(this);

    this._todosCount = this._todosCount.bind(this);
    this._completeCount = this._completeCount.bind(this);
    this._inCompleteCount = this._inCompleteCount.bind(this);
  }

  componentDidMount() {
    TodoStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    TodoStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      todos: TodoStore.getAll(this.state.filterByCompleteState),
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

  _filterByCompleteState(completeState) {
    this.setState({
      filterByCompleteState: completeState,
      todos: TodoStore.getAll(completeState),
    });
  }

  _todosCount() {
    return TodoStore.todosCount();
  }

  _completeCount() {
    return TodoStore.completeCount();
  }

  _inCompleteCount() {
    return TodoStore.inCompleteCount();
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
    const { todos, filterByCompleteState } = this.state;
    const noTodosFound = Object.keys(todos).length === 0;

    return (
      <div className="container">
        <div className="row">
          <div className="col col-md-8 offset-md-2 mt-2">
            <div className="todos-app card">
              {this._renderHeader()}
              <div className="card-body">
                <div className="filter-by-complete">
                  <span
                    onClick={() => this._filterByCompleteState(null)}
                    className={`${
                      filterByCompleteState === null ? "active" : ""
                    } filter`}
                  >
                    All ({this._todosCount()})
                  </span>
                  <span
                    onClick={() => this._filterByCompleteState(true)}
                    className={`${
                      filterByCompleteState === true ? "active" : ""
                    } filter`}
                  >
                    Complete ({this._completeCount()})
                  </span>
                  <span
                    onClick={() => this._filterByCompleteState(false)}
                    className={`${
                      filterByCompleteState === false ? "active" : ""
                    } filter`}
                  >
                    InComplete ({this._inCompleteCount()})
                  </span>
                </div>

                {noTodosFound ? (
                  filterByCompleteState === null ? (
                    <p className="error">No saved ToDos found.</p>
                  ) : (
                    <p className="error">
                      No saved ToDos found matching selected filter.
                    </p>
                  )
                ) : (
                  <TodoList todos={todos} />
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
