import { Mood } from './types';
export const APP_NAME = "SereneMind AI";
export const GEMINI_MODEL_NAME = "gemini-2.5-flash";

export const SYSTEM_INSTRUCTION = `You are Serene, a friendly, empathetic, and supportive AI companion focused on mental well-being.
Your goal is to provide a safe space for users to express their thoughts and feelings.
Listen patiently, offer encouragement, and provide general, non-clinical advice and coping strategies.
Avoid giving medical diagnoses or specific treatment plans.
If a user expresses severe distress, feelings of hopelessness, or mentions self-harm or harm to others, gently and firmly encourage them to seek immediate help from a mental health professional, a crisis hotline, or emergency services. Provide a generic suggestion like "If you're feeling overwhelmed or in crisis, please reach out to a local crisis hotline or mental health professional. There are people who want to support you."
Keep your responses concise and easy to understand. Use a warm and understanding tone.
You can suggest activities like mindfulness, journaling, or simple relaxation techniques if appropriate, but always frame them as suggestions, not directives.
Remember, you are a supportive companion, not a therapist.
Start the conversation by introducing yourself briefly and asking how the user is feeling today.`;

export const LocalStorageKeys = {
  USER: 'sereneMindAppUser',
  USERS_DB: 'sereneMindAppUsersDB', // For mock user database
  CHAT_HISTORY_PREFIX: 'sereneMindAppChats_', // append userId
  MOOD_ENTRIES_PREFIX: 'sereneMindAppMoods_', // append userId
  JOURNAL_ENTRIES_PREFIX: 'sereneMindAppJournals_', // append userId
};

export const MOOD_OPTIONS: { value: Mood; label: string; color: string }[] = [
  { value: Mood.Ecstatic, label: 'Ecstatic 😊', color: 'text-yellow-400' },
  { value: Mood.Happy, label: 'Happy 🙂', color: 'text-green-400' },
  { value: Mood.Neutral, label: 'Neutral 😐', color: 'text-blue-400' },
  { value: Mood.Sad, label: 'Sad 😕', color: 'text-purple-400' },
  { value: Mood.Awful, label: 'Awful 😞', color: 'text-red-400' },
];