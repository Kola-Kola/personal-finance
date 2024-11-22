import { Transaction } from '../types';
import { db } from '../db/instance';

export const filterTransactionsByMonth = (
  transactions: Transaction[],
  currentDate: Date,
  isRecurrent: boolean = false
) => {
  return transactions.filter(t => {
    if (t.isRecurrent !== isRecurrent) return false;
    if (isRecurrent) return true;
    
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentDate.getMonth() &&
           transactionDate.getFullYear() === currentDate.getFullYear();
  });
};

export const calculateMonthlyAmount = (
  transactions: Transaction[],
  currentDate: Date,
  category: string | null = null
) => {
  return transactions
    .filter(t => !category || t.categorie === category)
    .reduce((sum, t) => {
      if (t.isRecurrent) {
        return sum + db.getMontantForDate(t, currentDate);
      }
      return sum + (isNaN(t.montant) ? 0 : t.montant);
    }, 0);
};