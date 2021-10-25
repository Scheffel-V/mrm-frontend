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
import { CreateRentalComponent } from './models-components/create-rental/create-rental.component';
import { EventsComponent } from './models-components/events/events.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InvoicesComponent } from "./invoices/invoices.component";
import { CreateCustomerComponent } from './models-components/create-customer/create-customer.component';
import { CreateStockItemComponent } from './models-components/create-stock-item/create-stock-item.component';
import { CreateSupplierComponent } from './models-components/create-supplier/create-supplier.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'customers', component: ListCustomersComponent },
  { path: 'customers/-1', component: CreateCustomerComponent },
  { path: 'customers/:customerId', component: CustomerComponent },
  { path: 'suppliers', component: ListSuppliersComponent },
  { path: 'suppliers/-1', component: CreateSupplierComponent },
  { path: 'suppliers/:supplierId', component: SupplierComponent },
  { path: 'rentals', component: ListRentalsComponent },
  { path: 'rentals/-1', component: CreateRentalComponent },
  { path: 'rentals/:rentalId', component: RentalComponent },
  { path: 'stockItems', component: ListStockItemsComponent },
  { path: 'stockItems/-1', component: CreateStockItemComponent },
  { path: 'stockItems/:stockItemId', component: StockItemComponent },
  { path: 'events', component: EventsComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'invoices', component: InvoicesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
