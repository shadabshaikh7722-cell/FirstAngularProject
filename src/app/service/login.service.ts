import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  URLtest=environment.apiUrl+"api/auth/login";
  URL="https://localhost:7282/api/auth/login";

  ValidateUser(data:any):Observable<any>{
    console.log("URLtest",this.URLtest);
    return this.http.post(this.URLtest,data)
  }

}
