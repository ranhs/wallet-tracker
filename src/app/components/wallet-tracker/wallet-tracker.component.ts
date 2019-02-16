import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
import { WalletTransaction } from '../../utility/wallet.transaction';
import { LoginInfoService } from '../login/services/login-info.service';
import { ActionManagerService } from './services/action-manager.service';
import { TransactionEditorService } from './services/transaction-editor.service';

@Component({
             selector: 'app-wallet-tracker',
             templateUrl: './wallet-tracker.component.html',
             styleUrls: ['./wallet-tracker.component.scss']
           })
export class WalletTrackerComponent implements OnInit {
  public valueChange: number;
  public transactionToAdd: WalletTransaction;
  public transactionToUpdate: WalletTransaction;
  public isNew: boolean;

  constructor(private loginInfoService: LoginInfoService,
    public actionManager: ActionManagerService,
    public transactionEditor: TransactionEditorService) {
  }

  ngOnInit() {
    // Initialize the scrollContentToBottom function - TODO: find a better way of doing it
    $(() => {
      this.scrollContentToBottom(); // initialize the scrolling to bottom
    });
  }

  public get loginName(): string {
    return this.loginInfoService.name;
  }
  //
  // onEdit(transaction: WalletTransaction) {
  //   this.initTransaction = transaction;
  //   this.isNew = false;
  //   this.showEditComponent = true;
  // }

  //this function needs to be called whenever we add an item to the list
  private scrollContentToBottom() {
    const $content = $('wallet-table');
    $content.scrollTop($content.height());
  }

  public onTransactionSaved(trans: WalletTransaction) {
    if (this.isNew) {
      this.transactionToAdd = trans;
    } else {
      this.transactionToUpdate = trans;
    }

    // this.showEditComponent = false;
    // this.initTransaction = undefined;
  }
}
