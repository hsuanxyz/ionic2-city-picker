import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {CityPickerService} from "../../providers/city-picker";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dependentColumns: any[];
  text:string = '四川省 成都市 武侯区';
  // text:string = '台湾省';
  zipCode:string;
  myDate:any;
  constructor(
    public navCtrl: NavController,
    public cityPickerSev: CityPickerService,
  ) {

    this.cityPickerSev.getCitiesData()
      .then( data => {
        console.log(data)
        this.dependentColumns = data;
      });


    // this.dependentColumns = [
    //   {
    //     columnWidth: '100px',
    //     options: [
    //       { text: '1', value: '1' },
    //       { text: '2', value: '2' },
    //       { text: '3', value: '3' }],
    //   },
    //   {
    //     columnWidth: '100px',
    //     options: [
    //       { text: '1-1', value: '1-1', parentVal: '1' },
    //       { text: '1-2', value: '1-2', parentVal: '1' },
    //       { text: '1-3', value: '1-3', parentVal: '1' },
    //       { text: '1-4', value: '1-4', parentVal: '1' },
    //
    //       { text: '2-1', value: '2-1', parentVal: '2' },
    //       { text: '2-2', value: '2-2', parentVal: '2' },
    //       { text: '2-3', value: '2-3', parentVal: '2' },
    //       { text: '2-4', value: '2-4', parentVal: '2' },
    //
    //       { text: '3-1', value: '3-1', parentVal: '3' },
    //       { text: '3-2', value: '3-2', parentVal: '3' },
    //       { text: '3-3', value: '3-3', parentVal: '3' },
    //       { text: '3-4', value: '3-4', parentVal: '3' }]
    //   },
    //   {
    //     columnWidth: '100px',
    //     options: [
    //       { text: '1-1-1', value: '1-1-1', parentVal: '1-1' },
    //       { text: '1-1-2', value: '1-1-2', parentVal: '1-1' },
    //       { text: '1-1-3', value: '1-1-3', parentVal: '1-1' },
    //       { text: '1-1-4', value: '1-1-4', parentVal: '1-1' },
    //       { text: '1-2-1', value: '1-2-1', parentVal: '1-2' },
    //       { text: '1-2-2', value: '1-2-2', parentVal: '1-2' },
    //
    //
    //       { text: '2-1-1', value: '2-1-1', parentVal: '2-1' },
    //       { text: '2-1-2', value: '2-1-2', parentVal: '2-1' },
    //
    //       { text: '2-3-3', value: '2-3-3', parentVal: '2-3' },
    //       { text: '2-3-4', value: '2-3-4', parentVal: '2-3' },
    //       { text: '2-4-1', value: '2-4-1', parentVal: '2-4' },
    //       { text: '2-4-2', value: '2-4-2', parentVal: '2-4' },
    //       { text: '2-4-3', value: '2-4-3', parentVal: '2-4' },
    //       { text: '2-4-4', value: '2-4-4', parentVal: '2-4' },
    //
    //       { text: '3-1-1', value: '3-1-1', parentVal: '3-1' },
    //       { text: '3-1-2', value: '3-1-2', parentVal: '3-1' },
    //
    //       { text: '3-3-4', value: '3-3-4', parentVal: '3-3' },
    //       { text: '3-4-1', value: '3-4-1', parentVal: '3-4' },
    //       { text: '3-4-2', value: '3-4-2', parentVal: '3-4' },
    //       { text: '3-4-3', value: '3-4-3', parentVal: '3-4' },
    //       { text: '3-4-4', value: '3-4-4', parentVal: '3-4' },
    //     ]
    //   }
    // ];

  }

  e(ev){
    this.zipCode = ev['2'].value
  }

}
