import React, { Component } from "react";
import HarViewer from './components/HarViewer'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import './app.scss'

class App extends Component {
  render() {
    return (
      <div className="App">
        <HarViewer />
      </div>
    );
  }
}

export default App;
