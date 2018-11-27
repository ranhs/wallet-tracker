import { Component, OnInit } from '@angular/core';
import { $ } from 'jquery';
import { WalletTransaction } from './wallet.transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  public valueChange : number = 12.3;
  public showEditComponent = false;
  public initTransaction : WalletTransaction = undefined;
  public transactionToAdd : WalletTransaction = undefined;

  constructor(){}
  
  ngOnInit(){
    //document ready function
    // $(function(){
    //   AppComponent.scrollContentToBottom(); //initialize the scrolling to bottom
    // });
  }

  onAddNew(newTransaction : WalletTransaction) {
    this.initTransaction = newTransaction;
    this.showEditComponent = true;
  }

  //this function needs to be called whenever we add an item to the list
  static scrollContentToBottom(){
    let $content = $("#content");
    $content.scrollTop($content.height());
  }

  public onTransactionSaved(trans : WalletTransaction) {
    this.transactionToAdd = trans;
    this.showEditComponent = false;
    this.initTransaction = undefined;
  }

  public onEditCancel() {
    this.transactionToAdd = undefined;
    this.showEditComponent = false;
    this.initTransaction = undefined;
  }
}
