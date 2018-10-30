import { Component, OnInit } from '@angular/core';
import { WalletTransaction } from '../wallet.transaction';
import { TransactionStorageService } from '../transaction-storage.service';

@Component({
  selector: 'app-wallet-table',
  templateUrl: './wallet-table.component.html',
  styleUrls: ['./wallet-table.component.scss']
})
export class WalletTableComponent implements OnInit {

  public transactions : WalletTransaction[] = [];

  constructor(private transactionStorageSrv : TransactionStorageService) {
   }

  ngOnInit() {
    var today : Date = new Date();
    var lastmonth : Date = new Date(
      today.getFullYear() - ((today.getMonth() == 1)?1:0), 
      (today.getMonth() == 1)?12:today.getMonth()-1,
      1);
    this.transactionStorageSrv.getTransactions(lastmonth, today).then(
      (transactions) => this.transactions = transactions
    );
  }

}

interface Transaction {
  title: string;
  date: string;
  sum: number;
  left: number;
}
