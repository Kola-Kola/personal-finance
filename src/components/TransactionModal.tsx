import React, { useState } from 'react';
import { Transaction } from '../types';
import { categories } from '../data';
import { X, CalendarClock } from 'lucide-react';

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSubmit: (transaction: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
}

export default function TransactionModal({ transaction, onClose, onSubmit }: TransactionModalProps) {
  const [montant, setMontant] = useState(transaction.montant.toString());
  const [categorie, setCategorie] = useState(transaction.categorie);
  const [description, setDescription] = useState(transaction.description);
  const [isRecurrent, setIsRecurrent] = useState(transaction.isRecurrent || false);
  const [jourPrelevement, setJourPrelevement] = useState(
    transaction.jourPrelevement?.toString() || '1'
  );
  const [dateEffet, setDateEffet] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month] = dateEffet.split('-').map(Number);
    const effectiveDate = new Date(year, month - 1);
    
    await onSubmit({
      montant: parseFloat(montant),
      categorie,
      description,
      isRecurrent,
      jourPrelevement: isRecurrent ? parseInt(jourPrelevement) : undefined,
      dateEffet: effectiveDate.toISOString()
    });
  };

  // Générer les options pour les 12 prochains mois
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Modifier la Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant (€)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRecurrent"
              checked={isRecurrent}
              onChange={(e) => setIsRecurrent(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isRecurrent" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CalendarClock className="w-4 h-4" />
              Transaction mensuelle récurrente
            </label>
          </div>

          {isRecurrent && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jour du prélèvement
                </label>
                <select
                  value={jourPrelevement}
                  onChange={(e) => setJourPrelevement(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((jour) => (
                    <option key={jour} value={jour}>
                      {jour}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appliquer la modification à partir de
                </label>
                <select
                  value={dateEffet}
                  onChange={(e) => setDateEffet(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}