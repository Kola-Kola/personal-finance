import { describe, it, expect, vi } from 'vitest';
import { filterTransactionsByMonth, calculateMonthlyAmount } from '../../utils/transactionHelpers';
import { Transaction } from '../../types';
import { db } from '../../db/instance';

// Mock the db.getMontantForDate method
vi.mock('../../db/instance', () => ({
  db: {
    getMontantForDate: vi.fn((transaction) => transaction.montant)
  }
}));

describe('filterTransactionsByMonth', () => {
  const currentDate = new Date(2024, 2, 15); // March 15, 2024
  
  const transactions: Transaction[] = [
    {
      id: '1',
      montant: 1000,
      date: '2024-03-10',
      categorie: 'revenu',
      description: 'Salaire',
      isRecurrent: false
    },
    {
      id: '2',
      montant: 500,
      date: '2024-02-15',
      categorie: 'factures',
      description: 'Loyer',
      isRecurrent: true,
      jourPrelevement: 15
    },
    {
      id: '3',
      montant: 100,
      date: '2024-03-05',
      categorie: 'loisirs',
      description: 'Restaurant',
      isRecurrent: false
    }
  ];

  it('filters one-time transactions for current month', () => {
    const filtered = filterTransactionsByMonth(transactions, currentDate, false);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(t => t.id)).toEqual(['1', '3']);
  });

  it('filters recurring transactions', () => {
    const filtered = filterTransactionsByMonth(transactions, currentDate, true);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });
});

describe('calculateMonthlyAmount', () => {
  const currentDate = new Date(2024, 2, 15);
  
  const transactions: Transaction[] = [
    {
      id: '1',
      montant: 1000,
      date: '2024-03-10',
      categorie: 'revenu',
      description: 'Salaire',
      isRecurrent: false
    },
    {
      id: '2',
      montant: 500,
      date: '2024-03-15',
      categorie: 'factures',
      description: 'Loyer',
      isRecurrent: true,
      jourPrelevement: 15
    }
  ];

  it('calculates total amount for all categories', () => {
    const total = calculateMonthlyAmount(transactions, currentDate);
    expect(total).toBe(1500);
  });

  it('calculates amount for specific category', () => {
    const revenusTotal = calculateMonthlyAmount(transactions, currentDate, 'revenu');
    expect(revenusTotal).toBe(1000);

    const facturesTotal = calculateMonthlyAmount(transactions, currentDate, 'factures');
    expect(facturesTotal).toBe(500);
  });

  it('handles empty transactions array', () => {
    const total = calculateMonthlyAmount([], currentDate);
    expect(total).toBe(0);
  });
});