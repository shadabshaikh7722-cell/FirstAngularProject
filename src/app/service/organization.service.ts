import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }

  URL = "https://localhost:7282/api/common/OrganizationList";
  URL1 = "https://localhost:7282/api/common/SearchedDataGet";
  URL2 = "https://localhost:7282/api/common/SaveOrg";
  URL3 = "https://localhost:7278/api/UserMaster/UserList";

  GetOrganization(): Observable<any> {
    return this.http.get(this.URL)
  }

  GetSearchedData(searchValue: string): Observable<any> {

    const params = new HttpParams()
      .set('key', searchValue);

    return this.http.get(this.URL1, { params })
  }

  SaveOrg(data: any) {
    return this.http.post(this.URL2, data)
  }

  NeonAPI() {

    const requestObj = {
      LoginUserId: "101",
      Request_Id: "REQ123",
      PageNumber: 1,
      PageSize: 10,
      Username: "Superadmin",
      Fullname: "Super Admin"
    };
    return this.http.post(this.URL3, requestObj)
  }
}
