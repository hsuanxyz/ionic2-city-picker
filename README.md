# ionic2-city-picker
ionic2 的省市区选择插件
灵感(抄袭😄)来自于

https://github.com/raychenfj/ion-multi-picker
https://github.com/driftyco/ionic/blob/master/src/components/datetime/datetime.ts

![](https://github.com/HsuanXyz/hsuan.github.io/blob/master/assets/ionic2-city-picker/%E5%9C%B0%E5%8C%BA%E9%80%89%E6%8B%A9.gif?raw=true)

## Install
`npm install ionic2-city-picker --save`

## Json 下载
https://raw.githubusercontent.com/HsuanXyz/hsuan.github.io/master/assets/ionic2-city-picker/city-data.json.zip

## Use
import module
```
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
...
import { CityPickerModule } from  "ionic2-city-picker/dist/city-picker.module"

@NgModule({
  declarations: [
    MyApp,
    ...
  ],
  imports: [
    CityPickerModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ...
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
```
获取城市数据json服务
```
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CityPickerService {

  constructor(public http: Http) {
    console.log('Hello CityPicker Provider');
  }

  getCitiesData(){
    return this.http.get('./assets/data/city-data.json')
      .toPromise()
      .then(response => response.json())
      .catch( err => {
        return Promise.reject(err)
      })

  }

}
```
视图控制器
```
import { Component } from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {CityPickerService} from "../../providers/city-picker";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cityData: any[]; //城市数据
  cityName:string = '北京市 北京市 东城区'; //初始化城市名
  code:string; //城市编码
  constructor(
    public navCtrl: NavController,
    public cityPickerSev: CityPickerService,
    public navParams: NavParams
  ) {

    this.setCityPickerData();
  }

  /**
   * 获取城市数据
   */
  setCityPickerData(){
    this.cityPickerSev.getCitiesData()
      .then( data => {
        this.cityData = data;
      });
  }

  /**
   * 城市选择器被改变时触发的事件
   * @param event
   */
  cityChange(event){
    console.log(event);
    this.code = event['region'].value
  }
}

```
视图
```
<ion-header>
  <ion-navbar>
    <ion-title>选择城市</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>

  <ion-item>
    <ion-label>省市区选择器</ion-label>
    <city-picker item-content
                 [cancelText]="'取消'"
                 [doneText]="'完成'"
                 [separator]="' - '"
                 [citiesData]="cityData"
                 [(ngModel)]="cityName"
                 (ionChange)="cityChange($event)">

    </city-picker>
  </ion-item>
  <p>地区编码：  {{code}}
  </p>

</ion-content>

```
## 输入属性
| 名称          |  类型 | 默认   | 描述 |
| ------------- | ------- | ------- | ----------- |
| citiesData     |CityPickerColumn     | 无  | 城市数据   |
| separator     |string     | ' '  | 分隔符   |
| doneText     |string     |  'done'  | 完成文字   |
| cancelText     |string     |  'cancel'  | 取消文字   |

### CityPickerColumn
| key | 类型 | 描述 |
| --- | --- | --- |
| name | string | 名称 |
| code | string | 地区编码 |
| children | CityPickerColumn | 子级 |

## 输出事件
| 名称       | 描述 |
| ---------- | --- |
|ionChange | 城市选择器被改变时触发的事件 |
