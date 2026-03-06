import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MenumasterService {

  constructor(private http: HttpClient) { }

  URL1 = "https://localhost:7278/api/UserMaster/UserList";
  NeonAPI() {

    const requestObj = {
      LoginUserId: "101",
      Request_Id: "REQ123",
      PageNumber: 1,
      PageSize: 10,
      Username: "Superadmin",
      Fullname: "Super Admin"
    };
    return this.http.post(this.URL1, requestObj)
    
  }
}
