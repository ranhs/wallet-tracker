import { Injectable } from '@angular/core';
import { WalletTransaction } from '../../../utility/wallet.transaction';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  take,
  skip
} from 'rxjs/operators';

@Injectable()
export class TransactionEditorService {

  showEditor$ = new BehaviorSubject<boolean>(false);
  currentTransaction$ = new BehaviorSubject(null);

  constructor() {
  }

  getNewTransaction(): Promise<WalletTransaction> {
    this.showEditor$.next(true);
    return this.currentTransaction$.pipe(skip(1), take(1)).toPromise()
      .then((walletTransaction) => {
        this.showEditor$.next(false);
        console.log('returned', walletTransaction);
        return walletTransaction;
      });
  }

  editExistingTransaction(walletTransaction: WalletTransaction): Promise<WalletTransaction> {
    return undefined;
  }

}
