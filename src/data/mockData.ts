
import { Article, Category, User } from '../types/news';

export const mockCategories: Category[] = [
  { id: '1', name: 'Politique', description: 'Actualités politiques', color: 'blue' },
  { id: '2', name: 'Technologie', description: 'Innovation et tech', color: 'green' },
  { id: '3', name: 'Sport', description: 'Actualités sportives', color: 'red' },
  { id: '4', name: 'Culture', description: 'Art et culture', color: 'purple' },
  { id: '5', name: 'Économie', description: 'Actualités économiques', color: 'yellow' },
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@news.com',
    name: 'Admin Principal',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'editeur@news.com',
    name: 'Jean Éditeur',
    role: 'editor',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    email: 'visiteur@news.com',
    name: 'Marie Visiteur',
    role: 'visitor',
    createdAt: new Date('2024-02-01'),
  },
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'L\'intelligence artificielle révolutionne l\'industrie',
    summary: 'Les dernières avancées en IA transforment radicalement notre façon de travailler et de vivre au quotidien.',
    content: 'L\'intelligence artificielle continue de révolutionner tous les secteurs d\'activité. De la santé à l\'automobile, en passant par l\'éducation et les finances, l\'IA s\'impose comme un outil incontournable pour améliorer l\'efficacité et créer de nouvelles opportunités. Les entreprises qui adoptent ces technologies prennent une longueur d\'avance considérable sur leurs concurrents.',
    categoryId: '2',
    authorId: '2',
    publishedAt: new Date('2024-07-08'),
    updatedAt: new Date('2024-07-08'),
    imageUrl: '/placeholder.svg',
  },
  {
    id: '2',
    title: 'Les résultats des dernières élections analysés',
    summary: 'Une analyse approfondie des résultats électoraux et de leurs implications pour l\'avenir politique.',
    content: 'Les dernières élections ont apporté des changements significatifs dans le paysage politique national. Les électeurs ont exprimé clairement leurs attentes en matière de réformes économiques et sociales. Cette nouvelle configuration politique ouvre la voie à des négociations importantes sur les grandes réformes à venir.',
    categoryId: '1',
    authorId: '2',
    publishedAt: new Date('2024-07-07'),
    updatedAt: new Date('2024-07-07'),
    imageUrl: '/placeholder.svg',
  },
  {
    id: '3',
    title: 'Championship de football : résultats surprenants',
    summary: 'Des résultats inattendus bouleversent le classement du championnat national.',
    content: 'La dernière journée de championnat a réservé son lot de surprises avec des victoires inattendues qui redistribuent les cartes en tête du classement. Les équipes favorites ont été bousculées par des formations considérées comme outsiders en début de saison.',
    categoryId: '3',
    authorId: '2',
    publishedAt: new Date('2024-07-06'),
    updatedAt: new Date('2024-07-06'),
    imageUrl: '/placeholder.svg',
  },
  {
    id: '4',
    title: 'Nouvelle exposition d\'art contemporain',
    summary: 'Une exposition exceptionnelle présente les œuvres d\'artistes émergents de la scène internationale.',
    content: 'Le musée national accueille une exposition majeure consacrée à l\'art contemporain. Cette événement culturel met en lumière le travail d\'une nouvelle génération d\'artistes qui questionnent notre rapport au monde moderne à travers des œuvres innovantes et provocatrices.',
    categoryId: '4',
    authorId: '2',
    publishedAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-05'),
    imageUrl: '/placeholder.svg',
  },
  {
    id: '5',
    title: 'Les marchés financiers en hausse',
    summary: 'Une semaine positive pour les bourses mondiales avec des gains significatifs dans tous les secteurs.',
    content: 'Les marchés financiers affichent une performance remarquable cette semaine, portés par des indicateurs économiques encourageants et des résultats d\'entreprises supérieurs aux attentes. Cette dynamique positive reflète la confiance retrouvée des investisseurs.',
    categoryId: '5',
    authorId: '2',
    publishedAt: new Date('2024-07-04'),
    updatedAt: new Date('2024-07-04'),
    imageUrl: '/placeholder.svg',
  },
  {
    id: '6',
    title: 'Innovation dans le secteur de la santé',
    summary: 'De nouvelles technologies médicales promettent d\'améliorer significativement les traitements.',
    content: 'Le secteur de la santé connaît une révolution technologique sans précédent. Les nouvelles thérapies géniques, l\'intelligence artificielle appliquée au diagnostic et les dispositifs médicaux connectés ouvrent des perspectives extraordinaires pour améliorer la qualité des soins.',
    categoryId: '2',
    authorId: '2',
    publishedAt: new Date('2024-07-03'),
    updatedAt: new Date('2024-07-03'),
    imageUrl: '/placeholder.svg',
  },
];
