import { Component, OnInit } from '@angular/core';
import { SELECTED_LANGUAGE, INITIAL_ID } from '../app.constants'
import { TEXTS } from '../ui-texts/texts'
import { ScriptsService } from '../services/scripts.service'
import { Location } from '@angular/common';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  public TEXTS = TEXTS[SELECTED_LANGUAGE]
  private loadAPI: Promise<any>;
  protected INITIAL_ID = INITIAL_ID

  constructor(
    private scriptsService : ScriptsService,
    protected location : Location
  ) { }

  ngOnInit(): void {
  }

  protected loadScripts(scripts : string[]) : void {
    this.loadAPI = new Promise((resolve) => {
      console.log('resolving scripts loading...')
      scripts.forEach(this.scriptsService.loadScript)
    });
  }

  backPage(): void {
    this.location.back()
  }
}
