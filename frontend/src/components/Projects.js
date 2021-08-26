import axios from "axios";
import React, { Component } from "react";
import { csrftoken } from "./CSRFToken";
import AlertDialog from "./AlertDialog";
import ProjectFormDialog from "./ProjectFormDialog";
import EditProjectFormDialog from "./EditProjectFormDialog";
import { handleDate } from "../helpers/Date";

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import RemoveIcon from '@material-ui/icons/Remove';
import CachedIcon from '@material-ui/icons/Cached';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from "react-router-dom";

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewStatus: 0,
            alertOpen: false,
            addFormOpen: false,
            editFormOpen: false,
            projectId: 0,
            postTitle: "",
            postDesc: "",
            currItem: {},
        };
    }

    // Delete dialog helpers
    handleAlertOpen = (item) => {
        this.setState({ alertOpen: true, projectId: item.id });
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

    handleEditProject = () => {
        axios
            .put(`/api/projects/${this.state.currItem.id}/`,
                {
                    title: this.state.postTitle,
                    description: this.state.postDesc,
                    create_date: this.state.currItem.create_date,
                    status: this.state.currItem.status,
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
        return this.setState({ viewStatus: status });
    };

    handleDeleteTask = () => {
        axios
            .delete(`/api/projects/${this.state.projectId}/`,
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': csrftoken
                    }
                }
            )
            .then((res) => window.location.reload());
    }

    handleChangeStatus = (item, status) => {
        axios
            .get(`/calendar/${item.id}/changeProjectStatus/${status}`)
            .then((res) => window.location.reload());
    }

    renderTabList = () => {
        return (
            <div className="nav nav-tabs">
                <span
                    className={this.state.viewStatus == 0 ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(0)}
                >
                    On Hold
                </span>
                <span
                    className={this.state.viewStatus == 1 ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(1)}
                >
                    In Progress
                </span>
                <span
                    className={this.state.viewStatus == 2 ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(2)}
                >
                    Completed
                </span>
            </div>
        );
    };

    renderItems = () => {
        const { viewStatus } = this.state;
        const newItems = this.props.projectList.filter(
            (item) => viewStatus === item.status
        );

        return newItems.map((item) => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
                <span className="d-flex col-5">
                    <span
                        className={`col-10 todo-title mr-2`}
                    >
                        <span>{item.title}</span>
                        <br />
                        <small>{handleDate(item)}</small>
                    </span>
                </span>
                <span className="col-5"><small>{item.description}</small></span>
                <span className="col-1">
                    <button
                        className={`btn btn-success sm ${this.state.viewStatus == 1 ? "" : "hidden"}`}
                        onClick={() => this.handleChangeStatus(item, 2)}
                        title="Mark complete"
                    >
                        <CheckIcon />
                    </button>
                    <button
                        className={`btn btn-info sm ${this.state.viewStatus !== 1 ? "" : "hidden"}`}
                        onClick={() => this.handleChangeStatus(item, 1)}
                        title="Mark in progress"
                    >
                        <CachedIcon />
                    </button>
                    <button
                        className={`btn btn-warning sm ${this.state.viewStatus !== 0 ? "" : "hidden"}`}
                        onClick={() => this.handleChangeStatus(item, 0)}
                        title="Mark on hold"
                    >
                        <RemoveIcon />
                    </button>
                    <button
                        className={`btn btn-secondary sm ${this.state.viewStatus === 0 ? "" : "hidden"}`}
                        onClick={() => this.handleEditFormOpen(item)}
                    >
                        <EditIcon />
                    </button>
                    <Link to={{
                        pathname: "/tasks",
                        projectTitle: item.title,
                        todoList: item.tasks,
                        projectList: this.props.projectList,
                    }} className="btn btn-success sm linkButton" title="Go to tasks">
                        <AssignmentIcon />
                    </Link>
                    <button
                        className="btn btn-danger sm "
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
                <h1 className="my-4">Projects</h1>
                <div className="row">
                    <div className="col-md-12 col-sm-10 mx-auto p-0">
                        <div className="card p-3 mb-3">
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush border-top-0">
                                {this.renderItems()}
                            </ul>
                            <br />
                            <div className="mb-2">
                                <button
                                    className={`btn btn-success ${this.state.viewStatus === 0 ? "" : "hidden"}`}
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
                    title="This project will be deleted."
                    desc="This action cannot be undone."
                />
                <ProjectFormDialog
                    open={this.state.addFormOpen}
                    handleClose={this.handleAddFormClose}
                    title="Add a New Project"
                />
                <EditProjectFormDialog
                    open={this.state.editFormOpen}
                    handleClose={this.handleEditFormClose}
                    title="Edit Project"
                    postTitle={this.state.postTitle}
                    postDesc={this.state.postDesc}
                    handleEditProject={this.handleEditProject}
                    handleTitleChange={this.handleTitleChange}
                    handleDescChange={this.handleDescChange}
                />
            </main>
        );
    }
}

export default Projects;
