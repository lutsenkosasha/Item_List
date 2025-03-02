import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedItemsContextProps {
  selectedItems: number[];
  toggleSelectItem: (item: number) => void;
}

const SelectedItemsContext = createContext<SelectedItemsContextProps | undefined>(undefined);

export const SelectedItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelectItem = (item: number) => {
    setSelectedItems((prev) => {
      const newSelectedItems = [...prev];
      const index = newSelectedItems.indexOf(item);
      if (index === -1) {
        newSelectedItems.push(item);
      } else {
        newSelectedItems.splice(index, 1);
      }
      return newSelectedItems;
    });
  };


  return (
    <SelectedItemsContext.Provider value={{ selectedItems, toggleSelectItem }}>
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useSelectedItems = () => {
  const context = useContext(SelectedItemsContext);
  if (!context) {
    throw new Error("useSelectedItems must be used within a SelectedItemsProvider");
  }
  return context;
};