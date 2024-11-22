# 💰 Finance Tracker

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, intuitive personal finance tracker built with React and TypeScript. Track your expenses, monitor recurring payments, and visualize your financial health with beautiful charts.

![Finance Tracker Preview](https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop)

## ✨ Features

- 📊 **Interactive Dashboard**: Real-time overview of your financial status
- 💸 **Transaction Management**: Easy-to-use interface for managing expenses and income
- 🔄 **Recurring Transactions**: Track monthly bills and regular payments
- 📈 **Visual Analytics**: Beautiful charts to visualize spending patterns
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌙 **Offline Support**: Built with IndexedDB for offline functionality
- 🔒 **Privacy First**: All data stored locally in your browser

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/finance-tracker.git

# Navigate to the project directory
cd finance-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🛠️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Hooks
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Storage**: Dexie.js (IndexedDB wrapper)
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library

## 📱 Screenshots

<div style="display: flex; gap: 10px; margin-bottom: 20px;">
  <img src="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=600&auto=format&fit=crop" alt="Dashboard" width="400"/>
  <img src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=600&auto=format&fit=crop" alt="Transactions" width="400"/>
</div>

## 🌟 Key Features Explained

### Dashboard
- Real-time balance calculation
- Monthly income vs. expenses comparison
- Spending category breakdown
- Transaction history

### Transaction Management
- Add one-time or recurring transactions
- Categorize expenses
- Edit or delete transactions
- Filter by date range

### Recurring Transactions
- Set up monthly bills
- Automatic monthly tracking
- Modify future payment amounts
- Historical payment tracking

### Analytics
- Monthly spending trends
- Category-wise analysis
- Interactive pie charts
- Export functionality

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run coverage
```

## 📦 Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript types
├── constants/        # Global constants
├── db/              # Database configuration
└── __tests__/       # Test files
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- UI inspiration from various finance apps
- Testing setup inspired by Vitest documentation

## 📫 Contact

For questions or feedback, please open an issue or reach out to the maintainers.

---

<p align="center">Made with ❤️ for better financial management</p>