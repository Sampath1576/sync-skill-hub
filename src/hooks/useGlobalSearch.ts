
import { useState, useEffect } from 'react';
import { SearchResult } from '@/contexts/SearchContext';
import { useLocalNotes } from '@/hooks/useLocalNotes';
import { useLocalTasks } from '@/hooks/useLocalTasks';
import { useLocalEvents } from '@/hooks/useLocalEvents';

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { notes } = useLocalNotes();
  const { tasks } = useLocalTasks();
  const { events } = useLocalEvents();

  const search = async (query: string): Promise<SearchResult[]> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return [];
    }

    const searchResults: SearchResult[] = [];

    // Search in notes
    notes.forEach(note => {
      if (note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: note.id,
          title: note.title,
          content: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
          type: 'note',
          url: '/notes'
        });
      }
    });

    // Search in tasks
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: task.id,
          title: task.title,
          content: task.description,
          type: 'task',
          url: '/tasks'
        });
      }
    });

    // Search in events
    events.forEach(event => {
      if (event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: event.id,
          title: event.title,
          content: event.description,
          type: 'event',
          url: '/calendar'
        });
      }
    });

    setResults(searchResults);
    setIsLoading(false);
    return searchResults;
  };

  return {
    search,
    results,
    isLoading,
  };
}
