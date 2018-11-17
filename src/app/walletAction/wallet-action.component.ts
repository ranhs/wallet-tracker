import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WalletTransaction } from '../wallet.transaction';

const DAY = 24*60*60*1000;

@Component({
  selector: 'wallet-action',
  templateUrl: './wallet-action.component.html',
  styleUrls: ['./wallet-action.component.scss']
})
export class WalletActionComponent {
    @Input() public initTransaction: WalletTransaction;
    @Input() public isNew: boolean;
    @Output() public save: EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();
    private baseValue : number;
    public minDate: Date;
    public maxDate: Date;
    public date : Date;
    public valueChange : number = 0;
    
    constructor() {
        var now : number = Date.now();
        var today : Date = new Date( now - now % DAY );
        this.date = new Date( today );
        this.maxDate = new Date( today );
        this.minDate = new Date( today );

        var month = this.minDate.getMonth() - 1;
        if ( month < 0 ) {
            this.minDate.setMonth(11);
            this.minDate.setFullYear(this.minDate.getFullYear()-1);
        } else {
            this.minDate.setMonth(month);
        }
        this.minDate.setDate(1);
    }
    public description : string ='';

    ngOnInit(){
        if ( this.initTransaction ) {   
            let initDate = this.initTransaction.date;
            if ( initDate && initDate>=this.minDate && initDate<=this.maxDate) {
                this.date = initDate;
            }
            this.valueChange = ( this.initTransaction.value ) ? this.initTransaction.value : 0;
            this.baseValue = ( this.initTransaction.total ) ? this.initTransaction.total -this.valueChange : 0;
            this.description = (this.initTransaction.description ) ? this.initTransaction.description : '';
        }
    }

    public get saveText() : string {
        return (this.isNew)? "הוסף" : "שמור";
    }

    public get total() : number {
        return Math.round((this.baseValue + this.valueChange) *10 ) / 10;
    }

    public onSaveClicked() {
        let trans = new WalletTransaction(this.initTransaction.id, this.date, this.description, this.valueChange, this.total);
        this.save.emit(trans);
    }
}