import { Component, EventEmitter, forwardRef, HostListener, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PickerController, Form, Item } from 'ionic-angular';
export var CITY_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return CityPicker; }),
    multi: true
};
export var CityPicker = (function () {
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
        /**
         * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
         */
        this.cancelText = 'Cancel';
        /**
         * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
         */
        this.doneText = 'Done';
        /**
         * @input {CityPickerColumn} city data
         */
        this.citiesData = [];
        /**
         * @input {string} separate
         */
        this.separator = ' ';
        /**
         * @output {any} Emitted when the city selection has changed.
         */
        this.ionChange = new EventEmitter();
        /**
         * @output {any} Emitted when the city selection was cancelled.
         */
        this.ionCancel = new EventEmitter();
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
            // do not continue if the click event came from a form submit
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
    /**
     * @private
     */
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
    /**
     * @private
     */
    CityPicker.prototype.generate = function (picker) {
        var values = this._value.toString().split(this.separator);
        // Add province data to picker
        var provinceCol = {
            name: 'province',
            options: this.citiesData.map(function (province) { return { text: province.name, value: province.code, disabled: false }; })
        };
        var provinceIndex = this.citiesData.findIndex(function (option) { return option.name == values[0]; });
        provinceIndex = provinceIndex === -1 ? 0 : provinceIndex;
        provinceCol.selectedIndex = provinceIndex;
        picker.addColumn(provinceCol);
        // Add city data to picker
        var cityColData = this.citiesData[provinceCol.selectedIndex].children;
        var cityCol = {
            name: 'city',
            options: cityColData.map(function (city) { return { text: city.name, value: city.code, disabled: false }; })
        };
        var cityIndex = cityColData.findIndex(function (option) { return option.name == values[1]; });
        cityIndex = cityIndex === -1 ? 0 : cityIndex;
        cityCol.selectedIndex = cityIndex;
        picker.addColumn(cityCol);
        // Add region data to picker
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
    /**
     * @private
     */
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
    /**
     * @private
     */
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
    /**
     * @private
     */
    CityPicker.prototype.setValue = function (newData) {
        if (newData === null || newData === undefined) {
            this._value = '';
        }
        else {
            this._value = newData;
        }
    };
    /**
     * @private
     */
    CityPicker.prototype.getValue = function () {
        return this._value;
    };
    /**
     * @private
     */
    CityPicker.prototype.checkHasValue = function (inputValue) {
        if (this._item) {
            this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
        }
    };
    /**
     * @private
     */
    CityPicker.prototype.updateText = function () {
        this._text = this._value.toString().trim();
    };
    Object.defineProperty(CityPicker.prototype, "disabled", {
        /**
         * @input {boolean} Whether or not the multi picker component is disabled. Default `false`.
         */
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
    /**
     * @private
     */
    CityPicker.prototype.writeValue = function (val) {
        this.setValue(val);
        this.updateText();
        this.checkHasValue(val);
    };
    /**
     * @private
     */
    CityPicker.prototype.ngAfterContentInit = function () {
        this.updateText();
    };
    /**
     * @private
     */
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
    /**
     * @private
     */
    CityPicker.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * @private
     */
    CityPicker.prototype.onChange = function (val) {
        // onChange used when there is not an formControlName
        this.setValue(this.getString(val));
        this.updateText();
        this.checkHasValue(val);
        this.onTouched();
    };
    /**
     * @private
     */
    CityPicker.prototype.onTouched = function () { };
    /**
     * @private
     */
    CityPicker.prototype.ngOnDestroy = function () {
        this._form.deregister(this);
    };
    /**
     * @private
     */
    CityPicker.prototype.getString = function (newData) {
        return "" + newData['province'].text + this.separator + (newData['city'].text || '') + this.separator + (newData['region'].text || '');
    };
    CityPicker.decorators = [
        { type: Component, args: [{
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
                    providers: [CITY_PICKER_VALUE_ACCESSOR],
                    encapsulation: ViewEncapsulation.None,
                },] },
    ];
    /** @nocollapse */
    CityPicker.ctorParameters = [
        { type: Form, },
        { type: Item, decorators: [{ type: Optional },] },
        { type: PickerController, decorators: [{ type: Optional },] },
    ];
    CityPicker.propDecorators = {
        'cancelText': [{ type: Input },],
        'doneText': [{ type: Input },],
        'citiesData': [{ type: Input },],
        'separator': [{ type: Input },],
        'ionChange': [{ type: Output },],
        'ionCancel': [{ type: Output },],
        '_click': [{ type: HostListener, args: ['click', ['$event'],] },],
        '_keyup': [{ type: HostListener, args: ['keyup.space',] },],
        'disabled': [{ type: Input },],
    };
    return CityPicker;
}());
//# sourceMappingURL=city-picker.js.map