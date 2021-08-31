import React, { Component } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Tasks from "./components/Tasks";
import Projects from "./components/Projects";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectList: [],
    };
  }

  componentDidMount() {
    this.refreshProjectsList();
  }

  refreshProjectsList = () => {
    axios
      .get("api/projects/")
      .then((res) => this.setState({ projectList: res.data }))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="rowSideBySide">
        <Router>
          <Sidebar items={[
            { name: '/home', label: 'Home' },
            { name: '/projects', label: 'Projects' },
            { name: '/tasks', label: 'Tasks' }
          ]} />
          <Switch>
            <Route path="/home"></Route>
            <Route path="/projects">
              <Projects projectList={this.state.projectList} />
            </Route>
            <Route path="/tasks" component={Tasks}>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
