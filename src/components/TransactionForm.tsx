import React, { useState } from 'react';
import { PlusCircle, CalendarClock } from 'lucide-react';
import { categories } from '../data';
import { Transaction } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const [montant, setMontant] = useState('');
  const [categorie, setCategorie] = useState('revenu');
  const [description, setDescription] = useState('');
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [jourPrelevement, setJourPrelevement] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Générer les options pour les 12 derniers mois et les 12 prochains mois
  const monthOptions = Array.from({ length: 25 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 12 + i);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 15); // On utilise le 15 du mois comme date par défaut

    onAdd({
      montant: parseFloat(montant),
      date: date.toISOString(),
      categorie,
      description,
      isRecurrent,
      jourPrelevement: isRecurrent ? parseInt(jourPrelevement) : undefined
    });

    setMontant('');
    setDescription('');
    setIsRecurrent(false);
    setJourPrelevement('1');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Nouvelle Transaction</h2>
      <div className="grid gap-4">
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
            placeholder="0.00"
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
            placeholder="Description de la transaction"
          />
        </div>

        {!isRecurrent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

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
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <PlusCircle size={20} />
          Ajouter
        </button>
      </div>
    </form>
  );
}