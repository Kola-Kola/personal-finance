import Dexie, { type Table } from 'dexie';
import { Transaction } from '../types';

export class FinanceDB extends Dexie {
  transactions!: Table<Transaction>;
  private static instance: FinanceDB;

  private constructor() {
    super('FinanceDB');
    
    this.version(23).stores({
      transactions: '++id, date, categorie, montant, isRecurrent, jourPrelevement'
    });
  }

  static getInstance(): FinanceDB {
    if (!FinanceDB.instance) {
      FinanceDB.instance = new FinanceDB();
    }
    return FinanceDB.instance;
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>) {
    return await this.transactions.add(transaction as Transaction);
  }

  async updateTransaction(id: string, transaction: Partial<Omit<Transaction, 'id'>>) {
    const existingTransaction = await this.transactions.get(id);
    
    if (existingTransaction?.isRecurrent && transaction.montant) {
      const modifications = existingTransaction.modifications || [];
      
      modifications.push({
        montant: transaction.montant,
        dateEffet: transaction.dateEffet || new Date().toISOString()
      });

      modifications.sort((a, b) => 
        new Date(a.dateEffet).getTime() - new Date(b.dateEffet).getTime()
      );

      return await this.transactions.update(id, {
        ...transaction,
        modifications
      });
    }

    return await this.transactions.update(id, transaction);
  }

  async deleteTransaction(id: string) {
    return await this.transactions.delete(id);
  }

  async getTransactions() {
    return await this.transactions.orderBy('date').reverse().toArray();
  }

  getMontantForDate(transaction: Transaction, date: Date): number {
    if (!transaction.modifications?.length) {
      return transaction.montant;
    }

    const applicableMod = [...transaction.modifications]
      .sort((a, b) => new Date(a.dateEffet).getTime() - new Date(b.dateEffet).getTime())
      .filter(mod => new Date(mod.dateEffet) <= date)
      .pop();

    return applicableMod?.montant ?? transaction.montant;
  }

  async getRecurringTransactions() {
    return await this.transactions
      .where('isRecurrent')
      .equals(1)
      .toArray();
  }

  getRecurringAmountForMonth(transactions: Transaction[], year: number, month: number): number {
    const date = new Date(year, month);
    return transactions
      .filter(t => t.isRecurrent)
      .reduce((sum, t) => sum + this.getMontantForDate(t, date), 0);
  }
}