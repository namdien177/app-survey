import { Component, OnInit } from '@angular/core';
import { DataControlService } from 'src/services/data-control.service';
import { Router } from '@angular/router';
import { Question } from 'src/models/question';
import { QuestionList } from 'src/models/question.list';

@Component({
  selector: 'app-list-all-test',
  templateUrl: './list-all-test.component.html',
  styleUrls: ['./list-all-test.component.scss'],
})
export class ListAllTestComponent implements OnInit {

  tests: QuestionList = null;
  constructor(
    private db: DataControlService,
    private router: Router
  ) {
    this.db.retrieveAllSurvey().then(list => {
      console.log(list);
      if (!!list) {
        this.tests = list;
        console.log(this.tests);
      }
    })
  }

  ngOnInit() { }

}
