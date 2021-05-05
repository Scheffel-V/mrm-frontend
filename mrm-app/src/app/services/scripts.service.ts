import { Injectable } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  //private static loadedListCustomerTable = false
  //private static loadedListStockItemsTable = false

  constructor() { }

  public static loadScript(source) {
    let node = document.createElement('script');
    node.src = source;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
    console.log('Script ' + source + ' loaded.')
  }

  public loadListCustomerTableScript(source) {
    console.log("[SINGLETON] Loading Customer Table.")
    ScriptsService.loadScript(source)
  }

  public loadListStockItemsTableScript(source) {
    console.log("[SINGLETON] Loading StockItems Table.")
    ScriptsService.loadScript(source)
  }
}
