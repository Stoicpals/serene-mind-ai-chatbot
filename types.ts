
export interface User {
  id: string;
  email: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export enum Mood {
  Ecstatic = '😊', // Ecstatic
  Happy = '🙂',    // Happy
  Neutral = '😐',  // Neutral
  Sad = '😕',      // Sad
  Awful = '😞'     // Awful
}

export interface MoodEntry {
  id: string;
  mood: Mood;
  notes?: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, name?: string) => void; // name optional for signup
  logout: () => void;
  isLoading: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  startTime: number;
  lastMessageTime?: number;
}
    