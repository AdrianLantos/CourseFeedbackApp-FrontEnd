import React, { FC, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { User } from './model/User';
import axios from 'axios';
import { Course } from './model/Course';
import { Feedback } from './model/Feedback';
import { Box, Card, CardContent, Typography, CardActions, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import FeedbackForm from './components/FeedbackForm';
import UserSelect from './components/UserSelect';
import CourseEnrollment from './components/CourseEnrollment';

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
    axios.get('http://localhost:8080/courses').then((response) => setCourseList(response.data));
  }, []);

  useEffect(() => {
    if (selectedUser.id !== -1) {
      axios.get('http://localhost:8080/users/' + selectedUser.id + '/courses').then((response) => setUserCourses(response.data));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser.id !== -1 && selectedCourse.id !== -1)
      axios.get('http://localhost:8080/feedback/course/' + selectedCourse.id + '/user/' + selectedUser.id).then((response) => setUserFeedback(response.data));
  }, [selectedCourse])

  function reloadUserCourses() {
    axios.get('http://localhost:8080/users/' + selectedUser.id + '/courses').then((response) => setUserCourses(response.data))
  }

  function loadUserFeedback() {
    if (selectedUser.id !== -1) {
      axios.get('http://localhost:8080/feedback/course/' + selectedCourse.id + '/user/' + selectedUser.id).then((response) => setUserFeedback(response.data));
    }
  }

  function openFeedbackForm(check: boolean) {
    setFeedbackFormState(check);
    loadUserFeedback();
  }

  function hideTitle(courseId: number): boolean {
    if (feedbackFormState && courseId === selectedCourse.id) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <body className="App-body">
        <Box sx={{ margin: "auto", maxWidth: "80%" }}>
          <UserSelect selectedUser={selectedUser} userList={userList} openFeedbackForm={openFeedbackForm} setSelectedUser={setSelectedUser}></UserSelect>
          <p>
            <CourseEnrollment selectedUser={selectedUser} courseList={courseList} reloadUserCourses={reloadUserCourses}></CourseEnrollment>
          </p>
          <p>
            {userCourses?.map(course =>
              <Card sx={{ margin: 4 }}>
                <CardContent >
                  {hideTitle(course.id) && <Typography><strong>{course.name}</strong></Typography>}
                  <CardActions sx={{ justifyContent: 'center' }}>
                    {feedbackFormState === false && <Button onClick={() => [setFeedbackFormState(true), setSelectedCourse(course)]}>Give Feedback</Button>}
                    {feedbackFormState && selectedCourse.id === course.id && <FeedbackForm selectedCourse={selectedCourse} formOpen={openFeedbackForm} selectedUser={selectedUser} userFeedback={userFeedback}></FeedbackForm>}
                  </CardActions>
                </CardContent>
              </Card>)}
          </p>
        </Box>
      </body>
    </div >
  );
}


export default App;
