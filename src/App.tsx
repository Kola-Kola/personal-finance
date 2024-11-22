import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import RecurringTransactions from './components/RecurringTransactions';
import { Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { 
    transactions, 
    addTransaction, 
    updateTransaction,
    deleteTransaction,
    isLoading, 
    error 
  } = useTransactions();

  const monthOptions = Array.from({ length: 25 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 12 + i);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    };
  });

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    setCurrentDate(new Date(year, month - 1));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Une erreur est survenue. Actualisation en cours...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Mes Finances</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <select
                value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`}
                onChange={handleMonthChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={nextMonth}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section supérieure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Colonne de gauche */}
          <div className="lg:col-span-2 space-y-6">
            <Dashboard transactions={transactions} currentDate={currentDate} />
            <Charts transactions={transactions} currentDate={currentDate} />
          </div>

          {/* Colonne de droite */}
          <div className="lg:h-[calc(100vh-13rem)] lg:sticky lg:top-24">
            <TransactionForm onAdd={addTransaction} />
          </div>
        </div>

        {/* Section des tableaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionList 
            transactions={transactions}
            currentDate={currentDate}
            onUpdate={updateTransaction}
            onDelete={deleteTransaction}
          />
          <RecurringTransactions 
            transactions={transactions}
            onUpdate={updateTransaction}
            onDelete={deleteTransaction}
          />
        </div>
      </main>
    </div>
  );
}

export default App;