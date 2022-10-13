import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FC } from "react";
import { User } from "../model/User";

export type UserSelectProps = {
    selectedUser: User;
    userList: User[];
    setSelectedUser: (user: User) => void;
    openFeedbackForm: (check: boolean) => void
}

const UserSelect: FC<UserSelectProps> = ({ selectedUser, userList, setSelectedUser, openFeedbackForm }) => {
    return (
        <Box sx={{ flex: 'center', justifyContent: 'center' }}>
            <h1>
                <Typography> Please Select a User: </Typography>
            </h1>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="User-select-helper-label">User</InputLabel>
                <Select
                    labelId="User-select-label"
                    id="User-simple-select"
                    value={JSON.stringify(selectedUser)}
                    autoWidth
                    label="Users"
                    onChange={(e) => {
                        setSelectedUser(JSON.parse(e.target.value));
                        openFeedbackForm(false);
                    }}
                    renderValue={user => { return JSON.parse(user).name; }}
                >
                    {userList.map(user =>
                        <MenuItem value={JSON.stringify(user)}>
                            {user.name}
                        </MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    )
}

export default UserSelect