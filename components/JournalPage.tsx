
import React, { useState, useEffect, useContext } from 'react';
// Fix: Import AuthContextType from '../types'
import { AuthContext } from '../App';
import type { AuthContextType } from '../types';
import { JournalEntry } from '../types';
import { getJournalEntries, addJournalEntry, deleteJournalEntry } from '../services/mockDataService';
import { Button } from './common/Button';
import { Input, TextArea } from './common/Input';

const JournalEntryCard: React.FC<{ entry: JournalEntry; onDelete: (id: string) => void }> = ({ entry, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
        <h3 className="text-lg font-semibold text-primary">{entry.title}</h3>
        <p className="text-xs text-neutral-500 mb-2">{new Date(entry.timestamp).toLocaleDateString()}</p>
        <p className={`text-neutral-700 text-sm ${!isExpanded ? 'truncate' : ''}`}>
          {entry.content}
        </p>
      </div>
      {isExpanded && (
         <Button onClick={() => onDelete(entry.id)} variant="danger" size="sm" className="mt-3">Delete</Button>
      )}
    </div>
  );
};


export const JournalPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const currentUser = auth?.currentUser;

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEntries(getJournalEntries(currentUser.id).sort((a, b) => b.timestamp - a.timestamp));
    }
  }, [currentUser]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && newTitle.trim() && newContent.trim()) {
      addJournalEntry(currentUser.id, newTitle, newContent);
      setEntries(getJournalEntries(currentUser.id).sort((a, b) => b.timestamp - a.timestamp)); // Refresh
      setNewTitle('');
      setNewContent('');
      setShowForm(false);
    }
  };
  
  const handleDeleteEntry = (id: string) => {
    if (currentUser) {
        deleteJournalEntry(currentUser.id, id);
        setEntries(getJournalEntries(currentUser.id).sort((a,b) => b.timestamp - a.timestamp));
    }
  }

  if (!currentUser) {
    return <div className="p-8 text-center">Please log in to use the journal.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800">Your Journal</h1>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
          {showForm ? 'Cancel' : 'New Entry'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAddEntry} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <Input
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Today's reflections"
            required
          />
          <TextArea
            label="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your thoughts here..."
            required
            rows={6}
          />
          <Button type="submit" variant="secondary">Save Entry</Button>
        </form>
      )}

      {entries.length === 0 && !showForm ? (
        <p className="text-neutral-500 text-center py-8">No journal entries yet. Click "New Entry" to start writing.</p>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <JournalEntryCard key={entry.id} entry={entry} onDelete={handleDeleteEntry} />
          ))}
        </div>
      )}
    </div>
  );
};