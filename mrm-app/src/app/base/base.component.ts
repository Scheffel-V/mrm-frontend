import { Component, OnInit } from '@angular/core';
import { SELECTED_LANGUAGE, INITIAL_ID } from '../app.constants'
import { TEXTS } from '../ui-texts/texts'
import { ScriptsService } from '../services/scripts.service'
import { Location } from '@angular/common';
import { Router } from '@angular/router'


const scripts = [
  "../../assets/js/sb-admin-2.js"
]

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  public TEXTS = TEXTS[SELECTED_LANGUAGE]
  public router : Router
  private loadAPI: Promise<any>;
  protected INITIAL_ID = INITIAL_ID

  constructor(
    private scriptsService : ScriptsService,
    protected location : Location,
    router : Router
  ) {
    this.router = router
   }

  ngOnInit(): void {
    console.log("Load dos scripts na base!")
    this.loadScripts(scripts)
  }

  goToDashboard(): void {
    this.router.navigate([''])
  }

  protected loadScripts(scripts : string[]) : void {
    this.loadAPI = new Promise((resolve) => {
      console.log('resolving scripts loading...')
      scripts.forEach(this.scriptsService.loadScript)
    });
  }

  createCustomer(): void {
    this.router.navigate(['customers', this.INITIAL_ID])
  }

  listCustomers(): void {
    this.router.navigate(['customers'])
  }

  backPage(): void {
    this.location.back()
  }
}
