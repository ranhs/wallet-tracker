import { Component, OnInit } from '@angular/core';
import { WalletTransaction } from '../wallet.transaction';

@Component({
  selector: 'app-wallet-table',
  templateUrl: './wallet-table.component.html',
  styleUrls: ['./wallet-table.component.css']
})
export class WalletTableComponent implements OnInit {

  private rows : WalletTransaction[] = [];

  constructor() {
   }

  ngOnInit() {
    // TODO: read the data from the database
    this.rows = [];
    this.rows.push(new WalletTransaction(new Date(2018,8,31), "יתרה קודמת", 184.2, 184.2));
    this.rows.push(new WalletTransaction(new Date(2018,9,1), "לגנדה גלי", -28, 156.2));
    this.rows.push(new WalletTransaction(new Date(2018,9,2), "צהריים גלי", -50, 106.2));
  }

}
