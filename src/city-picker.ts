import { AfterContentInit, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, Optional, Output,
  ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  PickerController, Form, Item, PickerCmp, PickerColumnCmp
} from 'ionic-angular';

import { CityPickerColumn } from './city-picker.model';

export const CITY_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CityPicker),
  multi: true
};

@Component({
  selector: 'city-picker',
  template:
  '<div class="city-picker-text">{{_text}}</div>' +
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
})
export class CityPicker implements AfterContentInit, ControlValueAccessor, OnDestroy{

  _disabled: any = false;
  _labelId: string = '';
  _text: string = '';
  _fn: Function;
  _isOpen: boolean = false;
  _value: any;

  _pickerCmp: PickerCmp;
  _pickerColumnCmps: PickerColumnCmp[];

   _provinceCol :number = 0;
   _cityCol :number = 0;
   _regionCol :number = 0;

  /**
   * @private
   */
  id: string;

  /**
   * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
   */
  @Input() cancelText: string = 'Cancel';

  /**
   * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
   */
  @Input() doneText: string = 'Done';

  /**
   * @input {CityPickerColumn} city data
   */
  @Input() citiesData: CityPickerColumn[] = [];

  /**
   * @input {string} separate
   */
  @Input() separator: string = ' ';

  /**
   * @output {any} Emitted when the city selection has changed.
   */
  @Output() ionChange: EventEmitter<any> = new EventEmitter();

  /**
   * @output {any} Emitted when the city selection was cancelled.
   */
  @Output() ionCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private _form: Form,
    @Optional() private _item: Item,
    @Optional() private _pickerCtrl: PickerController
  ) {
    this._form.register(this);
    if (_item) {
      this.id = 'dt-' + _item.registerInput('city-picker');
      this._labelId = 'lbl-' + _item.id;
      this._item.setElementClass('item-city-picker', true);
      this._value = this._value || '';
    }

  }

  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    if (ev.detail === 0) {
      // do not continue if the click event came from a form submit
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    this.open();
  }

  @HostListener('keyup.space')
  _keyup() {
    if (!this._isOpen) {
      this.open();
    }
  }

  /**
   * @private
   */
  open() {
    if (this._disabled) {
      return;
    }

    let pickerOptions: any = {};

    let picker = this._pickerCtrl.create(pickerOptions);
    pickerOptions.buttons = [
      {
        text: this.cancelText,
        role: 'cancel',
        handler: () => {
          this.ionCancel.emit(null);
        }
      },
      {
        text: this.doneText,
        handler: (data: any) => {
          this.onChange(data);
          this.ionChange.emit(data);
        }
      }
    ];

    this.generate(picker);
    this.validate(picker);

    picker.ionChange.subscribe(() => {
      this.validate(picker);
    });

    picker.present(pickerOptions);

    this._isOpen = true;
    this._pickerCmp = picker.instance;
    this._pickerColumnCmps = this._pickerCmp._cols.toArray();

    picker.onDidDismiss(() => {
      this._isOpen = false;
    });
  }

  /**
   * @private
   */
  generate(picker: any) {
    let values = this._value.toString().split(this.separator);

    // Add province data to picker
    let provinceCol: any = {
      name:  'province',
      options: this.citiesData.map( province => { return { text: province.name, value: province.code, disabled: false } } )
    };
    let provinceIndex = this.citiesData.findIndex( option => option.name == values[0]);
    provinceIndex = provinceIndex === -1 ? 0 : provinceIndex;
    provinceCol.selectedIndex = provinceIndex;
    picker.addColumn(provinceCol);

    // Add city data to picker
    let cityColData = this.citiesData[provinceCol.selectedIndex].children;
    let cityCol: any = {
      name:  'city',
      options: cityColData.map( city => { return {text: city.name, value: city.code, disabled: false} })
    };
    let cityIndex = cityColData.findIndex( option => option.name == values[1]);
    cityIndex = cityIndex === -1 ? 0 : cityIndex;
    cityCol.selectedIndex = cityIndex;
    picker.addColumn(cityCol);

    // Add region data to picker
    let regionData = this.citiesData[provinceCol.selectedIndex].children[cityCol.selectedIndex].children;
    let regionColCol: any = {
      name:  'region',
      options: regionData.map( city => {return { text: city.name, value: city.code, disabled: false }} )
    };
    let regionIndex = regionData.findIndex( option => option.name == values[2]);
    regionIndex = regionIndex === -1 ? 0 : regionIndex;
    regionColCol.selectedIndex = regionIndex;
    picker.addColumn(regionColCol);

    this.divyColumns(picker);
  }

  /**
   * @private
   */
  validate(picker: any) {

    let columns = picker.getColumns();

    let provinceCol = columns[0];
    let cityCol = columns[1];
    let regionCol = columns[2];

    if(cityCol && this._provinceCol != provinceCol.selectedIndex){
      cityCol.selectedIndex = 0;
      let cityColData = this.citiesData[provinceCol.selectedIndex].children;
      cityCol.options =  cityColData.map( city => { return {text: city.name, value: city.code, disabled: false} });
      if( this._pickerColumnCmps && cityCol.options.length > 0){
        setTimeout(() => this._pickerColumnCmps[1].setSelected(0, 100), 0);
      }
    }

    if(regionCol && (this._cityCol != cityCol.selectedIndex || this._provinceCol != provinceCol.selectedIndex)){
      let regionData = this.citiesData[provinceCol.selectedIndex].children[cityCol.selectedIndex].children;
      regionCol.selectedIndex = 0;
      regionCol.options = regionData.map( city => {return { text: city.name, value: city.code, disabled: false }} );
      if( this._pickerColumnCmps && regionCol.options.length > 0){
        setTimeout(() => this._pickerColumnCmps[2].setSelected(0, 100), 0);
      }

    }

    picker.refresh();

    this._provinceCol = provinceCol.selectedIndex;
    this._cityCol     = cityCol.selectedIndex;
    this._regionCol   = regionCol.selectedIndex;

  }

  /**
   * @private
   */
  divyColumns(picker: any) {
    let pickerColumns = picker.getColumns();
    let columns: number[] = [];

    pickerColumns.forEach((col:any, i:any) => {
      columns.push(0);

      col.options.forEach((opt:any) => {
        if (opt.text.length > columns[i]) {
          columns[i] = opt.text.length;
        }
      });

    });

    if (columns.length === 2) {
      let width = Math.max(columns[0], columns[1]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].align = 'left';
      pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = `${width * 17}px`;

    } else if (columns.length === 3) {
      let width = Math.max(columns[0], columns[2]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].columnWidth = `${columns[1] * 33}px`;
      pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = `${width * 17}px`;
      pickerColumns[2].align = 'left';
    }
  }

  /**
   * @private
   */
  setValue(newData: any) {
    if (newData === null || newData === undefined) {
      this._value = '';
    } else {
      this._value = newData;
    }
  }

  /**
   * @private
   */
  getValue(): string {
    return this._value;
  }

  /**
   * @private
   */
  checkHasValue(inputValue: any) {
    if (this._item) {
      this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
    }
  }

  /**
   * @private
   */
  updateText() {
    this._text = this._value.toString().trim();
  }

  /**
   * @input {boolean} Whether or not the multi picker component is disabled. Default `false`.
   */
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = val;
    this._item && this._item.setElementClass('item-city-picker-disabled', this._disabled);
  }

  /**
   * @private
   */
  writeValue(val: any) {
    this.setValue(val);
    this.updateText();
    this.checkHasValue(val);
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    this.updateText();
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (val: any) => {
      this.setValue(this.getString(val));
      this.updateText();
      this.checkHasValue(val);

      fn(this._value);
      this.onTouched();
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * @private
   */
  onChange(val: any) {
    // onChange used when there is not an formControlName
    this.setValue(this.getString(val));
    this.updateText();
    this.checkHasValue(val);
    this.onTouched();
  }

  /**
   * @private
   */
  onTouched() { }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }

  /**
   * @private
   */
  getString(newData:any) {
    return `${newData['province'].text}${this.separator}${newData['city'].text || ''}${this.separator}${newData['region'].text || ''}`;
  }

}
