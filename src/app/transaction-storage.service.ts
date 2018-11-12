import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WalletTransaction } from './wallet.transaction';


@Injectable()
export class TransactionStorageService {
  private host: string;
  private user: string;
  private password: string;
  private database: string;

  constructor(private http: HttpClient) { 
    this.host = localStorage.getItem("wallet-host")
    this.user = localStorage.getItem("wallet-user")
    this.password = localStorage.getItem("wallet-password")
    this.database = localStorage.getItem("wallet-database")
  }

  private apiUrl(path : string) : string{
    var url : string = path;
    if ( location.host === "localhost:4200" )
    {
      // servered from local ng serve
      url = `http://localhost:8080${path}`;
    } 
    url = `${url}?host=${this.host}&user=${this.user}&password=${this.password}&database=${this.database}`;
    return url;
  }

  getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]> {
    return new Promise<WalletTransaction[]>((resolve, reject) => {
      var rv = this.http.get(this.apiUrl('/transactions')).subscribe( (data : {id:number, date: {year: number, month: number, day: number}, description: string, value: number, total: number}[] ) => {
        var transactions : WalletTransaction[] = [];
        for ( var trans of data ) {
          transactions.push( new WalletTransaction(trans.id, new Date(trans.date.year, trans.date.month-1, trans.date.day), trans.description, trans.value, trans.total));
        }
        resolve(transactions);
      }, (error) => {
        console.log("failed to fetch data", error);
      });
    });
  }

}
