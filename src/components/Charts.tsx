import React from 'react';
import { Transaction } from '../types';
import { categories } from '../data';
import { db } from '../db/instance';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartsProps {
  transactions: Transaction[];
  currentDate?: Date;
}

const COLORS = {
  revenu: '#10B981',    // emerald-500
  factures: '#3B82F6',  // blue-500
  impots: '#EF4444',    // red-500
  loisirs: '#8B5CF6',   // purple-500
  transport: '#0EA5E9', // sky-500
  essence: '#F97316',   // orange-500
  credit: '#6366F1',    // indigo-500
  assurance: '#14B8A6'  // teal-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-lg font-bold text-blue-600">
          {payload[0].value.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts({ transactions, currentDate = new Date() }: ChartsProps) {
  // Calculer les dépenses par catégorie
  const expensesByCategory = categories
    .filter(cat => cat.id !== 'revenu')
    .map(category => {
      // Dépenses ponctuelles du mois
      const ponctuelAmount = transactions
        .filter(t => !t.isRecurrent && t.categorie === category.id)
        .filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentDate.getMonth() && 
                 transactionDate.getFullYear() === currentDate.getFullYear();
        })
        .reduce((sum, t) => sum + (isNaN(t.montant) ? 0 : t.montant), 0);

      // Dépenses récurrentes du mois
      const recurrentAmount = transactions
        .filter(t => t.isRecurrent && t.categorie === category.id)
        .reduce((sum, t) => sum + db.getMontantForDate(t, currentDate), 0);

      return {
        name: category.nom,
        value: ponctuelAmount + recurrentAmount,
        color: COLORS[category.id as keyof typeof COLORS]
      };
    })
    .filter(cat => cat.value > 0); // Ne garder que les catégories avec un montant > 0

  const formatEuro = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const monthName = currentDate.toLocaleDateString('fr-FR', { 
    month: 'long',
    year: 'numeric'
  });

  if (expensesByCategory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Répartition des Dépenses - {monthName}
        </h2>
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500 text-center">
            Aucune dépense pour {monthName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        Répartition des Dépenses - {monthName}
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expensesByCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ name, value }) => `${name} (${formatEuro(value)})`}
              labelLine={true}
              animationBegin={0}
              animationDuration={1500}
            >
              {expensesByCategory.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}