import { Feedback } from "./Feedback";
import { User } from "./User";

export interface Course{
    id: number;
    name: string;
    users: Array<User>;
    feedback: Array<Feedback>;
}