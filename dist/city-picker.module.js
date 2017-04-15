import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CityPicker } from './city-picker';
export var CityPickerModule = (function () {
    function CityPickerModule() {
    }
    CityPickerModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [CityPicker],
                    exports: [CityPicker],
                    imports: [
                        IonicModule
                    ],
                    schemas: [
                        CUSTOM_ELEMENTS_SCHEMA,
                    ]
                },] },
    ];
    /** @nocollapse */
    CityPickerModule.ctorParameters = [];
    return CityPickerModule;
}());
//# sourceMappingURL=city-picker.module.js.map