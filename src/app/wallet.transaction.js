"use strict";
exports.__esModule = true;
var WalletTransaction = /** @class */ (function () {
    function WalletTransaction(_id, _date, _description, _value, _total) {
        this._id = _id;
        this._date = _date;
        this._description = _description;
        this._value = _value;
        this._total = _total;
    }
    Object.defineProperty(WalletTransaction.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WalletTransaction.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: true,
        configurable: true
    });
    WalletTransaction.prototype.dd = function (val) {
        return "" + ((val < 10) ? '0' : '') + val;
    };
    WalletTransaction.prototype.date2string = function (date) {
        return this.dd(date.getDate()) + "/" + this.dd(date.getMonth() + 1) + "/" + date.getFullYear();
    };
    Object.defineProperty(WalletTransaction.prototype, "displayDate", {
        get: function () {
            return "" + this.date2string(this._date);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WalletTransaction.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WalletTransaction.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WalletTransaction.prototype, "displayValue", {
        get: function () {
            return "" + ((this._value > 0) ? '+' : '') + this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WalletTransaction.prototype, "total", {
        get: function () {
            return this._total;
        },
        enumerable: true,
        configurable: true
    });
    return WalletTransaction;
}());
exports.WalletTransaction = WalletTransaction;
