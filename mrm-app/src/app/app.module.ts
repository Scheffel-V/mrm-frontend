import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './models-components/customer/customer.component';
import { ListCustomersComponent } from './models-components/list-customers/list-customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BaseComponent } from './base/base.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    ListCustomersComponent,
    DashboardComponent,
    BaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
