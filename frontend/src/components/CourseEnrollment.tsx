import { Box, Typography, FormControl, Select, MenuItem, Button } from "@mui/material";
import axios from "axios";
import { FC } from "react";
import { Course } from "../model/Course";
import { User } from "../model/User";

export type CourseEnrollmentPros = {
    selectedUser: User;
    courseList: (Course[] | undefined);
    reloadUserCourses: () => void
}

const CourseEnrollment: FC<CourseEnrollmentPros> = ({ selectedUser, courseList, reloadUserCourses }) => {
    
    function enrollUser(user: User, course: Course) {
        if (user.id !== -1)
            axios.put('http://localhost:8080/courses/' + course.id + '/user/' + user.id).then(reloadUserCourses)
    }

    return (
        <Box sx={{ flexDirection: 'row', justifyContent: 'center' }}>
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
    )
}

export default CourseEnrollment;