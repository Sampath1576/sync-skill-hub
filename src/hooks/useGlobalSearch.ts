
import { useState, useEffect } from 'react';
import { SearchResult } from '@/contexts/SearchContext';

// Mock data for search functionality
const mockData: SearchResult[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    content: 'Learn the basics of JavaScript programming language including variables, functions, and control structures.',
    type: 'note',
    url: '/notes'
  },
  {
    id: '2',
    title: 'Complete React assignment',
    content: 'Finish the React component assignment for the web development course.',
    type: 'task',
    url: '/tasks'
  },
  {
    id: '3',
    title: 'Team Meeting',
    content: 'Weekly team standup meeting to discuss project progress and upcoming deadlines.',
    type: 'event',
    url: '/calendar'
  },
  {
    id: '4',
    title: 'Machine Learning Basics',
    content: 'Introduction to machine learning concepts, algorithms, and practical applications.',
    type: 'note',
    url: '/notes'
  },
  {
    id: '5',
    title: 'Review meeting notes',
    content: 'Go through the notes from yesterday\'s client meeting and prepare action items.',
    type: 'task',
    url: '/tasks'
  },
  {
    id: '6',
    title: 'Project Planning',
    content: 'Strategic planning document for the upcoming product launch and timeline.',
    type: 'note',
    url: '/notes'
  },
];

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = async (query: string): Promise<SearchResult[]> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return [];
    }

    const filteredResults = mockData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredResults);
    setIsLoading(false);
    return filteredResults;
  };

  return {
    search,
    results,
    isLoading,
  };
}
