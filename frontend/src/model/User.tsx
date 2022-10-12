import { Course } from "./Course";
import { Feedback } from "./Feedback";

export interface User{
    id: number;
    name: string;
    courses: Array<Course>;
    feedback: Array<Feedback>;
}