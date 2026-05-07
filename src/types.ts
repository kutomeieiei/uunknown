export type ArchiveCategory = 'Mathematics' | 'Biology' | 'Chemistry' | 'Physics';

export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  difficulty: number;
  yearPublished: number;
  downloadUrl?: string; // Optional URL for external downloads like Google Drive
  isOfficialSource: boolean; // Indicates if it's from an official source
}
