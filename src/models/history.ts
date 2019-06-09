import { User } from './user';
import { Question } from './question';
import { Solution } from './solution';

export class History{
    id: number;
    user: User;
    question: Question;
    answeredSolution: Solution;
    answeredAt: string;
}