import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsermasterService {

  constructor(private http: HttpClient) { }

  URL1 = "https://localhost:7278/api/UserMaster/UserList";
  URL2 = "https://localhost:7278/api/UserMaster/SaveUser";
  URL3 = "https://localhost:7278/api/UserMaster/SelectUser";
  URL4 = "https://localhost:7278/api/UserMaster/DeleteUser";
  URL5 = "https://localhost:7278/api/UserMaster/SearchUser";
  URL6 = "https://localhost:7278/api/UserMaster/GetUsers";
  URL7 = "https://localhost:7278/api/UserMaster/UpdateUser";

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

  SaveOrg(data: any) {
    return this.http.post(this.URL2, data)
  }

  updateUser(data:any){
    return this.http.put(this.URL7, data)
  }

  selectUser(code: number): Observable<any> {

    const params = new HttpParams().set('code', code)
    return this.http.get(this.URL3, { params })
  }

  deleteUser(code: any) {
    const params = new HttpParams().set('code', code)
    return this.http.get(this.URL4, { params })
  }

  GetSearchedData(searchValue: string): Observable<any> {

    const params = new HttpParams()
      .set('key', searchValue);

    return this.http.get(this.URL5, { params })
  }

  GetUser(params: any) {
    return this.http.get<any>(this.URL6, { params })
  }
}
