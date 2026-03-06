import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {

  constructor(private http: HttpClient) {

  }
  URL = "https://localhost:7282/api/auth/refresh";

  refreshToken() {
    const refreshToken = sessionStorage.getItem('Refreshtoken');

    return this.http.post(this.URL, {
      refreshToken: refreshToken
    });
  }

}
