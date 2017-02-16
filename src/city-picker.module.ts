/**
 * Created by hsuanlee on 2017/2/13.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA }           from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityPicker } from './city-picker';
import {IonicModule} from "ionic-angular";

@NgModule({
  imports:      [  IonicModule, CommonModule ],
  declarations: [ CityPicker],
  exports:[CityPicker],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class CityPickerModule { }
