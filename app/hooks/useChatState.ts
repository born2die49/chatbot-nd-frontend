'use client';

import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService'; // Adjust path as needed
import { getUserId } from '../lib/actions'; // Adjust path as needed

export interface ChatSession {
  id: string;
  title: string;
  last_message: {
    content: string;
    message_type: string;
    created_at: string;
  } | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  references?: any;
}

export function useChatState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoadingSessions(true);
    setError(null);
    try {
      const response = await apiService.get('/api/chat/sessions/');
      const fetchedSessions = response.results || [];
      setSessions(fetchedSessions);
      if (fetchedSessions.length > 0) {
        const currentSessionExists = activeSessionId && fetchedSessions.some((s: ChatSession) => s.id === activeSessionId);
        if (!currentSessionExists) {
            setActiveSessionId(fetchedSessions[0].id);
        }
      } else {
        setActiveSessionId(null);
      }
    } catch (err: any) {
      setError('Failed to fetch chat sessions.');
      console.error(err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [isLoggedIn, activeSessionId]);

  const fetchMessages = useCallback(async (sessionId: string) => {
    if (!sessionId) {
        setMessages([]);
        return;
    }
    setIsLoadingMessages(true);
    setError(null);
    try {
      const response = await apiService.get(`/api/chat/sessions/${sessionId}/messages/`);
      setMessages(response.results || []);
    } catch (err: any) {
      setError(`Failed to fetch messages for session ${sessionId}.`);
      setMessages([]);
      console.error(err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);


  useEffect(() => {
    const checkAuth = async () => {
      const userId = await getUserId();
      const userIsLoggedIn = !!userId;
      setIsLoggedIn(userIsLoggedIn);
      if (!userIsLoggedIn) {
        setIsLoadingSessions(false);
        setSessions([]);
        setActiveSessionId(null);
        setMessages([]);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSessions();
    }
  }, [isLoggedIn, fetchSessions]);

  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
    } else {
      setMessages([]); // Clear messages if no session is active
    }
  }, [activeSessionId, fetchMessages]);

  const createNewSession = async (vectorStoreId?: string) => {
    if (!isLoggedIn) {
      setError("Please log in to create a new chat session.");
      return null;
    }
    setError(null);
    try {
      const payload: { title: string; vector_store?: string } = { title: 'New Chat' };
        if (vectorStoreId) {
            payload.vector_store = vectorStoreId;
        }
        const newSession = await apiService.post('/api/chat/sessions/', payload);
        // ... (existing logic to update state)
        return newSession;
    } catch (err: any) {
      setError('Failed to create a new chat session.');
      console.error(err);
      return null;
    }
  };

  const selectSession = (sessionId: string | null) => {
    setActiveSessionId(sessionId);
  };

  const refreshMessagesForActiveSession = () => {
    if (activeSessionId) {
        // A slight delay to allow the server to process and save the user message
        setTimeout(() => {
            fetchMessages(activeSessionId);
        }, 1000);
    }
  };

  return {
    isLoggedIn,
    sessions,
    activeSessionId,
    messages,
    isLoadingSessions,
    isLoadingMessages,
    error,
    fetchSessions, // Expose if manual refresh needed from UI
    createNewSession,
    selectSession,
    refreshMessagesForActiveSession,
    setError, // To allow components to set errors if needed
  };
}