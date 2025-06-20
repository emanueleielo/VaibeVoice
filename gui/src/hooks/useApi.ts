import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export interface Transcription {
  id: number;
  timestamp: string;
  audio_path: string;
  text: string;
  duration: number;
  word_count: number;
}

export interface Stats {
  totalTranscriptions: number;
  totalDuration: number;
  totalWords: number;
  avgWordsPerMinute: number;
  todayStats: {
    transcriptions: number;
    duration: number;
    words: number;
  };
  recentTranscriptions: Array<{
    id: number;
    text: string;
    timestamp: string;
    duration: number;
    words: number;
  }>;
}

export interface Settings {
  record_key: string;
  openai_api_key?: string;
  transcription_model: string;
  transcription_language?: string;
  llm_model: string;
  start_sound: string;
  end_sound: string;
}

export function useTranscriptions() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTranscriptions() {
      try {
        const response = await fetch(`${API_BASE_URL}/transcriptions`);
        if (!response.ok) {
          throw new Error('Failed to fetch transcriptions');
        }
        const data = await response.json();
        setTranscriptions(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    fetchTranscriptions();
  }, []);

  return { transcriptions, loading, error };
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      // Fetch the latest settings from the server to ensure we have the most up-to-date data
      await fetchSettings();
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      throw err;
    }
  };

  const resetSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset settings');
      }

      // Fetch the latest settings from the server to ensure we have the most up-to-date data
      await fetchSettings();
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      throw err;
    }
  };

  return { settings, loading, error, updateSettings, fetchSettings, resetSettings };
}
