import React, { useState, createContext, useContext } from 'react';

const TabsContext = createContext();

const Tabs = ({ children, defaultValue, value, onValueChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className="w-full">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = "" }) => {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-800 p-1 ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ children, value, className = "" }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all
        ${isActive 
          ? 'bg-purple-500 text-white shadow-sm' 
          : 'text-gray-300 hover:text-white hover:bg-gray-700'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, className = "" }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
