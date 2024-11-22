import React, { useState } from 'react';
import { Transaction } from '../types';
import { categories } from '../data';
import { 
  CalendarClock, 
  AlertCircle, 
  Pencil, 
  Trash2, 
  Check, 
  X,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import * as Icons from 'lucide-react';
import TransactionModal from './TransactionModal';
import { db } from '../db/instance';
import EmptyState from './shared/EmptyState';

interface RecurringTransactionsProps {
  transactions: Transaction[];
  onUpdate?: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function RecurringTransactions({ 
  transactions,
  onUpdate,
  onDelete 
}: RecurringTransactionsProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });
  
  const recurringTransactions = transactions.filter(t => t.isRecurrent);
  
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const IconComponent = Icons[category?.icon as keyof typeof Icons];
    return IconComponent ? <IconComponent className={`${category?.couleur} w-5 h-5`} /> : null;
  };

  // Générer les 6 mois à afficher
  const displayedMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    return date;
  });

  const navigatePrevious = () => {
    const newDate = new Date(startDate);
    newDate.setMonth(newDate.getMonth() - 6);
    setStartDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(startDate);
    newDate.setMonth(newDate.getMonth() + 6);
    setStartDate(newDate);
  };

  // Vérifier si on peut naviguer plus loin dans le passé (limite à 12 mois)
  const canNavigatePrevious = () => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    return startDate > twelveMonthsAgo;
  };

  // Vérifier si on peut naviguer plus loin dans le futur (limite à 24 mois)
  const canNavigateNext = () => {
    const twentyFourMonthsAhead = new Date();
    twentyFourMonthsAhead.setMonth(twentyFourMonthsAhead.getMonth() + 24);
    const lastVisibleMonth = new Date(startDate);
    lastVisibleMonth.setMonth(lastVisibleMonth.getMonth() + 5);
    return lastVisibleMonth < twentyFourMonthsAhead;
  };

  if (recurringTransactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-blue-600" />
            Transactions Récurrentes
          </h2>
        </div>
        <EmptyState message="Aucune transaction récurrente enregistrée" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-blue-600" />
          Transactions Récurrentes
        </h2>

        <div className="flex items-center gap-4">
          <button
            onClick={navigatePrevious}
            disabled={!canNavigatePrevious()}
            className={`p-2 rounded-full ${
              canNavigatePrevious()
                ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="6 mois précédents"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              {startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              {' - '}
              {displayedMonths[5].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <button
            onClick={navigateNext}
            disabled={!canNavigateNext()}
            className={`p-2 rounded-full ${
              canNavigateNext()
                ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="6 mois suivants"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-white">
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 sticky left-0 bg-gray-50 z-10">
                Transaction
              </th>
              {displayedMonths.map((date) => (
                <th 
                  key={date.getTime()} 
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600 min-w-[140px]"
                >
                  {date.toLocaleDateString('fr-FR', { 
                    month: 'long',
                    year: 'numeric'
                  })}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 sticky right-0 bg-gray-50 z-10">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recurringTransactions.map((transaction) => {
              const isDeleting = deleteConfirm === transaction.id;
              
              return (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 sticky left-0 bg-white">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(transaction.categorie)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          Prélèvement le {transaction.jourPrelevement} du mois
                        </p>
                        {transaction.modifications && transaction.modifications.length > 0 && (
                          <div className="mt-1 text-xs text-blue-600">
                            {transaction.modifications.length} modification(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {displayedMonths.map((date) => {
                    const montant = db.getMontantForDate(transaction, date);
                    const isCurrentMonth = date.getMonth() === new Date().getMonth() && 
                                        date.getFullYear() === new Date().getFullYear();
                    
                    return (
                      <td 
                        key={date.getTime()} 
                        className={`px-4 py-4 ${isCurrentMonth ? 'bg-blue-50' : ''}`}
                      >
                        <span className={`font-semibold ${
                          transaction.categorie === 'revenu' 
                            ? 'text-emerald-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.categorie === 'revenu' ? '+' : '-'}
                          {montant.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 text-right sticky right-0 bg-white">
                    <div className="flex items-center justify-end gap-2">
                      {isDeleting ? (
                        <>
                          <button
                            onClick={() => onDelete?.(transaction.id)}
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

      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSubmit={async (updatedTransaction) => {
            await onUpdate?.(editingTransaction.id, updatedTransaction);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}