import("fixed-data-table-2/dist/fixed-data-table.css");

import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import {Grid, Row,Col,PageHeader,Button,ButtonGroup, FormControl, Alert} from 'react-bootstrap'
import mimeTypes from "../core/mime-types";
import HarEntryTable from "./har-entry-table/HarEntryTable";
import harParser from '../core/har-parser'

const GutterWidth = 30;
let samples = [
  {
      id: 'so',
      har: require('../store/sample-hars/stackoverflow.com.json'),
      label: 'Stack Overflow'
  },
  {
      id: 'nyt',
      har: require('../store/sample-hars/www.nytimes.com.json'),
      label: 'New York Times'
  },
  {
      id: 'react',
      har: require('../store/sample-hars/facebook.github.io.json'),
      label: 'Facebook React'
  }
];

export default class HarViewer extends Component {
  state = this._initialState()

  _initialState(){
    return {
      activeHar: null,
      entries: [],
      sortKey: null,
      sortDirection: null
    }
  }

  render() {
    let content = this.state.activeHar
    ? this._renderViewer(this.state.activeHar)
    : this._renderEmptyViewer()

     let entries = []


    return (
      <div>
        {this._renderHeader()}
        {content}
      </div>
      
    );
  }


  _renderEmptyViewer(){
    return (
      <Grid fluid>
      <Row>
        <Col sm={12}>
        <p></p>
        <Alert bsStyle="warning">
          <strong>No Har loaded</strong>
        </Alert>
          
        </Col>
      </Row>
    </Grid>
     )
  }
  _renderViewer(har){
    
    let pages = harParser.parse(har);
    let currentPage = pages[0];
    let entries = this._sortEntiesByKey(this.state.sortKey,this.state.sortDirection, currentPage.entries)
    
 return (
  <Grid fluid>
  <Row>
    <Col sm={8} smOffset={2}>
      <HarEntryTable entries={entries}
      onColumnSort={this._onColumnSort.bind(this)} />
    </Col>
  </Row>
</Grid>
 )
  }

  _renderHeader() {
    let buttons = _.map(_.keys(mimeTypes.types), x => {
      return this._createButton(x, mimeTypes.types[x].label);
    });
    let options = _.map(samples, s => {
      
      return (<option key={s.id } value={s.id}>{s.label}</option>)
    })
    return (
      <Grid>
        <Row>
          <Col sm={12}>
            <PageHeader> Har Viewer</PageHeader>
          </Col>
          <Col sm={3} smOffset={9}>
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
          </Col>
        </Row>
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
              ref="filterText"
            />
          </Col>
        </Row>
      </Grid>
    );
  }
  /* _getEntry(index) {
    return this.props.entries[index];
  } */
  /* _onColumnResized(newColumnWidth, columnKey) {
    let columnWidths = this.state.columnWidths;
    columnWidths[columnKey] = newColumnWidth;
    this.setState({ columnWidths: columnWidths, isColumnResizing: false });
  } */

  //sorting

  _onColumnSort(columnKey, direction) {
    this.setState({sortKey: columnKey, sortDirection: direction})
  }

  _sortEntiesByKey(sortKey, sortDirection,entries) {
    if (_.isEmpty(sortKey) || _.isEmpty(sortDirection)) return entries;

    let keyMap = {
      url: 'request.url',
      time: 'time.start'
    }

    let getValue = function(entry){
      let key = keyMap[sortKey] || sortKey
      return _.get(entry, key)
    }

    let sorted = _.sortBy(entries, getValue)
    
    if (sortDirection === 'desc'){
      sorted.reverse()
    }

    return sorted;
  }
    

  _sampleChanged() {
    let selection = ReactDOM.findDOMNode(this.refs.selector).value
    let har = selection
      ? _.find(samples, s => s.id === selection).har
      : null

      if (har) {
        this.setState({activeHar: har})
      } else {
        this.setState(this._initialState())
      }
  }

 /*  componentDidMount() {
    window.addEventListener(
      "resize",
      _.debounce(this._onResize.bind(this), 50, {
        length: true,
        trailing: true
      })
    );
    this._onResize();
  } */

  /* _onResize() {
    let parent = ReactDOM.findDOMNode(this.refs.entriesTable).parentNode;

    this.setState({
      tableWidth: parent.clientWidth - GutterWidth,
      tableHeight:
        document.body.clientHeight - parent.offsetTop - GutterWidth * 0.5
    });
  } */
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
  _filterRequested(type, event) {}

  _filterTextChanged() {}
}

/* HarViewer.defaultProps = {
  entries: []
}; */
