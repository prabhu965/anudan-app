import { Grant } from './model/dahsboard';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GrantApiService {

  constructor(private http: HttpClient) { }

  public compareGrants(currentGrantId, origGrantId, userId): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };
    let url = "/api/user/" + userId + "/grant/compare/" + currentGrantId + "/" + origGrantId;

    return this.http.get(url, httpOptions).toPromise().then<any[]>((result: any[]) => {
      return Promise.resolve<Grant[]>(result);
    }).catch((err) => {
      return Promise.reject<any[]>(
        "Could not retrieve grants for compare"
      );
    });;
  }
}
