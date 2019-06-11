import {Component, OnInit} from '@angular/core';
import {DataControlService} from '../../../services/data-control.service';

@Component({
    selector: 'app-history-testing',
    templateUrl: './history-testing.component.html',
    styleUrls: ['./history-testing.component.scss'],
})
export class HistoryTestingComponent implements OnInit {

    listHistory: any[] = [];

    constructor(
        private db: DataControlService
    ) {
        this.db.receiveHistoryTest().then(out => {
            console.log(out.res);
            const resList = out.res.rows;
            if (resList.length > 0) {
                for (let i = 0; i < resList.length; i++) {
                    this.listHistory.push(resList.item(i));
                }
            }
        });
    }

    ngOnInit() {
    }

}
