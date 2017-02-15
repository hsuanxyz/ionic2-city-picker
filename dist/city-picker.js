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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ionic_angular_1 = require("ionic-angular");
exports.CITY_PICKER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return CityPicker; }),
    multi: true
};
var CityPicker = (function () {
    function CityPicker(_form, _item, _pickerCtrl) {
        this._form = _form;
        this._item = _item;
        this._pickerCtrl = _pickerCtrl;
        this._disabled = false;
        this._labelId = '';
        this._text = '';
        this._isOpen = false;
        this._provinceCol = 0;
        this._cityCol = 0;
        this._regionCol = 0;
        this.cancelText = 'Cancel';
        this.doneText = 'Done';
        this.citiesData = [];
        this.separator = ' ';
        this.ionChange = new core_1.EventEmitter();
        this.ionCancel = new core_1.EventEmitter();
        this._form.register(this);
        if (_item) {
            this.id = 'dt-' + _item.registerInput('city-picker');
            this._labelId = 'lbl-' + _item.id;
            this._item.setElementClass('item-city-picker', true);
            this._value = this._value || '';
        }
    }
    CityPicker.prototype._click = function (ev) {
        if (ev.detail === 0) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        this.open();
    };
    CityPicker.prototype._keyup = function () {
        if (!this._isOpen) {
            this.open();
        }
    };
    CityPicker.prototype.open = function () {
        var _this = this;
        if (this._disabled) {
            return;
        }
        var pickerOptions = {};
        var picker = this._pickerCtrl.create(pickerOptions);
        pickerOptions.buttons = [
            {
                text: this.cancelText,
                role: 'cancel',
                handler: function () {
                    _this.ionCancel.emit(null);
                }
            },
            {
                text: this.doneText,
                handler: function (data) {
                    _this.onChange(data);
                    _this.ionChange.emit(data);
                }
            }
        ];
        this.generate(picker);
        this.validate(picker);
        picker.ionChange.subscribe(function () {
            _this.validate(picker);
        });
        picker.present(pickerOptions);
        this._isOpen = true;
        this._pickerCmp = picker.instance;
        this._pickerColumnCmps = this._pickerCmp._cols.toArray();
        picker.onDidDismiss(function () {
            _this._isOpen = false;
        });
    };
    CityPicker.prototype.generate = function (picker) {
        var values = this._value.toString().split(this.separator);
        var provinceCol = {
            name: 'province',
            options: this.citiesData.map(function (province) { return { text: province.name, value: province.code, disabled: false }; })
        };
        var provinceIndex = this.citiesData.findIndex(function (option) { return option.name == values[0]; });
        provinceIndex = provinceIndex === -1 ? 0 : provinceIndex;
        provinceCol.selectedIndex = provinceIndex;
        picker.addColumn(provinceCol);
        var cityColData = this.citiesData[provinceCol.selectedIndex].children;
        var cityCol = {
            name: 'city',
            options: cityColData.map(function (city) { return { text: city.name, value: city.code, disabled: false }; })
        };
        var cityIndex = cityColData.findIndex(function (option) { return option.name == values[1]; });
        cityIndex = cityIndex === -1 ? 0 : cityIndex;
        cityCol.selectedIndex = cityIndex;
        picker.addColumn(cityCol);
        var regionData = this.citiesData[provinceCol.selectedIndex].children[cityCol.selectedIndex].children;
        var regionColCol = {
            name: 'region',
            options: regionData.map(function (city) { return { text: city.name, value: city.code, disabled: false }; })
        };
        var regionIndex = regionData.findIndex(function (option) { return option.name == values[2]; });
        regionIndex = regionIndex === -1 ? 0 : regionIndex;
        regionColCol.selectedIndex = regionIndex;
        picker.addColumn(regionColCol);
        this.divyColumns(picker);
    };
    CityPicker.prototype.validate = function (picker) {
        var _this = this;
        var columns = picker.getColumns();
        var provinceCol = columns[0];
        var cityCol = columns[1];
        var regionCol = columns[2];
        if (cityCol && this._provinceCol != provinceCol.selectedIndex) {
            cityCol.selectedIndex = 0;
            var cityColData = this.citiesData[provinceCol.selectedIndex].children;
            cityCol.options = cityColData.map(function (city) { return { text: city.name, value: city.code, disabled: false }; });
            if (this._pickerColumnCmps && cityCol.options.length > 0) {
                setTimeout(function () { return _this._pickerColumnCmps[1].setSelected(0, 100); }, 0);
            }
        }
        if (regionCol && (this._cityCol != cityCol.selectedIndex || this._provinceCol != provinceCol.selectedIndex)) {
            var regionData = this.citiesData[provinceCol.selectedIndex].children[cityCol.selectedIndex].children;
            regionCol.selectedIndex = 0;
            regionCol.options = regionData.map(function (city) { return { text: city.name, value: city.code, disabled: false }; });
            if (this._pickerColumnCmps && regionCol.options.length > 0) {
                setTimeout(function () { return _this._pickerColumnCmps[2].setSelected(0, 100); }, 0);
            }
        }
        picker.refresh();
        this._provinceCol = provinceCol.selectedIndex;
        this._cityCol = cityCol.selectedIndex;
        this._regionCol = regionCol.selectedIndex;
    };
    CityPicker.prototype.divyColumns = function (picker) {
        var pickerColumns = picker.getColumns();
        var columns = [];
        pickerColumns.forEach(function (col, i) {
            columns.push(0);
            col.options.forEach(function (opt) {
                if (opt.text.length > columns[i]) {
                    columns[i] = opt.text.length;
                }
            });
        });
        if (columns.length === 2) {
            var width = Math.max(columns[0], columns[1]);
            pickerColumns[0].align = 'right';
            pickerColumns[1].align = 'left';
            pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = width * 17 + "px";
        }
        else if (columns.length === 3) {
            var width = Math.max(columns[0], columns[2]);
            pickerColumns[0].align = 'right';
            pickerColumns[1].columnWidth = columns[1] * 33 + "px";
            pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = width * 17 + "px";
            pickerColumns[2].align = 'left';
        }
    };
    CityPicker.prototype.setValue = function (newData) {
        if (newData === null || newData === undefined) {
            this._value = '';
        }
        else {
            this._value = newData;
        }
    };
    CityPicker.prototype.getValue = function () {
        return this._value;
    };
    CityPicker.prototype.checkHasValue = function (inputValue) {
        if (this._item) {
            this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
        }
    };
    CityPicker.prototype.updateText = function () {
        this._text = this._value.toString().trim();
    };
    Object.defineProperty(CityPicker.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (val) {
            this._disabled = val;
            this._item && this._item.setElementClass('item-city-picker-disabled', this._disabled);
        },
        enumerable: true,
        configurable: true
    });
    CityPicker.prototype.writeValue = function (val) {
        this.setValue(val);
        this.updateText();
        this.checkHasValue(val);
    };
    CityPicker.prototype.ngAfterContentInit = function () {
        this.updateText();
    };
    CityPicker.prototype.registerOnChange = function (fn) {
        var _this = this;
        this._fn = fn;
        this.onChange = function (val) {
            _this.setValue(_this.getString(val));
            _this.updateText();
            _this.checkHasValue(val);
            fn(_this._value);
            _this.onTouched();
        };
    };
    CityPicker.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    CityPicker.prototype.onChange = function (val) {
        this.setValue(this.getString(val));
        this.updateText();
        this.checkHasValue(val);
        this.onTouched();
    };
    CityPicker.prototype.onTouched = function () { };
    CityPicker.prototype.ngOnDestroy = function () {
        this._form.deregister(this);
    };
    CityPicker.prototype.getString = function (newData) {
        return "" + newData['province'].text + this.separator + (newData['city'].text || '') + this.separator + (newData['region'].text || '');
    };
    return CityPicker;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CityPicker.prototype, "cancelText", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CityPicker.prototype, "doneText", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CityPicker.prototype, "citiesData", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CityPicker.prototype, "separator", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_a = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" && _a || Object)
], CityPicker.prototype, "ionChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_b = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" && _b || Object)
], CityPicker.prototype, "ionCancel", void 0);
__decorate([
    core_1.HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UIEvent]),
    __metadata("design:returntype", void 0)
], CityPicker.prototype, "_click", null);
__decorate([
    core_1.HostListener('keyup.space'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CityPicker.prototype, "_keyup", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], CityPicker.prototype, "disabled", null);
CityPicker = __decorate([
    core_1.Component({
        selector: 'city-picker',
        template: '<div class="city-picker-text">{{_text}}</div>' +
            '<button aria-haspopup="true" ' +
            'type="button" ' +
            '[id]="id" ' +
            'ion-button="item-cover" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
            '</button>',
        host: {
            '[class.city-picker-disabled]': '_disabled'
        },
        providers: [exports.CITY_PICKER_VALUE_ACCESSOR],
        encapsulation: core_1.ViewEncapsulation.None,
    }),
    __param(1, core_1.Optional()),
    __param(2, core_1.Optional()),
    __metadata("design:paramtypes", [typeof (_c = typeof ionic_angular_1.Form !== "undefined" && ionic_angular_1.Form) === "function" && _c || Object, typeof (_d = typeof ionic_angular_1.Item !== "undefined" && ionic_angular_1.Item) === "function" && _d || Object, typeof (_e = typeof ionic_angular_1.PickerController !== "undefined" && ionic_angular_1.PickerController) === "function" && _e || Object])
], CityPicker);
exports.CityPicker = CityPicker;
var _a, _b, _c, _d, _e;
//# sourceMappingURL=city-picker.js.map