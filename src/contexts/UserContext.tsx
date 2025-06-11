
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  password: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'avatar'>) => void;
  updateProfile: (updates: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => boolean;
  validatePassword: (password: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_AVATAR = "/placeholder.svg";

// Mock users storage - in real app this would be a database
const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem('skillsync_users');
  return stored ? JSON.parse(stored) : [
    {
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: DEFAULT_AVATAR,
      password: 'password123'
    }
  ];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem('skillsync_users', JSON.stringify(users));
};

const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('skillsync_current_user');
  return stored ? JSON.parse(stored) : null;
};

const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('skillsync_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('skillsync_current_user');
  }
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCurrentUser());

  const login = (credentials: { username: string; password: string }): boolean => {
    const users = getStoredUsers();
    const foundUser = users.find(u => 
      (u.username === credentials.username || u.email === credentials.username) && 
      u.password === credentials.password
    );

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      saveCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    saveCurrentUser(null);
  };

  const register = (userData: Omit<User, 'avatar'>) => {
    const users = getStoredUsers();
    const newUser: User = {
      ...userData,
      avatar: DEFAULT_AVATAR
    };
    users.push(newUser);
    saveUsers(users);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const users = getStoredUsers();
    const updatedUser = { ...user, ...updates };
    
    const userIndex = users.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveUsers(users);
    }

    setUser(updatedUser);
    saveCurrentUser(updatedUser);
  };

  const updatePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user || user.password !== currentPassword) {
      return false;
    }

    updateProfile({ password: newPassword });
    return true;
  };

  const validatePassword = (password: string): boolean => {
    return user ? user.password === password : false;
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      register,
      updateProfile,
      updatePassword,
      validatePassword,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
