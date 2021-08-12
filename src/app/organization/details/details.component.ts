import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './../../model/user';
import { stringify } from '@angular/core/src/util';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Organization } from 'app/model/dahsboard';
import { ThrowStmt } from '@angular/compiler';


@Component({
    selector: 'organization-details-dashboard',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

    org: Organization;
    twitter: boolean = false;
    facebook: boolean = false;
    linkedin: boolean = false;
    instagram: boolean = false;

    @ViewChild("twitterEl") twitterEl: ElementRef;
    @ViewChild("facebookEl") facebookEl: ElementRef;
    @ViewChild("linkedinEl") linkedinEl: ElementRef;
    @ViewChild("instagramEl") instagramEl: ElementRef;

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
        if (this.org.twitter !== this.appComp.loggedInUser.organization.twitter) {
            return false;
        }
        if (this.org.facebook !== this.appComp.loggedInUser.organization.facebook) {
            return false;
        }
        if (this.org.linkedin !== this.appComp.loggedInUser.organization.linkedin) {
            return false;
        }
        if (this.org.instagram !== this.appComp.loggedInUser.organization.instagram) {
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
            localStorage.setItem('USER', JSON.stringify(this.appComp.loggedInUser));
            this.org = JSON.parse(JSON.stringify(this.appComp.loggedInUser.organization));
        });
    }

    showTwitter() {
        if (this.twitter) {
            this.twitter = false;
        } else {
            this.twitter = true;
            this.twitterEl.nativeElement.focus();
        }
    }

    showFacebook() {
        if (this.facebook) {
            this.facebook = false;
        } else {
            this.facebook = true;
        }
    }

    showLinkedin() {
        if (this.linkedin) {
            this.linkedin = false;
        } else {
            this.linkedin = true;
        }
    }

    showInstagram() {
        if (this.instagram) {
            this.instagram = false;
        } else {
            this.instagram = true;
        }
    }

    processProfilePic(ev) {
        const file: File = ev.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            //this.user.userProfile = reader.result.toString();
            let formData = new FormData();
            formData.append("file", file);

            const httpOptions = {
                headers: new HttpHeaders({
                    'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                    'Authorization': localStorage.getItem('AUTH_TOKEN')
                })
            };
            const url = 'api/organizations/logo';

            this.httpClient.post(url, formData, httpOptions).subscribe(() => {

                this.appComp.logo = "/api/public/images/" + localStorage.getItem("X-TENANT-CODE") + '/logo?' + (new Date().getTime()).toString();
            });
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };

    }
}
