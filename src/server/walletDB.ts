import * as mysql from 'mysql';

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

    private static dummyTransactions : Transaction[]= [
        new Transaction(1, { year: 2018, month: 8, day: 31 }, "יתרה קודמת", 184.2, 184.2),
        new Transaction(3, { year: 2018, month: 9, day: 2 }, "צהריים גלי", -50, 106.2),
        new Transaction(4, { year: 2018, month: 9, day: 2 }, "חופשי יומי שחר", -40, 66.2),
        new Transaction(5, { year: 2018, month: 9, day: 4 }, "משיכה", 200, 266.2),
        new Transaction(6, { year: 2018, month: 9, day: 4 }, "מכונת חטיפים", -4.5, 261.7),
        new Transaction(7, { year: 2018, month: 9, day: 4 }, "פתוח קול שחר", -200, 61.7),
        new Transaction(8, { year: 2018, month: 9, day: 8 }, "משיכה", 200, 261.7)
    ];
}
