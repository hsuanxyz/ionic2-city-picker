"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var city_picker_1 = require("./city-picker");
var ionic_angular_1 = require("ionic-angular");
var CityPickerModule = (function () {
    function CityPickerModule() {
    }
    return CityPickerModule;
}());
CityPickerModule = __decorate([
    core_1.NgModule({
        imports: [ionic_angular_1.IonicModule, common_1.CommonModule],
        declarations: [city_picker_1.CityPicker],
        exports: [city_picker_1.CityPicker],
        schemas: [
            core_1.CUSTOM_ELEMENTS_SCHEMA,
            core_1.NO_ERRORS_SCHEMA
        ]
    }),
    __metadata("design:paramtypes", [])
], CityPickerModule);
exports.CityPickerModule = CityPickerModule;
//# sourceMappingURL=city-picker.module.js.map