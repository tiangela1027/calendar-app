import axios from "axios";
import React, { Component } from "react";
import { csrftoken } from "./CSRFToken";
import AlertDialog from "./AlertDialog";
import FormDialog from "./FormDialog";
import EditFormDialog from "./EditFormDialog";

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import RemoveIcon from '@material-ui/icons/Remove';
class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            alertOpen: false,
            addFormOpen: false,
            editFormOpen: false,
            taskId: 0,
            postTitle: "",
            postDesc: "",
            currItem: {}
        };
    }

    // Delete dialog helpers
    handleAlertOpen = (item) => {
        this.setState({ alertOpen: true, taskId: item.id });
    };

    handleAlertClose = () => {
        this.setState({ alertOpen: false });
    };

    // Add dialog helpers
    handleAddFormOpen = (item) => {
        this.setState({ addFormOpen: true });
    };

    handleAddFormClose = () => {
        this.setState({ addFormOpen: false });
    };

    // Edit dialog helpers
    handleEditFormOpen = (item) => {
        this.setState({
            currItem: item,
            postTitle: item.title,
            postDesc: item.description,
            editFormOpen: true
        });
    };

    handleEditFormClose = () => {
        this.setState({ editFormOpen: false });
    };

    handleEditTask = () => {
        axios
            .put(`/api/tasks/${this.state.currItem.id}/`,
                {
                    title: this.state.postTitle,
                    description: this.state.postDesc,
                    create_date: this.state.currItem.create_date,
                    completed: this.state.currItem.completed
                },
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': csrftoken,
                    }
                }
            ).then((res) => window.location.reload());
    }

    handleTitleChange = (event) => {
        this.setState({ postTitle: event.target.value })
    }

    handleDescChange = (event) => {
        this.setState({ postDesc: event.target.value });
    }

    // Other helpers
    displayCompleted = (status) => {
        if (status) {
            return this.setState({ viewCompleted: true });
        }

        return this.setState({ viewCompleted: false });
    };

    handleDeleteTask = () => {
        axios
            .delete(`/api/tasks/${this.state.taskId}/`,
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': csrftoken
                    }
                }
            )
            .then((res) => window.location.reload());
    }

    handleMarkComplete = (item) => {
        axios
            .get(`/calendar/${item.id}/markComplete/`)
            .then((res) => window.location.reload());
    }

    handleMarkIncomplete = (item) => {
        axios
            .get(`/calendar/${item.id}/markIncomplete/`)
            .then((res) => window.location.reload());
    }

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
                    <button
                        className={!this.state.viewCompleted ? "btn btn-warning mr-2 hidden" : "btn btn-warning mr-2"}
                        onClick={() => this.handleMarkIncomplete(item)}
                        title="Mark incomplete"
                    >
                        <RemoveIcon />
                    </button>
                    <button
                        className={this.state.viewCompleted ? "btn btn-success mr-2 hidden" : "btn btn-success mr-2"}
                        onClick={() => this.handleMarkComplete(item)}
                        title="Mark complete"
                    >
                        <CheckIcon />
                    </button>
                    <button
                        className={this.state.viewCompleted ? "btn btn-secondary mr-2 hidden" : "btn btn-secondary mr-2"}
                        onClick={() => this.handleEditFormOpen(item)}
                    >
                        <EditIcon />
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => this.handleAlertOpen(item)}
                        title="Delete task"
                    >
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
                                    onClick={() => this.handleAddFormOpen()}
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
                    handleSubmit={this.handleDeleteTask}
                    title="This task will be deleted."
                    desc="This action cannot be undone."
                />
                <FormDialog
                    open={this.state.addFormOpen}
                    handleClose={this.handleAddFormClose}
                    title="Add a New Task"
                />
                <EditFormDialog
                    open={this.state.editFormOpen}
                    handleClose={this.handleEditFormClose}
                    title="Edit Task"
                    postTitle={this.state.postTitle}
                    postDesc={this.state.postDesc}
                    handleEditTask={this.handleEditTask}
                    handleTitleChange={this.handleTitleChange}
                    handleDescChange={this.handleDescChange}
                />
            </main>
        );
    }
}

export default Tasks;
