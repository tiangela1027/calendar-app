import React, { Component } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Tasks from "./components/Tasks";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const items = [
  { name: '/home', label: 'Home' },
  { name: '/tasks', label: 'Tasks' },
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("api/tasks/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="rowSideBySide">
        <Router>
          <Sidebar items={items} />
          <Switch>
            <Route path="/home">
            </Route>
            <Route path="/tasks">
              <Tasks todoList={this.state.todoList} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
