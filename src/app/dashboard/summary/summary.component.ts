import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() heading: string;
  @Input() caption: string;
  @Input() disabled: boolean = false;
  @Input() color = "#ffffff";
  @Input() border = "#ffffff";
  @Input() borderWidth = '1px';
  @Input() shadow = 'none';
  @Input() clickable = false;

  constructor() {

  }

  ngOnInit() {

  }

}
