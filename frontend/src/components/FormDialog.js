import axios from "axios";
import { csrftoken } from "./CSRFToken";

import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({ open, handleClose, handleSubmit, title }) {

    const [postTitle, setPostTitle] = React.useState("");
    const [postDesc, setPostDesc] = React.useState("");

    let handleAddTask = () => {
        let date = new Date();
        axios
            .post(`/api/tasks/`,
                {
                    title: postTitle,
                    description: postDesc,
                    create_date: date,
                    completed: 0
                },
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': csrftoken,
                    }
                }
            ).then((res) => window.location.reload());
    }

    let handleTitleChange = (event) => {
        setPostTitle(event.target.value);
    }

    let handleDescChange = (event) => {
        setPostDesc(event.target.value);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        fullWidth
                        value={postTitle}
                        onChange={handleTitleChange}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        fullWidth
                        value={postDesc}
                        onChange={handleDescChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddTask} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
