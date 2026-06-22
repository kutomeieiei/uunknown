export type ArchiveCategory = 'Mathematics' | 'Biology' | 'Chemistry' | 'Physics';

export interface ExternalLinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  subjects: string[];
  isOfficialSource?: boolean;
  examTypes?: string[];
}

export interface PortfolioItem {
  id: string;
  url: string;
  tags: string[];
  ownerName?: string;
  ownerFullName?: string;
  targetFacultyAndUni?: string;
  coverImageUrl?: string;
}

export interface ArchiveItem {
  id?: string;
  dateAdded?: string;
  title: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  difficulty: number;
  yearPublished: number;
  downloadUrl?: string; // Optional URL for external downloads like Google Drive
  solutionUrl?: string; // Optional URL for the solution
  isOfficialSource: boolean; // Indicates if it's from an official source
}
