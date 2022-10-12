import { Course } from "./Course";
import { User } from "./User";

export interface Feedback{
    id: number;
    title: string;
    body: string;
    course: Course;
    user: User;    
}