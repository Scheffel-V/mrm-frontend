import { Component } from '@angular/core';
import { ScriptsService } from './services/scripts.service';


const scripts = [
  "../../assets/js/demo/datatables-demo.js"
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mrm-app';

  constructor(
    private scriptsService : ScriptsService,
  ) {}

  ngAfterViewInit(): void {
    this.loadScripts(scripts)
  }

  loadScripts(scripts : string[]) : void {
    new Promise((resolve) => {
      console.log('YEY Resolving scripts loading...')
      scripts.forEach(this.scriptsService.loadScript)
    });
  }
}
