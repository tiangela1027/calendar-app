import axios from "axios";
import React, { Component } from "react";
import { getCookie } from "./CSRFToken";

class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            open: false,
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    displayCompleted = (status) => {
        if (status) {
            return this.setState({ viewCompleted: true });
        }

        return this.setState({ viewCompleted: false });
    };

    renderTabList = () => {
        return (
            <div className="nav nav-tabs">
                <span
                    className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(true)}
                >
                    Complete
                </span>
                <span
                    className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
                    onClick={() => this.displayCompleted(false)}
                >
                    Incomplete
                </span>
            </div>
        );
    };

    handleDelete = (item) => {
        axios
            .delete(`/api/tasks/${item.id}/`,
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': `${getCookie('csrftoken')}`
                    }
                }
            )
            .then((res) => window.location.reload());
    }

    renderItems = () => {
        const { viewCompleted } = this.state;
        const newItems = this.props.todoList.filter(
            (item) => viewCompleted ? item.completed !== 0 : item.completed === 0
        );

        return newItems.map((item) => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
                <span
                    className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""
                        }`}
                    title={item.create_date}
                >
                    {item.title}
                </span>
                <small>{item.description}</small>
                <span>
                    <button className="btn btn-secondary mr-2">
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => this.handleDelete(item)}>
                        Delete
                    </button>
                </span>
            </li>
        ));
    };

    render() {
        return (
            <main className="container">
                <h1 className="text-center my-4">Tasks</h1>
                <div className="row">
                    <div className="col-md-10 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush border-top-0">
                                {this.renderItems()}
                            </ul>
                            <br />
                            <div className="mb-4">
                                <button className={this.state.viewCompleted ? "btn btn-primary hidden" : "btn btn-primary"} >
                                    Add task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Tasks;
