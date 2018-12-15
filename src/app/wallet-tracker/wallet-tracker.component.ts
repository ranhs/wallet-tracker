import { Component, OnInit } from '@angular/core';
import { $ } from 'jquery';
import { WalletTransaction } from '../wallet.transaction';

@Component({
  selector: 'app-wallet-tracker',
  templateUrl: './wallet-tracker.component.html',
  styleUrls: ['./wallet-tracker.component.scss']
})
export class WalletTrackerComponent implements OnInit {
  title = 'app';
  public valueChange : number;
  public showEditComponent = false;
  public initTransaction : WalletTransaction = undefined;
  public transactionToAdd : WalletTransaction = undefined;
  public transactionToUpdate : WalletTransaction = undefined;
  public isNew : boolean = undefined;

  constructor(){}
  
  ngOnInit(){
    //document ready function
    // $(function(){
    //   AppComponent.scrollContentToBottom(); //initialize the scrolling to bottom
    // });
  }

  onAddNew(newTransaction : WalletTransaction) {
    this.initTransaction = newTransaction;
    this.isNew = true;
    this.showEditComponent = true;
  }

  onEdit(transaction : WalletTransaction) {
    this.initTransaction = transaction;
    this.isNew = false;
    this.showEditComponent = true;
  }

  //this function needs to be called whenever we add an item to the list
  static scrollContentToBottom(){
    let $content = $("#content");
    $content.scrollTop($content.height());
  }

  public onTransactionSaved(trans : WalletTransaction) {
    if (this.isNew) {
      this.transactionToAdd = trans;
    } else {
      this.transactionToUpdate = trans;
    }
    
    this.showEditComponent = false;
    this.initTransaction = undefined;
  }

  public onEditCancel() {
    this.transactionToAdd = undefined;
    this.showEditComponent = false;
    this.initTransaction = undefined;
  }
}
