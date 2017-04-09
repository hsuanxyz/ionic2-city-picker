import { AfterContentInit, EventEmitter, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { PickerController, Form, Item, PickerCmp, PickerColumnCmp } from 'ionic-angular';
import { CityPickerColumn } from './city-picker.model';
export declare const CITY_PICKER_VALUE_ACCESSOR: any;
export declare class CityPicker implements AfterContentInit, ControlValueAccessor, OnDestroy {
    private _form;
    private _item;
    private _pickerCtrl;
    _disabled: any;
    _labelId: string;
    _text: string;
    _fn: Function;
    _isOpen: boolean;
    _value: any;
    _pickerCmp: PickerCmp;
    _pickerColumnCmps: PickerColumnCmp[];
    _provinceCol: number;
    _cityCol: number;
    _regionCol: number;
    /**
     * @private
     */
    id: string;
    /**
     * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
     */
    cancelText: string;
    /**
     * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
     */
    doneText: string;
    /**
     * @input {CityPickerColumn} city data
     */
    citiesData: CityPickerColumn[];
    /**
     * @input {string} separate
     */
    separator: string;
    /**
     * @output {any} Emitted when the city selection has changed.
     */
    ionChange: EventEmitter<any>;
    /**
     * @output {any} Emitted when the city selection was cancelled.
     */
    ionCancel: EventEmitter<any>;
    constructor(_form: Form, _item: Item, _pickerCtrl: PickerController);
    _click(ev: UIEvent): void;
    _keyup(): void;
    /**
     * @private
     */
    open(): void;
    /**
     * @private
     */
    generate(picker: any): void;
    /**
     * @private
     */
    validate(picker: any): void;
    /**
     * @private
     */
    divyColumns(picker: any): void;
    /**
     * @private
     */
    setValue(newData: any): void;
    /**
     * @private
     */
    getValue(): string;
    /**
     * @private
     */
    checkHasValue(inputValue: any): void;
    /**
     * @private
     */
    updateText(): void;
    /**
     * @input {boolean} Whether or not the multi picker component is disabled. Default `false`.
     */
    disabled: boolean;
    /**
     * @private
     */
    writeValue(val: any): void;
    /**
     * @private
     */
    ngAfterContentInit(): void;
    /**
     * @private
     */
    registerOnChange(fn: Function): void;
    /**
     * @private
     */
    registerOnTouched(fn: any): void;
    /**
     * @private
     */
    onChange(val: any): void;
    /**
     * @private
     */
    onTouched(): void;
    /**
     * @private
     */
    ngOnDestroy(): void;
    /**
     * @private
     */
    getString(newData: any): string;
}
