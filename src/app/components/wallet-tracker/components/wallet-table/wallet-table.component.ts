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
import { Subject } from 'rxjs/Subject';

@Component({
             selector: 'wallet-table',
             templateUrl: './wallet-table.component.html',
             styleUrls: ['./wallet-table.component.scss']
           })
export class WalletTableComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<null>();

  constructor(private transactionStorageSrv: TransactionServiceGen,
    public actionManager: ActionManagerService) {
  }

  // TODO: Probably shouldn't be here since it's unrelated to the role of 'wallet-table'
  @Output()
  public addNew: EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();

  @Output()
  public edit: EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();

  @Input()
  public set addTransaction(value: WalletTransaction) {
    if (value !== undefined && value.id >= this.actionManager.nextId) {
      // look where to add this transactionList:
      let insertAfterIndex = this.actionManager.transactionList.length - 1;
      const transactionsToUpdate: WalletTransaction[] = [];
      while (value.date < this.actionManager.transactionList[insertAfterIndex].date) {
        this.actionManager.transactionList[insertAfterIndex].rename(this.actionManager.transactionList[insertAfterIndex].id + 1);
        this.actionManager.transactionList[insertAfterIndex].adjustTotal(value.value);
        transactionsToUpdate.push(this.actionManager.transactionList[insertAfterIndex]);
        insertAfterIndex--;
        if (insertAfterIndex < 0) {
          break;
        }
      }
      if (transactionsToUpdate.length > 0) {
        value.rename((insertAfterIndex >= 0) ? this.actionManager.transactionList[insertAfterIndex].id + 1 : 1);
        value.adjustTotal(
          -value.total + ((insertAfterIndex >= 0) ? this.actionManager.transactionList[insertAfterIndex].total :
          0) + value.value);
        this.actionManager.transactionList.splice(insertAfterIndex + 1, 0, value);
        this.saving = true;
        this.transactionStorageSrv.updateTransactions(transactionsToUpdate).then(() => {
          this.actionManager.nextId = Math.max(this.actionManager.nextId, value.id + 1);
          this.transactionStorageSrv.insertTransaction(value).then(() => {
            this.saving = false;
          });
        }, (e) => {
          console.log('failed to update, ignoring inserting');
        });
      } else {
        this.actionManager.transactionList.push(value);
        this.actionManager.nextId = Math.max(this.actionManager.nextId, value.id + 1);
        this.transactionStorageSrv.insertTransaction(value);
      }
    }
  }

  @Input()
  public set updateTransaction(value: WalletTransaction) {
    if (value !== undefined && value.id === this.actionManager.selected_id) {
      // find the index of the selected item
      let update_index;
      for (let i = this.actionManager.transactionList.length - 1; i > 0; i--) {
        if (this.actionManager.transactionList[i].id === this.actionManager.selected_id) {
          update_index = i;
          break;
        }
      }
      if (!update_index) {
        return;
      }
      // move selected item up, if need to
      while (this.actionManager.transactionList[update_index - 1].date > value.date && update_index > 1) {
        this.actionManager.transactionList[update_index] = this.actionManager.transactionList[update_index - 1];
        update_index--;
      }
      // update the transaction
      this.actionManager.transactionList[update_index] = value;
      // move selected item down, if need to
      let down_index = update_index;
      while (down_index < this.actionManager.transactionList.length - 1 && this.actionManager.transactionList[down_index + 1].date <= value.date) {
        this.actionManager.transactionList[down_index] = this.actionManager.transactionList[down_index + 1];
        this.actionManager.transactionList[++down_index] = value;
      }
      // fix id and total from the updated transaction and forwared
      let prev: WalletTransaction;
      let current: WalletTransaction;
      const transactionsToUpdate: WalletTransaction[] = [];
      let newSelectedId;
      while (
        update_index < this.actionManager.transactionList.length &&
        (prev = this.actionManager.transactionList[update_index - 1]) &&
        (current = this.actionManager.transactionList[update_index]) &&
        (current.id !== prev.id + 1 || current.total !== Math.round(10 * (prev.total + current.value)) / 10)
        ) {
        current.rename(prev.id + 1);
        current.adjustTotal(Math.round(10 * (prev.total - current.total + current.value)) / 10);
        transactionsToUpdate.push(current);
        if (current.prev_id === this.actionManager.selected_id) {
          newSelectedId = current.id;
        }
        update_index++;
      }
      if (newSelectedId) {
        this.actionManager.selected_id = newSelectedId;
      }
      if (transactionsToUpdate.length === 0) {
        return;
      }
      this.saving = true;
      // temporaray change the id of the first transaction to avoid loop
      const first_id = transactionsToUpdate[0].id;
      transactionsToUpdate[0].rename(transactionsToUpdate[0].prev_id);
      transactionsToUpdate[0].rename(this.actionManager.nextId);
      if (this.actionManager.selected_id === first_id) {
        this.actionManager.selected_id = this.actionManager.nextId;
      }
      this.transactionStorageSrv.updateTransactions(transactionsToUpdate).then(() => {
        // reupdate the first transaction id
        transactionsToUpdate[0].rename(first_id);
        if (this.actionManager.selected_id === this.actionManager.nextId) {
          this.actionManager.selected_id = first_id;
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

  public get enableEdit(): boolean {
    return this.canEdit && !this.saving;
  }

  ngOnInit() {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear() - ((today.getMonth() === 1) ? 1 : 0),
      (today.getMonth() === 1) ? 12 : today.getMonth() - 1,
      1);
    this.transactionStorageSrv.getTransactions(lastMonth, today).then(
      (transactions) => {
        this.actionManager.transactionList = transactions;
        for (const trans of this.actionManager.transactionList) {
          this.actionManager.nextId = Math.max(this.actionManager.nextId, trans.id + 1);
        }
        this.canAdd = true;
      }
    );

    // Initialize listeners
    // this.actionManager.addTransaction$
    //   .pipe(
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(() => {
    //                this.addNewTransaction();
    //              }
    //   );
  }

  public selectTransaction(transaction: WalletTransaction): void {
    // if (!this.enableEdit) {
    //   return;
    // }
    if (this.actionManager.selected_id === transaction.id) {
      this.actionManager.selected_id = 0;
    } else {
      this.actionManager.selected_id = transaction.id;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
