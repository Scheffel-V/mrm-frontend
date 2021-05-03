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
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ProductModelComponent } from './models-components/product-model/product-model.component';
import { ListProductModelsComponent } from './models-components/list-product-models/list-product-models.component';
import { SupplierComponent } from './models-components/supplier/supplier.component';
import { ListSuppliersComponent } from './models-components/list-suppliers/list-suppliers.component';
import { StockItemComponent } from './models-components/stock-item/stock-item.component'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    ListCustomersComponent,
    DashboardComponent,
    BaseComponent,
    ProductModelComponent,
    ListProductModelsComponent,
    SupplierComponent,
    ListSuppliersComponent,
    StockItemComponent
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
