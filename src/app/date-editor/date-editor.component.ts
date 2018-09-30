import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const DAY = 24*60*60*1000;

export const DATE_EDIT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateEditorComponent),
  multi: true
};

// @Component({
//   selector: 'app-date-editor',
//   templateUrl: './date-editor.component.html',
//   styleUrls: ['./date-editor.component.css'],
//   providers: [DATE_EDIT_CONTROL_VALUE_ACCESSOR]
// })
export class DateEditorComponent implements ControlValueAccessor  {
  @Input() public max : Date;
  @Input() public min : Date;

  private onChangeCallback;
  private onTouchedCallback;

  private _innerValue : Date;
  constructor() { }

  private dd(val: number) : string {
    return `${(val<10)?'0':''}${val}`;
  }

  public get dateStr() : string {
    var value : Date = this.innerValue;
    if ( !value ) return '';
    return `${this.dd(value.getDate())}/${this.dd(value.getMonth()+1)}/${value.getFullYear()}`;
  }

  private onValueChange() {
    if (this.onChangeCallback) {
        this.onChangeCallback(this.innerValue);
    }
  }

  private get innerValue() : Date {
    return this._innerValue;
  }

  private set innerValue(value: Date) {
    if ( this._innerValue !== value ) {
      this._innerValue = value;
      this.onValueChange;
    }
  }

  
  public writeValue(value: Date) {
    if (value !== this.innerValue) {
        this.innerValue = value;
    }
  }

  public registerOnChange(fn: (Date)=>void) {
      this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) {
      this.onTouchedCallback = fn;
  }

  public get upEnabled() : boolean {
    return this.innerValue > this.min;
  }

  public get downEnabled() : boolean {
    return this.innerValue < this.max;
  }

  public upClicked() {
    this.innerValue = new Date(this.innerValue.valueOf() - DAY)
  }

  public downClicked() {
    this.innerValue = new Date(this.innerValue.valueOf() + DAY)
  }
}
