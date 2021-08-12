import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './../../model/user';
import { stringify } from '@angular/core/src/util';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Organization } from 'app/model/dahsboard';
import { ThrowStmt } from '@angular/compiler';


@Component({
    selector: 'organization-details-dashboard',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

    org: Organization

    constructor(
        public appComp: AppComponent,
        private httpClient: HttpClient
    ) { }

    ngOnInit() {
        this.org = JSON.parse(JSON.stringify(this.appComp.loggedInUser.organization));
        this.appComp.subMenu = { name: 'Organization Details' };
    }

    loadImage() {

    }

    checkIfChanged(): boolean {
        if (this.org.name !== this.appComp.loggedInUser.organization.name) {
            return false;
        }
        if (this.org.description !== this.appComp.loggedInUser.organization.description) {
            return false;
        }
        if (this.org.website !== this.appComp.loggedInUser.organization.website) {
            return false;
        }
        return true;
    }

    updateOrg() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const url = '/api/organizations/';
        this.httpClient.post<Organization>(url, this.org, httpOptions).subscribe((resp: Organization) => {
            this.appComp.loggedInUser.organization = resp;
            this.org = JSON.parse(JSON.stringify(this.appComp.loggedInUser.organization));
        });
    }
}
