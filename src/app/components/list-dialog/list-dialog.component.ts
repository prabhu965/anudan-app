import { UiUtilService } from '../../ui-util.service';
import { UpdateService } from '../../update.service';
import { AppComponent } from 'app/app.component';
import { ReportDataService } from '../../report.data.service';
import { FieldDialogComponent } from '../field-dialog/field-dialog.component';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule } from '@angular/material';
import { Report, AdditionReportsModel } from '../../model/report';
import { Grant } from '../../model/dahsboard';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { CurrencyService } from 'app/currency-service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss'],
  providers: [AppComponent, UpdateService]
})
export class ListDialogComponent implements OnInit {

  _for: any;
  data: AdditionReportsModel
  appComp: AppComponent
  disbursements: any;
  reports: any;
  grants: any;

  constructor(private dialog: MatDialog, private reportService: ReportDataService, public dialogRef: MatDialogRef<ListDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public listMetaData: any
    , private http: HttpClient, private currenyService: CurrencyService,
    public uiService: UiUtilService) {
    this.appComp = listMetaData.appComp;
    if (listMetaData._for === 'grant') {
      this._for = 'Grant';
      this.grants = listMetaData.grants;
    } else if (listMetaData._for === 'report') {
      this._for = 'Report';
      this.reports = listMetaData.reports;
    } else if (listMetaData._for === 'disbursement') {
      this._for = 'Disbursement';
      this.disbursements = listMetaData.grants;
    }


    //this.selectedReports = this.futureReports.filter(r => r.grant.id===this.grantId);
  }

  ngOnInit() {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({ result: false });
  }


  getFormattedGrantAmount(amount: number) {
    let amtInWords = '-';
    if (amount) {
      amtInWords = this.currenyService.getFormattedAmount(amount);
    }
    return amtInWords;
  }

  getGrantAmountInWords(amount: number) {
    let amtInWords = '-';
    if (amount) {
      amtInWords = this.currenyService.getAmountInWords(amount);
    }
    return amtInWords;
  }



  public getGrantTypeName(typeId): string {
    return this.appComp.grantTypes.filter(t => t.id === typeId)[0].name;
  }

  public getGrantTypeColor(typeId): any {
    return this.appComp.grantTypes.filter(t => t.id === typeId)[0].colorCode;
  }

  isExternalGrant(grant: Grant): boolean {
    const grantType = this.appComp.grantTypes.filter(gt => gt.id === grant.grantTypeId)[0];
    if (!grantType.internal) {
      return true;
    } else {
      return false;
    }
  }
}
