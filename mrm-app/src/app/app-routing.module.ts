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
import { LoginComponent } from './login/login.component';
import { RouteGuardService } from './services/route-guard.service';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[RouteGuardService] },
  { path: 'customers', component: ListCustomersComponent, canActivate:[RouteGuardService] },
  { path: 'customers/-1', component: CreateCustomerComponent, canActivate:[RouteGuardService] },
  { path: 'customers/:customerId', component: CustomerComponent, canActivate:[RouteGuardService] },
  { path: 'suppliers', component: ListSuppliersComponent, canActivate:[RouteGuardService] },
  { path: 'suppliers/-1', component: CreateSupplierComponent, canActivate:[RouteGuardService] },
  { path: 'suppliers/:supplierId', component: SupplierComponent, canActivate:[RouteGuardService] },
  { path: 'rentals', component: ListRentalsComponent, canActivate:[RouteGuardService] },
  { path: 'rentals/-1', component: CreateRentalComponent, canActivate:[RouteGuardService] },
  { path: 'rentals/:rentalId', component: RentalComponent, canActivate:[RouteGuardService] },
  { path: 'stockItems', component: ListStockItemsComponent, canActivate:[RouteGuardService] },
  { path: 'stockItems/-1', component: CreateStockItemComponent, canActivate:[RouteGuardService] },
  { path: 'stockItems/:stockItemId', component: StockItemComponent, canActivate:[RouteGuardService] },
  { path: 'events', component: EventsComponent, canActivate:[RouteGuardService] },
  { path: 'inventory', component: InventoryComponent, canActivate:[RouteGuardService] },
  { path: 'invoices', component: InvoicesComponent, canActivate:[RouteGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
