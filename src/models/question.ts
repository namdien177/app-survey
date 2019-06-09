import { Solution } from './solution';

export class Question{
    id: number;
    question: string;
    solution: Solution[];
    correctSolution: Solution;
    difficulty: number;
}