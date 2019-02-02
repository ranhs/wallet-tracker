import {
  Injectable,
  EventEmitter,
  OnInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WalletTransaction } from '../../../utility/wallet.transaction';
import { TransactionEditorService } from './transaction-editor.service';
import { Observable } from 'rxjs/Observable';
import { EventListener } from '@angular/core/src/debug/debug_node';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ActionManagerService implements OnInit {

  // TODO: make this property private
  /*private*/
  nextId: number = 1;
  transactionList: WalletTransaction[] = [];
  selected_id$ = new BehaviorSubject(0);

  // Event Emitters
  addEvent = new EventEmitter<null>();
  cancelEvent = new EventEmitter<null>();
  saveEvent = new EventEmitter<null>();

  constructor(private transactionEditor: TransactionEditorService) {
  }

  get selected_id() {
    return this.selected_id$.getValue();
  }

  set selected_id(value: number) {
    this.selected_id$.next(value);
  }

  get isEditorShown$(): Observable<boolean> {
    return this.transactionEditor.showEditor$;
  }

  // TODO: to be removed
  private get lastTotal(): number {
    if (this.transactionList.length > 0) {
      return this.transactionList[this.transactionList.length - 1].total;
    }
    return 0;
  }

  async addNewTransaction(): Promise<void> {
    this.selected_id = 0;
    const newTransaction: WalletTransaction = await this.transactionEditor.getNewTransaction();
    if (newTransaction) {
      // TODO: add transaction to Database here
      this.transactionList.push(newTransaction);
    }
  }

  ngOnInit(): void {

  }
}
