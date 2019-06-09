import { Component, OnInit, Input } from '@angular/core';
import { DataControlService } from 'src/services/data-control.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-testing',
  templateUrl: './make-testing.component.html',
  styleUrls: ['./make-testing.component.scss'],
})
export class MakeTestingComponent implements OnInit {

  @Input() existedTest = null;

  question: string = '';
  answer: string = '';
  otherAnswers: string[] = [
    '',
    '',
    ''
  ]
  difficulty: number = null;
  error = "";

  constructor(
    private db: DataControlService,
    private router: Router
  ) { }

  ngOnInit() { }

  submitNewTest() {
    if(this.validData()){
      this.db.newSurvey(this.question, this.answer, this.otherAnswers, this.difficulty)
      .then(
        res => {
          if (res){
            this.router.navigate(['/test/list'])
          }
        }
      ).catch(
        er => {
          console.error(er)
        }
      );
    }
  }

  validData() {
    if (this.question.length < 3) {
      this.error = "The question must have at lease 4 character!"
      return false;
    }

    if (this.answer == null || this.answer == '') {
      this.error = "The answers cannot be empty"
      return false;
    }

    this.otherAnswers.forEach(answer => {
      if (answer == null || answer == '') {
        this.error = "The question must have at lease 4 character!"
        return false;
      }
    });

    if (this.difficulty == null) {
      this.error = "Please choose difficulty!"
      return false;
    }

    return true;
  }

}
