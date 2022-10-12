import { Card, CardContent, Button, TextField, CardActions, FormControl, InputLabel, MenuItem, Select, Box, Typography } from "@mui/material";
import axios from "axios";
import { countReset } from "console";
import { FC, useEffect, useState } from "react";
import { createDocumentRegistry } from "typescript";
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
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback>({ id: -1, title: "New Feedback", body: "", course: selectedCourse, user: selectedUser });
    const newFeedback = { id: -1, title: "New Feedback", body: "", course: selectedCourse, user: selectedUser };

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
            <Card sx={{ margin: 2 }}>
                <CardContent>{selectedUser.name}, we would like to hear your feedback for the Course:<p><strong>{selectedCourse.name}</strong></p></CardContent>
                <CardContent>Select if you wish to write a new feedback or edit an existing one: </CardContent>
                <p>
                    <Box>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                labelId="Feedback-List-label"
                                id="Feedback-select"
                                value={JSON.stringify(selectedFeedback)}
                                autoWidth
                                label="FeedbackList"
                                renderValue={(value) => { return JSON.parse(value).title;}}
                                onChange={(e) => {
                                    setSelectedFeedback(JSON.parse(e.target.value));
                                  }}
                            >
                                <MenuItem value={JSON.stringify(newFeedback)}>{newFeedback.title}</MenuItem>
                                {userFeedback.map(feedback =>
                                    <MenuItem value={JSON.stringify(feedback)}>
                                        {/* <Button onClick={() => { setSelectedFeedback(feedback) }}> */}
                                            {feedback.title}
                                        {/* </Button> */}
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </p>
                <Box sx={{ flexDirection: 'column' }}>
                    <InputLabel id="Title">Title</InputLabel>
                    <TextField value={feedbackTitle} onChange={(e) => setFeedbackTitle(e.target.value)}>{feedbackTitle}</TextField>
                </Box>
                <p>
                    <Box sx={{ flexDirection: 'column' }}>
                        <InputLabel id="Body">Body</InputLabel>
                        <TextField value={feedbackBody} onChange={(e) => setFeedbackBody(e.target.value)}>{feedbackBody}</TextField>
                    </Box>
                </p>
                <CardActions sx={{ justifyContent: 'center' }}>
                    {selectedFeedback.id === -1 && <Button variant="contained" onClick={() => save()}>Save</Button>}
                    {selectedFeedback.id !== -1 && <Button variant="contained" onClick={() => editFeedback()}>Edit</Button>}
                    {selectedFeedback.id !== -1 && <Button variant="contained" sx={{ backgroundColor: "red" }} onClick={() => deleteFeedback()}>Delete</Button>}
                    <Button onClick={() => formOpen(false)}>Close</Button>
                </CardActions>
            </Card>
        </div>
    );

}

export default FeedbackForm;