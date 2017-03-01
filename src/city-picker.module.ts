/**
 * Created by hsuanlee on 2017/2/13.
 */
 import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 import { BrowserModule } from '@angular/platform-browser';
 import { IonicModule } from 'ionic-angular';

import { CityPicker } from './city-picker';


@NgModule({
  declarations: [ CityPicker],
  exports:[CityPicker],
  imports: [
    BrowserModule,
    IonicModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class CityPickerModule { }
