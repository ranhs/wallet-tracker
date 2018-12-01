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
  public selected_id : number = 0;
  @Output() public addNew : EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();
  @Input() public set addTransaction(value: WalletTransaction) {
    if ( value !== undefined && value.id >= this.nextId ) {
      // look where to add this transactions:
      let insertAfterIndex = this.transactions.length-1;
      let transactionsToUpdate : WalletTransaction[] = [];
      while ( value.date < this.transactions[insertAfterIndex].date ) {
        this.transactions[insertAfterIndex].rename(this.transactions[insertAfterIndex].id+1);
        this.transactions[insertAfterIndex].adjustTotal(value.value);
        transactionsToUpdate.push(this.transactions[insertAfterIndex]);
        insertAfterIndex--;
        if ( insertAfterIndex < 0 ) break;
      }
      if ( transactionsToUpdate.length > 0 ) {
        value.rename((insertAfterIndex>=0)?this.transactions[insertAfterIndex].id +1 : 1);
        value.adjustTotal(-value.total + ((insertAfterIndex>=0)?this.transactions[insertAfterIndex].total:0) + value.value);
        this.transactions.splice(insertAfterIndex+1, 0, value);
        this.transactionStorageSrv.updateTransactions(transactionsToUpdate).then( () => {
          this.nextId = Math.max(this.nextId, value.id + 1);
          this.transactionStorageSrv.insertTransaction(value);
        }, (e) => {
          console.log('failed to update, ignoring inserting');
        });
      } else {
        this.transactions.push(value);
        this.nextId = Math.max(this.nextId, value.id + 1);
        this.transactionStorageSrv.insertTransaction(value);
      }
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

  private getSelectedIndex(): number {
    if ( this.selected_id <= 0 ) return -1;
    for (let i =0; i<this.transactions.length; i++) {
      if ( this.transactions[i].id === this.selected_id ) return i;
    }
    return -1;
  }

  public onDeleteClicked(t : WalletTransaction) {
    if ( !t || t.id !== this.selected_id ) return;
    let selected_index = this.transactions.indexOf(t);
    if ( selected_index <= 0 ) return;
    let transactions2update : WalletTransaction[] = [];
    let total : number = this.transactions[selected_index-1].total;
    for (let i = selected_index + 1; i<this.transactions.length; i++) {
      this.transactions[i].rename(this.transactions[i].id-1);
      total += this.transactions[i].value;
      this.transactions[i].adjustTotal(total - this.transactions[i].total);
      transactions2update.push(this.transactions[i]);
    }
    let selected_id = this.selected_id;
    this.transactions.splice(selected_index, 1);
    this.selected_id = 0;
    this.transactionStorageSrv.deleteTransaction(selected_id).then( () => {
      if ( transactions2update.length > 0 ) {
        this.transactionStorageSrv.updateTransactions(transactions2update).catch( (error) => {
          console.log('failed to update database', error);
        });
      }
    }, (error) => {
      console.log('failed to delte from database', error);
    })
  }

  public onEditClicked() {
    console.log("Edit clicked");
  }

  public isSelected(t : WalletTransaction) : boolean {
    return this.selected_id === t.id;
  }

  public select( t: WalletTransaction ) : void {
    console.log(`select ${t.id}`);
    if ( this.selected_id === t.id ) {
      this.selected_id = 0;
    } else {
      this.selected_id = t.id;
    }
  }
}

interface Transaction {
  title: string;
  date: string;
  sum: number;
  left: number;
}
