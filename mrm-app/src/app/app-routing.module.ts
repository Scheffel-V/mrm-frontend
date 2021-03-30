import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'
import { CustomerComponent } from './models-components/customer/customer.component';
import { ListCustomersComponent } from './models-components/list-customers/list-customers.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'customers', component: ListCustomersComponent },
  { path: 'customers/:customerId', component: CustomerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
