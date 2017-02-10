import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {CityPickerService} from "../../providers/city-picker";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dependentColumns: any[];
  text:string = '1';
  code:string;
  constructor(
    public navCtrl: NavController,
    public cityPickerSev: CityPickerService,
  ) {

    this.cityPickerSev.getCitiesData()
      .then( data => {
        this.dependentColumns = data;
      });
  }

  cityChange(event){
    this.code = event['region'].value
  }

}
