import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { BaseComponent } from '../base/base.component';
import { ScriptsService } from '../services/scripts.service'
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  user = new User(-1)
  error = null

  constructor(
    authService: AuthService, 
    router: Router,
    scriptsService : ScriptsService,
    location : Location,
    matSnackBar : MatSnackBar
  ) {
    super(
      scriptsService,
      location,
      router,
      matSnackBar,
      authService
    )

    if (this.authService.isUserLoggedIn) { 
      this.router.navigate(['/dashboard']);
    }

    this.error = this.authService.error
  }

  ngOnInit(): void {
  }

  login() {
    if (this.user.username && this.user.password) {
      this.authService.login(this.user.username, this.user.password)
      .subscribe(
        data => {

        },
        error => {
          this.error = error
          this.openSnackBar(error.error.message);
        }
      )
    }
  }
}
