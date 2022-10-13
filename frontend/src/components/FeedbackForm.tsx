import { Card, CardContent, Button, TextField, CardActions, FormControl, InputLabel, MenuItem, Select, Box, Typography } from "@mui/material";
import axios from "axios";
import { countReset } from "console";
import { FC, useEffect, useState } from "react";
import { Course } from "../model/Course";
import { Feedback } from "../model/Feedback";
import { User } from "../model/User";

export type FeedbackFormPros = {
    selectedCourse: Course,
    formOpen: (reload: boolean) => void,
    selectedUser: User,
    userFeedback: Feedback[]
}

const FeedbackForm: FC<FeedbackFormPros> = ({ selectedCourse, formOpen, selectedUser, userFeedback }) => {
    const [feedbackTitle, setFeedbackTitle] = useState<string>();
    const [feedbackBody, setFeedbackBody] = useState<string>();
    const newFeedback = { id: -1, title: "New Feedback", body: "", course: selectedCourse, user: selectedUser };
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback>(newFeedback);
    
    useEffect(() => {
        setFeedbackBody(selectedFeedback.body);
        setFeedbackTitle(selectedFeedback.title);
    }, [selectedFeedback])

    const save = () => {
        axios.put('http://localhost:8080/users/' + selectedUser.id + '/course/' + selectedCourse.id, { title: feedbackTitle, body: feedbackBody }).then(response => formOpen(false));
    }

    const editFeedback = () => {
        axios.patch('http://localhost:8080/users/' + selectedUser.id + '/course/' + selectedFeedback.id, { title: feedbackTitle, body: feedbackBody }).then(response => formOpen(false));
    }

    const deleteFeedback = () => {
        axios.delete('http://localhost:8080/users/feedback/' + selectedFeedback.id).then(response => formOpen(false));
    }

    return (
        <div>
                {selectedUser.name}, we would like to hear your feedback for the Course: <h3><strong>{selectedCourse.name}</strong></h3>
                Select if you wish to write a new feedback or edit an existing one: 
                <Box>
                    <FormControl sx={{ m: 1, minWidth: 140 }}>
                        <InputLabel id="Feedback-select-helper-label">Feedback</InputLabel>
                        <Select
                            labelId="Feedback-List-label"
                            id="Feedback-select"
                            value={JSON.stringify(selectedFeedback)}
                            autoWidth
                            label="FeedbackList"
                            renderValue={(value) => { return JSON.parse(value).title; }}
                            onChange={(e) => {
                                setSelectedFeedback(JSON.parse(e.target.value));
                            }}
                        >
                            <MenuItem value={JSON.stringify(newFeedback)}>{newFeedback.title}</MenuItem>
                            {userFeedback.map(feedback =>
                                <MenuItem value={JSON.stringify(feedback)}>
                                    {feedback.title}
                                </MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ flexDirection: 'column' }}>
                    <InputLabel id="Title">Title</InputLabel>
                    <TextField value={feedbackTitle} onChange={(e) => setFeedbackTitle(e.target.value)}>{feedbackTitle}</TextField>
                </Box>
                <p>
                    <Box sx={{ flexDirection: 'column' }}>
                        <InputLabel id="Body">Body</InputLabel>
                        <TextField value={feedbackBody} minRows={2} multiline={true} fullWidth={true} onChange={(e) => setFeedbackBody(e.target.value)}>{feedbackBody}</TextField>
                    </Box>
                </p>
                    {selectedFeedback.id === -1 && <Button variant="contained" onClick={() => save()}>Save</Button>}
                    {selectedFeedback.id !== -1 && <Button variant="contained" onClick={() => editFeedback()}>Update</Button>}
                    {selectedFeedback.id !== -1 && <Button variant="contained" sx={{ backgroundColor: "red" }} onClick={() => deleteFeedback()}>Delete</Button>}
                    <Button onClick={() => formOpen(false)}>Close</Button>
        </div>
    );

}

export default FeedbackForm;