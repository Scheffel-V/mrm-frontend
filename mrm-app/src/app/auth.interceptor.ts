import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService : AuthService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authToken = this.authService.getAuthenticatedToken()

    if (authToken) {
      req = req.clone(
        {
          headers: req.headers.set(
            "Authorization",
            authToken
          )
      }
      )
    }

    return next.handle(req)
  }
}
