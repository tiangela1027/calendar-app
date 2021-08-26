import axios from "axios";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';

export default function FormDialog({
    open,
    handleClose,
    title,
    postTitle,
    postDesc,
    postPriority,
    postProject,
    handleEditTask,
    handleTitleChange,
    handleDescChange,
    handlePriorityChange,
    handleProjectChange,
    projects
}) {

    const useStyles = makeStyles((theme) => ({
        formControl: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(2),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));

    const classes = useStyles();

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
                        type="text"
                        value={postTitle}
                        onChange={handleTitleChange}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        fullWidth
                        type="text"
                        value={postDesc}
                        onChange={handleDescChange}
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Priority
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            value={postPriority}
                            onChange={handlePriorityChange}
                            displayEmpty
                            className={classes.selectEmpty}
                        >
                            <MenuItem value="0">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="1">Low</MenuItem>
                            <MenuItem value="2">Medium</MenuItem>
                            <MenuItem value="3">High</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Project
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            value={postProject}
                            onChange={handleProjectChange}
                            displayEmpty
                            className={classes.selectEmpty}
                        >
                            {projects.map(({ id, title, ...rest }) => (
                                <MenuItem value={id}>{title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditTask} color="primary">
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
