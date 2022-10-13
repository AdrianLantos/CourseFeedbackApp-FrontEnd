import React, { FC, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { User } from './model/User';
import axios from 'axios';
import { Course } from './model/Course';
import { Feedback } from './model/Feedback';
import { Box, Card, CardContent, Typography, CardActions, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import FeedbackForm from './components/FeedbackForm';

const App: FC = () => {
  const [userList, setUserList] = useState<User[]>([{ id: -1, name: "Username", courses: [], feedback: [] }]);
  const [courseList, setCourseList] = useState<Course[]>()
  const [userCourses, setUserCourses] = useState<Course[]>();
  const [userFeedback, setUserFeedback] = useState<Feedback[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>(userList[0]);
  const [selectedCourse, setSelectedCourse] = useState<Course>({ id: -1, name: "Course", users: [], feedback: [] });
  const [feedbackFormState, setFeedbackFormState] = useState<boolean>(false);

  useEffect(() => {
    axios.get('http://localhost:8080/users/').then((response) => setUserList(response.data));
    axios.get('http://localhost:8080/users/courses').then((response) => setCourseList(response.data));
  }, []);

  useEffect(() => {
    if(selectedUser.id !== -1){
    axios.get('http://localhost:8080/users/' + selectedUser.id).then((response) => setUserCourses(response.data));
    }
  }, [selectedUser]);

  useEffect(() => {
    if(selectedUser.id !== -1 && selectedCourse.id !== -1)
    axios.get('http://localhost:8080/users/' + selectedUser.id + '/feedback/' + selectedCourse.id).then((response) => setUserFeedback(response.data));
  }, [selectedCourse])

  function enrollUser(user: User, course:  Course){
    if(user.id  !== -1)
    axios.put('http://localhost:8080/users/' + user.id + '/courses/' + course.id).then(reloadUserCourses)
  }

  function reloadUserCourses() {
    axios.get('http://localhost:8080/users/' + selectedUser.id).then((response) => setUserCourses(response.data))
  }

  function loadUserFeedback() {
    if(selectedUser.id !== -1){
    axios.get('http://localhost:8080/users/' + selectedUser.id + '/feedback/' + selectedCourse.id).then((response) => setUserFeedback(response.data));
    }
  }

  function openFeedbackForm(check: boolean) {
    setFeedbackFormState(check);
    loadUserFeedback();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <body>
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
        <p>
          <Box sx={{ flex: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Typography> If you wish to enroll {selectedUser.name} into a Course select one below </Typography>
            <FormControl sx={{ m: 1, minWidth: 140 }}>
              <Select
                labelId="Course-enroll-label"
                id="Course-enroll-select"
                value=""
                autoWidth
                displayEmpty
                label="Courses"
                renderValue={() => { return 'Courses Available'; }}
              >
                {courseList?.map(course =>
                  <MenuItem>
                    <Button onClick={() => enrollUser(selectedUser, course)}>
                      {course.name}
                    </Button>
                  </MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </p>
        <p>
          <Box sx={{ overflow: "auto" }}>
            <Card>
              {userCourses?.map(course =>
                <Card sx={{ margin: 2 }}>
                  <CardContent >
                    <Typography><strong>{course.name}</strong></Typography>
                    <CardActions sx={{ justifyContent: 'center' }}>
                      {feedbackFormState === false && <Button onClick={() => [setFeedbackFormState(true), setSelectedCourse(course)]}>Give Feedback</Button>}
                      {feedbackFormState && selectedCourse.id === course.id && <FeedbackForm selectedCourse={selectedCourse} formOpen={openFeedbackForm} selectedUser={selectedUser} userFeedback={userFeedback}></FeedbackForm>}
                    </CardActions>
                  </CardContent>
                </Card>)}
            </Card>
          </Box>
        </p>
      </body>
    </div >
  );
}


export default App;
