import { Component, forwardRef  } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const CURRENCY_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CurrencyInputComponent),
    multi: true
};

@Component({
  selector: 'currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
  providers: [CURRENCY_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CurrencyInputComponent implements ControlValueAccessor {
    private onChangeCallback;
    private onTouchedCallback;
    private _value : string = "";
    public minus : boolean = true;

    public get value() : string {
        return this._value;
    }

    public set value(val : string) {
        if ( this._value !== val ) {
            this._value = val;
            this.onValueChange();
        }
    }

    private onValueChange() {
        if (this.onChangeCallback) {
            this.onChangeCallback(this.innerValue);
        }
}

    private get innerValue() : number {
        var val : number;
        if ( this.value === "" ) return 0;
        val = parseFloat(this.value);
        if ( this.minus ) {
            val = - val;
        }
        return val;
    }

    private set innerValue(val : number) {
        val = Math.round(val*10) / 10;
        if ( val === this.innerValue ) return;
        if ( val === 0) {
            this.value = "";
        } else {
            this.value = Math.abs(val).toString();
            if ( val !==0 ) {
                this.minus = (val < 0);
            }
        }
        this.onValueChange();
    }

    public get sign() : string {
        return (this.minus) ? String.fromCharCode(0x229D) : String.fromCharCode(0x2295);
    }

    private isValidKey(key : string, location: number, selectionLength: number) : boolean {
        if ( key >= '0' && key <='9' ) {
            if ( key == '0' && location == 0 ) return false;
            var decLoc = this.value.indexOf('.');
            if ( decLoc >=0 && this.value.length-decLoc >=2 && location > decLoc) return false;
            return true;
        }
        if ( key == '.' ) {
            var after = this.value;
            after = after.substr(0,location) + key + after.substr(location + selectionLength);
            if ( after.indexOf('.') !== after.lastIndexOf('.') || after.indexOf('.') < after.length - 2) return false;
            return true;
        }
        return false;
    }

    public onSignClicked() {
        this.minus = !this.minus
        if ( this.innerValue !== 0 ) {
            this.onValueChange();
        }
    }

    public onKeyPress($event) {
        if ( !this.isValidKey($event.key, $event.srcElement.selectionStart, $event.srcElement.selectionEnd - $event.srcElement.selectionStart) )
            $event.preventDefault();
    }

    public writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}