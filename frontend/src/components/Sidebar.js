import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { Link } from "react-router-dom";

function Sidebar({ items }) {
    return (
        <div className="sidebar">
            <h1 className="text-uppercase my-4">TBD</h1>
            <List disablePadding dense>
                {items.map(({ label, name, ...rest }) => (
                    <ListItem key={name} button {...rest}>
                        <Link className="sidebarLink" to={name}><ListItemText>{label}</ListItemText></Link>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default Sidebar