import("fixed-data-table-2/dist/fixed-data-table.css");

import React, { Component } from "react";
import ReactDOM from "react-dom";
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
import HarEntryTable from "./har-entry-table/HarEntryTable";
import harParser from "../core/har-parser";
import FilterBar from "./FilterBar";
import SampleSelector from './SampleSelector'
import samples from '../core/samples'
const GutterWidth = 30;


export default class HarViewer extends Component {
  state = this._initialState();

  _initialState() {
    return {
      activeHar: null,
      entries: [],
      sortKey: null,
      sortDirection: null,
      filterType: 'all',
      filterText: null
    };
  }

  render() {
    let content = this.state.activeHar
      ? this._renderViewer(this.state.activeHar)
      : this._renderEmptyViewer();

    let entries = [];

    return (
      <div>
        {this._renderHeader()}
        {content}
      </div>
    );
  }

  _renderEmptyViewer() {
    return (
      <Grid fluid>
        <Row>
          <Col sm={12}>
            <p />
            <Alert bsStyle="warning">
              <strong>No Har loaded</strong>
            </Alert>
          </Col>
        </Row>
      </Grid>
    );
  }
  _renderViewer(har) {
    let pages = harParser.parse(har);
    let currentPage = pages[0];
    let filter = {
      type: this.state.filterType,
      text: this.state.filterText
    }
    let filteredEntries = this._filterEntries(filter, currentPage.entries)
    let entries = this._sortEntiesByKey(
      this.state.sortKey,
      this.state.sortDirection,
      filteredEntries
    );
    

    return (
      <Grid fluid>
        <Row>
          <Col sm={8} smOffset={2}>
            <FilterBar 
            onChange={this._onFilterChanged.bind(this)}
            onFilterTextChange={this._onFilterTextChanged.bind(this)}
             />
            <HarEntryTable
              entries={entries}
              onColumnSort={this._onColumnSort.bind(this)}
            />
          </Col>
        </Row>
      </Grid>
    );
  }

  _renderHeader() {
    
    return (
      <Grid>
        <Row>
          <Col sm={12}>
            <PageHeader> Har Viewer</PageHeader>
          </Col>
          <Col sm={3} smOffset={9}>
            <SampleSelector
            onSampleChanged={this._sampleChanged.bind(this)}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
  _sampleChanged(har){
    if(har){
      this.setState({activeHar: har})
    } else {
      this.setState(this._initialState())
    }
  }

  _onFilterChanged(type){
     this.setState({
       filterType: type
     })
  }
  _onFilterTextChanged(text){
    this.setState({
      filterText: text
    })
  }
  _filterEntries(filter, entries){
    return _.filter(entries, function(x){
      let matchesType = filter.type === 'all' || filter.type === x.type
      let matchesText = _.includes(x.request.url, filter.text || '')

      return matchesType && matchesText;
    })
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
    this.setState({ sortKey: columnKey, sortDirection: direction });
  }

  _sortEntiesByKey(sortKey, sortDirection, entries) {
    if (_.isEmpty(sortKey) || _.isEmpty(sortDirection)) return entries;

    let keyMap = {
      url: "request.url",
      time: "time.start"
    };

    let getValue = function(entry) {
      let key = keyMap[sortKey] || sortKey;
      return _.get(entry, key);
    };

    let sorted = _.sortBy(entries, getValue);

    if (sortDirection === "desc") {
      sorted.reverse();
    }

    return sorted;
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
