export class WalletTransaction {
    constructor( 
        private _id : number,
        private _date : Date,
        private _description : string,
        private _value : number, 
        private _total : number) {
    }

    public get id() : number {
        return this._id;
    }

    public get date() : Date {
        return this._date;
    }

    private dd(val: number) : string {
        return `${(val<10)?'0':''}${val}`;
    }
    
    private date2string(date: Date) : string {
        return `${this.dd(date.getDate())}/${this.dd(date.getMonth()+1)}/${date.getFullYear()}`;
    }

    public get displayDate() : string {
        return `${this.date2string(this._date)}`
    }

    public get description() : string {
        return this._description;
    }

    public get value() : number {
        return this._value;
    }

    public get displayValue() : string {
        return `${(this._value>0)?'+':''}${this._value}`;
    }

    public get total() : number {
        return this._total;
    }
}