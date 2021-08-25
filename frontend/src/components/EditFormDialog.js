import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function FormDialog({
    open,
    handleClose,
    title,
    postTitle,
    postDesc,
    postChecked,
    handleEditTask,
    handleTitleChange,
    handleDescChange,
    handlePriorityChange
}) {

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
                    <FormControlLabel
                        control={<Checkbox checked={postChecked} onChange={handlePriorityChange} name="priority" />}
                        label="Mark as higher priority"
                    />
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
