require("fixed-data-table/dist/fixed-data-table.css");
require("./_har-entry-table.scss");

import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import { Table, Column } from "fixed-data-table-2";
import TimeBar from "../timebar/TimeBar.jsx";
import FileType from "../file-type/FileType.jsx";
import formatter from "../../core/formatter";
import { OverlayTrigger, Popover, Tooltip, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import {scaleLinear} from 'd3-scale'

const GutterWidth = 30;

export default class HarEntryTable extends React.Component {
  constructor() {
    super();

    this.state = {
      highlightRow: -1,
      columnWidths: {
        url: 800,
        size: 150,
        time: 272
      },
      sortDirection: {
        url: null,
        size: null,
        time: null
      },
      tableWidth: 1100,
      tableHeight: 500,
      isColumnResizing: false
    };
  }

  render() {
    return (
      <Table
        rowsCount={this.props.entries.length}
        width={this.state.tableWidth}
        headerHeight={30}
        height={this.state.tableHeight}
        rowHeight={40}
        /* rowGetter={this._getEntry.bind(this)}
        rowClassNameGetter={this._getRowClasses.bind(this)} */
        isColumnResizing={this.state.isColumnResizing}
        onColumnResizeEndCallback={this._onColumnResized.bind(this)}
      >
        <Column
          columnKey="url"
          cell={this._renderUrlColumn.bind(this)}
          header={this._renderHeader.bind(this)}
          width={this.state.columnWidths.url}
          isResizable={true}
        />
        <Column
          columnKey="size"
          cell={this._renderSizeColumn.bind(this)}
          header={this._renderHeader.bind(this)}
          width={this.state.columnWidths.size}
          minWidth={200}
          isResizable={true}
        />
        <Column
          columnKey="time"
          header={this._renderHeader.bind(this)}
          cell={this._renderTimeColumn.bind(this)}
          width={this.state.columnWidths.time}
          
          minWidth={200}
          isResizable={true}
        />
      </Table>
    );
  }

  _onColumnResized(newColumnWidth, dataKey) {
    var columnWidths = this.state.columnWidths;
    columnWidths[dataKey] = newColumnWidth;

    this.setState({ columnWidths: columnWidths, isColumnResizing: false });
  }

  _renderSizeColumn(cellData) {
    return (
      <span>{this.props.entries[cellData.rowIndex][cellData.columnKey]}</span>
    );
  }

  _renderUrlColumn(cellData) {
    return <span>{this.props.entries[cellData.rowIndex].request.url}</span>;
  }

  _renderTimeColumn(cellData) {
    console.log(this.props.entries[cellData.rowIndex][cellData.columnKey])
    let start = this.props.entries[cellData.rowIndex][cellData.columnKey].start;
    let total = this.props.entries[cellData.rowIndex][cellData.columnKey].total;
    let pgTimings = this.props.page.pageTimings;
    let scale = this._prepareScale(this.props.entries, this.props.page);
    return (
      <TimeBar
        scale={scale}
        start={start}
        total={total}
        timings={this.props.entries[cellData.rowIndex][cellData.columnKey].details}
        domContentLoad={pgTimings.onContentLoad}
        pageLoad={pgTimings.onLoad}
      />
    );
  }

  _prepareScale(entries, page) {
    let startTime = 0,
      lastEntry = _.last(entries),
      endTime = lastEntry.time.start + lastEntry.time.total,
      maxTime = Math.max(endTime, page.pageTimings.onLoad);
      
    let scale = scaleLinear()      
      .domain([startTime, Math.ceil(maxTime)])
      .range([0, 100]);
    
    return scale;
  }

  //-----------------------------------------
  //              Table Sorting
  //-----------------------------------------
  _renderHeader(cellData) {
    var dir = this.state.sortDirection[cellData.columnKey],
      classMap = {
        asc: "glyphicon glyphicon-sort-by-attributes",
        desc: "glyphicon glyphicon-sort-by-attributes-alt"
      },
      sortClass = dir ? classMap[dir] : "";

    return (
      <div
        className="text-primary sortable"
        onClick={this._columnClicked.bind(this, cellData.columnKey)}
      >
        <span>{cellData.columnKey}</span>
        &nbsp;
        <i className={sortClass} />
      </div>
    );
  }

  _columnClicked(columnKey) {
    var sortDirections = this.state.sortDirection;
    var dir = sortDirections[columnKey];

    if (dir === null) {
      dir = "asc";
    } else if (dir === "asc") {
      dir = "desc";
    } else if (dir === "desc") {
      dir = null;
    }

    // Reset all sorts
    _.each(_.keys(sortDirections), function(x) {
      sortDirections[x] = null;
    });

    sortDirections[columnKey] = dir;

    if (this.props.onColumnSort) {
      this.props.onColumnSort(columnKey, dir);
    }
  }

  //-----------------------------------------
  //              Table Resizing
  //-----------------------------------------
  componentDidMount() {
    window.addEventListener("resize", this._onResize.bind(this));
    this._onResize();
  }

  _onResize() {
    clearTimeout(this._updateSizeTimer);
    this._updateSizeTimer = setTimeout(this._updateSize.bind(this), 50);
  }

  _updateSize() {
    var parent = ReactDOM.findDOMNode(this).parentNode;

    this.setState({
      tableWidth: parent.clientWidth - GutterWidth,
      tableHeight:
        document.body.clientHeight - parent.offsetTop - GutterWidth * 0.5
    });
  }
}

HarEntryTable.defaultProps = {
  entries: [],
  page: null,
  onColumnSort: null,
  timeScale: null
};

HarEntryTable.propTypes = {
  entries: PropTypes.array,
  page: PropTypes.object,
  onColumnSort: PropTypes.func,
  timeScale: PropTypes.func
};
