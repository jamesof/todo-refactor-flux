import React, { Component } from "react";
import { dispatch, select, subscribe } from "@wordpress/data";

import TodoList from "./components/TodoList";
import { store as todoStore } from "./stores/TodoStore";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      todos: select(todoStore).getAll(),
      filterByCompleteState: null,
    };

    this.unsubscribe = null;
    this._onChange = this._onChange.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);
    this._onClickAdd = this._onClickAdd.bind(this);
    this._onEnterPressAdd = this._onEnterPressAdd.bind(this);
    this._filterByCompleteState = this._filterByCompleteState.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = subscribe(this._onChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  _onChange() {
    this.setState({
      todos: select(todoStore).getAll(this.state.filterByCompleteState),
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
    dispatch(todoStore).create(this.state.title);

    this.setState({ title: "" });
  }

  _filterByCompleteState(completeState) {
    this.setState({
      filterByCompleteState: completeState,
      todos: select(todoStore).getAll(completeState),
    });
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
                    All ({select(todoStore).todosCount()})
                  </span>
                  <span
                    onClick={() => this._filterByCompleteState(true)}
                    className={`${
                      filterByCompleteState === true ? "active" : ""
                    } filter`}
                  >
                    Complete ({select(todoStore).completeCount()})
                  </span>
                  <span
                    onClick={() => this._filterByCompleteState(false)}
                    className={`${
                      filterByCompleteState === false ? "active" : ""
                    } filter`}
                  >
                    InComplete ({select(todoStore).inCompleteCount()})
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
