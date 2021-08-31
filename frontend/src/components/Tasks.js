import axios from "axios";
import React, { Component } from "react";
import { csrftoken } from "./CSRFToken";
import AlertDialog from "./AlertDialog";
import TaskFormDialog from "./TaskFormDialog";
import { handleDate } from "../helpers/Date";

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import RemoveIcon from '@material-ui/icons/Remove';
import CachedIcon from '@material-ui/icons/Cached';

class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewStatus: 0,
            alertOpen: false,
            addFormOpen: false,
            editFormOpen: false,
            taskId: 0,
            postTitle: "",
            postDesc: "",
            postPriority: 0,
            postProject: 0,
            addTitle: "",
            addDesc: "",
            addPriority: 0,
            addProject: 0,
            currItem: {},
            projectTitle: "All",
            tasks: [],
            projects: [],
        };
    }

    refreshTasksList = () => {
        axios
            .get("api/tasks/")
            .then((res) => this.setState({ tasks: res.data }))
            .catch((err) => console.log(err));
    }

    refreshProjectsList = () => {
        axios
            .get("api/projects/")
            .then((res) => this.setState({ projects: res.data }))
            .catch((err) => console.log(err));
    }

    componentDidMount = () => {
        this.refreshTasksList();
        this.refreshProjectsList();
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
        this.setState({ addFormOpen: true, addProject: this.state.projects[0].id });
    };

    handleAddFormClose = () => {
        this.setState({ addFormOpen: false });
    };

    handleProject = () => {
        return this.props.location.projectId ? this.props.location.projectId : this.state.addProject;
    }

    handleAddTask = () => {
        let date = new Date();
        axios
            .post(`/api/tasks/`,
                {
                    title: this.state.addTitle,
                    description: this.state.addDesc,
                    create_date: date,
                    status: 0,
                    priority: this.state.addPriority,
                    project: this.handleProject()
                },
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': csrftoken,
                    }
                }
            ).then((res) => window.location.reload());
    }

    handleAddTitleChange = (event) => {
        this.setState({ addTitle: event.target.value })
    }

    handleAddDescChange = (event) => {
        this.setState({ addDesc: event.target.value });
    }

    handleAddPriorityChange = (event) => {
        this.setState({ addPriority: event.target.value });
    };

    handleAddProjectChange = (event) => {
        this.setState({ addProject: event.target.value });
    };

    // Edit dialog helpers
    handleEditFormOpen = (item) => {
        this.setState({
            currItem: item,
            postTitle: item.title,
            postDesc: item.description,
            postPriority: item.priority,
            postProject: item.project,
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
                    status: this.state.currItem.status,
                    priority: this.state.postPriority,
                    project: this.state.postProject,
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

    setPriorityStyle = (item) => {
        switch (item.priority) {
            case 1:
                return "low";
            case 2:
                return "medium";
            case 3:
                return "high";
            default:
                return "";
        }
    }

    handlePriorityChange = (event) => {
        this.setState({ postPriority: event.target.value });
    };

    handleProjectChange = (event) => {
        this.setState({ postProject: event.target.value });
    };

    // Other helpers
    displayCompleted = (status) => {
        return this.setState({ viewStatus: status });
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

    handleChangeStatus = (item, status) => {
        axios
            .get(`/calendar/${item.id}/changeStatus/${status}`)
            .then((res) => window.location.reload());
    }

    renderTabList = () => {
        return (
            <div className="nav nav-tabs">
                <span
                    className={this.state.viewStatus === 0 ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(0)}
                >
                    On Hold
                </span>
                <span
                    className={this.state.viewStatus === 1 ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(1)}
                >
                    In Progress
                </span>
                <span
                    className={this.state.viewStatus === 2 ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(2)}
                >
                    Completed
                </span>
            </div>
        );
    };

    renderItems = () => {
        const { viewStatus } = this.state;

        let newItems = []

        if (this.props.location.todoList) {
            newItems = this.props.location.todoList.filter(
                (item) => viewStatus === item.status
            );
        } else {
            newItems = this.state.tasks.filter(
                (item) => viewStatus === item.status
            );
        }

        return newItems.map((item) => (
            <li
                key={item.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${this.setPriorityStyle(item)}`}
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
                        className={`btn btn-success sm ${this.state.viewStatus === 1 ? "" : "hidden"}`}
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
                <h1 className="my-4">
                    {`${this.props.location.projectTitle ? this.props.location.projectTitle : this.state.projectTitle}`} / Tasks
                </h1>
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
                    title="This task will be deleted."
                    desc="This action cannot be undone."
                />
                <TaskFormDialog
                    open={this.state.addFormOpen}
                    handleClose={this.handleAddFormClose}
                    title="Add a New Task"
                    postTitle={this.state.addTitle}
                    postDesc={this.state.addDesc}
                    postPriority={this.state.addPriority}
                    postProject={this.handleProject()}
                    handleTask={this.handleAddTask}
                    handleTitleChange={this.handleAddTitleChange}
                    handleDescChange={this.handleAddDescChange}
                    handlePriorityChange={this.handleAddPriorityChange}
                    handleProjectChange={this.handleAddProjectChange}
                    projects={this.state.projects}
                />
                <TaskFormDialog
                    open={this.state.editFormOpen}
                    handleClose={this.handleEditFormClose}
                    title="Edit Task"
                    postTitle={this.state.postTitle}
                    postDesc={this.state.postDesc}
                    postPriority={this.state.postPriority}
                    postProject={this.state.postProject}
                    handleTask={this.handleEditTask}
                    handleTitleChange={this.handleTitleChange}
                    handleDescChange={this.handleDescChange}
                    handlePriorityChange={this.handlePriorityChange}
                    handleProjectChange={this.handleProjectChange}
                    projects={this.state.projects}
                />
            </main>
        );
    }
}

export default Tasks;
