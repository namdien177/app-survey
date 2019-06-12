import {Injectable} from '@angular/core';
import {SQLiteService} from './sqlite.service';
import {User} from 'src/models/user';
import {Question} from 'src/models/question';
import {Solution} from 'src/models/solution';
import {QuestionList} from 'src/models/question.list';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DataControlService {

    constructor(
        private db: SQLiteService
    ) {
    }

    static receiveUser() {
        const user: User = JSON.parse(localStorage.getItem('user'));
        return user;
    }

    login(username, password): Promise<boolean> {
        const query = 'select id, username, password from users where username=? and password=?';

        return this.db.query(query, [username, password]).then(
            result => {
                console.log(result);

                if (!!result.res && !!!result.err && result.res.rows.length > 0) {
                    const user: User = result.res.rows.item(0);
                    localStorage.setItem('user', JSON.stringify(user));
                    return Promise.resolve(true);
                }

                return Promise.resolve(false);
            }
        ).catch(err => {
            console.log(err);
            return Promise.resolve(false);
        });
    }

    register(username, password): Promise<boolean> {
        const user: User = {
            username,
            password
        };

        return this.db.insert('users', user).then(res => {
            return Promise.resolve(true);
        }).catch(err => {
            console.log(err);
            return Promise.resolve(false);
        });
    }

    updateProfile(user: User): Promise<any> {
        return this.db.update('users', user, user.id).then(res => {
            console.log(res);
            return Promise.resolve(true);
        }).catch(err => {
            console.log(err);
            return Promise.resolve(false);
        });
    }

    retrieveAllSurvey(): Promise<QuestionList> {
        const survey: Question[] = [];
        const hardSurvey: Question[] = [];
        const normalSurvey: Question[] = [];
        const easySurvey: Question[] = [];

        const tempQuestion = [];

        return this.db.query(
            'select * from questions'
        )
            .then(list => {
                const listRes = list.res.rows;
                if (listRes.length === 0) {
                    return Promise.reject('The list is empty');
                }
                const arrPromise = [];
                Array.from(listRes).forEach(question => {
                    tempQuestion.push(question);
                    arrPromise.push(this.db.query('select * from solutions where question_id=?', [question['id']]));
                });
                return Promise.all(arrPromise);
            })
            .then(arrPromises => {
                for (let index = 0; index < tempQuestion.length; index++) {
                    const arrResponseRows = arrPromises[index].res.rows;
                    let correctSolution: Solution = null;
                    let arrAllSolutions: Solution[] = [];
                    Array.from(arrResponseRows).forEach(solution => {
                        arrAllSolutions.push({
                            id: solution['id'],
                            answer: solution['answer'],
                            question_id: solution['question_id']
                        });
                        if (solution['id'] == tempQuestion[index].correctSolution_id) {
                            correctSolution = {
                                id: solution['id'],
                                answer: solution['answer'],
                                question_id: solution['question_id']
                            };
                        }
                    });
                    arrAllSolutions = this.shuffleArray(arrAllSolutions);
                    const sv: Question = {
                        id: tempQuestion[index].id,
                        question: tempQuestion[index].question,
                        correctSolution,
                        solution: arrAllSolutions,
                        difficulty: tempQuestion[index].difficulty
                    };
                    survey.push(sv);
                    if (sv.difficulty == 2) {
                        easySurvey.push(sv);
                    } else if (sv.difficulty == 1) {
                        normalSurvey.push(sv);
                    } else {
                        hardSurvey.push(sv);
                    }
                }

                return Promise.resolve(
                    {
                        surveys: survey,
                        easySurveys: easySurvey,
                        normalSurveys: normalSurvey,
                        hardSurveys: hardSurvey
                    }
                );
            }, reject => {
                console.warn(reject);
                return Promise.resolve(null);
            })
            .catch((err) => {
                console.log(err);
                return Promise.resolve(null);
            });
    }

    newSurvey(question: string, answer: string, otherAnswers: string[], difficulty: number) {
        let idQuestion = null;
        return this.db.query('insert into questions (question, difficulty) values (?, ?)', [question, difficulty])
            .then(out => {
                idQuestion = out.res.insertId;
                return this.db.query('insert into solutions (answer, question_id) values (?, ?)', [answer, idQuestion]);
            })
            .then(out => {
                const correctAnswer = out.res.insertId;
                console.log(correctAnswer);
                return this.db.update('questions', {correctSolution_id: correctAnswer}, idQuestion);
            })
            .then(out => {
                const promises = [];
                for (let i = 0; i < otherAnswers.length; i++) {
                    const anAnswer = otherAnswers[i];
                    promises.push(
                        this.db.insert('solutions', {
                            answer: anAnswer,
                            question_id: idQuestion
                        })
                    );
                }
                return Promise.all(promises);
            })
            .then(
                res => {
                    return Promise.resolve(true);
                }
            ).catch(reject => {
                console.error(reject);
                return Promise.resolve(false);
            });
    }

    deleteSurvey(surveyID: number) {
        return this.db.query('select * from histories where question_id=?', [surveyID])
            .then(
                out => {
                    if (out.res.rows > 0) {
                        return Promise.resolve(false);
                    }

                    return this.db.query('select * from solutions where question_id=?', [surveyID])
                        .then(
                            out => {
                                const result = out.res.rows;
                                if (result.length > 0) {
                                    const promises = [];
                                    for (let i = 0; i < result.length; i++) {
                                        const anAnswer = result[i];
                                        promises.push(
                                            this.db.delete('solutions', anAnswer.id)
                                        );
                                    }
                                    return Promise.all(promises);
                                }
                            }
                        ).then(
                            out => {
                                return this.db.delete('questions', surveyID).then(
                                    out => Promise.resolve(true)
                                ).catch(() => Promise.resolve(false));
                            }
                        );
                }
            );
    }

    recordTest(correct: number, wrong: number, timePerform: string) {
        const currentTime = moment().format('DD-MM-YYYY kk:mm:ss');
        const idUser = DataControlService.receiveUser().id;

        return this.db.insert('results', {user_id: idUser, correct, wrong, answer_date: currentTime, duration: timePerform});
    }

    receiveHistoryTest(userId = DataControlService.receiveUser().id) {
        return this.db.query(
            'select * from results where user_id=? order by id desc',
            [userId]
        );
    }

    shuffleArray(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}
