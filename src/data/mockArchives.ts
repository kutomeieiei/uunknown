import { ArchiveItem } from '../types';

export const mockArchives: ArchiveItem[] = [
  {
    id: 'arch-m001',
    title: 'A Proof of the Twin Prime Conjecture for Special Cases',
    description: 'An extensive mathematical proof addressing specific boundary conditions of the Twin Prime Conjecture.',
    category: 'Mathematics',
    size: '1.2 MB',
    dateAdded: '2023-08-15',
    downloads: 12450,
    tags: ['number-theory', 'primes', 'proof'],
    difficulty: 5,
    yearPublished: 2023
  },
  {
    id: 'arch-b001',
    title: 'CRISPR-Cas9 Off-Target Effects Dataset',
    description: 'Comprehensive dataset of observed off-target genetic modifications across 50 cell lines.',
    category: 'Biology',
    size: '4.5 GB',
    dateAdded: '2024-01-22',
    downloads: 8320,
    tags: ['genetics', 'crispr', 'dataset'],
    difficulty: 3,
    yearPublished: 2024
  },
  {
    id: 'arch-c001',
    title: 'Novel Synthesis of Graphene Aerogels',
    description: 'Detailed methodology and spectroscopic data for a low-cost graphene aerogel synthesis pathway.',
    category: 'Chemistry',
    size: '85 MB',
    dateAdded: '2023-11-05',
    downloads: 5410,
    tags: ['materials', 'nanotech', 'synthesis'],
    difficulty: 4,
    yearPublished: 2023
  },
  {
    id: 'arch-p001',
    title: 'Quantum Decoherence in Superconducting Qubits',
    description: 'Empirical measurements of decoherence times under varying thermal conditions and material impurities.',
    category: 'Physics',
    size: '120 MB',
    dateAdded: '2022-09-30',
    downloads: 15600,
    tags: ['quantum', 'superconductors', 'experimental'],
    difficulty: 4,
    yearPublished: 2022
  },
  {
    id: 'arch-m002',
    title: 'Topological Data Analysis of Market Networks',
    description: 'Application of persistent homology to identify structural changes and vulnerability in global financial networks.',
    category: 'Mathematics',
    size: '45 MB',
    dateAdded: '2023-05-08',
    downloads: 3240,
    tags: ['topology', 'finance', 'applied-math'],
    difficulty: 5,
    yearPublished: 2023
  },
  {
    id: 'arch-b002',
    title: 'Deep-Sea Microbiome Sequencing Map',
    description: 'Metagenomic data from the Mariana Trench outlining novel extremophile metabolic pathways and enzyme discoveries.',
    category: 'Biology',
    size: '12.3 GB',
    dateAdded: '2021-04-14',
    downloads: 4120,
    tags: ['marine-biology', 'genomics', 'raw-data'],
    difficulty: 2,
    yearPublished: 2021
  },
  {
    id: 'arch-c002',
    title: 'Catalytic Conversion of CO2 to Methanol',
    description: 'Reaction kinetics and catalyst characterization data for a highly efficient copper-zinc-zirconia system.',
    category: 'Chemistry',
    size: '54 MB',
    dateAdded: '2023-12-01',
    downloads: 8850,
    tags: ['catalysis', 'green-chemistry', 'kinetics'],
    difficulty: 3,
    yearPublished: 2023
  }
];
