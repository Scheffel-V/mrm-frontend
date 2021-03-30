import { Component, OnInit } from '@angular/core';


const scripts = [
  '../assets/js/chart-area-demo.js',
  '../assets/js/chart-pie-demo.js'
]

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loadAPI: Promise<any>;

  constructor() { }

  ngOnInit(): void {
    this.loadAPI = new Promise((resolve) => {
      console.log('resolving promise...');
      scripts.forEach(this.loadScript)
    });
  }

  public loadScript(source) {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = source;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
}
}
