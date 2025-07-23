
import { User, Message, MoodEntry, JournalEntry, Mood, ChatSession } from '../types';
import { LocalStorageKeys } from '../constants';

// Helper to get/set localStorage
const getFromStorage = <T,>(key: string): T | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const setToStorage = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- User Authentication ---
interface UsersDB {
  [email: string]: User & { password?: string }; // Store mock password for demo
}

const getUsersDB = (): UsersDB => getFromStorage<UsersDB>(LocalStorageKeys.USERS_DB) || {};

const saveUsersDB = (db: UsersDB): void => setToStorage(LocalStorageKeys.USERS_DB, db);

export const mockSignup = (email: string, password?: string): User | null => {
  const db = getUsersDB();
  if (db[email]) {
    return null; // User already exists
  }
  const newUser: User = { id: Date.now().toString(), email };
  db[email] = { ...newUser, password }; // In a real app, hash password
  saveUsersDB(db);
  setToStorage(LocalStorageKeys.USER, newUser);
  return newUser;
};

export const mockLogin = (email: string, password?: string): User | null => {
  const db = getUsersDB();
  const user = db[email];
  // In a real app, compare hashed passwords
  if (user && (password === undefined || user.password === password || user.password === undefined)) { // Allow login if no password was set during signup for simplicity
    setToStorage(LocalStorageKeys.USER, {id: user.id, email: user.email});
    return {id: user.id, email: user.email};
  }
  return null;
};

export const mockLogout = (): void => {
  localStorage.removeItem(LocalStorageKeys.USER);
};

export const getCurrentUser = (): User | null => {
  return getFromStorage<User>(LocalStorageKeys.USER);
};

// --- Chat History ---
const getChatHistoryKey = (userId: string) => `${LocalStorageKeys.CHAT_HISTORY_PREFIX}${userId}`;

export const getChatSessions = (userId: string): ChatSession[] => {
    return getFromStorage<ChatSession[]>(getChatHistoryKey(userId)) || [];
};

export const getChatSession = (userId: string, sessionId: string): ChatSession | null => {
    const sessions = getChatSessions(userId);
    return sessions.find(s => s.id === sessionId) || null;
};

export const saveMessageToSession = (userId: string, sessionId: string, message: Message): ChatSession | null => {
    const sessions = getChatSessions(userId);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex > -1) {
        sessions[sessionIndex].messages.push(message);
        sessions[sessionIndex].lastMessageTime = message.timestamp;
        setToStorage(getChatHistoryKey(userId), sessions);
        return sessions[sessionIndex];
    }
    return null;
};

export const createNewChatSession = (userId: string, initialMessage?: Message): ChatSession => {
    const sessions = getChatSessions(userId);
    const newSession: ChatSession = {
        id: `chat_${Date.now()}`,
        userId,
        messages: initialMessage ? [initialMessage] : [],
        startTime: Date.now(),
    };
    sessions.push(newSession);
    setToStorage(getChatHistoryKey(userId), sessions);
    return newSession;
};


// --- Mood Entries ---
const getMoodEntriesKey = (userId: string) => `${LocalStorageKeys.MOOD_ENTRIES_PREFIX}${userId}`;

export const getMoodEntries = (userId: string): MoodEntry[] => {
  return getFromStorage<MoodEntry[]>(getMoodEntriesKey(userId)) || [];
};

export const addMoodEntry = (userId: string, mood: Mood, notes?: string): MoodEntry => {
  const entries = getMoodEntries(userId);
  const newEntry: MoodEntry = {
    id: `mood_${Date.now()}`,
    mood,
    notes,
    timestamp: Date.now(),
  };
  entries.push(newEntry);
  setToStorage(getMoodEntriesKey(userId), entries);
  return newEntry;
};

// --- Journal Entries ---
const getJournalEntriesKey = (userId: string) => `${LocalStorageKeys.JOURNAL_ENTRIES_PREFIX}${userId}`;

export const getJournalEntries = (userId: string): JournalEntry[] => {
  return getFromStorage<JournalEntry[]>(getJournalEntriesKey(userId)) || [];
};

export const addJournalEntry = (userId: string, title: string, content: string): JournalEntry => {
  const entries = getJournalEntries(userId);
  const newEntry: JournalEntry = {
    id: `journal_${Date.now()}`,
    title,
    content,
    timestamp: Date.now(),
  };
  entries.push(newEntry);
  setToStorage(getJournalEntriesKey(userId), entries);
  return newEntry;
};

export const deleteJournalEntry = (userId: string, entryId: string): void => {
  let entries = getJournalEntries(userId);
  entries = entries.filter(entry => entry.id !== entryId);
  setToStorage(getJournalEntriesKey(userId), entries);
};
    