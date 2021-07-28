import { SearchFilterComponent } from 'app/layouts/admin-layout/search-filter/search-filter.component';
import { GrantDataService } from './../../grant.data.service';
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
  title; any;
  searchClosed = true;
  filterReady = false;
  filterCriteria: any;
  @ViewChild("appSearchFilter") appSearchFilter: SearchFilterComponent;
  filteredGrants: any;

  constructor(private dialog: MatDialog,
    private reportService: ReportDataService,
    public dialogRef: MatDialogRef<ListDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public listMetaData: any
    , private http: HttpClient,
    public currenyService: CurrencyService,
    public uiService: UiUtilService,
    public grantService: GrantDataService) {
    this.appComp = listMetaData.appComp;
    this._for = listMetaData._for;
    this.title = listMetaData.title;
    if (listMetaData._for === 'grant') {
      this.grants = listMetaData.grants;
      this.filteredGrants = this.grants;
    } else if (listMetaData._for === 'report') {
      this.reports = listMetaData.reports;
    } else if (listMetaData._for === 'disbursement') {
      this.disbursements = listMetaData.disbursements;
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

  openSearch() {
    if (this.searchClosed) {
      this.searchClosed = false;
    } else {
      this.searchClosed = true;
      this.appSearchFilter.closeSearch();
    }
  }

  startFilter(val) {
    val = val.toLowerCase();
    this.filterCriteria = val;
    this.filteredGrants = this.grants.filter(g => {
      this.filterReady = true;
      return (
        (g.name && g.name.trim() !== '' && g.name.toLowerCase().includes(val)) ||
        //(g.organization && g.organization.name && g.organization.name.toLowerCase().includes(val)) ||
        (g.referenceNo && g.referenceNo.toLowerCase().includes(val))
      )
    });



  }

  resetFilterFlag(val) {
    this.filterReady = val;
  }
}
