import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WalletTransaction } from './wallet.transaction';

@Injectable()
export class TransactionStorageService {

  constructor(private http: HttpClient) { }

  getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]> {
    return new Promise<WalletTransaction[]>((resolve, reject) => {
      var rv = this.http.get('/transactions').subscribe( (data : {id:number, date: {year: number, month: number, day: number}, description: string, value: number, total: number}[] ) => {
        var transactions : WalletTransaction[] = [];
        for ( var trans of data ) {
          transactions.push( new WalletTransaction(trans.id, new Date(trans.date.year, trans.date.month-1, trans.date.day), trans.description, trans.value, trans.total));
        }
        resolve(transactions);
      });
    });
  }

}
