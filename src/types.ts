export interface GratitudeEntry {
  id: string;
  index: number;
  content: string;
  timestamp: string;
  bodyTag?: string;
}

export interface GratitudeSession {
  id: string;
  date: string;
  entries: GratitudeEntry[];
}
