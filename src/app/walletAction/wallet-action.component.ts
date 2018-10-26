import { Component } from '@angular/core';

const DAY = 24*60*60*1000;

@Component({
  selector: 'wallet-action',
  templateUrl: './wallet-action.component.html',
  styleUrls: ['./wallet-action.component.scss']
})
export class WalletActionComponent {
    public minDate: Date;
    public maxDate: Date;
    public date : Date;
    public valueChange : number = 0;
    public total : number = 0;
    
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
    public description : string ='aaa';
}