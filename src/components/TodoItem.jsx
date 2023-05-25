import React from "react";

class TodoItem extends React.Component {
  constructor(props) {
    super(props);

    this._onCompleteCheck = this._onCompleteCheck.bind(this);
  }

  _onCompleteCheck(event) {
    const { id, onComplete } = this.props;

    onComplete(id);
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

  _renderTitle() {
    const { title } = this.props;

    return (
      <div className="col-10 todo-item__title">
        <h3>{title}</h3>
      </div>
    );
  }

  render() {
    return (
      <li className="list-group-item todo-item">
        <div className="row">
          {this._renderCheckbox()}
          {this._renderTitle()}
        </div>
      </li>
    );
  }
}

export default TodoItem;
