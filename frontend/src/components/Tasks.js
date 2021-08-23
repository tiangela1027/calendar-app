import axios from "axios";
import React, { Component } from "react";
import { getCookie } from "./CSRFToken";
import AlertDialog from "./AlertDialog";

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import FormDialog from "./FormDialog";

class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            alertOpen: false,
            formOpen: false,
            taskId: 0,
        };
    }

    handleAlertOpen = (item) => {
        this.setState({ alertOpen: true, taskId: item.id });
    };

    handleAlertClose = () => {
        this.setState({ alertOpen: false });
    };

    handleFormOpen = (item) => {
        this.setState({ formOpen: true });
    };

    handleFormClose = () => {
        this.setState({ formOpen: false });
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

    handleDelete = () => {
        axios
            .delete(`/api/tasks/${this.state.taskId}/`,
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
                        <EditIcon />
                    </button>
                    <button className="btn btn-danger" onClick={() => this.handleAlertOpen(item)}>
                        <DeleteOutlineIcon />
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
                                <button
                                    className={this.state.viewCompleted ? "btn btn-success hidden" : "btn btn-success"}
                                    onClick={() => this.handleFormOpen()}
                                >
                                    <AddIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <AlertDialog
                    open={this.state.alertOpen}
                    handleClose={this.handleAlertClose}
                    handleSubmit={this.handleDelete}
                    title="This task will be deleted."
                    desc="This action cannot be undone."
                />
                <FormDialog
                    open={this.state.formOpen}
                    handleClose={this.handleFormClose}
                    handleSubmit={() => {}}
                    title="Add a New Task"
                />
            </main>
        );
    }
}

export default Tasks;
