import { User } from './user';
import { Question } from './question';

export class Database{
    users: User[];
    questions: Question[];
    histories: History[];
}