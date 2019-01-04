import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WalletTransaction } from '../wallet.transaction';
import { TransactionServiceGen } from '../transaction.service/transection.service.gen';

@Component({
  selector: 'app-wallet-table',
  templateUrl: './wallet-table.component.html',
  styleUrls: ['./wallet-table.component.scss']
})
export class WalletTableComponent implements OnInit {

  public transactions : WalletTransaction[] = [];
  public selected_id : number = 0;
  @Output() public addNew : EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();
  @Output() public edit : EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();
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
        this.saving = true;
        this.transactionStorageSrv.updateTransactions(transactionsToUpdate).then( () => {
          this.nextId = Math.max(this.nextId, value.id + 1);
          this.transactionStorageSrv.insertTransaction(value).then ( () => {
            this.saving = false;
          })
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
  @Input() public set updateTransaction(value: WalletTransaction) {
    if ( value !== undefined && value.id === this.selected_id ) {
      // find the index of the selected item
      let update_index = undefined;
      for (let i=this.transactions.length-1; i>0; i--) {
        if ( this.transactions[i].id == this.selected_id ) {
          update_index = i;
          break;
        }
      }
      if ( !update_index ) return;
      // move selected item up, if need to
      while ( this.transactions[update_index-1].date > value.date && update_index > 1) {
        this.transactions[update_index] = this.transactions[update_index-1];
        update_index--;
      }
      // update the transaction
      this.transactions[update_index] = value;
      // move selected item down, if need to
      let down_index = update_index;
      while ( down_index < this.transactions.length - 1 && this.transactions[down_index+1].date <= value.date) {
        this.transactions[down_index] = this.transactions[down_index+1];
        this.transactions[++down_index] = value;
      }
      // fix id and total from the updated transaction and forwared
      var prev : WalletTransaction;
      var current : WalletTransaction;
      let transactionsToUpdate : WalletTransaction[] = [];
      let newSelectedId = undefined;
      while ( 
         update_index < this.transactions.length && 
         (prev = this.transactions[update_index-1]) &&
         (current = this.transactions[update_index]) &&
         (current.id !== prev.id + 1 || current.total !== Math.round(10*(prev.total+current.value))/10)
      ) {
           current.rename(prev.id+1);
           current.adjustTotal(Math.round(10*(prev.total-current.total+current.value))/10);
           transactionsToUpdate.push(current);
           if ( current.prev_id === this.selected_id ) {
             newSelectedId = current.id;
           }
           update_index++;
      }
      if ( newSelectedId ) {
        this.selected_id = newSelectedId;
      }
      if ( transactionsToUpdate.length === 0 ) return;
      this.saving = true;
      // temporaray change the id of the first transaction to avoid loop
      let first_id = transactionsToUpdate[0].id;
      transactionsToUpdate[0].rename(transactionsToUpdate[0].prev_id);
      transactionsToUpdate[0].rename(this.nextId);
      if ( this.selected_id === first_id ) {
        this.selected_id = this.nextId;
      }
      this.transactionStorageSrv.updateTransactions(transactionsToUpdate).then( () => {
        // reupdate the first transaction id
        transactionsToUpdate[0].rename(first_id);
        if ( this.selected_id === this.nextId ) {
          this.selected_id = first_id;
        }
        this.transactionStorageSrv.updateTransactions([transactionsToUpdate[0]]).then( () => {
          this.saving = false;
        })
      })

    }
  }
  @Input() public canEdit: boolean;
  public canAdd : boolean = false;
  public saving : boolean = false;
  private nextId : number = 1;
  public get enableEdit() : boolean {
    return this.canEdit && !this.saving;
  }

  constructor(private transactionStorageSrv : TransactionServiceGen) {
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
    this.selected_id = 0;
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
    this.saving = true;
    this.transactionStorageSrv.deleteTransaction(selected_id).then( () => {
      if ( transactions2update.length > 0 ) {
        this.transactionStorageSrv.updateTransactions(transactions2update).catch( (error) => {
          console.log('failed to update database', error);
        }).then ( () => {
          this.saving = false;
        });
      } else {
        this.saving = false;
      }
    }, (error) => {
      console.log('failed to delte from database', error);
    })
  }

  public onEditClicked(t : WalletTransaction) {
    if ( !t || t.id !== this.selected_id ) return;
    this.edit.emit(t);
  }

  public isSelected(t : WalletTransaction) : boolean {
    return this.selected_id === t.id;
  }

  public select( t: WalletTransaction ) : void {
    if (!this.enableEdit) return;
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
