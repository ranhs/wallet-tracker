import { TransactionService } from "./transaction.service";
import { Injectable } from "@angular/core";
import { WalletTransaction } from "../wallet.transaction";

@Injectable()
export class TransactionMockService  implements TransactionService {
    private transactions : WalletTransaction[] = [

    ];

    async getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]> {
        return [];
    }

    async insertTransaction(trans: WalletTransaction) : Promise<WalletTransaction> {
        return trans;
    }

    async updateTransactions(transactions: WalletTransaction[]) : Promise<any> {
        return null;
    }

    async deleteTransaction(id: number): Promise<WalletTransaction> {
        return null;
    }

}