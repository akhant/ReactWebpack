import React, { Component } from "react";
import ReactDOM from 'react-dom'

import _ from "lodash";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Button,
  ButtonGroup,
  FormControl,
  Alert
} from "react-bootstrap";
import mimeTypes from "../core/mime-types";
import PropTypes from 'prop-types'

export default class FilterBar extends Component {
  constructor() {
    super();

    this.filterText = React.createRef();
    this.state = {
      type: 'all'
    };
  }
  render() {
    let buttons = _.map(_.keys(mimeTypes.types), x => {
      return this._createButton(x, mimeTypes.types[x].label);
    });
    return (
      <Row>
        <Col sm={8}>
          <ButtonGroup bsSize="small">
            {this._createButton("all", "All")}
            {buttons}
          </ButtonGroup>
        </Col>
        <Col sm={4}>
          <FormControl
            type="search"
            placeholder="Search Url"
            bsSize="small"
            onChange={this._filterTextChanged.bind(this)}
            ref={this.filterText}
          />
        </Col>
      </Row>
    );
  }

  _createButton(type, label) {
    let handler = this._filterRequested.bind(this, type);
    return (
      <Button
        key={type}
        bsStyle="primary"
        active={this.state.type === type}
        onClick={handler}
      >
        {label}
      </Button>
    );
  }

  _filterRequested(type, event) {
    this.setState({ type: type });
    if (this.props.onChange) {
      this.props.onChange(type);
    }
  }

  _filterTextChanged() {
    
    if (this.props.onFilterTextChange) {
      this.props.onFilterTextChange(ReactDOM.findDOMNode(this.filterText.current).value);
    }
  }
}

FilterBar.propTypes = {
  onChange: PropTypes.func,
  onFilterTextChange: PropTypes.func
}
