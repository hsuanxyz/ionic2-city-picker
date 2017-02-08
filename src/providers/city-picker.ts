import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
/*
  Generated class for the CityPicker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CityPickerService {

  constructor(public http: Http) {
    console.log('Hello CityPicker Provider');
  }

  getCitiesData(){
    return this.http.get('./assets/data/c.json')
      .toPromise()
      .then(response => response.json())
      .catch( err => {
        return Promise.reject(err)
      })

  }

}
