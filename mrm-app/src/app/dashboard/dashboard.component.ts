import { Component, OnInit } from '@angular/core'
import { ScriptsService } from '../services/scripts.service'
import { BaseComponent } from '../base/base.component'
import { Router } from '@angular/router'
import { Location } from '@angular/common';


const scripts = [
  '../../assets/js/demo/chart-area-demo.js',
  '../../assets/js/demo/chart-pie-demo.js'
]

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {
  constructor(
    scriptsService : ScriptsService,
    location : Location,
    private router : Router
  ) {
    super(
      scriptsService,
      location
    )
   }

  ngOnInit(): void {
   this.loadScripts([]) 
  }

  createCustomer(): void {
    this.router.navigate(['customers', this.INITIAL_ID])
  }

  listCustomers(): void {
    this.router.navigate(['customers'])
  }
}
