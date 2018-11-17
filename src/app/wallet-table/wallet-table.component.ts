import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WalletTransaction } from '../wallet.transaction';
import { TransactionStorageService } from '../transaction-storage.service';

@Component({
  selector: 'app-wallet-table',
  templateUrl: './wallet-table.component.html',
  styleUrls: ['./wallet-table.component.scss']
})
export class WalletTableComponent implements OnInit {

  public transactions : WalletTransaction[] = [];
  @Output() public addNew : EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();
  @Input() public set addTransaction(value: WalletTransaction) {
    if ( value !== undefined && value.id >= this.nextId ) {
      this.transactions.push(value);
      this.nextId = Math.max(this.nextId, value.id + 1);
    }
  }
  @Input() public canEdit: boolean;
  public canAdd : boolean = false;
  private nextId : number = 1;

  constructor(private transactionStorageSrv : TransactionStorageService) {
   }

  ngOnInit() {
    var today : Date = new Date();
    var lastmonth : Date = new Date(
      today.getFullYear() - ((today.getMonth() == 1)?1:0), 
      (today.getMonth() == 1)?12:today.getMonth()-1,
      1);
    this.transactionStorageSrv.getTransactions(lastmonth, today).then(
      (transactions) => {
        this.transactions = transactions;
        for ( var trans of this.transactions ) {
          this.nextId = Math.max(this.nextId, trans.id + 1);
        }
        this.canAdd = true;
      }
    );
  }

  private get lastTotal() : number {
    if ( this.transactions.length > 0 ) {
      return this.transactions[this.transactions.length -1].total;
    }
    return 0;
}

  public onAddClicked() {
    let newTransaction : WalletTransaction = new WalletTransaction(this.nextId, new Date(), '', 0, this.lastTotal);
    this.addNew.emit(newTransaction);
  }

}

interface Transaction {
  title: string;
  date: string;
  sum: number;
  left: number;
}
