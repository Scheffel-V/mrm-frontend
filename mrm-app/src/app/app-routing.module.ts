import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'
import { CustomerComponent } from './models-components/customer/customer.component';
import { ListCustomersComponent } from './models-components/list-customers/list-customers.component';
import { SupplierComponent } from './models-components/supplier/supplier.component';
import { ListSuppliersComponent } from './models-components/list-suppliers/list-suppliers.component';
import { RentalComponent } from './models-components/rental/rental.component';
import { ListRentalsComponent } from './models-components/list-rentals/list-rentals.component';
import { StockItemComponent } from './models-components/stock-item/stock-item.component';
import { ListStockItemsComponent } from './models-components/list-stock-items/list-stock-items.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'customers', component: ListCustomersComponent },
  { path: 'customers/:customerId', component: CustomerComponent },
  { path: 'suppliers', component: ListSuppliersComponent },
  { path: 'suppliers/:supplierId', component: SupplierComponent },
  { path: 'rentals', component: ListRentalsComponent },
  { path: 'rentals/:rentalId', component: RentalComponent },
  { path: 'rentals', component: ListRentalsComponent },
  { path: 'rentals/:rentalId', component: RentalComponent },
  { path: 'stockItems', component: ListStockItemsComponent },
  { path: 'stockItems/:stockItemId', component: StockItemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
