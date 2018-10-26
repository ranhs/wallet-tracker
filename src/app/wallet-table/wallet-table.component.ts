import { Component, OnInit } from '@angular/core';
import { WalletTransaction } from '../wallet.transaction';

@Component({
  selector: 'app-wallet-table',
  templateUrl: './wallet-table.component.html',
  styleUrls: ['./wallet-table.component.scss']
})
export class WalletTableComponent implements OnInit {

  public transactions : WalletTransaction[] = [];

  constructor() {
   }

  ngOnInit() {
    // TODO: read the data from the database
    this.transactions = [];
    this.transactions.push(new WalletTransaction(new Date(2018,8,31), "יתרה קודמת", 184.2, 184.2));
    this.transactions.push(new WalletTransaction(new Date(2018,9,1), "לגנדה גלי", -28, 156.2));
    this.transactions.push(new WalletTransaction(new Date(2018,9,2), "צהריים גלי", -50, 106.2));
    this.transactions.push(new WalletTransaction(new Date(2018,9,2), "חופשי יומי שחר", -40, 66.2));
    this.transactions.push(new WalletTransaction(new Date(2018,9,4), "משיכה", 200, 266.2));
    this.transactions.push(new WalletTransaction(new Date(2018,9,4), "מכונת חטיפים", -4.5, 261.7));
    this.transactions.push(new WalletTransaction(new Date(2018,9,4), "פתוח קול שחר", -200, 61.7));
    this.transactions.push(new WalletTransaction(new Date(2018,9,8), "משיכה", 200, 261.7));
  }

}

interface Transaction {
  title: string;
  date: string;
  sum: number;
  left: number;
}
