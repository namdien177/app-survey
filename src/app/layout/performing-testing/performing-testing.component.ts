import { Component, OnInit } from '@angular/core';
import { DataControlService } from 'src/services/data-control.service';
import { QuestionList } from 'src/models/question.list';
import { Question } from 'src/models/question';

@Component({
  selector: 'app-performing-testing',
  templateUrl: './performing-testing.component.html',
  styleUrls: ['./performing-testing.component.scss'],
})
export class PerformingTestingComponent implements OnInit {

  listAvailable: QuestionList = null;
  listDisplay: Question[] = [];

  constructor(
    private db: DataControlService
  ) {
    this.db.retrieveAllSurvey().then(list => {
      this.listAvailable = list;
      this.listDisplay = this.shuffleQuestion(this.listAvailable);
    })
  }

  ngOnInit() { }

  shuffleQuestion(list: QuestionList, easy: number = 2, normal: number = 2, hard: number = 2) {
    const listEasy: Question[] = list.easySurveys;
    const listNormal: Question[] = list.normalSurveys;
    const listHard: Question[] = list.hardSurveys;

    let finalList: Question[] = [];

    if (easy >= listEasy.length) {
      finalList.concat(listEasy);
    } else {
      for (let i = 1; i <= easy; i++) {
        let index = this.getRandomInt(listEasy.length);
        finalList.push(listEasy[index]);
      }
    }

    if (normal >= listNormal.length) {
      finalList.concat(listNormal);
    } else {
      for (let i = 1; i <= easy; i++) {
        let index = this.getRandomInt(listNormal.length);
        finalList.push(listNormal[index]);
      }
    }

    if (hard >= listHard.length) {
      finalList.concat(listHard);
    } else {
      for (let i = 1; i <= easy; i++) {
        let index = this.getRandomInt(listHard.length);
        finalList.push(listHard[index]);
      }
    }

    return finalList;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
