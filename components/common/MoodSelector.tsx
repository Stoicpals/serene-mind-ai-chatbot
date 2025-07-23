
import React from 'react';
import { Mood } from '../../types';
import { MOOD_OPTIONS } from '../../constants';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="flex justify-around items-center p-4 bg-neutral-100 rounded-lg shadow">
      {MOOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          title={option.label}
          onClick={() => onSelectMood(option.value)}
          className={`text-4xl p-2 rounded-full transition-transform duration-150 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary ${
            selectedMood === option.value ? 'transform scale-125 ring-2 ring-primary bg-primary/20' : ''
          }`}
        >
          {option.value}
        </button>
      ))}
    </div>
  );
};
    