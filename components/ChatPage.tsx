
import React, { useState, useEffect, useRef, useContext } from 'react';
import { sendMessageToGemini, startNewGeminiChat } from '../services/geminiService';
import { mockLogin, saveMessageToSession, createNewChatSession, getChatSession } from '../services/mockDataService';
import { Message, ChatSession } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { LoadingSpinner } from './common/LoadingSpinner';
// Fix: Import AuthContextType from '../types'
import { AuthContext } from '../App';
import type { AuthContextType } from '../types';

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow ${
          isUser ? 'bg-primary text-white rounded-br-none' : 'bg-neutral-200 text-neutral-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-200 text-right' : 'text-neutral-500 text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export const ChatPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const currentUser = auth?.currentUser;

  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      // Attempt to load the latest session or create a new one
      const sessions = createNewChatSession(currentUser.id); // This will get existing or create if empty
      const activeSession = sessions; // For now, assume latest. Could be more complex.
      
      if (activeSession && activeSession.messages.length > 0) {
        setCurrentSession(activeSession);
        setMessages(activeSession.messages);
      } else {
        // Start a new chat if no active session or it's empty
        startNewChat();
      }
    }
  }, [currentUser]);

  const startNewChat = async () => {
    if (!currentUser) return;
    setIsLoadingAiResponse(true);
    try {
      const aiGreetingResponse = await startNewGeminiChat(); // This now uses the new Gemini service
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        text: aiGreetingResponse.text,
        sender: 'ai',
        timestamp: Date.now(),
      };
      const newSession = createNewChatSession(currentUser.id, aiMessage);
      setCurrentSession(newSession);
      setMessages([aiMessage]);
    } catch (error) {
      console.error("Error starting new chat with AI:", error);
      const errMessage: Message = {
        id: `err_${Date.now()}`,
        text: "Sorry, I couldn't start a new conversation. Please try again.",
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages([errMessage]); // Show error in chat
    } finally {
      setIsLoadingAiResponse(false);
    }
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !currentUser || !currentSession) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessageToSession(currentUser.id, currentSession.id, userMessage);
    setNewMessage('');
    setIsLoadingAiResponse(true);

    try {
      // Pass the history *including* the new user message to Gemini
      const aiResponseText = await sendMessageToGemini(userMessage.text, updatedMessages);
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        text: aiResponseText,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      saveMessageToSession(currentUser.id, currentSession.id, aiMessage);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errMessage: Message = {
        id: `err_${Date.now()}`,
        text: "Sorry, I encountered an issue. Please try again.",
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, errMessage]);
      saveMessageToSession(currentUser.id, currentSession.id, errMessage);
    } finally {
      setIsLoadingAiResponse(false);
    }
  };
  
  if (!currentUser) {
    return <div className="p-8 text-center text-neutral-600">Please log in to use the chat.</div>;
  }


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto bg-white shadow-xl rounded-b-lg">
      <header className="p-4 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-neutral-800">Chat with Serene</h1>
        <p className="text-xs text-neutral-500">This is not a replacement for professional mental health support. If you are in crisis, please contact a professional.</p>
      </header>
      <div className="flex-grow p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoadingAiResponse && (
          <div className="flex justify-start mb-4">
             <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow bg-neutral-200 text-neutral-800 rounded-bl-none">
                <LoadingSpinner size="sm" color="text-primary" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="flex items-center space-x-3">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow !mb-0"
            disabled={isLoadingAiResponse}
            aria-label="Chat input"
          />
          <Button type="submit" disabled={isLoadingAiResponse || !newMessage.trim()} isLoading={isLoadingAiResponse}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};