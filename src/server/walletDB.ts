import * as mysql from 'mysql';
import {Promise} from 'es6-promise';

export class DbInfo  {
    constructor (
        public host : string, 
        public user : string, 
        public password : string, 
        public database : string) {
    }
}

export class Transaction  {
    constructor(
        public id : number, 
        public date: {year : number, month : number, day : number}, 
        public description : string, 
        public value : number, 
        public total : number) {
    }
}

export class WalletDB {
    constructor() {
    }

    public static getTransactions(dbInfo : DbInfo) : Promise<Transaction[]> {
        var pool = mysql.createPool(dbInfo);
        return new Promise<Transaction[]>( (resolve, reject) => {
            pool.query("SELECT * FROM WalletTransactions", (error, result) => {
                if ( error ) {
                    reject(error);
                } else {
                    var transactions : Transaction[] = [];
                    for (var res of result) {
                        var date : Date = new Date(res.date);
                        var trans = new Transaction(
                            res.id, 
                            {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()},
                            res.description,
                            res.value,
                            res.balance);
                        transactions.push(trans);
                    }
                    resolve(transactions);
                }
            });
        });
    };

    public static insertTransaction(dbInfo: DbInfo, trans: Transaction) : Promise<Transaction>  {
        if ( !dbInfo || !trans ) return;
        var pool = mysql.createPool(dbInfo);
        var date = new Date(trans.date.year, trans.date.month-1, trans.date.day);
        return new Promise<Transaction>( (resolve, reject) => {
            pool.query(`INSERT INTO WalletTransactions (id, date, description, value, balance)  
            VALUES (${trans.id}, '${trans.date.year}-${trans.date.month}-${trans.date.day}' ,'${trans.description}',${trans.value},${trans.total})`, 
            (error, result) => {
                if ( error ) {
                    reject(error);
                } else {
                    resolve(trans);
                }
            });
        });
    }
}