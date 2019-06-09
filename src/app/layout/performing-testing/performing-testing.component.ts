import {Component, OnInit} from '@angular/core';
import {DataControlService} from 'src/services/data-control.service';
import {QuestionList} from 'src/models/question.list';
import {Question} from 'src/models/question';

@Component({
    selector: 'app-performing-testing',
    templateUrl: './performing-testing.component.html',
    styleUrls: ['./performing-testing.component.scss'],
})
export class PerformingTestingComponent implements OnInit {

    listAvailable: QuestionList = null;
    listDisplay: Question[] = [];
    listRadioRecord: { idQuestion, idSolution }[] = [];
    errorMessage = '';

    constructor(
        private db: DataControlService
    ) {
        this.loadQuestions();
    }

    ngOnInit() {
    }

    submitTest() {
        console.log(this.listRadioRecord);
        console.log(this.listDisplay);
        const checkValidate = this.validateArrayAnswer();
        if (checkValidate) {
            this.db.recordTest(this.listRadioRecord).then(out => {
                console.log(out);
            });
        }
    }

    loadQuestions() {
        this.db.retrieveAllSurvey().then(list => {
            this.listAvailable = list;
            this.listDisplay = this.shuffleQuestion(this.listAvailable);
        });
    }

    shuffleQuestion(list: QuestionList, easy: number = 2, normal: number = 2, hard: number = 2) {
        const finalList: Question[] = [];

        if (list) {
            const listEasy: Question[] = list.easySurveys;
            const listNormal: Question[] = list.normalSurveys;
            const listHard: Question[] = list.hardSurveys;
            if (easy >= listEasy.length) {
                finalList.push(...listEasy);
            } else {
                for (let i = 1; i <= easy; i++) {
                    const index = this.getRandomInt(listEasy.length);
                    finalList.push(listEasy[index]);
                }
            }

            if (normal >= listNormal.length) {
                finalList.push(...listNormal);
            } else {
                for (let i = 1; i <= easy; i++) {
                    const index = this.getRandomInt(listNormal.length);
                    finalList.push(listNormal[index]);
                }
            }

            if (hard >= listHard.length) {
                finalList.push(...listHard);
            } else {
                for (let i = 1; i <= easy; i++) {
                    const index = this.getRandomInt(listHard.length);
                    finalList.push(listHard[index]);
                }
            }
        }
        for (const question of finalList) {
            this.listRadioRecord.push({idQuestion: question.id, idSolution: null});
        }
        return finalList;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    validateArrayAnswer() {
        this.errorMessage = '';
        for (const answer of this.listRadioRecord) {
            if (answer.idSolution == null) {
                this.errorMessage = 'You must fill all the answer before hand in!';
                break;
            }
        }
        return this.errorMessage.length === 0;
    }
}
