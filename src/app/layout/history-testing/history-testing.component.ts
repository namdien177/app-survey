import {Component, OnInit} from '@angular/core';
import {DataControlService} from '../../../services/data-control.service';

@Component({
    selector: 'app-history-testing',
    templateUrl: './history-testing.component.html',
    styleUrls: ['./history-testing.component.scss'],
})
export class HistoryTestingComponent implements OnInit {

    constructor(
        private db: DataControlService
    ) {
        this.db.receiveHistoryTest();
    }

    ngOnInit() {
    }

}
