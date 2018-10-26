import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet-table',
  templateUrl: './wallet-table.component.html',
  styleUrls: ['./wallet-table.component.scss']
})
export class WalletTableComponent implements OnInit {

  public transactions: Transaction[]; 

  constructor() {
    this.transactions=
    [
      {
        title: "יתרה קודמת",
        date: "31 אוגוסט",
        sum: 184,
        left: 184
      },
      {
        title: "לגנדה גלי",
        date: "1 ספטמבר",
        sum: -28,
        left: 156
      },
      {
        title: "צהריים גלי",
        date: "1 ספטמבר",
        sum: -50,
        left: 106
      },
      {
        title: "חופשי יומי שחר",
        date: "2 ספטמבר",
        sum: -40,
        left: 66
      },
      {
        title: "משיכה",
        date: "4 ספטמבר",
        sum: 200,
        left: 266
      },
      {
        title: "מכונת חטיפים",
        date: "4 ספטמבר",
        sum: -4.5,
        left: 261.5
      },
      {
        title: "פתוח קול שחר",
        date: "4 ספטמבר",
        sum: -200,
        left: 61.5
      },
      {
        title: "משיכה",
        date: "4 ספטמבר",
        sum: 200,
        left: 261.5
      },
    ]
   }

  ngOnInit() {
  }

}

interface Transaction {
  title: string;
  date: string;
  sum: number;
  left: number;
}
