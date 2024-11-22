import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/instance';
import { Transaction } from '../types';
import { useState, useCallback } from 'react';

export function useTransactions() {
  const [error, setError] = useState<Error | null>(null);
  const transactions = useLiveQuery(() => db.getTransactions());

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      await db.addTransaction(transaction);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => {
    try {
      await db.updateTransaction(id, transaction);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await db.deleteTransaction(id);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  return {
    transactions: transactions || [],
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading: transactions === undefined,
    error
  };
}