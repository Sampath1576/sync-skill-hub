
import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'task' | 'event';
  url: string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      searchResults,
      setSearchResults,
      isSearching,
      setIsSearching,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
