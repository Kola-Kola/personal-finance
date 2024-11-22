import React from 'react';
import { Transaction } from '../types';
import { Euro, TrendingUp, TrendingDown } from 'lucide-react';
import { db } from '../db/instance';

interface DashboardProps {
  transactions: Transaction[];
  currentDate: Date;
}

export default function Dashboard({ transactions, currentDate }: DashboardProps) {
  // Calculer les revenus pour le mois sélectionné
  const revenus = transactions
    .filter(t => {
      if (t.isRecurrent && t.categorie === 'revenu') {
        return true;
      }
      if (!t.isRecurrent && t.categorie === 'revenu') {
        const date = new Date(t.date);
        return date.getMonth() === currentDate.getMonth() &&
               date.getFullYear() === currentDate.getFullYear();
      }
      return false;
    })
    .reduce((sum, t) => {
      if (t.isRecurrent) {
        return sum + db.getMontantForDate(t, currentDate);
      }
      return sum + (isNaN(t.montant) ? 0 : t.montant);
    }, 0);

  // Calculer les dépenses pour le mois sélectionné
  const depenses = transactions
    .filter(t => {
      if (t.isRecurrent && t.categorie !== 'revenu') {
        return true;
      }
      if (!t.isRecurrent && t.categorie !== 'revenu') {
        const date = new Date(t.date);
        return date.getMonth() === currentDate.getMonth() &&
               date.getFullYear() === currentDate.getFullYear();
      }
      return false;
    })
    .reduce((sum, t) => {
      if (t.isRecurrent) {
        return sum + db.getMontantForDate(t, currentDate);
      }
      return sum + (isNaN(t.montant) ? 0 : t.montant);
    }, 0);

  const solde = revenus - depenses;

  const StatCard = ({ title, amount, icon: Icon, color, bgColor }: {
    title: string;
    amount: number;
    icon: typeof Euro;
    color: string;
    bgColor: string;
  }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} transition-transform duration-200 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-semibold mt-1 ${color.replace('border-l', 'text')}`}>
            {(amount || 0).toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}
          </p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const monthName = currentDate.toLocaleDateString('fr-FR', { 
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Résumé - {monthName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Solde"
          amount={solde}
          icon={Euro}
          color="border-l-blue-500"
          bgColor="bg-blue-500"
        />
        <StatCard
          title="Revenus"
          amount={revenus}
          icon={TrendingUp}
          color="border-l-emerald-500"
          bgColor="bg-emerald-500"
        />
        <StatCard
          title="Dépenses"
          amount={depenses}
          icon={TrendingDown}
          color="border-l-red-500"
          bgColor="bg-red-500"
        />
      </div>
    </div>
  );
}