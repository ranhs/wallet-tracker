import { Injectable } from '@angular/core';
import { WalletTransaction } from './wallet.transaction';

@Injectable()
export class TransactionStorageService {

  constructor() { }

  getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]> {
    return new Promise<WalletTransaction[]>((resolve, reject) => {
      var dummyTransactions : WalletTransaction[] = [];
      dummyTransactions.push(new WalletTransaction(1, new Date(2018,8-1,31), "יתרה קודמת", 184.2, 184.2));
      dummyTransactions.push(new WalletTransaction(2, new Date(2018,9-1,1), "לגנדה גלי", -28, 156.2));
      dummyTransactions.push(new WalletTransaction(3, new Date(2018,9-1,2), "צהריים גלי", -50, 106.2));
      dummyTransactions.push(new WalletTransaction(4, new Date(2018,9-1,2), "חופשי יומי שחר", -40, 66.2));
      dummyTransactions.push(new WalletTransaction(5, new Date(2018,9-1,4), "משיכה", 200, 266.2));
      dummyTransactions.push(new WalletTransaction(6, new Date(2018,9-1,4), "מכונת חטיפים", -4.5, 261.7));
      dummyTransactions.push(new WalletTransaction(7, new Date(2018,9-1,4), "פתוח קול שחר", -200, 61.7));
      dummyTransactions.push(new WalletTransaction(8, new Date(2018,9-1,8), "משיכה", 200, 261.7));
      resolve(dummyTransactions);
    });
  }

}
