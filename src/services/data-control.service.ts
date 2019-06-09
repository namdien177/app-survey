import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { User } from 'src/models/user';
import { Question } from 'src/models/question';
import { Solution } from 'src/models/solution';
import { QuestionList } from 'src/models/question.list';

@Injectable({
    providedIn: 'root'
})
export class DataControlService {

    constructor(
        private db: SQLiteService
    ) {
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
        let survey: Question[] = [];
        let hardSurvey: Question[] = [];
        let normalSurvey: Question[] = [];
        let easySurvey: Question[] = [];

        let tempQuestion = [];

        return this.db.query(
            "select * from questions"
        )
            .then(list => {
                const listRes = list.res.rows;
                if (listRes.length == 0) {
                    return Promise.reject("The list is empty")
                }
                let arrPromise = [];
                Array.from(listRes).forEach(question => {
                    tempQuestion.push(question);
                    arrPromise.push(this.db.query("select * from solutions where question_id=?", [question["id"]]));
                });
                return Promise.all(arrPromise)
            })
            .then(arrPromises => {
                for (let index = 0; index < tempQuestion.length; index++) {
                    const arrResponseRows = arrPromises[index].res.rows;
                    let correctSolution: Solution = null;
                    let arrAllSolutions: Solution[] = [];
                    console.log(arrPromises[index].res.rows);
                    Array.from(arrResponseRows).forEach(solution => {
                        arrAllSolutions.push({
                            id: solution["id"],
                            answer: solution["answer"],
                            question_id: solution["question_id"]
                        });
                        if (solution["id"] == tempQuestion[index]["correctSolution_id"]) {
                            correctSolution = {
                                id: solution["id"],
                                answer: solution["answer"],
                                question_id: solution["question_id"]
                            };
                        }
                    });
                    let sv: Question = {
                        id: tempQuestion[index]["id"],
                        question: tempQuestion[index]["question"],
                        correctSolution: correctSolution,
                        solution: arrAllSolutions,
                        difficulty: tempQuestion[index]["difficulty"]
                    }
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
                )
            }, reject => {
                console.warn(reject);
                return Promise.resolve(null);
            })
            .catch((err) => {
                console.log(err);
                return Promise.resolve(null);
            })
    }

    newSurvey(question: string, answer: string, otherAnswers: string[], difficulty: number) {
        let idQuestion = null;
        return this.db.query("insert into questions (question, difficulty) values (?, ?)", [question, difficulty])
            .then(out => {
                idQuestion = out.res["insertId"];
                return this.db.query("insert into solutions (answer, question_id) values (?, ?)", [answer, idQuestion])
            })
            .then(out => {
                let correctAnswer = out.res["insertId"];
                console.log(correctAnswer);
                return this.db.update("questions", { correctSolution_id: correctAnswer }, idQuestion)
            })
            .then(out => {
                let promises = [];
                for (let i = 0; i < otherAnswers.length; i++) {
                    const anAnswer = otherAnswers[i];
                    promises.push(
                        this.db.insert("solutions", {
                            answer: anAnswer,
                            question_id: idQuestion
                        })
                    )
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
            })
    }

    deleteSurvey(surveyID: number) {
        return this.db.query("select * from histories where question_id=?", [surveyID])
            .then(
                out => {
                    if (out.res.rows > 0) {
                        return Promise.resolve(false);
                    }

                    return this.db.query("select * from solutions where question_id=?", [surveyID])
                        .then(
                            out => {
                                const result = out.res.rows;
                                if (result.length > 0) {
                                    let promises = [];
                                    for (let i = 0; i < result.length; i++) {
                                        const anAnswer = result[i];
                                        promises.push(
                                            this.db.delete("solutions", anAnswer["id"])
                                        )
                                    }
                                    return Promise.all(promises);
                                }
                            }
                        ).then(
                            out => {
                                return this.db.delete("questions", surveyID).then(
                                    out => Promise.resolve(true)
                                ).catch(() => Promise.resolve(false))
                            }
                        )
                }
            )
    }


}
