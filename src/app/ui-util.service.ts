import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiUtilService {

  constructor() { }

  public getCardStyle(flag: boolean) {
    if (flag) {
      return [
        'row',
        'w-100',
        'pl-1',
        'pt-3',
        'mb-4',
        'mx-0',
        'grants-section',
        'owner-highlight'
      ];
    } else {
      return ['row', 'w-100', 'pl-1', 'pt-3', 'mb-4', 'mx-0', 'grants-section', 'owner-no-highlight']
    }
  }
}
