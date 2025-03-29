import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect, 
    ReactNode 
  } from 'react';
  
  // Define the shape of our dark mode context
  interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
  }
  
  // Create the context with a default value
  const DarkModeContext = createContext<DarkModeContextType>({
    isDarkMode: false,
    toggleDarkMode: () => {}
  });
  
  // Provider component
  export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize dark mode state
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
      // Check local storage first
      const savedTheme = localStorage.getItem('theme');
      
      // If explicitly saved, use that
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      
      // Otherwise, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
  
    // Effect to apply dark mode class and save to local storage
    useEffect(() => {
      const root = window.document.documentElement;
      
      if (isDarkMode) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }, [isDarkMode]);
  
    // Toggle dark mode function
    const toggleDarkMode = () => {
      setIsDarkMode(prevMode => !prevMode);
    };
  
    return (
      <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    );
  };
  
  // Custom hook to use dark mode context
  export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    
    // Throw an error if used outside of a provider
    if (context === undefined) {
      throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    
    return context;
  };