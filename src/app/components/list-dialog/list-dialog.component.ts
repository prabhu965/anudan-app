import { DisbursementDataService } from 'app/disbursement.data.service';
import { Disbursement } from 'app/model/disbursement';
import { SingleReportDataService } from './../../single.report.data.service';
import { Router } from '@angular/router';
import { DataService } from './../../data.service';
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
  providers: [AppComponent, UpdateService],
  styles: [`
    ::ng-deep .addnl-report-class{
      overflow: hidden !important;
    }
  `]
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
  @ViewChild("appSearchFilter1") appSearchFilter1: SearchFilterComponent;
  filteredGrants: any;
  deleteDisbursementEvent: boolean = false;

  otherReportsClicked: boolean = false;
  deleteReportsClicked: boolean = false;
  filteredReports: any;
  filteredDisbursements: any;

  constructor(private dialog: MatDialog,
    private reportService: ReportDataService,
    public dialogRef: MatDialogRef<ListDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public listMetaData: any
    , private http: HttpClient,
    public currenyService: CurrencyService,
    public uiService: UiUtilService,
    public grantService: GrantDataService,
    public dataService: DataService,
    public router: Router,
    private singleReportService: SingleReportDataService,
    private disbursementDataService: DisbursementDataService

  ) {

    this.appComp = listMetaData.appComp;
    this._for = listMetaData._for;
    this.title = listMetaData.title;
    if (listMetaData._for === 'grant') {
      this.grants = listMetaData.grants;
      this.filteredGrants = this.grants;
    } else if (listMetaData._for === 'report') {
      this.reports = listMetaData.reports;
      this.filteredReports = this.reports;
    } else if (listMetaData._for === 'disbursement') {
      this.disbursements = listMetaData.disbursements;
      this.filteredDisbursements = this.disbursements;
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
      this.appSearchFilter1.closeSearch();
    }
  }

  startFilter(val) {
    val = val.toLowerCase();
    this.filterCriteria = val;
    if (this._for === 'grant') {
      this.filteredGrants = this.grants.filter(g => {
        this.filterReady = true;
        return (
          (g.name && g.name.trim() !== '' && g.name.toLowerCase().includes(val)) ||
          //(g.organization && g.organization.name && g.organization.name.toLowerCase().includes(val)) ||
          (g.referenceNo && g.referenceNo.toLowerCase().includes(val))
        )
      });
    } else if (this._for === 'report') {
      this.filteredReports = this.reports.filter(g => {
        this.filterReady = true;
        return (g.name && g.name.trim() !== '' && g.name.toLowerCase().includes(val)) ||
          (g.grant.name.toLowerCase().includes(val)) ||
          (g.grant.organization && g.grant.organization.name && g.grant.organization.name.toLowerCase().includes(val)) ||
          (g.grant.referenceNo && g.grant.referenceNo.toLowerCase().includes(val))
      });
    } else if (this._for === 'disbursement') {
      this.filteredDisbursements = this.disbursements.filter(g => {
        this.filterReady = true;
        return (g.grant.name.toLowerCase().includes(val)) ||
          (g.grant.organization && g.grant.organization.name && g.grant.organization.name.toLowerCase().includes(val)) ||
          (g.grant.referenceNo && g.grant.referenceNo.toLowerCase().includes(val))
      });
    }




  }

  closeSearch(ev: any) {
    this.searchClosed = ev;
  }

  resetFilterFlag(val) {
    this.filterReady = val;
  }

  manageGrant(grant: Grant) {

    this.appComp.subMenu = { name: "In-progress Grants", action: "dg" };
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      })
    };

    this.appComp.loggedIn = true;

    const url = "/api/user/" + this.appComp.loggedInUser.id + "/grant/" + grant.id;

    this.http.get(url, httpOptions).subscribe((grant: Grant) => {
      if (
        grant.workflowAssignments.filter(
          (wf) =>
            wf.stateId === grant.grantStatus.id &&
            wf.assignments === this.appComp.loggedInUser.id
        ).length > 0 &&
        this.appComp.loggedInUser.organization.organizationType !==
        "GRANTEE" &&
        grant.grantStatus.internalStatus !== "ACTIVE" &&
        grant.grantStatus.internalStatus !== "CLOSED"
      ) {
        grant.canManage = true;
      } else {
        grant.canManage = false;
      }
      this.dataService.changeMessage(grant.id);
      this.grantService.changeMessage(grant, this.appComp.loggedInUser.id);
      this.appComp.originalGrant = JSON.parse(JSON.stringify(grant));
      this.appComp.currentView = "grant";

      this.appComp.selectedTemplate = grant.grantTemplate;

      this.dialogRef.close();

      if (grant.canManage) {
        this.router.navigate(["grant/basic-details"]);
      } else {
        this.appComp.action = "preview";
        this.router.navigate(["grant/preview"]);
      }
    });

  }

  manageReport(report: Report) {
    if (this.otherReportsClicked || this.deleteReportsClicked) {
      return;
    }
    this.appComp.subMenu = { name: 'Submitted Reports', action: 'sr' };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    const user = JSON.parse(localStorage.getItem('USER'));
    let url = '/api/user/' + user.id + '/report/' + report.id;
    this.http.get<Report>(url, httpOptions).subscribe((report: Report) => {
      this.appComp.currentView = 'report';
      this.singleReportService.changeMessage(report);
      this.dialogRef.close();
      if (report.canManage && report.status.internalStatus != 'CLOSED') {
        this.appComp.action = 'report';
        this.router.navigate(['report/report-header']);
      } else {
        this.appComp.action = 'report';
        this.router.navigate(['report/report-preview']);
      }
    });
  }

  manageDisbursement(disbursement: Disbursement) {
    if (this.deleteDisbursementEvent) {
      return;
    }

    this.appComp.subMenu = { name: 'Approvals In-progress', action: 'id' };

    this.disbursementDataService.changeMessage(disbursement);
    this.dialogRef.close();
    if (disbursement.canManage) {
      this.router.navigate(['disbursement/approval-request']);
    } else {
      this.router.navigate(['disbursement/preview']);
    }
  }
}
