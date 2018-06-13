import React, { Component } from "react";
import PropTypes from "prop-types";
import samples from "../core/samples";
import ReactDOM from "react-dom";

export default class componentName extends Component {
  constructor() {
    super();
    this.state = {};
  }
  static propTypes = {
    onSampleChanged: PropTypes.func
  };

  render() {
    let options = _.map(samples, s => {
      return (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      );
    });
    return (
      <div>
        <label className="control-label" />
        <select
          ref="selector"
          onChange={this._sampleChanged.bind(this)}
          className="form-control"
        >
          <option value=""> --- </option>
          {options}
        </select>
      </div>
    );
  }
  _sampleChanged() {
    let selection = ReactDOM.findDOMNode(this.refs.selector).value;
    let har = selection ? _.find(samples, s => s.id === selection).har : null;

    if (this.props.onSampleChanged) {
      this.props.onSampleChanged(har);
    }
  }
}
