import React, { useState } from 'react';
import { Transaction } from '../types';
import { categories } from '../data';
import * as Icons from 'lucide-react';
import { Pencil, Trash2, X, Check, AlertCircle } from 'lucide-react';
import TransactionModal from './TransactionModal';

interface TransactionListProps {
  transactions: Transaction[];
  currentDate: Date;
  onUpdate: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TransactionList({ 
  transactions, 
  currentDate,
  onUpdate, 
  onDelete 
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const IconComponent = Icons[category?.icon as keyof typeof Icons];
    return IconComponent ? <IconComponent className={`${category?.couleur} w-5 h-5`} /> : null;
  };

  // Filtrer les transactions pour le mois sélectionné
  const monthlyTransactions = transactions.filter(t => {
    if (t.isRecurrent) return false;
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentDate.getMonth() && 
           transactionDate.getFullYear() === currentDate.getFullYear();
  });

  const monthName = currentDate.toLocaleDateString('fr-FR', { 
    month: 'long',
    year: 'numeric'
  });

  if (monthlyTransactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Transactions - {monthName}
        </h2>
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Aucune transaction pour {monthName}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Transactions - {monthName}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Transaction</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Montant</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyTransactions.map((transaction) => {
                const amount = isNaN(transaction.montant) ? 0 : transaction.montant;
                const isDeleting = deleteConfirm === transaction.id;
                
                return (
                  <tr 
                    key={transaction.id} 
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(transaction.categorie)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {categories.find(c => c.id === transaction.categorie)?.nom}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long'
                      })}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`font-semibold ${
                        transaction.categorie === 'revenu' 
                          ? 'text-emerald-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.categorie === 'revenu' ? '+' : '-'}
                        {amount.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isDeleting ? (
                          <>
                            <button
                              onClick={() => onDelete(transaction.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Confirmer la suppression"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                              title="Annuler"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingTransaction(transaction)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(transaction.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSubmit={async (updatedTransaction) => {
            await onUpdate(editingTransaction.id, updatedTransaction);
            setEditingTransaction(null);
          }}
        />
      )}
    </>
  );
}