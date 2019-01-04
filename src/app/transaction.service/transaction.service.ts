import { WalletTransaction } from "../wallet.transaction";

export interface TransactionService {
    getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]>;
    insertTransaction(trans: WalletTransaction) : Promise<WalletTransaction>;
    updateTransactions(transactions: WalletTransaction[]) : Promise<any>;
    deleteTransaction(id: number): Promise<WalletTransaction>;
}