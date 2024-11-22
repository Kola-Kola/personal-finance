export interface Transaction {
  id: string;
  montant: number;
  date: string;
  categorie: string;
  description: string;
  isRecurrent?: boolean;
  jourPrelevement?: number;
  dateEffet?: string;
  modifications?: TransactionModification[];
}

export interface TransactionModification {
  montant: number;
  dateEffet: string;
}

export interface Categorie {
  id: string;
  nom: string;
  icon: string;
  couleur: string;
}