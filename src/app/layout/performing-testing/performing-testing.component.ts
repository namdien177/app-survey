import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataControlService} from 'src/services/data-control.service';
import {QuestionList} from 'src/models/question.list';
import {Question} from 'src/models/question';

@Component({
    selector: 'app-performing-testing',
    templateUrl: './performing-testing.component.html',
    styleUrls: ['./performing-testing.component.scss'],
})
export class PerformingTestingComponent implements OnInit, AfterViewInit {

    listAvailable: QuestionList = null;
    listDisplay: Question[] = [];
    listRadioRecord: { idQuestion, idSolution }[] = [];
    errorMessage = '';

    turnIn = false;
    correct = 0;
    wrong = 0;
    result = false;
    timer = null;
    second = '00';
    secondTime = 0;
    minute = '00';
    minuteTime = 0;

    constructor(
        private db: DataControlService
    ) {
    }

    ngOnInit() {
        this.loadQuestions();

        console.log(this.listDisplay);
        console.log(this.listRadioRecord);
    }

    timerCountStart() {
        this.timer = setInterval(() => {
            this.secondTime += 1;
            if (this.secondTime >= 60) {
                this.secondTime = 0;
                this.second = '00';
                this.minuteTime += 1;

                if (this.minuteTime < 10) {
                    this.minute = '0' + this.minuteTime;
                } else {
                    this.minute = this.minuteTime + '';
                }

            } else {
                if (this.secondTime < 10) {
                    this.second = '0' + this.secondTime;
                } else {
                    this.second = this.secondTime + '';
                }
            }
        }, 1000);
    }

    timerCountEnd() {
        clearInterval(this.timer);
    }

    submitTest() {
        if (this.listDisplay.length > 0) {
            this.result = false;
            const checkValidate = this.validateArrayAnswer();
            if (checkValidate) {
                this.timerCountEnd();
                this.checkResult();
                this.db.recordTest(this.correct, this.wrong, this.minute + ':' + this.second).then(out => {
                    console.log(out);
                    this.result = true;
                });
            }
        }
    }

    checkResult() {
        this.turnIn = false;
        this.correct = 0;
        this.wrong = 0;
        this.listDisplay.forEach((question, index) => {
            if (
                +question.correctSolution.id === +this.listRadioRecord[index].idSolution &&
                +this.listRadioRecord[index].idQuestion === +question.id
            ) {
                this.correct += 1;
            } else {
                this.wrong += 1;
            }
        });
        this.turnIn = true;
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

    ngAfterViewInit(): void {
        if (this.listDisplay.length > 0) {
            this.timerCountStart();
        }
    }
}
