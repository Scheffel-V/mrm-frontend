import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'
import { CustomerComponent } from './models-components/customer/customer.component';
import { ListCustomersComponent } from './models-components/list-customers/list-customers.component';
import { ListProductModelsComponent } from './models-components/list-product-models/list-product-models.component';
import { ProductModelComponent } from './models-components/product-model/product-model.component';
import { SupplierComponent } from './models-components/supplier/supplier.component';
import { ListSuppliersComponent } from './models-components/list-suppliers/list-suppliers.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'customers', component: ListCustomersComponent },
  { path: 'customers/:customerId', component: CustomerComponent },
  { path: 'productModels', component: ListProductModelsComponent },
  { path: 'productModels/:productModelId', component: ProductModelComponent },
  { path: 'suppliers', component: ListSuppliersComponent },
  { path: 'suppliers/:supplierId', component: SupplierComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
