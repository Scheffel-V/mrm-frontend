import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../models/user.model';
import { AUTHENTICATED_TOKEN, AUTHENTICATION_URL, AUTHENTICATED_USER_USERNAME, AUTHENTICATED_USER_ID } from '../app.constants';
import { Router } from '@angular/router';
import * as moment from "moment";
import { map, filter, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  error = null
  
  constructor(
    private http: HttpClient,
    private router : Router
    ) { }

  login(username, password) {
    let header = this.createBasicAuthenticationHttpHeader(username, password)

    return this.http.post<any>(
      AUTHENTICATION_URL + "/login",
      {
        username,
        password
      }
    ).pipe(map(
        data => {
          const expiresAt = moment().add(data.expiresIn, 'second');
          sessionStorage.setItem(AUTHENTICATED_USER_USERNAME, username)
          sessionStorage.setItem(AUTHENTICATED_TOKEN, `Bearer ${data.token}`)
          sessionStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
          this.router.navigate(['dashboard'])
          return data
        }
      ));
  }

  logout() {
    sessionStorage.removeItem(AUTHENTICATED_USER_USERNAME)
    sessionStorage.removeItem(AUTHENTICATED_TOKEN)
    sessionStorage.removeItem("expires_at")
    this.router.navigate([''])
  }

  isUserLoggedIn() {
    const expiration = this.getExpiration()

    return !expiration ? false : moment().isBefore(this.getExpiration())
  }

  getAuthenticatedUserUsername() {
    return sessionStorage.getItem(AUTHENTICATED_USER_USERNAME)
  }

  getAuthenticatedToken() {
    if(this.getAuthenticatedUserUsername()) {
      return sessionStorage.getItem(AUTHENTICATED_TOKEN)
    }

    return "Doesn't exist"
  }

  getExpiration() {
    const expiration = sessionStorage.getItem("expires_at")
    return !expiration ?  null : moment(JSON.parse(expiration))
  }  

  private createBasicAuthenticationHttpHeader(username : string, password : string) {
    let basicAuthHeaderString = 'Basic ' + window.btoa(username + ":" + password)
    
    return new HttpHeaders({
      Authorization : basicAuthHeaderString
    })
  }
}