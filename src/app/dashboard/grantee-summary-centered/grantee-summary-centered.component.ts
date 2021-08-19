import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';


@Component({
    selector: 'app-granteesummary-centered',
    templateUrl: './grantee-summary-centered.component.html',
    styleUrls: ['./grantee-summary-centered.component.css']
})
export class GranteeSummaryCenteredComponent implements OnInit, OnChanges {

    @Input() data: any;
    @Input() display: boolean = false;

    heading: string;
    donorsHeading: string;
    caption: string;
    donorsCaption: string;
    subCaption: string;

    constructor() {

    }

    ngOnInit() {
        console.log("summary centered");
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property === 'data') {
                if (this.data) {
                    this.display = true;
                    this.heading = this.data.totalGrants;
                    if (this.data.donors) {
                        this.donorsHeading = this.data.donors;
                        this.donorsCaption = 'Donors';
                    }
                    this.caption = this.data.name;
                    this.subCaption = this.data.period;
                }
            }
        }
    }

}
