import('fixed-data-table-2/dist/fixed-data-table.css')

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import {Grid, Row,Col,PageHeader,Button,ButtonGroup, FormControl} from 'react-bootstrap'
import {Table,Column,Cell} from 'fixed-data-table-2'
import mimeTypes from '../core/mimeTypes'
const GutterWidth = 30

export default class HarViewer extends Component {
  state= {
    isColumnResizing: false,
    columnWidths: {
      url: 500,
      size: 100,
      time: 200
    },
    tableWidth: 1000,
    tableHeight: 500
  }


  render() {
    let buttons = _.map(_.keys(mimeTypes.types), x => {
      return this._createButton(x, mimeTypes.types[x].label)
    })
    return (
      <Grid> 
        <Row>
          <Col sm={12}>
            <PageHeader> Har Viewer</PageHeader>
          </Col>
          <Col sm={3} smOffset={9}>
            <div>
              <label  className="control-label"></label>
              <select onChange={this._sampleShanged.bind(this)} className="form-control">
                <option value=""> ---</option>
              </select>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={8} >
            <ButtonGroup bsSize="small">
              {this._createButton('all', 'All')}
              {buttons}
            </ButtonGroup>
          </Col>
          <Col sm={4} >
            <FormControl type="search"
              placeholder="Search Url"
              bsSize="small"
              onChange={this._filterTextChanged.bind(this)}
              ref="filterText" 
              />
          </Col> 
        </Row>
        <Row>
          <Col sm={12}>
            <Table 
              ref="entriesTable"
              rowsCount={this.props.entries.length} 
              width={this.state.tableWidth}
              headerHeight={30}
              height={this.state.tableHeight}
              rowHeight={30}
              rowGetter={this._getEntry.bind(this)}
              isColumnResizing={this.state.isColumnResizing}
              onColumnResizeEndCallback={this._onColumnResized.bind(this)}
            >
              <Column 
                columnKey='url'
                width={this.state.columnWidths.url}
                isResizable={true}
                header='Url' />
                <Column 
                columnKey='size'
                width={this.state.columnWidths.size}
                isResizable={true}
                header='Size' />
                <Column 
                columnKey='time'
                width={this.state.columnWidths.time}
                minWidth={200}
                isResizable={true}
                header='TimeLine' />
            </Table>
          </Col>
        </Row>
      </Grid>
    )
  }

  _getEntry(index){
    return this.props.entries[index]
  }
  _onColumnResized(newColumnWidth, columnKey){
    
    let columnWidths = this.state.columnWidths;
    columnWidths[columnKey] = newColumnWidth;
    this.setState({columnWidths: columnWidths, isColumnResizing: false})
  }

  _sampleShanged(){

  }

  componentDidMount(){
    window.addEventListener('resize', _.debounce(this._onResize.bind(this), 50, {length: true, trailing: true}))
    this._onResize()
  }

  _onResize(){
    let parent = ReactDOM.findDOMNode(this.refs.entriesTable).parentNode

    this.setState({
      tableWidth: parent.clientWidth - GutterWidth,
      tableHeight: document.body.clientHeight - parent.offsetTop - GutterWidth*0.5
    })
  }
  _createButton(type, label){
    let handler = this._filterRequested.bind(this, type)
    return (
      <Button key = {type}
      bsStyle="primary"
      active= {this.state.type === type}
      onClick = {handler} >
      {label}
      </Button>
    )
  }
  _filterRequested(type, event){

  }

  _filterTextChanged(){

  }


}

HarViewer.defaultProps = {
  entries: []
}


