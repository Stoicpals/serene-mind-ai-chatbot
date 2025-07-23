
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Fix: Import AuthContextType from '../types'
import { AuthContext } from '../App';
import type { AuthContextType } from '../types';
import { MoodEntry, Mood, ChatSession } from '../types';
import { getMoodEntries, addMoodEntry, getChatSessions } from '../services/mockDataService';
import { MOOD_OPTIONS } from '../constants';
import { Button } from './common/Button';
import { MoodSelector } from './common/MoodSelector';
import { TextArea } from './common/Input';

const MoodChart: React.FC<{ data: MoodEntry[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-neutral-500">No mood data yet to display chart.</p>;
  }

  const moodCounts = MOOD_OPTIONS.map(opt => ({
    name: opt.label,
    mood: opt.value,
    count: data.filter(entry => entry.mood === opt.value).length,
    fill: opt.color.replace('text-', '#').replace('-400', ''), // basic color extraction
  }));
  
  // Quick hack for recharts fill colors from Tailwind text colors
  const colorMap: Record<Mood, string> = {
    [Mood.Ecstatic]: '#FACC15', // yellow-400
    [Mood.Happy]: '#4ADE80',    // green-400
    [Mood.Neutral]: '#60A5FA',  // blue-400
    [Mood.Sad]: '#A78BFA',      // purple-400
    [Mood.Awful]: '#F87171',    // red-400
  };

  const chartData = MOOD_OPTIONS.map(opt => ({
    name: opt.value, // Emoji
    count: data.filter(entry => entry.mood === opt.value).length,
    fill: colorMap[opt.value]
  }));


  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" tick={{fontSize: 18}} />
        <YAxis allowDecimals={false} />
        <Tooltip 
            formatter={(value: number, name: string, props: any) => [`${value} times`, `Mood: ${props.payload.name}`]} 
            cursor={{fill: 'rgba(200,200,200,0.1)'}}
        />
        <Legend formatter={(value, entry) => <span className="text-neutral-700">{MOOD_OPTIONS.find(opt => opt.value === value)?.label || value}</span>} />
        <Bar dataKey="count" name="Mood Frequency" >
          {chartData.map((entry, index) => (
            <Bar key={`bar-${index}`} dataKey="count" fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DashboardPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const currentUser = auth?.currentUser;

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodNotes, setMoodNotes] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (currentUser) {
      setMoodEntries(getMoodEntries(currentUser.id).sort((a,b) => b.timestamp - a.timestamp));
      setChatSessions(getChatSessions(currentUser.id).sort((a,b) => (b.lastMessageTime || b.startTime) - (a.lastMessageTime || a.startTime)));
    }
  }, [currentUser]);

  const handleAddMood = () => {
    if (currentUser && selectedMood) {
      addMoodEntry(currentUser.id, selectedMood, moodNotes);
      setMoodEntries(getMoodEntries(currentUser.id).sort((a,b) => b.timestamp - a.timestamp)); // Refresh
      setSelectedMood(null);
      setMoodNotes('');
    }
  };

  if (!currentUser) {
    return <div className="p-8 text-center">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-neutral-800">Welcome, {currentUser.email}!</h1>

      {/* Mood Tracker */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">Mood Tracker</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-neutral-600 mb-2">How are you feeling today?</h3>
          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
        </div>
        {selectedMood && (
          <div className="mb-6">
            <TextArea
              label="Any notes? (Optional)"
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              placeholder="What's on your mind?"
            />
            <Button onClick={handleAddMood} variant="primary" disabled={!selectedMood}>
              Save Mood
            </Button>
          </div>
        )}
        <h3 className="text-lg font-medium text-neutral-600 my-4">Your Mood History</h3>
        <MoodChart data={moodEntries} />
        <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
            {moodEntries.slice(0,5).map(entry => (
                <div key={entry.id} className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
                    <span className={`text-2xl mr-2 ${MOOD_OPTIONS.find(m => m.value === entry.mood)?.color}`}>{entry.mood}</span>
                    <span className="text-sm text-neutral-600">{new Date(entry.timestamp).toLocaleDateString()} - {new Date(entry.timestamp).toLocaleTimeString()}</span>
                    {entry.notes && <p className="text-xs text-neutral-500 mt-1 italic">"{entry.notes}"</p>}
                </div>
            ))}
        </div>
      </section>

      {/* Chat History Summary */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">Recent Chats</h2>
        {chatSessions.length > 0 ? (
          <ul className="space-y-3">
            {chatSessions.slice(0, 3).map(session => (
              <li key={session.id} className="p-3 bg-neutral-50 rounded-md hover:bg-neutral-100 transition-colors">
                <Link to={`/chat#${session.id}`} className="block"> {/* Modify ChatPage to handle session ID from hash */}
                  <p className="font-medium text-primary">Chat from {new Date(session.startTime).toLocaleString()}</p>
                  <p className="text-sm text-neutral-600 truncate">
                    {session.messages.length > 0 ? session.messages[session.messages.length -1].text : "Empty chat"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500">No chat history yet. <Link to="/chat" className="text-primary hover:underline">Start a chat!</Link></p>
        )}
        {chatSessions.length > 3 && <Link to="/chat" className="text-primary hover:underline mt-2 inline-block">View all chats</Link>}
      </section>

      {/* Journal Link */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">Journal</h2>
        <p className="text-neutral-600 mb-4">Reflect on your thoughts and feelings in a private space.</p>
        <Button onClick={() => {}} variant="secondary"> 
            <Link to="/journal">Go to Journal</Link>
        </Button>
      </section>
    </div>
  );
};