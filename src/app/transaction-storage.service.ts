import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WalletTransaction } from './wallet.transaction';
import { TagContentType } from '@angular/compiler';


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
      var rv = this.http.get(this.apiUrl('/transactions')).subscribe( (data : HttpWalletTransaction[] ) => {
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

  insertTransaction(trans: WalletTransaction) {
    var rv = this.http.post<HttpWalletTransaction>(this.apiUrl('/transactions'), {
      id : trans.id,
      date: {
        year: trans.date.getFullYear(),
        month: trans.date.getMonth() +1,
        day: trans.date.getDate()
      },
      description: trans.description,
      value: trans.value,
      total: trans.total
    }).subscribe((data:HttpWalletTransaction)=>{
      //console.log('post successed', data);
    }, (error) => {
      console.log('post failed', error);
    })
  }

  updateTransactions(transactions: WalletTransaction[]) {
    var httpTrans : HttpWalletTransaction[] = [];
    for ( var trans of transactions ) {
      httpTrans.push( {
        id: trans.id,
        date: {
          year: trans.date.getFullYear(),
          month: trans.date.getMonth() +1,
          day: trans.date.getDate()
        },
        description: trans.description,
        value: trans.value,
        total: trans.total,
        prev_id: trans.prev_id
      });
    }
    /*
    var rv = this.http.put<HttpWalletTransaction[]>(this.apiUrl('/transactions'), httpTrans).subscribe(()=>{
      //console.log('put successed');
    }, (error) => {
      console.log('post failed', error);
    });
    */
   console.log('put', JSON.stringify(httpTrans,undefined,2));
  }

}

interface HttpWalletTransaction {
  id: number;
  date : { year: number, month: number, day: number};
  description: string;
  value: number;
  total: number;
  prev_id?: number;
}