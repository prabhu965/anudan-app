import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../model/user';
import {SerializationHelper, Tenant, Tenants} from '../model/dahsboard';
import {AppComponent} from '../app.component';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {GrantDataService} from '../grant.data.service';
import {DataService} from '../data.service';
import {Grant} from '../model/dahsboard'
import * as $ from 'jquery'
import {ToastrService} from 'ngx-toastr';
import {GrantComponent} from "../grant/grant.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './grants.component.html',
  styleUrls: ['./grants.component.css'],
  providers: [GrantComponent]
})
export class GrantsComponent implements OnInit {

  user: User;
  tenants: Tenants;
  currentTenant: Tenant;
  hasTenant = false;
  hasKpisToSubmit: boolean;
  kpiSubmissionDate: Date;
  kpiSubmissionTitle: string;
  currentGrantId: number;

  constructor(private http: HttpClient,
              public appComponent: AppComponent,
              private router: Router,
              private route: ActivatedRoute,
              private data: GrantDataService,
              private toastr: ToastrService,
              public grantComponent: GrantComponent,
              private dataService: DataService) {
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('USER'));
    this.appComponent.loggedInUser = user;
    this.fetchDashboard(user.id);
    this.dataService.currentMessage.subscribe(id => this.currentGrantId = id);
  }


  fetchDashboard(userId: string) {
  console.log('dashboard');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    this.appComponent.loggedIn = true;

    const url = '/api/users/' + userId + '/dashboard';
    this.http.get<Tenants>(url, httpOptions).subscribe((tenants: Tenants) => {

      // this.tenants = new Tenants();
      this.tenants = tenants;
      console.log(this.tenants);
      // this.tenants = tenants;
        if (this.tenants.tenants && this.tenants.tenants.length > 0) {
        this.currentTenant = this.tenants.tenants[0];
        this.hasTenant = true;
        localStorage.setItem('X-TENANT-CODE', this.currentTenant.name);

        for (const grant of this.currentTenant.grants) {
          for (const submission of grant.submissions) {
            if (submission.flowAuthorities) {
              this.hasKpisToSubmit = true;
              this.kpiSubmissionTitle = submission.title;
              // this.kpiSubmissionDate = submission.submitBy;
              break;
            }
          }
          if (this.hasKpisToSubmit) {
            break;
          }
        }
      }
    },
        error1 => {
      const errorMsg = error1 as HttpErrorResponse;
          this.toastr.error(errorMsg.error.message, errorMsg.error.messageTitle, {
            enableHtml: true,
            positionClass: 'toast-top-center'
          });
        });
  }

  manageGrant(grant: Grant) {

   this.dataService.changeMessage(grant.id);
    this.data.changeMessage(grant);
    this.router.navigate(['grant/basic-details']);
    this.appComponent.currentView = 'grant';
    
  }
}
