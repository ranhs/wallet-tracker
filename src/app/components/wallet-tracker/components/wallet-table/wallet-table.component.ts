import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { WalletTransaction } from '../../../../utility/wallet.transaction';
import { TransactionServiceGen } from '../../services/transaction.service/transection.service.gen';
import { takeUntil } from 'rxjs/operators';
import { ActionManagerService } from '../../services/action-manager.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
             selector: 'app-wallet-table',
             templateUrl: './wallet-table.component.html',
             styleUrls: ['./wallet-table.component.scss']
           })
export class WalletTableComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<null>();
  transactionList: WalletTransaction[] = [];
  selected_id: number = 0;

  @Output()
  public addNew: EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();
  @Output()
  public edit: EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();

  @Input()
  public set addTransaction(value: WalletTransaction) {
    if (value !== undefined && value.id >= this.nextId) {
      // look where to add this transactionList:
      let insertAfterIndex = this.transactionList.length - 1;
      let transactionsToUpdate: WalletTransaction[] = [];
      while (value.date < this.transactionList[insertAfterIndex].date) {
        this.transactionList[insertAfterIndex].rename(this.transactionList[insertAfterIndex].id + 1);
        this.transactionList[insertAfterIndex].adjustTotal(value.value);
        transactionsToUpdate.push(this.transactionList[insertAfterIndex]);
        insertAfterIndex--;
        if (insertAfterIndex < 0) {
          break;
        }
      }
      if (transactionsToUpdate.length > 0) {
        value.rename((insertAfterIndex >= 0) ? this.transactionList[insertAfterIndex].id + 1 : 1);
        value.adjustTotal(-value.total + ((insertAfterIndex >= 0) ? this.transactionList[insertAfterIndex].total : 0) + value.value);
        this.transactionList.splice(insertAfterIndex + 1, 0, value);
        this.saving = true;
        this.transactionStorageSrv.updateTransactions(transactionsToUpdate).then(() => {
          this.nextId = Math.max(this.nextId, value.id + 1);
          this.transactionStorageSrv.insertTransaction(value).then(() => {
            this.saving = false;
          });
        }, (e) => {
          console.log('failed to update, ignoring inserting');
        });
      } else {
        this.transactionList.push(value);
        this.nextId = Math.max(this.nextId, value.id + 1);
        this.transactionStorageSrv.insertTransaction(value);
      }
    }
  }

  @Input()
  public set updateTransaction(value: WalletTransaction) {
    if (value !== undefined && value.id === this.selected_id) {
      // find the index of the selected item
      let update_index = undefined;
      for (let i = this.transactionList.length - 1; i > 0; i--) {
        if (this.transactionList[i].id == this.selected_id) {
          update_index = i;
          break;
        }
      }
      if (!update_index) {
        return;
      }
      // move selected item up, if need to
      while (this.transactionList[update_index - 1].date > value.date && update_index > 1) {
        this.transactionList[update_index] = this.transactionList[update_index - 1];
        update_index--;
      }
      // update the transaction
      this.transactionList[update_index] = value;
      // move selected item down, if need to
      let down_index = update_index;
      while (down_index < this.transactionList.length - 1 && this.transactionList[down_index + 1].date <= value.date) {
        this.transactionList[down_index] = this.transactionList[down_index + 1];
        this.transactionList[++down_index] = value;
      }
      // fix id and total from the updated transaction and forwared
      var prev: WalletTransaction;
      var current: WalletTransaction;
      let transactionsToUpdate: WalletTransaction[] = [];
      let newSelectedId = undefined;
      while (
        update_index < this.transactionList.length &&
        (prev = this.transactionList[update_index - 1]) &&
        (current = this.transactionList[update_index]) &&
        (current.id !== prev.id + 1 || current.total !== Math.round(10 * (prev.total + current.value)) / 10)
        ) {
        current.rename(prev.id + 1);
        current.adjustTotal(Math.round(10 * (prev.total - current.total + current.value)) / 10);
        transactionsToUpdate.push(current);
        if (current.prev_id === this.selected_id) {
          newSelectedId = current.id;
        }
        update_index++;
      }
      if (newSelectedId) {
        this.selected_id = newSelectedId;
      }
      if (transactionsToUpdate.length === 0) {
        return;
      }
      this.saving = true;
      // temporaray change the id of the first transaction to avoid loop
      let first_id = transactionsToUpdate[0].id;
      transactionsToUpdate[0].rename(transactionsToUpdate[0].prev_id);
      transactionsToUpdate[0].rename(this.nextId);
      if (this.selected_id === first_id) {
        this.selected_id = this.nextId;
      }
      this.transactionStorageSrv.updateTransactions(transactionsToUpdate).then(() => {
        // reupdate the first transaction id
        transactionsToUpdate[0].rename(first_id);
        if (this.selected_id === this.nextId) {
          this.selected_id = first_id;
        }
        this.transactionStorageSrv.updateTransactions([transactionsToUpdate[0]]).then(() => {
          this.saving = false;
        });
      });

    }
  }

  @Input()
  public canEdit: boolean;

  public canAdd: boolean = false;
  public saving: boolean = false;
  private nextId: number = 1;

  public get enableEdit(): boolean {
    return this.canEdit && !this.saving;
  }

  constructor(private transactionStorageSrv: TransactionServiceGen,
              private actionManager: ActionManagerService) {
  }

  ngOnInit() {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear() - ((today.getMonth() == 1) ? 1 : 0),
      (today.getMonth() == 1) ? 12 : today.getMonth() - 1,
      1);
    this.transactionStorageSrv.getTransactions(lastMonth, today).then(
      (transactions) => {
        this.transactionList = transactions;
        for (var trans of this.transactionList) {
          this.nextId = Math.max(this.nextId, trans.id + 1);
        }
        this.canAdd = true;
      }
    );

    // Initialize listeners
    this.actionManager.addTransaction$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
                   this.addNewTransaction();
                 }
      );
  }

  private get lastTotal(): number {
    if (this.transactionList.length > 0) {
      return this.transactionList[this.transactionList.length - 1].total;
    }
    return 0;
  }

  // TODO: perhaps we should move this to action manager
  private addNewTransaction() {
    this.selected_id = 0;
    let newTransaction: WalletTransaction = new WalletTransaction(this.nextId, new Date(), '', 0, this.lastTotal);
    this.addNew.emit(newTransaction);
  }

  private getSelectedIndex(): number {
    if (this.selected_id <= 0) {
      return -1;
    }
    for (let i = 0; i < this.transactionList.length; i++) {
      if (this.transactionList[i].id === this.selected_id) {
        return i;
      }
    }
    return -1;
  }

  public onDeleteClicked(t: WalletTransaction) {
    if (!t || t.id !== this.selected_id) {
      return;
    }
    let selected_index = this.transactionList.indexOf(t);
    if (selected_index <= 0) {
      return;
    }
    let transactions2update: WalletTransaction[] = [];
    let total: number = this.transactionList[selected_index - 1].total;
    for (let i = selected_index + 1; i < this.transactionList.length; i++) {
      this.transactionList[i].rename(this.transactionList[i].id - 1);
      total += this.transactionList[i].value;
      this.transactionList[i].adjustTotal(total - this.transactionList[i].total);
      transactions2update.push(this.transactionList[i]);
    }
    let selected_id = this.selected_id;
    this.transactionList.splice(selected_index, 1);
    this.selected_id = 0;
    this.saving = true;
    this.transactionStorageSrv.deleteTransaction(selected_id).then(() => {
      if (transactions2update.length > 0) {
        this.transactionStorageSrv.updateTransactions(transactions2update).catch((error) => {
          console.log('failed to update database', error);
        }).then(() => {
          this.saving = false;
        });
      } else {
        this.saving = false;
      }
    }, (error) => {
      console.log('failed to delte from database', error);
    });
  }

  public onEditClicked(t: WalletTransaction) {
    if (!t || t.id !== this.selected_id) {
      return;
    }
    this.edit.emit(t);
  }

  public isSelected(t: WalletTransaction): boolean {
    return this.selected_id === t.id;
  }

  public selectTransaction(transaction: WalletTransaction): void {
    if (!this.enableEdit) {
      return;
    }
    if (this.selected_id === transaction.id) {
      this.selected_id = 0;
    } else {
      this.selected_id = transaction.id;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
