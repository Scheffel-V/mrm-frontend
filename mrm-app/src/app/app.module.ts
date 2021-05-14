import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './models-components/customer/customer.component';
import { ListCustomersComponent } from './models-components/list-customers/list-customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BaseComponent } from './base/base.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { SupplierComponent } from './models-components/supplier/supplier.component';
import { ListSuppliersComponent } from './models-components/list-suppliers/list-suppliers.component';
import { StockItemComponent } from './models-components/stock-item/stock-item.component';
import { RentalComponent } from './models-components/rental/rental.component';
import { ListRentalsComponent } from './models-components/list-rentals/list-rentals.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListStockItemsComponent } from './models-components/list-stock-items/list-stock-items.component'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPortuguesePaginator } from './ui-texts/portuguese-paginator'
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';
import { MonthProfitChartComponent } from './charts/month-profit-chart/month-profit-chart.component';
import { CreatedRentalComponent } from './models-components/created-rental/created-rental.component'
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { InvoiceComponent } from './models-components/invoice/invoice.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerContainer } from './spinner-container/spinner-container';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    ListCustomersComponent,
    DashboardComponent,
    BaseComponent,
    SupplierComponent,
    ListSuppliersComponent,
    StockItemComponent,
    RentalComponent,
    ListRentalsComponent,
    ListStockItemsComponent,
    MonthProfitChartComponent,
    CreatedRentalComponent,
    InvoiceComponent,
    SpinnerContainer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskModule.forRoot(),
    BrowserAnimationsModule,
    NgxMatSelectSearchModule,
    MatDividerModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatSortModule,
    FlexLayoutModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    ChartsModule,
    WavesModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatGridListModule,
    MatProgressBarModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginator() }
  ],
  bootstrap: [AppComponent],
  entryComponents: [InvoiceComponent]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    iconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );
  }
 }
